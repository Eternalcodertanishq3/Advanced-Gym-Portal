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
 * Resolves the active Tenant's metadata dynamically from incoming request headers.
 * Safe fallback during build operations or offline CLI tasks.
 */
export async function getTenantDetails(): Promise<TenantDetails> {
  try {
    const { headers } = require("next/headers");
    const headersList = await headers();
    const tenantId = headersList.get("x-tenant-id") || null;
    return {
      id: tenantId,
      subdomain: headersList.get("x-tenant-subdomain") || null,
      name: headersList.get("x-tenant-name") || "GymFlow SaaS",
      logo: headersList.get("x-tenant-logo") || "/logo.png",
      currency: headersList.get("x-tenant-currency") || "INR",
      locale: headersList.get("x-tenant-locale") || "en-IN",
    };
  } catch {
    return {
      id: null,
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
 * Guaranteed zero-dependency, safe to import across Client Components.
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
