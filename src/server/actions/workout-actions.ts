"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkoutPlans(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        name: { contains: search, mode: "insensitive" }
      };
    }

    const [plans, total] = await Promise.all([
      prisma.workoutPlan.findMany({
        where: whereClause,
        include: {
          trainer: {
            include: { user: { select: { firstName: true, lastName: true } } }
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.workoutPlan.count({ where: whereClause })
    ]);


    return { 
      success: true, 
      data: {
        plans,
        pagination: { total, pages: Math.ceil(total / limit), page, limit }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createWorkoutPlan(data: { name: string, description?: string, trainerId: string, memberId?: string }) {
  try {
    const plan = await prisma.workoutPlan.create({
      data: {
        name: data.name,
        description: data.description,
        trainerId: data.trainerId,
        memberId: data.memberId,
      }
    });

    revalidatePath("/trainer/workouts");
    return { success: true, data: plan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
