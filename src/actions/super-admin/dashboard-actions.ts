"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [revenueResult, activeMembersCount, activeStaffCount, recentLogs] = await Promise.all([
      // Total Revenue
      prisma.payment.aggregate({
        _sum: { total: true },
        where: { status: "COMPLETED" },
      }),
      // Active Members Count
      prisma.member.count({
        where: { status: "ACTIVE" },
      }),
      // Staff Count
      prisma.user.count({
        where: {
          role: { in: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "TRAINER", "WORKER"] },
          status: "ACTIVE",
        },
      }),
      // Recent Audit Logs
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      })
    ]);

    const totalRevenue = Number(revenueResult._sum.total || 0);

    return {
      success: true,
      stats: {
        totalRevenue,
        activeMembersCount,
        activeStaffCount,
      },
      recentLogs,
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to load dashboard metrics" };
  }
}
