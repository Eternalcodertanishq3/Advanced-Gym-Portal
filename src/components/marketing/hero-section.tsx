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
  statsTrainers = "200+",
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
    <section className="relative flex h-screen w-full items-center overflow-hidden bg-obsidian-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image src={heroImage} alt={gymName} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">
                {heroSubtitle}
              </span>
            </div>

            <h1
              className="mb-8 font-display text-6xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-8xl"
              dangerouslySetInnerHTML={{
                __html: heroTitle.replace(".", '<span className="text-brand-orange">.</span>'),
              }}
            />

            <p className="mb-10 max-w-2xl text-lg font-medium leading-relaxed text-white/60 md:text-xl">
              {heroDescription}
            </p>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-brand-orange px-10 py-5 text-lg font-black text-white shadow-2xl shadow-brand-orange/40 transition-all hover:-translate-y-1 hover:shadow-brand-orange/60 sm:w-auto"
              >
                GET STARTED{" "}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <button className="group flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-brand-orange">
                  <Play className="h-5 w-5 fill-current text-white group-hover:text-brand-orange" />
                </div>
                <span className="font-bold text-white transition-colors group-hover:text-brand-orange">
                  WATCH TOUR
                </span>
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
        className="absolute bottom-12 left-1/2 hidden w-full max-w-7xl -translate-x-1/2 items-center gap-20 px-6 lg:flex"
      >
        <div className="flex flex-col gap-1">
          <span className="font-display text-4xl font-black tracking-tighter text-white">
            {statsBranches}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Branches Nationwide
          </span>
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div className="flex flex-col gap-1">
          <span className="font-display text-4xl font-black tracking-tighter text-white">
            {statsMembers}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Active Members
          </span>
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div className="flex flex-col gap-1">
          <span className="font-display text-4xl font-black tracking-tighter text-white">
            {statsTrainers}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Expert Trainers
          </span>
        </div>
      </motion.div>

      {/* Floating Elements for Premium Feel */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[800px] w-[800px] translate-x-1/2 rounded-full bg-brand-orange/10 blur-[150px]" />
    </section>
  );
}
