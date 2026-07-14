"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Users, Trophy, Zap, Shield, Heart } from "lucide-react";

const features = [
  {
    title: "Elite Equipment",
    description:
      "Train with the world's leading fitness technology and premium strength machinery.",
    icon: Dumbbell,
    color: "bg-blue-500",
  },
  {
    title: "Expert Coaches",
    description: "Our certified trainers design personalized paths to crush your specific goals.",
    icon: Users,
    color: "bg-brand-orange",
  },
  {
    title: "Dynamic Classes",
    description:
      "From high-intensity HIIT to centered Yoga, find your rhythm in our group sessions.",
    icon: Zap,
    color: "bg-yellow-500",
  },
  {
    title: "Achievement Tracking",
    description: "Real-time performance analytics integrated directly into your member dashboard.",
    icon: Trophy,
    color: "bg-purple-500",
  },
  {
    title: "Wellness Recovery",
    description: "Dedicated recovery zones featuring hydro-massage and cryotherapy recovery.",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    title: "Secure Environment",
    description:
      "24/7 biometric access and high-standard hygiene protocols for your peace of mind.",
    icon: Shield,
    color: "bg-emerald-500",
  },
];

export function FeaturesGrid({
  title = "EVERYTHING YOU NEED TO",
  subtitle = "BECOME LIMITLESS.",
  featuresList,
}: {
  title?: string;
  subtitle?: string;
  featuresList?: any[];
}) {
  const displayFeatures = featuresList || features;

  return (
    <section id="features" className="relative overflow-hidden bg-obsidian-950 py-32">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-orange/5 blur-[120px]" />
      <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-orange/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-24 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-brand-orange">
              Premium Experience
            </h2>
            <p
              className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-6xl"
              dangerouslySetInnerHTML={{
                __html: `${title} <br /><span className="text-white/40">${subtitle}</span>`,
              }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {displayFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-10 transition-all duration-500 hover:border-brand-orange/30 hover:bg-white/[0.06]"
            >
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-orange/5 blur-[40px] transition-all duration-500 group-hover:bg-brand-orange/20" />

              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-500 group-hover:scale-110 group-hover:border-brand-orange/20">
                <feature.icon className="h-8 w-8 text-brand-orange transition-transform duration-500 group-hover:rotate-12" />
              </div>

              <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-brand-orange">
                {feature.title}
              </h3>
              <p className="font-medium leading-relaxed text-white/40 transition-colors group-hover:text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
