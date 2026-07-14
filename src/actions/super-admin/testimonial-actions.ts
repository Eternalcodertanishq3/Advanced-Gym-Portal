"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";

export async function getAllTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, testimonials };
  } catch (error) {
    return { success: false, error: "Failed to fetch testimonials" };
  }
}

export async function approveTestimonial(id: string) {
  try {
    const user = await ensureSuperAdmin();
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { isApproved: true },
    });

    await recordAudit({
      userId: user.id,
      action: "UPDATE",
      entityType: "TESTIMONIAL",
      entityId: id,
      newValue: { isApproved: true },
    });
    revalidatePath("/super-admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to approve testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const user = await ensureSuperAdmin();
    const oldTestimonial = await prisma.testimonial.findUnique({ where: { id } });

    await prisma.testimonial.delete({
      where: { id },
    });

    await recordAudit({
      userId: user.id,
      action: "DELETE",
      entityType: "TESTIMONIAL",
      entityId: id,
      oldValue: oldTestimonial,
    });
    revalidatePath("/super-admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete testimonial" };
  }
}
