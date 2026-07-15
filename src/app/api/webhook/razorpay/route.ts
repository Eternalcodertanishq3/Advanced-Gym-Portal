import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Razorpay Webhook Handler
// ═══════════════════════════════════════════════════════════════

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature payload" }, { status: 400 });
    }

    // Verify webhook signature for absolute security
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        console.error("CRITICAL: RAZORPAY_WEBHOOK_SECRET is missing in production!");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret || "mock_webhook_secret")
      .update(rawBody)
      .digest("hex");

    if (!safeCompare(expectedSignature, signature)) {
      console.warn("Invalid signature verified on Razorpay Webhook.");
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    // Handle payment capture events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes || {};

      const { memberId, planId } = notes;

      if (memberId && planId) {
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
        });

        if (plan) {
          const now = new Date();
          const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);

          await prisma.$transaction(async (tx) => {
            // Fetch member's user profile to get branch context
            const user = await tx.user.findFirst({
              where: { member: { id: memberId } },
            });
            const branchId = user?.branchId || null;

            // 1. Upsert subscription state
            const sub = await tx.subscription.upsert({
              where: { memberId },
              update: {
                planId: plan.id,
                startDate: now,
                endDate: endDate,
                amount: plan.price,
                status: "ACTIVE",
              },
              create: {
                memberId,
                planId: plan.id,
                startDate: now,
                endDate: endDate,
                amount: plan.price,
                status: "ACTIVE",
                branchId,
              },
            });

            // 2. Check for duplicate logs (idempotency check)
            const duplicateCheck = await tx.payment.findFirst({
              where: { transactionId: paymentEntity.id },
            });

            if (!duplicateCheck) {
              await tx.payment.create({
                data: {
                  memberId,
                  amount: plan.price,
                  total: plan.price,
                  method: "ONLINE",
                  type: "SUBSCRIPTION",
                  status: "COMPLETED",
                  receiptNo: `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  transactionId: paymentEntity.id,
                  subscriptionId: sub.id,
                  branchId,
                },
              });

              // 3. Mark member active
              await tx.member.update({
                where: { id: memberId },
                data: { status: "ACTIVE" },
              });

              // 4. Award XP for subscribing (Gamification Integration!)
              if (user) {
                await tx.xPTransaction.create({
                  data: {
                    userId: user.id,
                    amount: 150,
                    reason: `Subscribed to ${plan.name} plan`,
                  },
                });
                await tx.user.update({
                  where: { id: user.id },
                  data: { xp: { increment: 150 } },
                });
              }
            }
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Razorpay webhook handler failure:", error);
    return NextResponse.json(
      {
        error: (error instanceof Error ? error.message : String(error)) || "Internal Webhook Error",
      },
      { status: 500 },
    );
  }
}
