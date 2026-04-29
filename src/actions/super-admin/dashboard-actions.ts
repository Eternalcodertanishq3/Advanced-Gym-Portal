"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    // Total Revenue (Sum of all completed payments)
    const revenueResult = await prisma.payment.aggregate({
      _sum: { total: true },
      where: { status: "COMPLETED" },
    });
    const totalRevenue = Number(revenueResult._sum.total || 0);

    // Active Members Count
    const activeMembersCount = await prisma.member.count({
      where: { status: "ACTIVE" },
    });

    // Staff Count (Admins, Receptionists, Trainers, SuperAdmins, Workers)
    const activeStaffCount = await prisma.user.count({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "TRAINER", "WORKER"] },
        status: "ACTIVE",
      },
    });

    // Recent Audit Logs
    const recentLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });

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
