import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/notification-service";
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
    const eventId = payload.id;
    const eventType = payload.event;

    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    // 1. Initial check outside transaction (fast path to avoid lock overhead)
    const duplicateEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (duplicateEvent) {
      return NextResponse.json(
        { duplicate: true, message: "Webhook event already processed" },
        { status: 200 },
      );
    }

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
            // 2. Insert event ID inside the transaction (database enforcement check for concurrent requests)
            await tx.webhookEvent.create({
              data: {
                eventId,
                provider: "RAZORPAY",
                eventType,
              },
            });

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
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes || {};
      const { memberId, planId } = notes;

      if (memberId && planId) {
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
        });

        if (plan) {
          await prisma.$transaction(async (tx) => {
            // Write event to idempotency check table
            await tx.webhookEvent.create({
              data: {
                eventId,
                provider: "RAZORPAY",
                eventType,
              },
            });

            const user = await tx.user.findFirst({
              where: { member: { id: memberId } },
            });
            const branchId = user?.branchId || null;

            // 1. Create a FAILED payment log
            await tx.payment.create({
              data: {
                memberId,
                amount: plan.price,
                total: plan.price,
                method: "ONLINE",
                type: "SUBSCRIPTION",
                status: "FAILED",
                receiptNo: `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                transactionId: paymentEntity.id,
                branchId,
                description: `Failed payment attempt for subscription plan ${plan.name}`,
              },
            });

            // 2. Alert the user of their failed payment & provide a recovery path (Dunning Flow)
            if (user?.email) {
              await NotificationService.sendEmail({
                to: user.email,
                subject: "Payment Failed — GymFlow SaaS Subscription Alert",
                html: `
                  <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1; border-radius: 12px;">
                    <h2 style="color: #ef4444; font-size: 20px; font-weight: bold; margin-bottom: 16px;">Payment Verification Failed</h2>
                    <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                      Hello ${user.firstName},<br/><br/>
                      We were unable to process your payment of <strong>₹${plan.price}</strong> for the subscription plan <strong>${plan.name}</strong>.
                    </p>
                    <div style="text-align: center; margin-bottom: 24px;">
                      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/member/subscription" 
                         style="background-color: #ef4444; color: #ffffff; padding: 12px 30px; font-weight: bold; font-size: 14px; text-decoration: none; border-radius: 8px; display: inline-block;">
                        Retry Payment Securely
                      </a>
                    </div>
                    <p style="color: #64748b; font-size: 11px; line-height: 1.6;">
                      If your bank account was debited, the amount will be automatically refunded by your card issuer/UPI provider within 3-5 business days.
                    </p>
                  </div>
                `,
              });
            }
          });
        }
      }
    } else {
      // Create record for other webhook event types so they are not re-processed
      await prisma.webhookEvent.create({
        data: {
          eventId,
          provider: "RAZORPAY",
          eventType,
        },
      });
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
