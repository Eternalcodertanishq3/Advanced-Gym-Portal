"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClasses(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        name: { contains: search, mode: "insensitive" }
      };
    }

    const [classes, total] = await Promise.all([
      prisma.gymClass.findMany({
        where: whereClause,
        include: {
          trainer: {
            include: { user: { select: { firstName: true, lastName: true } } }
          },
          schedules: {
            include: {
              _count: {
                select: { bookings: true }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.gymClass.count({ where: whereClause })
    ]);

    return { 
      success: true, 
      data: {
        classes,
        pagination: { total, pages: Math.ceil(total / limit), page, limit }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createClass(data: { name: string, description?: string, trainerId: string, category: any, capacity: number, duration: number }) {
  try {
    const gymClass = await prisma.gymClass.create({
      data: {
        name: data.name,
        description: data.description,
        trainerId: data.trainerId,
        category: data.category,
        maxCapacity: data.capacity,
        duration: data.duration,
      }
    });

    revalidatePath("/admin/classes");
    return { success: true, data: gymClass };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

