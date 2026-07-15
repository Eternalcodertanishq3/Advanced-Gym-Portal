"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SECURITY } from "@/lib/constants";

export async function getTrainerDashboardStats(trainerId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [myMembers, upcomingSessionsCount, completedSessions, activeClasses, sessionsRaw] =
      await Promise.all([
        prisma.member.count({ where: { trainerId, status: "ACTIVE" } }),
        prisma.pTSession.count({
          where: {
            trainerId,
            status: "SCHEDULED",
            date: { gte: new Date() },
          },
        }),
        prisma.pTSession.count({
          where: {
            trainerId,
            status: "COMPLETED",
            date: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
          },
        }),
        prisma.gymClass.count({ where: { trainerId, isActive: true } }),
        (prisma.pTSession as any).findMany({
          where: { trainerId, date: { gte: today } },
          take: 5,
          orderBy: { date: "asc" },
          include: {
            member: { include: { user: true } },
          },
        }),
      ]);

    const schedule = sessionsRaw.map((s: any) => ({
      id: s.id,
      time: s.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      client: `${s.member.user?.firstName || "Member"} ${s.member.user?.lastName || ""}`.trim(),
      type: "Personal Training",
      status: s.status.toLowerCase(),
    }));

    // Calculate real average rating from completed sessions
    const ratingAggregate = await prisma.pTSession.aggregate({
      where: {
        trainerId,
        status: "COMPLETED",
        rating: { not: null },
      },
      _avg: { rating: true },
      _count: { rating: true },
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
        schedule,
      },
    };
  } catch (error: unknown) {
    console.error("Error fetching trainer stats:", error);
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)) || "Failed to fetch stats",
    };
  }
}

export async function getTrainers() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: trainers };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getTrainerMembers(trainerId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const members = await (prisma.member as any).findMany({
      where: { trainerId },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true,
          },
        },
        workoutPlans: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        dietPlans: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { joinDate: "desc" },
    });

    return { success: true, data: members };
  } catch (error: unknown) {
    console.error("Error fetching trainer members:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function assignWorkoutPlan(memberId: string, planId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.workoutPlan.update({
      where: { id: planId },
      data: { memberId },
    });

    revalidatePath("/trainer/my-members");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function assignDietPlan(memberId: string, planId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.dietPlan.update({
      where: { id: planId },
      data: { memberId },
    });

    revalidatePath("/trainer/my-members");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getMemberProfileForTrainer(memberId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const member = await (prisma.member as any).findUnique({
      where: { id: memberId },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true,
          },
        },
        workoutPlans: {
          orderBy: { createdAt: "desc" },
          include: { exercises: true },
        },
        dietPlans: {
          orderBy: { createdAt: "desc" },
          include: { meals: true },
        },
        progress: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        progressPhotos: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        goals: {
          orderBy: { deadline: "asc" },
        },
      },
    });

    if (!member) return { success: false, error: "Member not found" };

    return { success: true, data: member };
  } catch (error: unknown) {
    console.error("Error fetching member profile:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Schedules a new PT session for a member.
 */
export async function schedulePTSession(data: {
  memberId: string;
  trainerId: string;
  date: Date;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const session = await prisma.pTSession.create({
      data: {
        memberId: data.memberId,
        trainerId: data.trainerId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        status: "SCHEDULED",
      },
    });

    revalidatePath("/trainer/sessions");
    revalidatePath("/trainer");
    return { success: true, data: session };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getTrainerById(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: {
        user: true,
        _count: {
          select: { members: true },
        },
      },
    });

    if (!trainer) return { success: false, error: "Trainer not found" };
    return { success: true, data: trainer };
  } catch (error: unknown) {
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)) || "Failed to fetch trainer",
    };
  }
}

/**
 * Updates the status of a PT session (e.g., mark as COMPLETED).
 */
export async function updateSessionStatus(sessionId: string, status: string, feedback?: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const session = await prisma.pTSession.update({
      where: { id: sessionId },
      data: {
        status: status as any,
        feedback: feedback,
      },
    });

    revalidatePath("/trainer/sessions");
    revalidatePath("/trainer");
    return { success: true, data: session };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Creates a new trainer user and profile.
 */
export async function createTrainer(data: any) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(
      SECURITY.DEFAULT_TEMP_PASSWORD(),
      SECURITY.BCRYPT_ROUNDS,
    );

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the base User
      const user = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: "TRAINER",
          status: "ACTIVE",
          passwordResetRequired: true,
        },
      });

      // 2. Create the Trainer profile
      const trainer = await tx.trainer.create({
        data: {
          userId: user.id,
          specialization: Array.isArray(data.specialization)
            ? data.specialization
            : [data.specialization],
          experience: Number(data.experience),
          salary: data.salary,
          isActive: true,
        },
      });

      return trainer;
    });

    revalidatePath("/admin/trainers");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error creating trainer:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "Email or phone number already exists." };
    }
    return {
      success: false,
      error:
        (error instanceof Error ? error.message : String(error)) || "Failed to onboard trainer",
    };
  }
}

/**
 * Updates an existing trainer's details.
 */
export async function updateTrainer(id: string, data: any) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const trainer = await tx.trainer.update({
        where: { id },
        data: {
          specialization: Array.isArray(data.specialization)
            ? data.specialization
            : [data.specialization],
          experience: Number(data.experience),
          salary: data.salary,
          isActive: data.isActive,
          user: {
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
            },
          },
        },
        include: { user: true },
      });
      return trainer;
    });

    revalidatePath("/admin/trainers");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error updating trainer:", error);
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)) || "Failed to update trainer",
    };
  }
}
