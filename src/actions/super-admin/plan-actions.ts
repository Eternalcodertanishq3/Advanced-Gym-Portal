"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";

/**
 * Fetch all subscription plans
 */
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

/**
 * Create a new subscription plan
 */
export async function createPlan(data: any) {
  try {
    const superAdmin = await ensureSuperAdmin();

    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        duration: parseInt(data.duration),
        price: data.price,
        gstIncluded: data.gstIncluded ?? true,
        features: data.features || [],
        description: data.description,
        color: data.color || "#F26522",
        isActive: true,
        maxCheckIns: parseInt(data.maxCheckIns || "0"),
        ptSessions: parseInt(data.ptSessions || "0"),
        guestPasses: parseInt(data.guestPasses || "0"),
        sortOrder: parseInt(data.sortOrder || "0"),
        createdBy: superAdmin.id,
      } as any,
    });

    await recordAudit({
      userId: superAdmin.id,
      action: "CREATE",
      entityType: "PLAN",
      entityId: plan.id,
      newValue: plan,
    });

    revalidatePath("/super-admin/subscription-plans");
    return { success: true, plan };
  } catch (error: any) {
    console.error("Failed to create plan:", error);
    return { success: false, error: "Failed to create plan" };
  }
}

/**
 * Update an existing subscription plan
 */
export async function updatePlan(id: string, data: any) {
  try {
    const superAdmin = await ensureSuperAdmin();

    const oldPlan = await prisma.plan.findUnique({ where: { id } });
    if (!oldPlan) throw new Error("Plan not found");

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name: data.name,
        duration: data.duration ? parseInt(data.duration) : undefined,
        price: data.price,
        gstIncluded: data.gstIncluded,
        features: data.features,
        description: data.description,
        color: data.color,
        isActive: data.isActive,
        maxCheckIns: data.maxCheckIns ? parseInt(data.maxCheckIns) : undefined,
        ptSessions: data.ptSessions ? parseInt(data.ptSessions) : undefined,
        guestPasses: data.guestPasses ? parseInt(data.guestPasses) : undefined,
        sortOrder: data.sortOrder ? parseInt(data.sortOrder) : undefined,
      } as any,
    });

    await recordAudit({
      userId: superAdmin.id,
      action: "UPDATE",
      entityType: "PLAN",
      entityId: plan.id,
      oldValue: oldPlan,
      newValue: plan,
    });

    revalidatePath("/super-admin/subscription-plans");
    return { success: true, plan };
  } catch (error: any) {
    console.error("Failed to update plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

/**
 * Toggle plan active status
 */
export async function togglePlanStatus(id: string, currentStatus: boolean) {
  try {
    const superAdmin = await ensureSuperAdmin();

    await prisma.plan.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    await recordAudit({
      userId: superAdmin.id,
      action: "UPDATE",
      entityType: "PLAN",
      entityId: id,
      newValue: { isActive: !currentStatus },
    });

    revalidatePath("/super-admin/subscription-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle plan status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Delete a plan (only if no subscriptions)
 */
export async function deletePlan(id: string) {
  try {
    const superAdmin = await ensureSuperAdmin();

    const activeSubs = await prisma.subscription.count({
      where: { planId: id, status: "ACTIVE" },
    });

    if (activeSubs > 0) {
      return {
        success: false,
        error: "Cannot delete plan with active subscribers. Deactivate it instead.",
      };
    }

    await prisma.plan.delete({ where: { id } });

    await recordAudit({
      userId: superAdmin.id,
      action: "DELETE",
      entityType: "PLAN",
      entityId: id,
    });

    revalidatePath("/super-admin/subscription-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete plan" };
  }
}
