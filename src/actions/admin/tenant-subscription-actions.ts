"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * 🦅 GymFlow SaaS — Tenant SaaS Subscription Management Actions
 */

/**
 * 1. Fetch current tenant subscription details & available plans
 */
export async function getCurrentTenantSubscription() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true, role: true },
    });

    if (!user || !user.tenantId) {
      return { success: false, error: "No tenant context associated with this user" };
    }

    // Only Admin or Super Admin can manage Tenant subscriptions
    const canManage = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    if (!canManage) {
      return { success: false, error: "Access denied. Only gym owners/admins can manage billing." };
    }

    const [tenant, plans] = await Promise.all([
      prisma.tenant.findUnique({
        where: { id: user.tenantId },
        include: { saasPlan: true },
      }),
      prisma.saaSPlan.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      }),
    ]);

    if (!tenant) {
      return { success: false, error: "Tenant records not found" };
    }

    return {
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        currency: tenant.currency,
        saasPlanId: tenant.saasPlanId,
        saasStatus: tenant.saasStatus,
        saasExpiry: tenant.saasExpiry,
        saasPlan: tenant.saasPlan,
      },
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price.toString(),
        interval: p.interval,
        maxBranches: p.maxBranches,
        maxMembers: p.maxMembers,
        features: p.features,
      })),
    };
  } catch (error) {
    console.error("Error loading tenant subscription:", error);
    return { success: false, error: "Failed to fetch tenant subscription info" };
  }
}

/**
 * 2. Upgrade or Downgrade SaaS Plan instantly (Self-Service)
 */
export async function updateTenantSaaSPlan(targetPlanId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true, role: true },
    });

    if (!user || !user.tenantId) {
      return { success: false, error: "No tenant context associated with this user" };
    }

    const canManage = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    if (!canManage) {
      return { success: false, error: "Access denied. Only gym owners/admins can manage billing." };
    }

    const plan = await prisma.saaSPlan.findUnique({
      where: { id: targetPlanId },
    });

    if (!plan || !plan.isActive) {
      return { success: false, error: "Target SaaS plan not found or inactive" };
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days billing cycle

    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        saasPlanId: plan.id,
        saasStatus: "ACTIVE",
        saasExpiry: expiryDate,
      },
    });

    // Create a record of payment / log in audit list
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPGRADE",
        entityType: "Tenant",
        entityId: user.tenantId,
        ipAddress: "127.0.0.1",
        userAgent: "System Server Action",
        newValue: {
          planId: plan.id,
          planName: plan.name,
          price: plan.price.toString(),
        },
      },
    });

    revalidatePath("/admin/settings");
    return {
      success: true,
      message: `Tenant subscription successfully updated to the ${plan.name} Plan!`,
    };
  } catch (error) {
    console.error("Error upgrading tenant SaaS plan:", error);
    return { success: false, error: "Failed to update subscription plan" };
  }
}
