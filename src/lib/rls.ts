import { prisma } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — PostgreSQL RLS Database Session Helper
// Injects 'app.current_tenant_id' into the PostgreSQL connection session
// ═══════════════════════════════════════════════════════════════

/**
 * Executes a database operation within a dedicated PostgreSQL session configured with tenant RLS.
 * Uses parameterized set_config to prevent SQL injection and enforce database-level isolation.
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * @param tenantId The tenant ID to scope the database session to, or "SUPER_ADMIN_BYPASS"
 * @param callback The transactional database queries to run under this tenant scope
 */
export async function withTenantRLS<T>(
  tenantId: string | undefined,
  callback: (tx: any) => Promise<T>,
): Promise<T> {
  const effectiveTenantId = tenantId || "SUPER_ADMIN_BYPASS";

  return prisma.$transaction(async (tx) => {
    // 100% Parameterized session variable injection (local scope: true)
    await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${effectiveTenantId}, true)`;
    return callback(tx);
  });
}

export default withTenantRLS;
