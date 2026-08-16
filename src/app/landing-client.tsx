"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { RoleSwitcher } from "@/components/marketing/role-switcher";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { ComparisonMatrix } from "@/components/marketing/comparison-matrix";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { PartnersBar } from "@/components/marketing/partners-bar";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingClientProps {
  config: Record<string, any>;
  plans: any[];
  testimonials: any[];
}

const FAQS = [
  {
    q: "Do I need special turnstile or biometric hardware to use the Kiosk?",
    a: "No! GymFlow's Smart Kiosk runs in any standard web browser on an iPad, Android tablet, or old smartphone. Members simply show their dynamic QR code to the front camera for 1-second entry verification.",
  },
  {
    q: "How does the 'Founding Partner' free Excel migration work?",
    a: "Once you start your 14-day free pilot, simply send us your existing member list in Excel, Google Sheets, or CSV format. Our technical onboarding team will clean, format, and upload all your active members, plans, and expiry dates within 24 hours.",
  },
  {
    q: "Can I manage multiple gym branches from a single account?",
    a: "Yes. With the Multi-Branch Franchise plan, you get a unified consolidated dashboard showing live revenue, active member rosters, and staff check-ins across all locations with cross-branch roaming passes.",
  },
  {
    q: "What happens if our internet connection drops at the front desk?",
    a: "The front-desk terminal and kiosk cache recent active member passes locally and sync automatically the moment your connection recovers. Your check-ins never stop.",
  },
];

export function LandingClient({
  config,
  plans,
  testimonials: _dbTestimonials,
}: LandingClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const gymName = config.gymName || "GymFlow SaaS";

  return (
    <main className="relative min-h-screen bg-obsidian-950 font-display selection:bg-brand-orange selection:text-white">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[1000] h-1 origin-left bg-brand-orange"
        style={{ scaleX }}
      />

      {/* 1. Header Navigation */}
      <MarketingNav gymName={gymName} gymLogo={config.gymLogo} />

      {/* 2. Hero Section (First 5 Seconds Impact + Dual Screen Mockup) */}
      <HeroSection
        gymName={gymName}
        heroSubtitle={config.heroSubtitle}
        heroTitle={config.heroTitle}
        heroDescription={config.heroDescription}
      />

      {/* 3. Partner & Trust Bar */}
      <PartnersBar />

      {/* 4. Interactive Role Switcher ("Show Every User's Experience") */}
      <RoleSwitcher />

      {/* 5. High-Impact Feature Bento Grid (Core Differentiators) */}
      <FeaturesGrid title={config.featuresTitle} subtitle={config.featuresSubtitle} />

      {/* 6. Interactive "Revenue Leakage" ROI Calculator */}
      <RoiCalculator />

      {/* 7. Side-by-Side Comparison Matrix */}
      <ComparisonMatrix />

      {/* 8. Transparent Pricing & Zero-Risk Guarantee */}
      <PricingPlans plans={plans} />

      {/* 9. High-Trust FAQ Section */}
      <section className="relative border-t border-white/5 bg-obsidian-950 py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-orange">
                Frequently Asked Questions
              </span>
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Everything You Need to Know Before Your{" "}
              <span className="text-brand-orange">Free Pilot</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/60 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="pr-4 text-base font-bold text-white">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-brand-orange transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/5 px-6 pb-6 pt-1 text-sm font-medium leading-relaxed text-white/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. High-Conversion Final CTA */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-obsidian-950 via-brand-orange/10 to-obsidian-950 py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/20 blur-[180px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-brand-orange" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">
                Instant 2-Minute Setup
              </span>
            </div>

            <h2 className="mb-8 font-display text-5xl font-black uppercase leading-tight tracking-tight text-white md:text-7xl">
              Ready to Upgrade Your Gym to <span className="text-brand-orange">Autopilot?</span>
            </h2>

            <p className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-white/60 md:text-xl">
              Join leading gyms that recovered thousands in uncollected fees and eliminated
              front-desk chaos with GymFlow SaaS.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-brand-orange px-10 py-5 text-sm font-black uppercase tracking-wider text-white shadow-2xl shadow-brand-orange/40 transition-all hover:scale-105 active:scale-95 sm:w-auto"
              >
                Start 14-Day Free Pilot
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-10 py-5 text-sm font-bold text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                Staff / Member Login
              </Link>
            </div>

            <p className="mt-6 text-xs font-semibold text-white/40">
              No credit card required • Instant account activation • Free CSV onboarding
            </p>
          </motion.div>
        </div>
      </section>

      {/* 11. Footer */}
      <MarketingFooter config={config} />
    </main>
  );
}
