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
    restDelta: 0.001
  });

  const gymName = config.gymName || "EAGLE GYM";

  return (
    <main className="relative min-h-screen bg-obsidian-950 font-display selection:bg-brand-orange selection:text-white">
      {/* Custom Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-brand-orange z-[1000] origin-left"
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
      
      <FeaturesGrid 
        title={config.featuresTitle}
        subtitle={config.featuresSubtitle}
      />
      
      {/* Mid-Page CTA / Quote */}
      <section className="py-32 bg-brand-orange relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/logo-white.png')] bg-[length:400px_400px] opacity-10 rotate-12 scale-150" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter mb-10 italic uppercase leading-[0.85]">
              "{config.midPageQuote || "THE ONLY BAD WORKOUT IS THE ONE THAT DIDN'T HAPPEN."}"
            </h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-1 bg-white/30 rounded-full" />
              <p className="text-white/80 font-bold uppercase tracking-[0.4em] text-sm md:text-base">
                — {gymName} {config.midPageQuoteAuthor || "Elite Community"} —
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <PricingPlans plans={plans} />

      {/* Trust / FAQ Section Preview */}
      <section id="about" className="py-32 bg-obsidian-950 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 mb-6">
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]">
                  {config.aboutTitle || "Our Philosophy"}
                </span>
              </div>
              <h3 
                className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter mb-10 uppercase leading-[0.9]"
                dangerouslySetInnerHTML={{ __html: (config.aboutSubtitle || "BUILT ON GRIT, <br />DRIVEN BY RESULTS.").replace("GRIT", '<span className="text-white/20">GRIT</span>') }}
              />
              <p className="text-lg text-white/50 leading-relaxed mb-12 font-medium">
                {config.aboutDescription || `At ${gymName}, we don't just provide equipment; we provide a sanctuary for transformation. Our facility is engineered to push you further, our community is designed to keep you inspired, and our technology is built to measure your evolution.`}
              </p>
              <div className="space-y-8">
                {(config.aboutFeatures || [
                  "24/7 Premium Access for All Members",
                  "Industry-Leading Certified Trainers",
                  "Cutting-Edge Recovery & Wellness Zones",
                  "Inclusive & Motivational Community"
                ]).map((item: string, i: number) => (
                  <motion.div 
                    key={item} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-orange/30 group-hover:bg-brand-orange/5 transition-all duration-300">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                    </div>
                    <span className="text-white font-black text-base tracking-wide uppercase">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowFeedbackForm(true)}
                className="mt-16 group relative inline-flex items-center gap-4 px-10 py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-orange/20 overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <MessageSquare className="w-5 h-5" />
                Share Your Story
              </motion.button>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-orange/20 blur-3xl rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative grid grid-cols-12 gap-0">
                {/* Main Image Container */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="col-span-11 aspect-[4/5] rounded-[3.5rem] bg-white/5 border border-white/10 relative overflow-hidden shadow-2xl z-10"
                >
                  <Image 
                    src={config.aboutImage || "/images/hero-bg.png"} 
                    alt="Philosophy" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-obsidian-950 via-transparent to-transparent opacity-60" />
                </motion.div>

                {/* Floating Testimonial Slider Container */}
                <motion.div 
                  initial={{ opacity: 0, y: 40, x: -20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
                  className="absolute -bottom-12 -left-12 sm:-left-20 w-[90%] sm:w-[110%] max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-obsidian-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-30 overflow-hidden"
                >
                  <TestimonialSlider config={config} gymName={gymName} dbTestimonials={dbTestimonials} />
                </motion.div>

                {/* Integration Stat Badge */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 -right-8 p-8 rounded-[2.5rem] bg-brand-orange text-white shadow-[0_20px_40px_rgba(249,115,22,0.3)] z-40 text-center"
                >
                  <p className="text-5xl font-display font-black leading-none mb-1 tracking-tighter">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Success Rate</p>
                </motion.div>
                
                {/* Decorative border element */}
                <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-brand-orange/30 rounded-tl-[3rem] -z-10" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-brand-orange/30 rounded-br-[3rem] -z-10" />
              </div>
            </div>

            <TestimonialForm isOpen={showFeedbackForm} onClose={() => setShowFeedbackForm(false)} />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 bg-obsidian-950 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-orange/10 blur-[150px] rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-9xl font-display font-black text-white tracking-tighter mb-12 uppercase leading-none">
              JOIN THE <br />
              <span className="text-brand-orange">ELITE.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/50 mb-16 max-w-2xl mx-auto font-medium">
              Ready to transcend your limits? Start your transformation journey today with {gymName}.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href="/register"
                className="w-full sm:w-auto bg-brand-orange text-white px-12 py-6 rounded-full font-black text-xl shadow-2xl shadow-brand-orange/40 hover:shadow-brand-orange/60 hover:-translate-y-2 transition-all duration-300"
              >
                BECOME A MEMBER
              </Link>
              <Link 
                href="/login"
                className="w-full sm:w-auto text-white px-12 py-6 rounded-full font-black text-xl border border-white/10 hover:bg-white/5 transition-all duration-300"
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

function TestimonialSlider({ config, gymName, dbTestimonials }: { config: any, gymName: string, dbTestimonials: any[] }) {
  const [current, setCurrent] = React.useState(0);
  
  // Combine database testimonials with admin-configured fallbacks
  const testimonials = React.useMemo(() => {
    const combined = [...dbTestimonials];
    
    // Add admin-configured ones if they don't already exist or as fallbacks
    if (config.testimonialQuote) {
      combined.push({
        quote: config.testimonialQuote,
        author: config.testimonialAuthor || "Siddharth Varma",
        role: config.testimonialRole || "Pro Athlete"
      });
    }
    
    if (config.testimonialQuote2) {
      combined.push({
        quote: config.testimonialQuote2,
        author: config.testimonialAuthor2 || "Priya Sharma",
        role: config.testimonialRole2 || "Yoga Practitioner"
      });
    }

    // Default fallback if absolutely nothing exists
    if (combined.length === 0) {
      combined.push({
        quote: `${gymName} completely changed my perspective on fitness. The environment is unmatched.`,
        author: "Siddharth Varma",
        role: "Pro Athlete"
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
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              className={`text-xl transition-colors ${
                star <= (testimonials[current].rating || 5) 
                  ? "text-brand-orange" 
                  : "text-white/10"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-xl sm:text-2xl text-white font-medium mb-10 leading-relaxed tracking-tight italic min-h-[120px]">
          "{testimonials[current].quote}"
        </p>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-orange/10 animate-pulse" />
            <Users className="w-8 h-8 text-brand-orange relative z-10" />
          </div>
          <div>
            <p className="text-white font-black text-xl tracking-tight leading-none mb-2">{testimonials[current].author}</p>
            <p className="text-brand-orange text-xs font-black uppercase tracking-[0.2em]">{testimonials[current].role}</p>
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
