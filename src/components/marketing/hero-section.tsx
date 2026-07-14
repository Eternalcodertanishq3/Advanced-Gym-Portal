"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection({ 
  gymName = "GymFlow SaaS",
  heroSubtitle = "Rise Above. Transform Beyond.",
  heroTitle = "UNLEASH YOUR ELITE SELF.",
  heroDescription = "Experience the pinnacle of fitness in our premium, state-of-the-art facility. Built for those who refuse to settle for ordinary.",
  heroImage = "/images/hero-bg.png",
  statsBranches = "15+",
  statsMembers = "50K+",
  statsTrainers = "200+"
}: { 
  gymName?: string;
  heroSubtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  statsBranches?: string;
  statsMembers?: string;
  statsTrainers?: string;
}) {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-obsidian-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={gymName}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs font-black text-brand-orange uppercase tracking-[0.2em]">
                {heroSubtitle}
              </span>
            </div>

            <h1 
              className="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase"
              dangerouslySetInnerHTML={{ __html: heroTitle.replace(".", '<span className="text-brand-orange">.</span>') }}
            />

            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed font-medium max-w-2xl">
              {heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-brand-orange text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl shadow-brand-orange/40 hover:shadow-brand-orange/60 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                GET STARTED <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-orange transition-colors">
                  <Play className="w-5 h-5 text-white group-hover:text-brand-orange fill-current" />
                </div>
                <span className="text-white font-bold group-hover:text-brand-orange transition-colors">WATCH TOUR</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Stats (Decorative) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 hidden lg:flex items-center gap-20"
      >
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-display font-black text-white tracking-tighter">{statsBranches}</span>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Branches Nationwide</span>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-display font-black text-white tracking-tighter">{statsMembers}</span>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Active Members</span>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-display font-black text-white tracking-tighter">{statsTrainers}</span>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Expert Trainers</span>
        </div>
      </motion.div>

      {/* Floating Elements for Premium Feel */}
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-brand-orange/10 blur-[150px] rounded-full translate-x-1/2 pointer-events-none" />
    </section>
  );
}
