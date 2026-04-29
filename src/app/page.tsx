import { getSystemConfig } from "@/actions/super-admin/config-actions";
import { getPlans } from "@/actions/super-admin/plan-actions";
import { getApprovedTestimonials } from "@/actions/marketing/testimonial-actions";
import { LandingClient } from "./landing-client";

export default async function LandingPage() {
  const [configRes, plansRes, testimonialsRes] = await Promise.all([
    getSystemConfig(),
    getPlans(),
    getApprovedTestimonials()
  ]);

  const config = configRes.success && configRes.config ? configRes.config : {};
  const plans = plansRes.success && plansRes.plans ? plansRes.plans : [];
  const testimonials = testimonialsRes.success ? testimonialsRes.testimonials : [];

  return <LandingClient config={config} plans={plans} testimonials={testimonials} />;
}
