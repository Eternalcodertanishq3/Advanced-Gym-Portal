import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.warn("WARNING: CRON_SECRET is missing from environment variables.");
    }

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Expire Member Subscriptions
      const expiredSubs = await tx.subscription.updateMany({
        where: {
          status: "ACTIVE",
          endDate: { lt: now },
        },
        data: {
          status: "EXPIRED",
        },
      });

      // Update corresponding members status to EXPIRED
      const expiredMembers = await tx.member.updateMany({
        where: {
          status: "ACTIVE",
          subscription: {
            endDate: { lt: now },
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      // 2. Expire B2B Tenants
      const expiredTenants = await tx.tenant.updateMany({
        where: {
          saasStatus: "ACTIVE",
          saasExpiry: { lt: now },
        },
        data: {
          saasStatus: "EXPIRED",
        },
      });

      return {
        expiredSubscriptionsCount: expiredSubs.count,
        expiredMembersCount: expiredMembers.count,
        expiredTenantsCount: expiredTenants.count,
      };
    });

    console.log(
      `[Subscription Cron Executed]: Expired ${result.expiredSubscriptionsCount} subscriptions and ${result.expiredTenantsCount} tenants.`,
    );

    return NextResponse.json({
      success: true,
      message: "Subscription status verification completed successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error("Scheduled cron verification job failed:", error);
    return NextResponse.json({ error: error.message || "Internal Cron Error" }, { status: 500 });
  }
}
