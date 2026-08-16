"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  MessageSquare,
  ShoppingCart,
  Flame,
  Award,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";

export function FeaturesGrid({
  title = "Core Capabilities Built to Protect Revenue",
  subtitle = "Zero fluff. Four distinct operational advantages that elevate your gym above competitors.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section id="features" className="relative overflow-hidden bg-obsidian-950 py-28">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-orange/5 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-orange">
              Core Differentiators
            </span>
          </div>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/60 md:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* Card 1: Smart Kiosk & Due Gatekeeper (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group flex flex-col justify-between rounded-3xl border border-white/15 bg-obsidian-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-brand-orange/40 md:p-10 lg:col-span-7"
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-wider text-white/60">
                  Zero Confrontation
                </span>
              </div>

              <h3 className="mb-3 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                Smart Kiosk & Due Gatekeeper
              </h3>
              <p className="mb-6 text-sm font-medium leading-relaxed text-white/60 md:text-base">
                Stop unpaid members from walking onto the workout floor unnoticed. The kiosk
                automatically flags expired memberships at the entrance with zero awkward
                receptionist confrontations.
              </p>
            </div>

            {/* Visual: Tablet Scanner with Amber Due Warning */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="mb-3 flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Membership Lapsed — Desk Notification
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white/40">Station 1</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Member: Priya Kapoor</p>
                  <p className="text-xs text-white/50">
                    Silver Tier • Expired 3 days ago (₹2,500 due)
                  </p>
                </div>
                <span className="rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-black text-amber-300">
                  Renew at Desk
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: WhatsApp-First Invoicing (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group flex flex-col justify-between rounded-3xl border border-white/15 bg-obsidian-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-emerald-500/40 md:p-10 lg:col-span-5"
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-400">
                  98% Open Rate
                </span>
              </div>

              <h3 className="mb-3 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                WhatsApp-First Invoicing
              </h3>
              <p className="mb-6 text-sm font-medium leading-relaxed text-white/60 md:text-base">
                Members don't want to install heavy mobile apps. Digital passes, official GST tax
                receipts, and renewal links are sent straight to WhatsApp.
              </p>
            </div>

            {/* Visual: WhatsApp Message Bubble */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 font-sans">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                  ✓
                </div>
                <span className="text-xs font-bold text-emerald-400">Eagle Gym Official Bot</span>
              </div>
              <p className="text-xs leading-relaxed text-white/90">
                🎉 Welcome, Rahul! Your Annual VIP Pass is active. <br />
                📄 <strong>Receipt #REC-8921:</strong> ₹18,000 (Paid)
                <br />
                📲 <strong>QR Badge:</strong>{" "}
                <span className="text-emerald-400 underline">eaglegym.com/pass/r89</span>
              </p>
            </div>
          </motion.div>

          {/* Card 3: 5-Second Counter POS (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group flex flex-col justify-between rounded-3xl border border-white/15 bg-obsidian-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-brand-orange/40 md:p-10 lg:col-span-5"
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 text-brand-orange">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-wider text-white/60">
                  Zero Stock Loss
                </span>
              </div>

              <h3 className="mb-3 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                5-Second Counter POS
              </h3>
              <p className="mb-6 text-sm font-medium leading-relaxed text-white/60 md:text-base">
                Quick-tap checkout for protein shakes, supplements, and water bottles. Automatic
                inventory decrementing stops cashier stock theft and inventory discrepancies.
              </p>
            </div>

            {/* Visual: Quick Tap POS Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs font-bold text-white">Whey Isolate</p>
                <p className="text-[11px] font-black text-emerald-400">₹180 • 1 Tap Sale</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs font-bold text-white">Energy Drink</p>
                <p className="text-[11px] font-black text-emerald-400">₹120 • 1 Tap Sale</p>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Member Gamification & Retention (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group flex flex-col justify-between rounded-3xl border border-white/15 bg-obsidian-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-brand-orange/40 md:p-10 lg:col-span-7"
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 text-brand-orange">
                  <Award className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-orange">
                  +40% Renewal Rate
                </span>
              </div>

              <h3 className="mb-3 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                Member Gamification & Retention
              </h3>
              <p className="mb-6 text-sm font-medium leading-relaxed text-white/60 md:text-base">
                Turn regular gym check-ins into an addictive habit. Members earn XP, climb from
                Rookie to Titan Tier, and maintain attendance streaks that double their annual
                renewal probability.
              </p>
            </div>

            {/* Visual: Gamified Level Progression Bar */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 fill-current text-brand-orange" />
                  <span className="text-xs font-bold text-white">Titan Tier • Level 14</span>
                </div>
                <span className="text-xs font-black text-brand-orange">3,450 / 4,000 XP</span>
              </div>
              <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-amber-400 to-brand-orange" />
              </div>
              <p className="text-[10px] font-semibold text-white/40">
                🔥 18-Day Workout Streak Active • Next reward: 1 Free PT Session
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
