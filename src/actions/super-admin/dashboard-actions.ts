"use server";

import { ensureSuperAdmin } from "@/lib/action-utils";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getDashboardStats() {
  await ensureSuperAdmin();
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
      prevMembers,
      activeBranches,
      activeBranchesList,
      revenueByBranch,
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
          role: {
            in: [Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER, Role.WORKER],
          },
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
      prisma.payment.findMany({
        where: {
          status: "COMPLETED",
          createdAt: { gte: last7Days },
        },
        select: { total: true, createdAt: true },
      }),
      // Daily Members for Sparkline (Last 7 Days)
      prisma.member.findMany({
        where: { joinDate: { gte: last7Days } },
        select: { joinDate: true },
      }),
      // Previous Revenue for Trend
      prisma.payment.aggregate({
        _sum: { total: true },
        where: {
          status: "COMPLETED",
          createdAt: { gte: prev7Days, lt: last7Days },
        },
      }),
      // Previous Members for Trend
      prisma.member.count({
        where: { joinDate: { gte: prev7Days, lt: last7Days } },
      }),
      // Active Branches Count
      prisma.branch.count({
        where: { status: "ACTIVE" },
      }),
      // Branch Performance Comparison
      prisma.branch.findMany({
        where: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          _count: {
            select: { users: { where: { role: "MEMBER", status: "ACTIVE" } } },
          },
        },
      }),
      // Revenue by Branch
      prisma.payment.groupBy({
        by: ["branchId"],
        where: { status: "COMPLETED" },
        _sum: { total: true },
      }),
    ]);

    // Map branch names to revenue and member counts
    const branchComparison = activeBranchesList.map((b) => {
      const revenue = revenueByBranch.find((r) => r.branchId === b.id)?._sum?.total || 0;
      return {
        name: b.name,
        members: b._count.users,
        revenue: Number(revenue),
      };
    });

    const totalRevenue = Number(revenueResult._sum.total || 0);
    const previousRevenueValue = Number(prevRevenue._sum.total || 0);

    // Process Sparklines (Group by day in JS for better control)
    const revenueSparkline = Array(7).fill(0);
    const membersSparkline = Array(7).fill(0);

    dailyRevenue.forEach((p) => {
      const dayIdx = Math.floor(
        (new Date(p.createdAt).getTime() - last7Days.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (dayIdx >= 0 && dayIdx < 7) revenueSparkline[dayIdx] += Number(p.total || 0);
    });

    dailyMembers.forEach((m) => {
      const dayIdx = Math.floor(
        (new Date(m.joinDate).getTime() - last7Days.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (dayIdx >= 0 && dayIdx < 7) membersSparkline[dayIdx] += 1;
    });

    // Calculate Trends
    const revenueTrend =
      previousRevenueValue === 0
        ? "+0.0%"
        : `${(((totalRevenue - previousRevenueValue) / previousRevenueValue) * 100).toFixed(1)}%`;

    const membersTrend =
      prevMembers === 0
        ? "New"
        : `${(((activeMembersCount - prevMembers) / prevMembers) * 100).toFixed(1)}%`;

    return {
      success: true,
      stats: {
        totalRevenue,
        activeMembersCount,
        activeStaffCount,
        activeBranches,
        revenueTrend,
        membersTrend,
        revenueSparkline,
        membersSparkline,
        branchComparison,
      },
      recentLogs,
    };
  } catch (error: unknown) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to load dashboard metrics" };
  }
}

export async function getSystemHealth() {
  await ensureSuperAdmin();
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 1. Check Database Heartbeat
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;

    // 2. Check Payments Health (Any FAILED payments in last 24h)
    const failedPayments = await prisma.payment.count({
      where: {
        status: "FAILED",
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    });

    // 3. Check Backup Health (Any FAILED backups recently)
    const failedBackups = await prisma.backup.count({
      where: {
        status: "FAILED",
        createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      success: true,
      data: {
        database: {
          status: dbLatency < 100 ? "Optimal" : "Degraded",
          latency: dbLatency,
          health: Math.max(0, 100 - dbLatency / 10),
        },
        payments: {
          status: failedPayments === 0 ? "Active" : "Issues Detected",
          stuckCount: failedPayments,
          health: Math.max(0, 100 - failedPayments * 10),
        },
        system: {
          status: failedBackups === 0 ? "Operational" : "Backup Failed",
          errorCount: failedBackups,
          health: Math.max(0, 100 - failedBackups * 20),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "System health check failed",
    };
  }
}
