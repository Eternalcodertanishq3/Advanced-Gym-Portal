"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventoryItems(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    let whereClause = {};
    if (search) {
      whereClause = { name: { contains: search, mode: "insensitive" } };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause })
    ]);

    return { 
      success: true, 
      data: { items, pagination: { total, pages: Math.ceil(total / limit), page, limit } }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInventoryQuantity(id: string, newQuantity: number) {
  try {
    const item = await prisma.product.update({
      where: { id },
      data: { stock: newQuantity }
    });
    revalidatePath("/admin/inventory");
    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

