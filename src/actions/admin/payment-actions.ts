"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getBranchContext } from "@/lib/action-utils";
import { auth } from "@/auth";
import { serializeData } from "@/lib/utils";

export async function getPayments(page = 1, limit = 10, status?: string) {
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (Math.max(1, page) - 1) * safeLimit;

    const { branchId } = await getBranchContext();

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    if (branchId) {
      whereClause.member = {
        user: {
          branchId: branchId,
        },
      };
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: whereClause,
        include: {
          member: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
      }),
      prisma.payment.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: serializeData({
        payments,
        pagination: { total, pages: Math.ceil(total / safeLimit), page, limit: safeLimit },
      }),
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createPayment(data: {
  memberId: string;
  subscriptionId?: string;
  amount: number;
  method: any;
  receiptNo: string;
  transactionId?: string;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    // Atomic Transaction: Database RLS & Idempotency deduplication
    const tenantId = (session.user as any).tenantId;
    const { withTenantRLS } = await import("@/lib/rls");

    const payment = await withTenantRLS(tenantId, async (tx) => {
      if (data.receiptNo) {
        const existing = await tx.payment.findFirst({
          where: { receiptNo: data.receiptNo },
        });
        if (existing) return existing; // Idempotent return
      }

      return tx.payment.create({
        data: {
          memberId: data.memberId,
          subscriptionId: data.subscriptionId,
          amount: data.amount,
          tax: 0,
          discount: 0,
          total: data.amount,
          method: data.method,
          status: "COMPLETED",
          receiptNo: data.receiptNo,
          transactionId: data.transactionId,
        },
      });
    });

    revalidatePath("/admin/payments");
    return { success: true, data: serializeData(payment) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getPaymentStats() {
  try {
    const { branchId } = await getBranchContext();

    const whereClause: any = {};
    if (branchId) {
      whereClause.member = {
        user: { branchId: branchId },
      };
    }

    const [totalRevenue, pendingDues, totalTransactions] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { ...whereClause, status: "COMPLETED" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { ...whereClause, status: "PENDING" },
      }),
      prisma.payment.count({
        where: { ...whereClause, status: "COMPLETED" },
      }),
    ]);

    return {
      success: true,
      data: {
        totalRevenue: Number(totalRevenue._sum.amount || 0),
        pendingDues: Number(pendingDues._sum.amount || 0),
        totalTransactions,
      },
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
