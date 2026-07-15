"use server";

import { ensureSuperAdmin } from "@/lib/action-utils";

import prisma from "@/lib/prisma";

export async function getAuditLogs() {
  await ensureSuperAdmin();
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
      take: 500, // Limit to last 500 for performance
    });

    const mappedLogs = logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toLocaleString(),
      user: log.user ? `${log.user.firstName} ${log.user.lastName}` : "System / Unknown",
      action: log.action,
      entity: `${log.entityType} ${log.entityId}`,
      ipAddress: log.ipAddress || "Unknown",
      status: "Success" as const, // For now, we only log successful actions. Extend schema if needed for failures.
    }));

    return { success: true, logs: mappedLogs };
  } catch (error: unknown) {
    console.error("Failed to fetch audit logs:", error);
    return { success: false, error: "Failed to load audit logs" };
  }
}
