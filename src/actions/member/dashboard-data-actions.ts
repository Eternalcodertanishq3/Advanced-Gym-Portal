"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

export async function getMemberDashboardStats(userId: string) {
  const session = await auth();
  if (!session?.user || (session.user.id !== userId && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const member = await prisma.member.findUnique({
      where: { userId },
      include: {
        subscription: {
          include: { plan: true },
        },
        _count: {
          select: { attendance: true, classBookings: true },
        },
      },
    });

    if (!member) throw new Error("Member not found");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [upcomingBookings, weeklyLogs] = await Promise.all([
      prisma.classBooking.findMany({
        where: { memberId: member.id, status: "CONFIRMED" },
        take: 3,
        include: {
          schedule: {
            include: {
              class: { include: { trainer: { include: { user: true } } } },
            },
          },
        },
      }),
      prisma.workoutLog.findMany({
        where: { memberId: member.id, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyProgress = days.map((day, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const log = weeklyLogs.find((l) => l.createdAt.toDateString() === date.toDateString());
      return {
        day,
        completed: !!log,
        calories: log?.caloriesBurned || 0,
      };
    });

    const upcomingClasses = upcomingBookings.map((b) => ({
      id: b.id,
      name: b.schedule.class.name,
      time: `${b.schedule.startTime}, ${days[b.schedule.dayOfWeek]}`,
      trainer: b.schedule.class.trainer.user?.firstName || "Trainer",
      booked: true,
    }));

    // Get current workout and diet plans assigned by trainer
    const assignedPlans = await prisma.member.findUnique({
      where: { id: member.id },
      include: {
        workoutPlans: {
          where: { isTemplate: false }, // Only actual assigned plans
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { exercises: { orderBy: { sortOrder: "asc" } } },
        },
        dietPlans: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { meals: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });

    const activeWorkout = assignedPlans?.workoutPlans?.[0];
    const activeDiet = assignedPlans?.dietPlans?.[0];

    const todayWorkout = activeWorkout
      ? {
          name: activeWorkout.name,
          exercises: activeWorkout.exercises.length,
          estimatedTime: `${activeWorkout.estimatedDuration || 45} min`,
          completed: 0,
          total: activeWorkout.exercises.length,
          exerciseList: activeWorkout.exercises.map((e: any) => ({
            name: e.name,
            sets: `${e.sets} x ${e.reps}`,
            completed: false,
          })),
        }
      : null;

    const todayDiet = activeDiet
      ? {
          name: activeDiet.name,
          totalCalories: activeDiet.totalCalories,
          meals: activeDiet.meals.length,
          mealList: activeDiet.meals.map((m: any) => ({
            name: m.name,
            time: m.time,
            calories: m.calories,
          })),
        }
      : null;

    // Calculate real streak (existing logic...)
    const recentAttendance = await prisma.attendance.findMany({
      where: { memberId: member.id },
      orderBy: { date: "desc" },
      take: 30,
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
          } else {
            break;
          }
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
        todayDiet,
        attendanceSparkline: recentAttendance.reverse().map((a) => 1), // Simple count for now, or use real data if available
      },
    };
  } catch (error: any) {
    console.error("Error fetching member dashboard stats:", error);
    return { success: false, error: error.message || "Failed to fetch stats" };
  }
}
