"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getBranchContext } from "@/lib/action-utils";

export async function getSubscriptions(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        member: {
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ]
          }
        }
      };
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: whereClause,
        include: {
          member: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } }
            }
          },
          plan: true,
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where: whereClause })
    ]);

    return { 
      success: true, 
      data: {
        subscriptions,
        pagination: { total, pages: Math.ceil(total / limit), page, limit }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSubscription(data: { memberId: string, planId: string, startDate: Date, endDate: Date }) {
  try {
    const { branchId } = await getBranchContext();
    
    const plan = await prisma.plan.findUnique({
      where: { id: data.planId }
    });

    if (!plan) throw new Error("Plan not found");

    const sub = await prisma.subscription.create({
      data: {
        memberId: data.memberId,
        planId: data.planId,
        branchId,
        startDate: data.startDate,
        endDate: data.endDate,
        amount: plan.price,
        status: "ACTIVE"
      }
    });

    revalidatePath("/admin/members");
    revalidatePath("/admin");
    return { success: true, data: sub };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
