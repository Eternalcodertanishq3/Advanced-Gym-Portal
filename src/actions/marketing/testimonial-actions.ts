"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const testimonialSchema = z.object({
  author: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
  quote: z.string().min(10, "Quote must be at least 10 characters"),
  rating: z.number().min(1).max(5).default(5),
});

export async function submitTestimonial(formData: FormData) {
  try {
    const data = {
      author: formData.get("author") as string,
      role: formData.get("role") as string,
      quote: formData.get("quote") as string,
      rating: 5, // Default for now
    };

    const validated = testimonialSchema.parse(data);

    await prisma.testimonial.create({
      data: {
        ...validated,
        isApproved: false,
      },
    });

    return { success: true, message: "Thank you! Your feedback has been submitted for review." };
  } catch (error: any) {
    console.error("Testimonial submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to submit feedback. Please try again." };
  }
}

export async function getApprovedTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, testimonials };
  } catch (error) {
    return { success: false, testimonials: [] };
  }
}
