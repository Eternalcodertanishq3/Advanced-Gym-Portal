"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetches diet plans assigned to the authenticated member.
 */
export async function getMemberDiets() {
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

    const plans = await prisma.dietPlan.findMany({
      where: {
        OR: [
          { memberId: member.id },
          { isTemplate: true }
        ]
      },
      include: {
        meals: {
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
      orderBy: [
        { memberId: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return { success: true, data: plans };
  } catch (error) {
    console.error("Error fetching member diets:", error);
    return { success: false, error: "Failed to load nutrition data" };
  }
}

/**
 * Logs water intake for the member.
 */
export async function logWater(amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member not found" };

    const newLog = await (prisma as any).waterLog.create({
      data: {
        memberId: member.id,
        amount,
        date: new Date(),
      }
    });
    
    return { success: true, data: newLog };
  } catch (error) {
    console.error("Error logging water:", error);
    return { success: false, error: "Failed to log water" };
  }
}

/**
 * Fetches hydration and nutrition stats for today.
 */
export async function getNutritionStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member not found" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const waterLogs = await (prisma as any).waterLog.findMany({
      where: {
        memberId: member.id,
        date: {
          gte: today
        }
      },
      orderBy: { date: 'desc' }
    });

    const mealLogs = await (prisma as any).dietLog.findMany({
      where: {
        memberId: member.id,
        createdAt: {
          gte: today
        }
      },
      include: {
        meal: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalWater = waterLogs.reduce((sum: number, log: { amount: number }) => sum + log.amount, 0);

    return {
      success: true,
      data: {
        todayWater: totalWater,
        waterGoal: 3500,
        recipesCount: await (prisma as any).recipe.count({ where: { isPublic: true } }),
        waterLogs,
        mealLogs: mealLogs.map((log: any) => ({
          id: log.id,
          name: log.meal?.name || "Custom Meal",
          calories: log.actualCalories || log.meal?.calories || 0,
          createdAt: log.createdAt
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching nutrition stats:", error);
    return { success: false, error: "Failed to load stats" };
  }
}

/**
 * Logs a meal consumption.
 */
export async function logMeal(data: { 
  name: string; 
  calories: number; 
  protein?: number; 
  carbs?: number; 
  fats?: number;
  dietPlanId?: string;
  mealId?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
      include: {
        dietPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!member) return { success: false, error: "Member not found" };

    const activePlanId = data.dietPlanId || member.dietPlans?.[0]?.id;
    if (!activePlanId) return { success: false, error: "No active diet plan found to log against." };

    // If no mealId provided (ad-hoc meal), we create a "Custom" meal entry for this plan first
    // Or we just allow the log if the schema permitted null mealId. Since it doesn't, we'll find or create a "Custom Log" meal.
    let targetMealId = data.mealId;
    
    if (!targetMealId) {
      const customMeal = await prisma.meal.create({
        data: {
          dietPlanId: activePlanId,
          name: data.name,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          sortOrder: 99,
          items: [data.name]
        }
      });
      targetMealId = customMeal.id;
    }

    const log = await (prisma as any).dietLog.create({
      data: {
        memberId: member.id,
        dietPlanId: activePlanId,
        mealId: targetMealId,
        consumed: true,
        actualCalories: data.calories,
        notes: `Logged via dashboard: ${data.name}`
      }
    });

    return { 
      success: true, 
      data: {
        id: log.id,
        name: data.name,
        calories: data.calories,
        createdAt: log.createdAt
      }
    };
  } catch (error) {
    console.error("Error logging meal:", error);
    return { success: false, error: "Failed to log meal" };
  }
}

/**
 * Fetches curated recipes.
 */
export async function getRecipes() {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  try {
    const recipes = await (prisma as any).recipe.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: recipes };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { success: false, error: "Failed to load recipes" };
  }
}
