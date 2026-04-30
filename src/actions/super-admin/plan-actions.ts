"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";

export async function getPlans() {
  try {
    await ensureSuperAdmin();
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
    const user = await ensureSuperAdmin();
    const createdBy = user.id; 

    const plan = await prisma.plan.create({
      data: {
        ...data,
        createdBy,
      },
    });

    await recordAudit({
      userId: user.id,
      action: "CREATE",
      entityType: "PLAN",
      entityId: plan.id,
      newValue: plan
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
    const user = await ensureSuperAdmin();
    const oldPlan = await prisma.plan.findUnique({ where: { id } });

    const plan = await prisma.plan.update({
      where: { id },
      data,
    });

    await recordAudit({
      userId: user.id,
      action: "UPDATE",
      entityType: "PLAN",
      entityId: id,
      oldValue: oldPlan,
      newValue: plan
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
    const user = await ensureSuperAdmin();
    const oldPlan = await prisma.plan.findUnique({ where: { id } });

    await prisma.plan.delete({
      where: { id },
    });

    await recordAudit({
      userId: user.id,
      action: "DELETE",
      entityType: "PLAN",
      entityId: id,
      oldValue: oldPlan
    });
    revalidatePath("/super-admin/subscription-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete subscription plan" };
  }
}
