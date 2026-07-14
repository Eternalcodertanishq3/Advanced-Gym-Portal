import prisma from "@/lib/prisma";
import { MessageSquare } from "lucide-react";
import TestimonialManager from "./components/testimonial-manager";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-wide text-foreground">
          <MessageSquare className="h-6 w-6 text-brand-orange" />
          Member Feedback
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve member stories for the landing page.
        </p>
      </div>

      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
