"use server";

import { prisma } from "@/lib/prisma";

export async function getTrainerDashboardStats(trainerId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      myMembers,
      upcomingSessionsCount,
      completedSessions,
      activeClasses,
      sessionsRaw
    ] = await Promise.all([
      prisma.member.count({ where: { trainerId, status: "ACTIVE" } }),
      prisma.pTSession.count({
        where: {
          trainerId,
          status: "SCHEDULED",
          date: { gte: new Date() }
        }
      }),
      prisma.pTSession.count({
        where: {
          trainerId,
          status: "COMPLETED",
          date: { gte: new Date(today.getFullYear(), today.getMonth(), 1) }
        }
      }),
      prisma.gymClass.count({ where: { trainerId, isActive: true } }),
      (prisma.pTSession as any).findMany({
        where: { trainerId, date: { gte: today } },
        take: 5,
        orderBy: { date: 'asc' },
        include: {
          member: { include: { user: true } }
        }
      })
    ]);

    const schedule = sessionsRaw.map((s: any) => ({
      id: s.id,
      time: s.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      client: `${s.member.user?.firstName || "Member"} ${s.member.user?.lastName || ""}`.trim(),
      type: "Personal Training",
      status: s.status.toLowerCase()
    }));

    // Calculate real average rating from completed sessions
    const ratingAggregate = await prisma.pTSession.aggregate({
      where: {
        trainerId,
        status: "COMPLETED",
        rating: { not: null }
      },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const rating = ratingAggregate._avg.rating ? Number(ratingAggregate._avg.rating.toFixed(1)) : 0;

    return {
      success: true,
      data: {
        myMembers,
        upcomingSessions: upcomingSessionsCount,
        completedSessions,
        activeClasses,
        rating,
        schedule
      }
    };
  } catch (error: any) {
    console.error("Error fetching trainer stats:", error);
    return { success: false, error: error.message || "Failed to fetch stats" };
  }
}

export async function getTrainers() {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: trainers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
