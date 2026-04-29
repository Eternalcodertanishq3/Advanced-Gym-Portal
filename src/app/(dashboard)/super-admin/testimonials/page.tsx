import prisma from "@/lib/prisma";
import { MessageSquare } from "lucide-react";
import TestimonialManager from "./components/testimonial-manager";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-wide font-display flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-brand-orange" />
          Member Feedback
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve member stories for the landing page.</p>
      </div>

      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
