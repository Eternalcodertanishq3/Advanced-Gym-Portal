"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetches workout plans assigned to the authenticated member.
 */
export async function getMemberWorkouts() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    // Get plans specifically assigned to this member OR common templates
    const plans = await prisma.workoutPlan.findMany({
      where: {
        OR: [
          { memberId: member.id },
          { isTemplate: true }
        ]
      },
      include: {
        exercises: {
          orderBy: { sortOrder: 'asc' }
        },
        trainer: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get recent logs to show progress
    const recentLogs = await prisma.workoutLog.findMany({
      where: { memberId: member.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        workoutPlan: {
          select: { name: true }
        }
      }
    });

    return { 
      success: true, 
      data: {
        plans,
        recentLogs
      }
    };
  } catch (error) {
    console.error("Error fetching member workouts:", error);
    return { success: false, error: "Failed to load workout data" };
  }
}

/**
 * Logs a completed workout session.
 */
export async function logWorkoutSession(data: {
  workoutPlanId: string;
  duration: number;
  caloriesBurned?: number;
  feeling?: any;
  notes?: string;
  completedExercises: any[];
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    const log = await prisma.workoutLog.create({
      data: {
        memberId: member.id,
        workoutPlanId: data.workoutPlanId,
        duration: data.duration,
        caloriesBurned: data.caloriesBurned,
        feeling: data.feeling,
        notes: data.notes,
        completedExercises: data.completedExercises
      }
    });

    return { success: true, data: log };
  } catch (error) {
    console.error("Error logging workout:", error);
    return { success: false, error: "Failed to save workout log" };
  }
}
