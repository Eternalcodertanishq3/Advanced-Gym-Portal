"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStaff(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        user: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ]
        }
      };
    }

    const [workers, total] = await Promise.all([
      prisma.worker.findMany({
        where: whereClause,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, avatar: true, phone: true }
          }
        },
        orderBy: { joiningDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.worker.count({ where: whereClause })
    ]);


    return { 
      success: true, 
      data: {
        staff: workers,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
