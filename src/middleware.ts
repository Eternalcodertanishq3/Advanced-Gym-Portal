import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { ROUTES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Multi-Tenant Middleware Router
// ═══════════════════════════════════════════════════════════════

const { auth } = NextAuth(authConfig);

const publicRoutes = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_OTP,
  "/",
];

const authRoutes = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_OTP,
];

// In-memory cache for Tenant Resolution with 5 minutes TTL & Size limit
interface CacheEntry {
  tenant: {
    id: string;
    subdomain: string;
    saasStatus: string;
    name: string;
    logo: string | null;
    currency: string;
    locale: string;
  } | null;
  expiresAt: number;
}

const tenantCache = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 1000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getTenantSlug(host: string) {
  const cleanHost = host.replace(/:\d+$/, ""); // Remove port number
  const parts = cleanHost.split(".");
  
  // Support slug.localhost and slug.domain.com
  if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
    const slug = parts[0].toLowerCase();
    if (slug !== "www" && slug !== "app" && slug !== "admin-saas") {
      return slug;
    }
  }
  return null;
}

export default auth(async (req) => {
  const { nextUrl } = req;
  const host = req.headers.get("host") || "";
  const tenantSlug = getTenantSlug(host);
  
  let tenant: { id: string; subdomain: string; saasStatus: string; name: string; logo: string | null; currency: string; locale: string } | null = null;
  
  if (tenantSlug) {
    const now = Date.now();
    const cached = tenantCache.get(tenantSlug);

    if (cached && cached.expiresAt > now) {
      tenant = cached.tenant;
    } else {
      try {
        const resolved = await prisma.tenant.findUnique({
          where: { subdomain: tenantSlug },
          select: { id: true, subdomain: true, saasStatus: true, name: true, logo: true, currency: true, locale: true }
        });
        tenant = resolved;

        // Evict oldest if cache gets too large
        if (tenantCache.size >= MAX_CACHE_SIZE) {
          const firstKey = tenantCache.keys().next().value;
          if (firstKey) tenantCache.delete(firstKey);
        }

        tenantCache.set(tenantSlug, {
          tenant: resolved,
          expiresAt: now + CACHE_TTL_MS
        });
      } catch (err) {
        console.error("Tenant lookup error in middleware:", err);
      }
    }
  }

  // Redirect if subdomain is invalid/does not exist in database
  if (tenantSlug && !tenant) {
    const landingUrl = new URL("/", nextUrl.href);
    landingUrl.host = host.split(".").slice(-2).join("."); // Strip subdomain
    return NextResponse.redirect(landingUrl);
  }

  // Check SaaS Account Status
  if (tenant && (tenant.saasStatus === "SUSPENDED" || tenant.saasStatus === "EXPIRED")) {
    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; background-color: #0f0f10; color: #f4f4f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center; border: 1px border #27272a; padding: 2rem; border-radius: 8px; background-color: #18181b; max-width: 450px;">
            <h1 style="color: #ef4444; margin-top: 0;">Access Suspended</h1>
            <p style="color: #a1a1aa; line-height: 1.6;">This gym portal is currently inactive or suspended due to billing. Please contact the gym manager or SaaS administrator.</p>
          </div>
        </body>
      </html>`,
      {
        status: 403,
        headers: { "Content-Type": "text/html" }
      }
    );
  }

  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname as any);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname as any);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL(ROUTES.SUPER_ADMIN, nextUrl));
      if (role === "ADMIN") return NextResponse.redirect(new URL(ROUTES.ADMIN, nextUrl));
      if (role === "RECEPTIONIST") return NextResponse.redirect(new URL(ROUTES.RECEPTIONIST, nextUrl));
      if (role === "TRAINER") return NextResponse.redirect(new URL(ROUTES.TRAINER, nextUrl));
      if (role === "MEMBER") return NextResponse.redirect(new URL(ROUTES.MEMBER, nextUrl));
      if (role === "WORKER") return NextResponse.redirect(new URL(ROUTES.WORKER, nextUrl));
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, nextUrl));
  }

  if (isLoggedIn) {
    const path = nextUrl.pathname;
    
    if (path.startsWith("/super-admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
    if (path.startsWith("/admin") && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
    if (path.startsWith("/receptionist") && role !== "RECEPTIONIST" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
    if (path.startsWith("/trainer") && role !== "TRAINER" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
    if (path.startsWith("/member") && role !== "MEMBER") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
    if (path.startsWith("/worker") && role !== "WORKER" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
    }
  }

  // Inject tenant details and request url into headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url', nextUrl.pathname);
  if (tenant) {
    requestHeaders.set('x-tenant-id', tenant.id);
    requestHeaders.set('x-tenant-subdomain', tenant.subdomain);
    requestHeaders.set('x-tenant-name', tenant.name);
    requestHeaders.set('x-tenant-logo', tenant.logo || "");
    requestHeaders.set('x-tenant-currency', tenant.currency);
    requestHeaders.set('x-tenant-locale', tenant.locale);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
