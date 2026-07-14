"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Member Billing and Payment Actions
// ═══════════════════════════════════════════════════════════════

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Fetches the member's current subscription, transactions, and available payment methods.
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
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!member) return { success: false, error: "Member not found" };

    // Standard checkout cards mapping for UI
    const paymentMethods = [
      { 
        id: "pm_online", 
        brand: "razorpay", 
        last4: "Online NetBanking/UPI", 
        expMonth: 12, 
        expYear: 2030, 
        isDefault: true 
      }
    ];

    const invoices = member.payments.map((p) => ({
      id: p.id,
      amount: Number(p.total),
      date: p.createdAt,
      status: p.status.toLowerCase(),
      receiptNo: p.receiptNo
    }));

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
    return { success: false, error: "Failed to load billing details" };
  }
}

/**
 * Creates a Razorpay Order for a subscription plan purchase.
 */
export async function createCheckoutSession(planId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member profile not found" };

    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan || !plan.isActive) return { success: false, error: "Plan is active or not found" };

    const amountInPaise = Math.round(Number(plan.price) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_sub_${plan.id.slice(0, 8)}_${Date.now().toString().slice(-6)}`,
      notes: {
        memberId: member.id,
        planId: plan.id,
        userId: session.user.id
      }
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId && process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL: RAZORPAY_KEY_ID is missing in production!");
    }

    return {
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId || "mock_key_id",
        name: plan.name,
        description: plan.description || `Subscription: ${plan.name}`,
        member: {
          name: session.user.name || `${session.user.firstName} ${session.user.lastName}`,
          email: session.user.email,
          phone: (session.user as any).phone || ""
        }
      }
    };
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return { success: false, error: error.message || "Failed to initiate checkout session" };
  }
}

/**
 * Verifies the Razorpay payment signature and updates the subscription state.
 */
export async function verifyPaymentSignature(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  planId: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member profile not found" };

    const plan = await prisma.plan.findUnique({
      where: { id: data.planId }
    });

    if (!plan) return { success: false, error: "Plan not found" };

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret && process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL: RAZORPAY_KEY_SECRET is missing in production!");
    }

    // Verify HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", secret || "mock_key_secret")
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (!safeCompare(generatedSignature, data.razorpay_signature)) {
      return { success: false, error: "Payment verification failed. Invalid signature." };
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update/Create Subscription
      const sub = await tx.subscription.upsert({
        where: { memberId: member.id },
        update: {
          planId: plan.id,
          startDate: now,
          endDate: endDate,
          amount: plan.price,
          status: "ACTIVE",
        },
        create: {
          memberId: member.id,
          planId: plan.id,
          startDate: now,
          endDate: endDate,
          amount: plan.price,
          status: "ACTIVE",
          branchId: (session.user as any).branchId
        }
      });

      // 2. Create Payment log
      const payment = await tx.payment.create({
        data: {
          memberId: member.id,
          amount: plan.price,
          total: plan.price,
          method: "ONLINE",
          type: "SUBSCRIPTION",
          status: "COMPLETED",
          receiptNo: `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          transactionId: data.razorpay_payment_id,
          subscriptionId: sub.id,
          branchId: (session.user as any).branchId
        }
      });

      // 3. Activate member
      await tx.member.update({
        where: { id: member.id },
        data: { status: "ACTIVE" }
      });

      return { sub, payment };
    });

    revalidatePath("/member/billing");
    revalidatePath("/member/subscription");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Signature verification failed:", error);
    return { success: false, error: error.message || "Signature verification failed" };
  }
}

/**
 * Updates the default payment method (simulated).
 */
export async function setDefaultPaymentMethod(pmId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Simulate database update delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    revalidatePath("/member/billing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update default payment protocol" };
  }
}
