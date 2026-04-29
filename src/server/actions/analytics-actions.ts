"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalMembers,
      activeMembers,
      totalTrainers,
      activeClasses,
      thisMonthPayments,
      lastMonthPayments,
      todayPayments,
      todayCheckins,
      pendingPayments,
      newMembersThisMonth,
      expiringSoon,
      attendanceSparkline,
      revenueSparkline
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.trainer.count({ where: { isActive: true } }),
      prisma.gymClass.count({ where: { isActive: true } }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        select: { total: true }
      }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        select: { total: true }
      }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: startOfToday } },
        select: { total: true }
      }),
      prisma.attendance.count({ where: { date: { gte: startOfToday } } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.member.count({ where: { joinDate: { gte: startOfMonth } } }),
      prisma.subscription.count({ 
        where: { 
          endDate: { 
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) 
          } 
        } 
      }),
      // Sparkline data (last 7 days)
      prisma.attendance.groupBy({
        by: ['date'],
        where: { date: { gte: sevenDaysAgo } },
        _count: { _all: true },
        orderBy: { date: 'asc' }
      }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: sevenDaysAgo } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const monthlyRevenue = thisMonthPayments.reduce((sum, p) => sum + Number(p.total), 0);
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + Number(p.total), 0);
    const todayRevenue = todayPayments.reduce((sum, p) => sum + Number(p.total), 0);
    
    // Revenue Growth
    let revenueGrowth = 0;
    if (lastMonthRevenue > 0) {
      revenueGrowth = ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (monthlyRevenue > 0) {
      revenueGrowth = 100;
    }

    // Attendance Rate
    const daysPassed = now.getDate();
    const uniqueCheckinsMonth = await prisma.attendance.count({
      where: { date: { gte: startOfMonth } }
    });
    
    let attendanceRate = 0;
    if (activeMembers > 0 && daysPassed > 0) {
      attendanceRate = (uniqueCheckinsMonth / (activeMembers * daysPassed)) * 100;
    }

    return {
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalTrainers,
        monthlyRevenue,
        revenueGrowth: Number(revenueGrowth.toFixed(1)),
        attendanceRate: Number(attendanceRate.toFixed(1)),
        activeClasses,
        todayRevenue,
        todayAttendance: todayCheckins,
        pendingPayments,
        newMembersThisMonth,
        expiringSoon,
        attendanceSparkline: attendanceSparkline.map(a => a._count._all),
        revenueSparkline: revenueSparkline.map(p => Number(p.total))
      }
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: error.message || "Failed to fetch dashboard stats" };
  }
}

export async function getAnalyticsChartsData() {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [revenueHistory, planDistribution, dailyAttendance] = await Promise.all([
      // Monthly Revenue (last 6 months)
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: sixMonthsAgo } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      // Plan Distribution
      prisma.subscription.groupBy({
        by: ['planId'],
        _count: { _all: true },
        where: { status: 'ACTIVE' }
      }),
      // Daily Attendance (Avg by day of week)
      prisma.attendance.findMany({
        where: { date: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
        select: { date: true }
      })
    ]);

    // Process Revenue History
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueByMonth = revenueHistory.reduce((acc: any, p) => {
      const month = months[new Date(p.createdAt).getMonth()];
      acc[month] = (acc[month] || 0) + Number(p.total);
      return acc;
    }, {});

    const revenueData = Object.keys(revenueByMonth).map(month => ({
      month,
      revenue: revenueByMonth[month],
      members: 0 // Could be enhanced to count active members at that time
    }));

    // Process Plan Distribution
    const plans = await prisma.plan.findMany({ select: { id: true, name: true } });
    const colors = ["#F59E0B", "#1E293B", "#64748B", "#94A3B8"];
    const categoryData = planDistribution.map((pd, index) => ({
      name: plans.find(p => p.id === pd.planId)?.name || "Unknown",
      value: pd._count._all,
      color: colors[index % colors.length]
    }));

    // Process Attendance
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const attendanceByDay = dailyAttendance.reduce((acc: any, a) => {
      const day = days[new Date(a.date).getDay()];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const attendanceData = days.map(day => ({
      day,
      count: Math.round((attendanceByDay[day] || 0) / 4) // Avg over 4 weeks
    }));

    return {
      success: true,
      data: {
        revenueData,
        categoryData,
        attendanceData
      }
    };
  } catch (error: any) {
    console.error("Error fetching chart data:", error);
    return { success: false, error: error.message };
  }
}

export async function getSuperAdminRevenueStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const [
      thisMonthPayments,
      allPayments,
      activeMembers,
      expiredThisMonth
    ] = await Promise.all([
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        select: { total: true }
      }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: twelveMonthsAgo } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "EXPIRED", endDate: { gte: startOfMonth } } })
    ]);

    const mrr = thisMonthPayments.reduce((sum, p) => sum + Number(p.total), 0);
    const arr = mrr * 12;
    
    let churnRate = 0;
    if (activeMembers > 0) {
      churnRate = (expiredThisMonth / (activeMembers + expiredThisMonth)) * 100;
    }

    // Process sparkline for last 12 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return months[d.getMonth()];
    });

    const revenueByMonth = allPayments.reduce((acc: any, p) => {
      const d = new Date(p.createdAt);
      const key = months[d.getMonth()];
      acc[key] = (acc[key] || 0) + Number(p.total);
      return acc;
    }, {});

    const sparklineData = last12Months.map(m => revenueByMonth[m] || 0);

    return {
      success: true,
      data: {
        mrr,
        arr,
        churnRate: Number(churnRate.toFixed(1)),
        revenueSparkline: sparklineData
      }
    };
  } catch (error: any) {
    console.error("Error fetching super admin revenue stats:", error);
    return { success: false, error: error.message };
  }
}
