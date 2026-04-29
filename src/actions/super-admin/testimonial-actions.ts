"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    await prisma.testimonial.update({
      where: { id },
      data: { isApproved: true },
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
    await prisma.testimonial.delete({
      where: { id },
    });
    revalidatePath("/super-admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete testimonial" };
  }
}
