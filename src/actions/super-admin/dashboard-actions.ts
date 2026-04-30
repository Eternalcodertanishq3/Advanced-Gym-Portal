"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getDashboardStats() {
  try {
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev7Days = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      revenueResult,
      activeMembersCount,
      activeStaffCount,
      recentLogs,
      dailyRevenue,
      dailyMembers,
      prevRevenue,
      prevMembers
    ] = await Promise.all([
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
          role: { in: [Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER, Role.WORKER] },
          status: "ACTIVE",
        },
      }),
      // Recent Audit Logs
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      // Daily Revenue for Sparkline (Last 7 Days)
      prisma.payment.groupBy({
        by: ['createdAt'],
        _sum: { total: true },
        where: { 
          status: "COMPLETED",
          createdAt: { gte: last7Days }
        },
      }),
      // Daily Members for Sparkline (Last 7 Days)
      prisma.member.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: { createdAt: { gte: last7Days } },
      }),
      // Previous Revenue for Trend
      prisma.payment.aggregate({
        _sum: { total: true },
        where: { 
          status: "COMPLETED",
          createdAt: { gte: prev7Days, lt: last7Days }
        },
      }),
      // Previous Members for Trend
      prisma.member.count({
        where: { createdAt: { gte: prev7Days, lt: last7Days } }
      })
    ]);

    const totalRevenue = Number(revenueResult._sum.total || 0);
    const previousRevenueValue = Number(prevRevenue._sum.total || 0);
    
    // Process Sparklines (Group by day)
    const revenueSparkline = Array(7).fill(0);
    const membersSparkline = Array(7).fill(0);

    dailyRevenue.forEach(day => {
      const dayIdx = Math.floor((new Date(day.createdAt).getTime() - last7Days.getTime()) / (24 * 60 * 60 * 1000));
      if (dayIdx >= 0 && dayIdx < 7) revenueSparkline[dayIdx] += Number(day._sum.total || 0);
    });

    dailyMembers.forEach(day => {
      const dayIdx = Math.floor((new Date(day.createdAt).getTime() - last7Days.getTime()) / (24 * 60 * 60 * 1000));
      if (dayIdx >= 0 && dayIdx < 7) membersSparkline[dayIdx] += day._count.id;
    });

    // Calculate Trends
    const revenueTrend = previousRevenueValue === 0 
      ? "+0.0%" 
      : `${(((totalRevenue - previousRevenueValue) / previousRevenueValue) * 100).toFixed(1)}%`;
    
    const membersTrend = prevMembers === 0
      ? "New"
      : `${(((activeMembersCount - prevMembers) / prevMembers) * 100).toFixed(1)}%`;

    return {
      success: true,
      stats: {
        totalRevenue,
        activeMembersCount,
        activeStaffCount,
        revenueTrend,
        membersTrend,
        revenueSparkline,
        membersSparkline
      },
      recentLogs,
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to load dashboard metrics" };
  }
}
