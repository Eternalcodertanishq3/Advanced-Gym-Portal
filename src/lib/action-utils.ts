import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/constants";
import { LogAction } from "@prisma/client";
import { headers } from "next/headers";

/**
 * 🦅 EAGLE GYM — Server Action Protection
 * Ensures the user is authenticated and has the SUPER_ADMIN role.
 * Returns the user session or throws an error.
 */
export async function ensureSuperAdmin() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required.");
  }
  
  return session.user;
}

/**
 * 🏢 EAGLE GYM — Branch Context Resolver
 * Returns the branchId if the user is an ADMIN, or null if SUPER_ADMIN.
 */
export async function getBranchContext() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const user = session.user as any;
  
  // Super Admin sees everything
  if (user.role === "SUPER_ADMIN") {
    return { branchId: null, role: user.role };
  }

  // Branch Admins see only their branch
  if (user.role === "ADMIN" || user.role === "RECEPTIONIST" || user.role === "TRAINER") {
    if (!user.branchId) {
      // In a real app, you might want to handle unassigned staff differently
      console.warn(`Staff user ${user.id} has no branchId assigned.`);
    }
    return { branchId: user.branchId, role: user.role };
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
  newValue
}: {
  userId: string;
  action: LogAction;
  entityType: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
}) {
  try {
    const headersList = headers();
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
        userAgent
      }
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
    // We don't throw here to avoid failing the main action if logging fails,
    // but in a high-security app, you might want to.
  }
}
