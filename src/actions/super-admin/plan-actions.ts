"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return { success: true, plans };
  } catch (error: any) {
    console.error("Failed to fetch plans:", error);
    return { success: false, error: "Failed to load subscription plans" };
  }
}

export async function createPlan(data: {
  name: string;
  duration: number;
  price: number;
  features: string[];
  maxCheckIns: number;
  ptSessions: number;
  guestPasses: number;
}) {
  try {
    // In a real app, you'd get the super admin's ID from the session here.
    const createdBy = "admin-placeholder-id"; 

    const plan = await prisma.plan.create({
      data: {
        ...data,
        createdBy,
      },
    });

    revalidatePath("/super-admin/subscription-plans");
    return { success: true, plan };
  } catch (error: any) {
    console.error("Failed to create plan:", error);
    return { success: false, error: "Failed to create subscription plan" };
  }
}

export async function updatePlan(id: string, data: Partial<{
  name: string;
  duration: number;
  price: number;
  features: string[];
  maxCheckIns: number;
  ptSessions: number;
  guestPasses: number;
}>) {
  try {
    const plan = await prisma.plan.update({
      where: { id },
      data,
    });
    revalidatePath("/super-admin/subscription-plans");
    return { success: true, plan };
  } catch (error: any) {
    console.error("Failed to update plan:", error);
    return { success: false, error: "Failed to update subscription plan" };
  }
}

export async function deletePlan(id: string) {
  try {
    await prisma.plan.delete({
      where: { id },
    });
    revalidatePath("/super-admin/subscription-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete subscription plan" };
  }
}
