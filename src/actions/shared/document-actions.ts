"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserDocuments(memberId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }
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
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }
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
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.document.delete({ where: { id } });
    revalidatePath("/admin/documents");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


