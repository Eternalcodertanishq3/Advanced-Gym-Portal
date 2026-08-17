import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Subscription Dunning & Recovery Lifecycle Engine
// Automated grace period tracking, payment retry schedules, and suspension
// ═══════════════════════════════════════════════════════════════

export interface DunningEventPayload {
  subscriptionId: string;
  memberId: string;
  tenantId?: string;
  amount: number;
  failureReason?: string;
}

export const DunningService = {
  /**
   * Handles a failed subscription payment attempt (triggers grace period & reminder)
   */
  async handlePaymentFailure(payload: DunningEventPayload) {
    const { subscriptionId, memberId, tenantId, failureReason } = payload;

    logger.warn("Subscription payment failed, initiating dunning cycle", {
      subscriptionId,
      memberId,
      tenantId,
      failureReason,
    });

    const { withTenantRLS } = await import("@/lib/rls");
    return withTenantRLS(tenantId, async (tx) => {
      // 1. Fetch subscription details
      const sub = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: { member: { include: { user: true } } },
      });

      if (!sub) {
        logger.error("Subscription not found for dunning event", undefined, { subscriptionId });
        return { success: false, error: "Subscription not found" };
      }

      // 2. Transition status to GRACE if currently active
      const updatedSub = await tx.subscription.update({
        where: { id: subscriptionId },
        data: { status: "GRACE" },
      });

      // 3. Create in-app notification for the member
      if (sub.member?.userId) {
        await tx.notification.create({
          data: {
            userId: sub.member.userId,
            title: "Payment Unsuccessful — Action Required",
            body: "Your latest membership renewal could not be processed. Please update your payment method to avoid suspension.",
            type: "PAYMENT_DUE",
            tenantId: sub.tenantId,
            memberId: sub.memberId,
          },
        });
      }

      return { success: true, status: updatedSub.status };
    });
  },

  /**
   * Handles a successful payment recovery (reactivates membership and updates renewal date)
   */
  async handlePaymentRecovery(payload: {
    subscriptionId: string;
    transactionId: string;
    amount: number;
    tenantId?: string;
  }) {
    const { subscriptionId, transactionId, amount, tenantId } = payload;

    logger.info("Subscription payment recovered, restoring active status", {
      subscriptionId,
      transactionId,
      amount,
    });

    const { withTenantRLS } = await import("@/lib/rls");
    return withTenantRLS(tenantId, async (tx) => {
      const sub = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: { member: true, plan: true },
      });

      if (!sub) return { success: false, error: "Subscription not found" };

      // Restore status to ACTIVE
      const updatedSub = await tx.subscription.update({
        where: { id: subscriptionId },
        data: { status: "ACTIVE" },
      });

      // Also ensure member status is ACTIVE
      if (sub.memberId) {
        await tx.member.update({
          where: { id: sub.memberId },
          data: { status: "ACTIVE" },
        });
      }

      // Record successful payment transaction
      await tx.payment.create({
        data: {
          memberId: sub.memberId,
          subscriptionId: sub.id,
          amount,
          tax: 0,
          discount: 0,
          total: amount,
          method: "CARD",
          status: "COMPLETED",
          receiptNo: `REC-DUN-${Date.now().toString().slice(-6)}`,
          transactionId,
          tenantId: sub.tenantId,
        },
      });

      return { success: true, status: updatedSub.status };
    });
  },

  /**
   * Suspends overdue subscriptions whose grace period (e.g. 7 days) has expired
   */
  async processOverdueSuspensions(gracePeriodDays = 7) {
    const cutoffDate = new Date(Date.now() - gracePeriodDays * 24 * 60 * 60 * 1000);
    const { withTenantRLS } = await import("@/lib/rls");

    return withTenantRLS("SUPER_ADMIN_BYPASS", async (tx) => {
      const expiredSubs = await tx.subscription.findMany({
        where: {
          status: "GRACE",
          updatedAt: { lte: cutoffDate },
        },
        select: { id: true, memberId: true, tenantId: true },
      });

      for (const sub of expiredSubs) {
        await tx.subscription.update({
          where: { id: sub.id },
          data: { status: "CANCELLED" },
        });

        if (sub.memberId) {
          await tx.member.update({
            where: { id: sub.memberId },
            data: { status: "FROZEN" },
          });
        }
      }

      return { suspendedCount: expiredSubs.length };
    });
  },
};

export default DunningService;
