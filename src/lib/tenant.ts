import { headers } from "next/headers";
import { resolveTenantId } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dynamic Tenant Details Helper
// ═══════════════════════════════════════════════════════════════

export interface TenantDetails {
  id: string | null;
  subdomain: string | null;
  name: string;
  logo: string;
  currency: string;
  locale: string;
}

/**
 * Resolves the active Tenant's metadata from HTTP headers dynamically.
 * Provides safe fallback constants during build operations or offline CLI tasks.
 */
export function getTenantDetails(): TenantDetails {
  const tenantId = resolveTenantId();
  if (!tenantId) {
    return {
      id: null,
      subdomain: null,
      name: "GymFlow SaaS",
      logo: "/logo.png",
      currency: "INR",
      locale: "en-IN"
    };
  }

  try {
    const headersList = headers();
    return {
      id: tenantId,
      subdomain: headersList.get("x-tenant-subdomain"),
      name: headersList.get("x-tenant-name") || "GymFlow SaaS",
      logo: headersList.get("x-tenant-logo") || "/logo.png",
      currency: headersList.get("x-tenant-currency") || "INR",
      locale: headersList.get("x-tenant-locale") || "en-IN"
    };
  } catch {
    return {
      id: tenantId,
      subdomain: null,
      name: "GymFlow SaaS",
      logo: "/logo.png",
      currency: "INR",
      locale: "en-IN"
    };
  }
}
