"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Users, Trophy, Zap, Shield, Heart } from "lucide-react";

const features = [
  {
    title: "Elite Equipment",
    description: "Train with the world's leading fitness technology and premium strength machinery.",
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
    description: "From high-intensity HIIT to centered Yoga, find your rhythm in our group sessions.",
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
    description: "24/7 biometric access and high-standard hygiene protocols for your peace of mind.",
    icon: Shield,
    color: "bg-emerald-500",
  },
];

export function FeaturesGrid({ 
  title = "EVERYTHING YOU NEED TO",
  subtitle = "BECOME LIMITLESS.",
  featuresList
}: { 
  title?: string;
  subtitle?: string;
  featuresList?: any[];
}) {
  const displayFeatures = featuresList || features;

  return (
    <section id="features" className="py-32 bg-obsidian-950 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em]">Premium Experience</h2>
            <p 
              className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-[0.9]"
              dangerouslySetInnerHTML={{ __html: `${title} <br /><span className="text-white/40">${subtitle}</span>` }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {displayFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-brand-orange/30 hover:bg-white/[0.06] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-orange/20 transition-all duration-500" />
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-brand-orange/20 transition-all duration-500">
                <feature.icon className="w-8 h-8 text-brand-orange transition-transform duration-500 group-hover:rotate-12" />
              </div>

              <h3 className="text-2xl font-display font-black text-white mb-4 uppercase tracking-tight group-hover:text-brand-orange transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
