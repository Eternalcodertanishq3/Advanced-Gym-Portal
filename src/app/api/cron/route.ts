import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.warn("CRON_SECRET missing or invalid authorization header.");
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const now = new Date();
    const startTime = Date.now();
    const BATCH_SIZE = 250;

    let totalExpiredSubscriptions = 0;
    let totalExpiredMembers = 0;
    let hasMore = true;

    // 1. Process Expired Subscriptions & Members in bounded batch chunks
    while (hasMore) {
      const expiredBatch = await prisma.subscription.findMany({
        where: {
          status: "ACTIVE",
          endDate: { lt: now },
        },
        take: BATCH_SIZE,
        select: {
          id: true,
          memberId: true,
        },
      });

      if (expiredBatch.length === 0) {
        hasMore = false;
        break;
      }

      const subIds = expiredBatch.map((s) => s.id);
      const memberIds = expiredBatch.map((s) => s.memberId).filter(Boolean);

      await prisma.$transaction([
        prisma.subscription.updateMany({
          where: { id: { in: subIds } },
          data: { status: "EXPIRED" },
        }),
        prisma.member.updateMany({
          where: { id: { in: memberIds }, status: "ACTIVE" },
          data: { status: "EXPIRED" },
        }),
      ]);

      totalExpiredSubscriptions += subIds.length;
      totalExpiredMembers += memberIds.length;

      if (expiredBatch.length < BATCH_SIZE) {
        hasMore = false;
      }
    }

    // 2. Expire Overdue B2B Tenants in bounded batch
    const expiredTenants = await prisma.tenant.updateMany({
      where: {
        saasStatus: "ACTIVE",
        saasExpiry: { lt: now },
      },
      data: {
        saasStatus: "EXPIRED",
      },
    });

    const executionDurationMs = Date.now() - startTime;

    const result = {
      expiredSubscriptionsCount: totalExpiredSubscriptions,
      expiredMembersCount: totalExpiredMembers,
      expiredTenantsCount: expiredTenants.count,
      executionDurationMs,
    };

    console.debug(
      `[Subscription Cron Executed]: Expired ${result.expiredSubscriptionsCount} subscriptions and ${result.expiredTenantsCount} tenants in ${executionDurationMs}ms.`,
    );

    return NextResponse.json({
      success: true,
      message: "Subscription status verification completed successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Scheduled cron verification job failed:", error);
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : String(error)) || "Internal Cron Error" },
      { status: 500 },
    );
  }
}
