"use server";

import { prisma } from "@/lib/prisma";

export async function getMemberDashboardStats(memberId: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        subscription: {
          include: { plan: true }
        },
        _count: {
          select: { attendance: true, classBookings: true }
        }
      }
    });

    if (!member) throw new Error("Member not found");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [upcomingBookings, weeklyLogs] = await Promise.all([
      prisma.classBooking.findMany({
        where: { memberId, status: "CONFIRMED" },
        take: 3,
        include: {
          schedule: {
            include: {
              class: { include: { trainer: { include: { user: true } } } }
            }
          }
        }
      }),
      prisma.workoutLog.findMany({
        where: { memberId, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyProgress = days.map((day, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const log = weeklyLogs.find(l => l.createdAt.toDateString() === date.toDateString());
      return {
        day,
        completed: !!log,
        calories: log?.caloriesBurned || 0
      };
    });

    const upcomingClasses = upcomingBookings.map(b => ({
      id: b.id,
      name: b.schedule.class.name,
      time: `${b.schedule.startTime}, ${days[b.schedule.dayOfWeek]}`,
      trainer: b.schedule.class.trainer.user?.firstName || "Trainer",
      booked: true
    }));

    // Get current workout plan
    const currentWorkout = await prisma.workoutLog.findFirst({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      include: { workoutPlan: { include: { exercises: true } } }
    });

    const todayWorkout = currentWorkout ? {
      name: currentWorkout.workoutPlan.name,
      exercises: currentWorkout.workoutPlan.exercises.length,
      estimatedTime: `${currentWorkout.workoutPlan.estimatedDuration || 45} min`,
      completed: 0, // In a real app, this would be tracked during the session
      total: currentWorkout.workoutPlan.exercises.length,
      exerciseList: currentWorkout.workoutPlan.exercises.map(e => ({
        name: e.name,
        sets: `${e.sets} x ${e.reps}`,
        completed: false
      }))
    } : null;

    // Calculate real streak (existing logic...)
    const recentAttendance = await prisma.attendance.findMany({
      where: { memberId },
      orderBy: { date: 'desc' },
      take: 30
    });

    let streak = 0;
    if (recentAttendance.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(recentAttendance[0].date);
      checkDate.setHours(0, 0, 0, 0);
      const diff = (today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1) {
        streak = 1;
        for (let i = 1; i < recentAttendance.length; i++) {
          const nextDate = new Date(recentAttendance[i].date);
          nextDate.setHours(0, 0, 0, 0);
          const dayDiff = (checkDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
          if (dayDiff === 1) {
            streak++;
            checkDate = nextDate;
          } else { break; }
        }
      }
    }

    return {
      success: true,
      data: {
        totalAttendance: member._count.attendance,
        totalClasses: member._count.classBookings,
        upcomingClassesCount: upcomingBookings.length,
        subscriptionStatus: member.subscription?.status || "INACTIVE",
        planName: member.subscription?.plan?.name || "No Plan",
        expiresAt: member.subscription?.endDate || null,
        streak,
        weeklyProgress,
        upcomingClasses,
        todayWorkout,
        attendanceSparkline: recentAttendance.reverse().map(a => 1) // Simple count for now, or use real data if available
      }
    };
  } catch (error: any) {
    console.error("Error fetching member dashboard stats:", error);
    return { success: false, error: error.message || "Failed to fetch stats" };
  }
}
