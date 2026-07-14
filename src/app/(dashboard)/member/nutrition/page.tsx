import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NutritionClient } from "./components/nutrition-client";
import { getNutritionStats } from "@/actions/member/diet-actions";

export const metadata = {
  title: "Nutrition Dashboard | Eagle Gym",
  description: "Track your meals, macros, and hydration goals.",
};

export default async function NutritionPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      dietPlans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { meals: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!member) redirect("/member");

  const activePlan = member.dietPlans?.[0];
  const statsRes = await getNutritionStats();
  const stats = statsRes.success
    ? statsRes.data
    : { todayWater: 0, waterGoal: 3500, recipesCount: 0 };

  // Calculate totals from meals
  const totals = activePlan?.meals.reduce(
    (acc: any, meal: any) => {
      acc.calories += meal.calories || 0;
      acc.protein += Number(meal.protein) || 0;
      acc.carbs += Number(meal.carbs) || 0;
      acc.fats += Number(meal.fats) || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  return (
    <div className="mx-auto h-full w-full max-w-6xl p-2 md:p-6">
      <NutritionClient stats={stats as any} activePlan={activePlan} totals={totals} />
    </div>
  );
}
