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

/**
 * Processes a product sale (POS).
 */
export async function processSale(data: {
  items: { productId: string; quantity: number; price: number }[];
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: any;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}) {
  try {
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Create the Sale
      const newSale = await tx.sale.create({
        data: {
          subtotal: data.subtotal,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          paymentMethod: data.paymentMethod,
          customerId: data.customerId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            }))
          }
        }
      });

      // 2. Update stock for each product
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3. Create Payment record
      await tx.payment.create({
        data: {
          memberId: data.customerId || "WALK-IN", // Placeholder or handling for non-members
          amount: data.subtotal,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          method: data.paymentMethod,
          type: "PRODUCT",
          status: "COMPLETED",
          receiptNo: `REC-${Date.now()}`,
          saleId: newSale.id,
          description: `Sale of ${data.items.length} product(s)`
        }
      });

      return newSale;
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/payments");
    return { success: true, data: sale };
  } catch (error: any) {
    console.error("Sale processing failed:", error);
    return { success: false, error: error.message || "Failed to process sale" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) return { success: false, error: "Product not found" };
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock: data.stock,
        barcode: data.sku,
        image: data.image,
      }
    });

    revalidatePath("/admin/inventory");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock: data.stock,
        barcode: data.sku,
        image: data.image,
      }
    });

    revalidatePath("/admin/inventory");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

