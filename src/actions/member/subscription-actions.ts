"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Subscribe a member to a plan
 */
export async function subscribeToPlan(planId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    return { success: false, error: "Only members can subscribe to plans." };
  }

  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) {
      return { success: false, error: "Plan not found or inactive." };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found." };
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    // Create or Update Subscription
    // (In a real app, you'd handle payment here first)
    await prisma.subscription.upsert({
      where: { memberId: member.id },
      update: {
        planId: plan.id,
        startDate,
        endDate,
        amount: plan.price,
        status: "ACTIVE",
      },
      create: {
        memberId: member.id,
        planId: plan.id,
        startDate,
        endDate,
        amount: plan.price,
        status: "ACTIVE",
      },
    });

    // Create a dummy payment record
    await prisma.payment.create({
      data: {
        memberId: member.id,
        amount: plan.price,
        total: plan.price,
        method: "CASH", // Dummy
        type: "SUBSCRIPTION",
        status: "COMPLETED",
        receiptNo: `REC-${Date.now()}`,
        description: `Subscription to ${plan.name}`,
      },
    });

    revalidatePath("/member");
    return { success: true };
  } catch (error: any) {
    console.error("Subscription failed:", error);
    return { success: false, error: "Failed to process subscription." };
  }
}
