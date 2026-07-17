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
 * Resolves the active Tenant's metadata from HTTP headers dynamically (asynchronous).
 * Provides safe fallback constants during build operations or offline CLI tasks.
 */
export async function getTenantDetails(): Promise<TenantDetails> {
  const tenantId = await resolveTenantId();
  if (!tenantId) {
    return {
      id: null,
      subdomain: null,
      name: "GymFlow SaaS",
      logo: "/logo.png",
      currency: "INR",
      locale: "en-IN",
    };
  }

  try {
    const { headers } = require("next/headers");
    const headersList = await headers();
    return {
      id: tenantId,
      subdomain: headersList.get("x-tenant-subdomain"),
      name: headersList.get("x-tenant-name") || "GymFlow SaaS",
      logo: headersList.get("x-tenant-logo") || "/logo.png",
      currency: headersList.get("x-tenant-currency") || "INR",
      locale: headersList.get("x-tenant-locale") || "en-IN",
    };
  } catch {
    return {
      id: tenantId,
      subdomain: null,
      name: "GymFlow SaaS",
      logo: "/logo.png",
      currency: "INR",
      locale: "en-IN",
    };
  }
}

/**
 * Synchronous fallback resolver for client bundles and formatting libraries.
 */
export function getTenantDetailsSync(): TenantDetails {
  return {
    id: null,
    subdomain: null,
    name: "GymFlow SaaS",
    logo: "/logo.png",
    currency: "INR",
    locale: "en-IN",
  };
}
