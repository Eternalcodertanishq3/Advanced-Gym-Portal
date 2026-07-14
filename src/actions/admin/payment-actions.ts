"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getBranchContext } from "@/lib/action-utils";
import { auth } from "@/auth";

export async function getPayments(page = 1, limit = 10, status?: string) {
  try {
    const skip = (page - 1) * limit;

    const { branchId } = await getBranchContext();

    let whereClause: any = {};
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
        take: limit,
      }),
      prisma.payment.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: {
        payments,
        pagination: { total, pages: Math.ceil(total / limit), page, limit },
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
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
    const payment = await prisma.payment.create({
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

    revalidatePath("/admin/payments");
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPaymentStats() {
  try {
    const { branchId } = await getBranchContext();

    let whereClause: any = {};
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
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
