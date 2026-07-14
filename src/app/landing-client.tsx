"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { PartnersBar } from "@/components/marketing/partners-bar";
import Image from "next/image";
import Link from "next/link";
import { Users, MessageSquare } from "lucide-react";
import { TestimonialForm } from "@/components/marketing/testimonial-form";

interface LandingClientProps {
  config: Record<string, any>;
  plans: any[];
  testimonials: any[];
}

export function LandingClient({ config, plans, testimonials: dbTestimonials }: LandingClientProps) {
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const gymName = config.gymName || "EAGLE GYM";

  return (
    <main className="relative min-h-screen bg-obsidian-950 font-display selection:bg-brand-orange selection:text-white">
      {/* Custom Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[1000] h-1 origin-left bg-brand-orange"
        style={{ scaleX }}
      />

      <MarketingNav gymName={gymName} gymLogo={config.gymLogo} />

      <HeroSection
        gymName={gymName}
        heroSubtitle={config.heroSubtitle}
        heroTitle={config.heroTitle}
        heroDescription={config.heroDescription}
        heroImage={config.heroImage}
        statsBranches={config.statsBranches}
        statsMembers={config.statsMembers}
        statsTrainers={config.statsTrainers}
      />

      <PartnersBar />

      <FeaturesGrid title={config.featuresTitle} subtitle={config.featuresSubtitle} />

      {/* Mid-Page CTA / Quote */}
      <section className="relative overflow-hidden bg-brand-orange py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-full w-full rotate-12 scale-150 bg-[url('/logo-white.png')] bg-[length:400px_400px] opacity-10" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <h2 className="mb-10 font-display text-5xl font-black uppercase italic leading-[0.85] tracking-tighter text-white md:text-8xl">
              "{config.midPageQuote || "THE ONLY BAD WORKOUT IS THE ONE THAT DIDN'T HAPPEN."}"
            </h2>
            <div className="flex flex-col items-center gap-6">
              <div className="h-1 w-20 rounded-full bg-white/30" />
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-white/80 md:text-base">
                — {gymName} {config.midPageQuoteAuthor || "Elite Community"} —
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <PricingPlans plans={plans} />

      {/* Trust / FAQ Section Preview */}
      <section id="about" className="relative bg-obsidian-950 py-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/5 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-block rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
                  {config.aboutTitle || "Our Philosophy"}
                </span>
              </div>
              <h3
                className="mb-10 font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-7xl"
                dangerouslySetInnerHTML={{
                  __html: (
                    config.aboutSubtitle || "BUILT ON GRIT, <br />DRIVEN BY RESULTS."
                  ).replace("GRIT", '<span className="text-white/20">GRIT</span>'),
                }}
              />
              <p className="mb-12 text-lg font-medium leading-relaxed text-white/50">
                {config.aboutDescription ||
                  `At ${gymName}, we don't just provide equipment; we provide a sanctuary for transformation. Our facility is engineered to push you further, our community is designed to keep you inspired, and our technology is built to measure your evolution.`}
              </p>
              <div className="space-y-8">
                {(
                  config.aboutFeatures || [
                    "24/7 Premium Access for All Members",
                    "Industry-Leading Certified Trainers",
                    "Cutting-Edge Recovery & Wellness Zones",
                    "Inclusive & Motivational Community",
                  ]
                ).map((item: string, i: number) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center gap-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-brand-orange/30 group-hover:bg-brand-orange/5">
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-orange" />
                    </div>
                    <span className="text-base font-black uppercase tracking-wide text-white">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowFeedbackForm(true)}
                className="group relative mt-16 inline-flex items-center gap-4 overflow-hidden rounded-2xl bg-brand-orange px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-brand-orange/20 transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform duration-700 ease-in-out group-hover:translate-x-[100%]" />
                <MessageSquare className="h-5 w-5" />
                Share Your Story
              </motion.button>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 rounded-[4rem] bg-brand-orange/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative grid grid-cols-12 gap-0">
                {/* Main Image Container */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 col-span-11 aspect-[4/5] overflow-hidden rounded-[3.5rem] border border-white/10 bg-white/5 shadow-2xl"
                >
                  <Image
                    src={config.aboutImage || "/images/hero-bg.png"}
                    alt="Philosophy"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-obsidian-950 via-transparent to-transparent opacity-60" />
                </motion.div>

                {/* Floating Testimonial Slider Container */}
                <motion.div
                  initial={{ opacity: 0, y: 40, x: -20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
                  className="absolute -bottom-12 -left-12 z-30 w-[90%] max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-obsidian-900/60 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:-left-20 sm:w-[110%] sm:p-10"
                >
                  <TestimonialSlider
                    config={config}
                    gymName={gymName}
                    dbTestimonials={dbTestimonials}
                  />
                </motion.div>

                {/* Integration Stat Badge */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 top-12 z-40 rounded-[2.5rem] bg-brand-orange p-8 text-center text-white shadow-[0_20px_40px_rgba(249,115,22,0.3)]"
                >
                  <p className="mb-1 font-display text-5xl font-black leading-none tracking-tighter">
                    98%
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                    Success Rate
                  </p>
                </motion.div>

                {/* Decorative border element */}
                <div className="absolute -left-6 -top-6 -z-10 h-32 w-32 rounded-tl-[3rem] border-l-2 border-t-2 border-brand-orange/30" />
                <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-br-[3rem] border-b-2 border-r-2 border-brand-orange/30" />
              </div>
            </div>

            <TestimonialForm isOpen={showFeedbackForm} onClose={() => setShowFeedbackForm(false)} />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden border-t border-white/5 bg-obsidian-950 py-40">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-12 font-display text-6xl font-black uppercase leading-none tracking-tighter text-white md:text-9xl">
              JOIN THE <br />
              <span className="text-brand-orange">ELITE.</span>
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-xl font-medium text-white/50 md:text-2xl">
              Ready to transcend your limits? Start your transformation journey today with {gymName}
              .
            </p>
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-full bg-brand-orange px-12 py-6 text-xl font-black text-white shadow-2xl shadow-brand-orange/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-brand-orange/60 sm:w-auto"
              >
                BECOME A MEMBER
              </Link>
              <Link
                href="/login"
                className="w-full rounded-full border border-white/10 px-12 py-6 text-xl font-black text-white transition-all duration-300 hover:bg-white/5 sm:w-auto"
              >
                MEMBER LOGIN
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter config={config} />
    </main>
  );
}

function TestimonialSlider({
  config,
  gymName,
  dbTestimonials,
}: {
  config: any;
  gymName: string;
  dbTestimonials: any[];
}) {
  const [current, setCurrent] = React.useState(0);

  // Combine database testimonials with admin-configured fallbacks
  const testimonials = React.useMemo(() => {
    const combined = [...dbTestimonials];

    // Add admin-configured ones if they don't already exist or as fallbacks
    if (config.testimonialQuote) {
      combined.push({
        quote: config.testimonialQuote,
        author: config.testimonialAuthor || "Siddharth Varma",
        role: config.testimonialRole || "Pro Athlete",
      });
    }

    if (config.testimonialQuote2) {
      combined.push({
        quote: config.testimonialQuote2,
        author: config.testimonialAuthor2 || "Priya Sharma",
        role: config.testimonialRole2 || "Yoga Practitioner",
      });
    }

    // Default fallback if absolutely nothing exists
    if (combined.length === 0) {
      combined.push({
        quote: `${gymName} completely changed my perspective on fitness. The environment is unmatched.`,
        author: "Siddharth Varma",
        role: "Pro Athlete",
      });
    }

    return combined;
  }, [dbTestimonials, config, gymName]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xl transition-colors ${
                star <= (testimonials[current].rating || 5) ? "text-brand-orange" : "text-white/10"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="mb-10 min-h-[120px] text-xl font-medium italic leading-relaxed tracking-tight text-white sm:text-2xl">
          "{testimonials[current].quote}"
        </p>
        <div className="flex items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-brand-orange/30 bg-brand-orange/20">
            <div className="absolute inset-0 animate-pulse bg-brand-orange/10" />
            <Users className="relative z-10 h-8 w-8 text-brand-orange" />
          </div>
          <div>
            <p className="mb-2 text-xl font-black leading-none tracking-tight text-white">
              {testimonials[current].author}
            </p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">
              {testimonials[current].role}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Dots */}
      <div className="mt-8 flex gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            title={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-brand-orange" : "w-2 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
