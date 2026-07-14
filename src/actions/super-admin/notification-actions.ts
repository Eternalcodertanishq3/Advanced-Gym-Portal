"use server";

import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/notification-service";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";
import { revalidatePath } from "next/cache";

/**
 * 🦅 EAGLE GYM — Automated Payment Reminders
 * Scans for subscriptions expiring in the next 3 days and sends alerts.
 */
export async function triggerPaymentReminders() {
  try {
    const admin = await ensureSuperAdmin();

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find subscriptions expiring within 3 days that haven't been notified
    const dueSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
        plan: true,
      },
    });

    let sentCount = 0;
    const results = [];

    for (const sub of dueSubscriptions) {
      const { user } = sub.member;
      const { plan } = sub;

      // Send Email
      const emailRes = await NotificationService.sendEmail({
        to: user.email,
        subject: `Payment Reminder: Your ${plan.name} is expiring soon!`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b;">
            <h2 style="color: #E85D26;">Eagle Gym Payment Reminder</h2>
            <p>Hello <strong>${user.firstName}</strong>,</p>
            <p>Your <strong>${plan.name}</strong> subscription is set to expire on <strong>${sub.endDate.toLocaleDateString()}</strong>.</p>
            <p>To ensure uninterrupted access to the gym and your personalized training plans, please renew your subscription via the member portal or at the reception.</p>
            <br/>
            <p>Stay Strong,<br/>The Eagle Gym Team</p>
          </div>
        `,
      });

      // Send SMS (Mock/Placeholder)
      const smsRes = await NotificationService.sendSMS({
        to: user.phone || "",
        message: `Eagle Gym: Hi ${user.firstName}, your ${plan.name} expires on ${sub.endDate.toLocaleDateString()}. Renew now to avoid interruption!`,
      });

      if (emailRes.success || smsRes.success) {
        sentCount++;
        results.push({ email: user.email, success: true });
      }
    }

    await recordAudit({
      userId: admin.id,
      action: "UPDATE",
      entityType: "NOTIFICATIONS",
      entityId: "BULK_REMINDER",
      newValue: { sentCount, targetCount: dueSubscriptions.length },
    });

    revalidatePath("/super-admin");
    return { success: true, sentCount, totalFound: dueSubscriptions.length };
  } catch (error: any) {
    console.error("Failed to trigger reminders:", error);
    return { success: false, error: error.message };
  }
}
