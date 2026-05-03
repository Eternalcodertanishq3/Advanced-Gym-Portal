"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches the member's current subscription and payment methods.
 */
export async function getBillingInfo() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
      include: {
        subscription: {
          include: { plan: true }
        }
      }
    });

    if (!member) return { success: false, error: "Member not found" };

    // Mocking payment methods since we don't have a real Stripe integration yet
    const paymentMethods = [
      { 
        id: "pm_1", 
        brand: "visa", 
        last4: "4242", 
        expMonth: 12, 
        expYear: 2026, 
        isDefault: true 
      },
      { 
        id: "pm_2", 
        brand: "mastercard", 
        last4: "8888", 
        expMonth: 5, 
        expYear: 2025, 
        isDefault: false 
      }
    ];

    const invoices = [
      { id: "inv_1", amount: member.subscription?.plan?.price || 49.99, date: new Date(), status: "paid" },
      { id: "inv_2", amount: 49.99, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: "paid" }
    ];

    return { 
      success: true, 
      data: {
        subscription: member.subscription,
        paymentMethods,
        invoices
      }
    };
  } catch (error) {
    console.error("Error fetching billing info:", error);
    return { success: false, error: "Failed to load billing intelligence" };
  }
}

/**
 * Updates the default payment method.
 */
export async function setDefaultPaymentMethod(pmId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 800));

    revalidatePath("/member/billing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update default payment protocol" };
  }
}
