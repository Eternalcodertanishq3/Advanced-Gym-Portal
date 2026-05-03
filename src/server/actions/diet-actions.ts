"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDietPlans(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause: any = {};
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const [plans, total] = await Promise.all([
      prisma.dietPlan.findMany({
        where: whereClause,
        include: {
          trainer: {
            include: { user: { select: { firstName: true, lastName: true } } }
          },
          meals: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.dietPlan.count({ where: whereClause })
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

export async function getDietTemplates() {
  try {
    const templates = await prisma.dietPlan.findMany({
      where: { isTemplate: true },
      include: { meals: true },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: templates };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDietPlan(data: { name: string, description?: string, trainerId: string, memberId?: string, type: any }) {
  try {
    const plan = await prisma.dietPlan.create({
      data: {
        name: data.name,
        description: data.description,
        trainerId: data.trainerId,
        memberId: data.memberId,
        type: data.type,
        isTemplate: !data.memberId
      }
    });

    revalidatePath("/trainer/diet");
    return { success: true, data: plan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
