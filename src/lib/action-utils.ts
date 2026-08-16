import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/constants";
import { LogAction } from "@prisma/client";
import { headers } from "next/headers";

/**
 * 🔒 GYMFLOW — Live Session & Privilege Verifier
 * Prevents privilege de-sync and stale JWT exploitation by verifying
 * active user status and tenant operational status in the database.
 */
export async function verifyActiveSession() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const liveUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      status: true,
      branchId: true,
      deletedAt: true,
      tenantId: true,
      tenant: {
        select: {
          id: true,
          isActive: true,
          saasStatus: true,
        },
      },
    },
  });

  if (!liveUser || liveUser.deletedAt || liveUser.status !== "ACTIVE") {
    throw new Error("Unauthorized: User account is inactive or has been suspended.");
  }

  // Super Admin can access even during tenant subscription hold
  if (liveUser.role !== "SUPER_ADMIN" && liveUser.tenant) {
    if (!liveUser.tenant.isActive || liveUser.tenant.saasStatus === "SUSPENDED") {
      throw new Error("Tenant subscription suspended. Please contact gym administrator.");
    }
  }

  return liveUser;
}

/**
 * 🦅 EAGLE GYM — Server Action Protection
 * Ensures the user is authenticated, active in the database, and has the SUPER_ADMIN role.
 * Returns the verified user or throws an error.
 */
export async function ensureSuperAdmin() {
  const liveUser = await verifyActiveSession();

  if (liveUser.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required.");
  }

  return liveUser;
}

/**
 * 🏢 EAGLE GYM — Branch Context Resolver
 * Returns the branchId if the user is an ADMIN/Staff, or null if SUPER_ADMIN.
 * Verifies live database status to protect against stale JWT permissions.
 */
export async function getBranchContext() {
  const liveUser = await verifyActiveSession();

  // Super Admin sees everything
  if (liveUser.role === "SUPER_ADMIN") {
    return { branchId: null, role: liveUser.role, user: liveUser };
  }

  // Branch Admins and Staff see only their branch
  if (
    liveUser.role === "ADMIN" ||
    liveUser.role === "MANAGER" ||
    liveUser.role === "RECEPTIONIST" ||
    liveUser.role === "TRAINER" ||
    liveUser.role === "WORKER"
  ) {
    if (!liveUser.branchId) {
      console.warn(`Staff user ${liveUser.id} has no branchId assigned.`);
    }
    return { branchId: liveUser.branchId, role: liveUser.role, user: liveUser };
  }

  throw new Error("Unauthorized: Management role required.");
}

/**
 * 📝 EAGLE GYM — Audit Logger
 * Records sensitive administrative actions to the database.
 */
export async function recordAudit({
  userId,
  action,
  entityType,
  entityId,
  oldValue,
  newValue,
}: {
  userId: string;
  action: LogAction;
  entityType: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
}) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : undefined,
        newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
    // We don't throw here to avoid failing the main action if logging fails,
    // but in a high-security app, you might want to.
  }
}

/**
 * 🔒 GYMFLOW — Emergency Lock Check
 * Throws an error if emergency lock is active and the user is not an Admin/Super Admin.
 */
export async function checkEmergencyLock() {
  const session = await auth();

  // Admins and Super Admins can bypass emergency lock to do corrections
  if (session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN") {
    return;
  }

  try {
    const { resolveTenantId } = require("@/lib/prisma");
    const tenantId = (await resolveTenantId()) || null;
    const lockSetting = await prisma.gymSetting.findUnique({
      where: { key_tenantId: { key: "emergency_lock", tenantId: tenantId || "" } },
    });
    if (lockSetting && lockSetting.value === true) {
      throw new Error("System is currently under emergency lock. Operations are suspended.");
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("emergency lock")) {
      throw err;
    }
    // Continue if database check fails/is unreachable
  }
}
