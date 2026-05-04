"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserDocuments(memberId: string) {
  try {
    const documents = await prisma.document.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: documents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllDocuments() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        member: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: documents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDocument(id: string) {
  try {
    await prisma.document.delete({ where: { id } });
    revalidatePath("/admin/documents");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


