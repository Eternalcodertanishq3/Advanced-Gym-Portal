"use server";

import { prisma } from "@/lib/prisma";
import { getBranchContext, ensureSuperAdmin } from "@/lib/action-utils";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { branchId } = await getBranchContext();
    const branchFilter = branchId ? { branchId } : {};
    const userBranchFilter = branchId ? { user: { branchId } } : {};

    const [
      totalMembers,
      activeMembersCount,
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
      prisma.member.count({ where: userBranchFilter }),
      prisma.subscription.count({ 
        where: { 
          ...branchFilter, 
          status: "ACTIVE",
          endDate: { gte: now } 
        } 
      }),
      prisma.trainer.count({ where: { ...userBranchFilter, isActive: true } }),
      prisma.gymClass.count({ where: { ...branchFilter, isActive: true } }),
      prisma.payment.findMany({
        where: { ...branchFilter, status: "COMPLETED", createdAt: { gte: startOfMonth } },
        select: { total: true }
      }),
      prisma.payment.findMany({
        where: { ...branchFilter, status: "COMPLETED", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        select: { total: true }
      }),
      prisma.payment.findMany({
        where: { ...branchFilter, status: "COMPLETED", createdAt: { gte: startOfToday } },
        select: { total: true }
      }),
      prisma.attendance.count({ where: { ...branchFilter, date: { gte: startOfToday } } }),
      prisma.payment.count({ where: { ...branchFilter, status: "PENDING" } }),
      prisma.member.count({ where: { ...userBranchFilter, joinDate: { gte: startOfMonth } } }),
      prisma.subscription.count({ 
        where: { 
          ...branchFilter,
          endDate: { 
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) 
          } 
        } 
      }),
      // Sparkline data (last 7 days)
      prisma.attendance.groupBy({
        by: ['date'],
        where: { ...branchFilter, date: { gte: sevenDaysAgo } },
        _count: { _all: true },
        orderBy: { date: 'asc' }
      }),
      prisma.payment.findMany({
        where: { ...branchFilter, status: "COMPLETED", createdAt: { gte: sevenDaysAgo } },
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
    if (activeMembersCount > 0 && daysPassed > 0) {
      attendanceRate = (uniqueCheckinsMonth / (activeMembersCount * daysPassed)) * 100;
    }

    // Member Growth
    const lastMonthMembers = await prisma.member.count({ 
      where: { ...userBranchFilter, joinDate: { lt: startOfMonth } } 
    });
    let memberGrowth = 0;
    if (lastMonthMembers > 0) {
      memberGrowth = ((totalMembers - lastMonthMembers) / lastMonthMembers) * 100;
    } else if (totalMembers > 0) {
      memberGrowth = 100;
    }

    // Conversion Rate (New Members / Total Members - simple proxy)
    const conversionRate = totalMembers > 0 ? (newMembersThisMonth / totalMembers) * 100 : 0;

    return {
      success: true,
      data: {
        totalMembers,
        activeMembers: activeMembersCount,
        totalTrainers,
        monthlyRevenue,
        revenueGrowth: Number(revenueGrowth.toFixed(1)),
        memberGrowth: Number(memberGrowth.toFixed(1)),
        attendanceRate: Number(attendanceRate.toFixed(1)),
        conversionRate: Number(conversionRate.toFixed(1)),
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

    const { branchId } = await getBranchContext();
    const branchFilter = branchId ? { branchId } : {};
    const userBranchFilter = branchId ? { user: { branchId } } : {};

    const [revenueHistory, planDistribution, dailyAttendance] = await Promise.all([
      // Monthly Revenue (last 6 months)
      prisma.payment.findMany({
        where: { ...branchFilter, status: "COMPLETED", createdAt: { gte: sixMonthsAgo } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      // Plan Distribution
      prisma.subscription.groupBy({
        by: ['planId'],
        _count: { _all: true },
        where: { ...branchFilter, status: 'ACTIVE' }
      }),
      // Daily Attendance (Avg by day of week)
      prisma.attendance.findMany({
        where: { ...branchFilter, date: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
        select: { date: true }
      })
    ]);

    // Process Revenue History (Last 6 months including current)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      
      // Calculate revenue for this specific month
      const monthRevenue = revenueHistory.reduce((sum, p) => {
        const pDate = new Date(p.createdAt);
        if (pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear()) {
          return sum + Number(p.total);
        }
        return sum;
      }, 0);

      // Estimate members (current active count for current month, slightly less for historical)
      const isCurrentMonth = i === 0;
      const memberEstimate = isCurrentMonth 
        ? await prisma.subscription.count({ where: { ...branchFilter, status: 'ACTIVE' } })
        : Math.max(0, Math.floor((await prisma.member.count({ where: { ...userBranchFilter, joinDate: { lte: new Date(d.getFullYear(), d.getMonth() + 1, 0) } } }))));

      revenueData.push({
        month: monthName,
        revenue: monthRevenue,
        members: memberEstimate
      });
    }

    // Process Plan Distribution
    const plans = await prisma.plan.findMany({ select: { id: true, name: true } });
    const colors = ["#F97316", "#0F172A", "#64748B", "#94A3B8"];
    
    const totalSubs = planDistribution.reduce((sum, pd) => sum + pd._count._all, 0);
    
    const categoryData = planDistribution.map((pd, index) => {
      const count = pd._count._all;
      const percentage = totalSubs > 0 ? Math.round((count / totalSubs) * 100) : 0;
      
      return {
        name: plans.find(p => p.id === pd.planId)?.name || "Unknown",
        value: count,
        percentage: percentage, // Ensure this is explicitly named
        color: colors[index % colors.length]
      };
    });

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

export async function getDashboardActivity() {
  try {
    const { branchId } = await getBranchContext();
    const branchFilter = branchId ? { user: { branchId } } : {};

    const activities = await prisma.auditLog.findMany({
      where: branchFilter,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    return {
      success: true,
      data: activities.map(a => ({
        id: a.id,
        user: `${a.user.firstName} ${a.user.lastName}`,
        action: a.action,
        entityType: a.entityType,
        time: a.createdAt.toISOString(),
        role: a.user.role
      }))
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDashboardSchedules() {
  try {
    const now = new Date();
    const today = now.getDay();
    const { branchId } = await getBranchContext();
    const branchFilter = branchId ? { branchId } : {};

    const classes = await prisma.gymClass.findMany({
      where: {
        ...branchFilter,
        isActive: true,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        schedules: {
          where: { dayOfWeek: today }
        }
      }
    });

    // Flatten and process
    const scheduleItems = classes.flatMap(c => 
      c.schedules.map(s => {
        const [startHours, startMinutes] = s.startTime.split(':').map(Number);
        
        const startTime = new Date();
        startTime.setHours(startHours, startMinutes, 0, 0);
        
        // Calculate end time using duration
        const endTime = new Date(startTime.getTime() + c.duration * 60000);
        
        let status: "upcoming" | "ongoing" | "completed" = "upcoming";
        if (now > endTime) status = "completed";
        else if (now >= startTime && now <= endTime) status = "ongoing";

        return {
          id: `${c.id}-${s.id}`,
          time: s.startTime,
          title: c.name,
          type: "class",
          trainer: `${c.trainer.user.firstName} ${c.trainer.user.lastName}`,
          room: s.room,
          status,
          attendees: 0, // Placeholder, can be linked to bookings if available
          maxCapacity: c.maxCapacity
        };
      })
    );

    return {
      success: true,
      data: scheduleItems.sort((a, b) => a.time.localeCompare(b.time))
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSuperAdminRevenueStats() {
  await ensureSuperAdmin();
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
    const chartData = last12Months.map(m => ({
      name: m,
      revenue: revenueByMonth[m] || 0
    }));

    return {
      success: true,
      data: {
        mrr,
        arr,
        churnRate: Number(churnRate.toFixed(1)),
        revenueSparkline: sparklineData,
        chartData
      }
    };
  } catch (error: any) {
    console.error("Error fetching super admin revenue stats:", error);
    return { success: false, error: error.message };
  }
}
