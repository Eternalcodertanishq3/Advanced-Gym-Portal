"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  TrendingUp,
  Users,
  QrCode,
  Zap,
  ShieldCheck,
  Smartphone,
  CreditCard,
  MessageSquare,
  Sparkles,
  Clock,
  Check,
} from "lucide-react";

export function HeroSection({
  gymName = "GymFlow SaaS",
}: {
  gymName?: string;
  heroSubtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
}) {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-obsidian-950 pb-24 pt-32">
      {/* Background Radial Ambiance */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-10 right-[-50px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* Top Header & Value Proposition */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 shadow-inner shadow-brand-orange/10"
          >
            <span className="flex h-2 w-2 animate-ping rounded-full bg-brand-orange" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">
              Next-Gen Gym Operating System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Automate Front-Desk Check-Ins.{" "}
            <span className="bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange bg-clip-text text-transparent">
              Stop Membership Fee Leakage.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/60 md:text-xl"
          >
            Replace paper registers and clunky desktop software. Get zero-hardware QR
            self-check-ins, automated WhatsApp fee recovery, and 5-second counter POS in one unified
            cloud portal.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/register"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-brand-orange px-9 py-5 text-sm font-black uppercase tracking-wider text-white shadow-2xl shadow-brand-orange/40 transition-all hover:scale-105 hover:shadow-brand-orange/60 active:scale-95 sm:w-auto"
            >
              Start 14-Day Free Pilot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#roles"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 sm:w-auto"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <Play className="h-3 w-3 fill-current text-brand-orange" />
              </div>
              See 60-Second Interactive Tour
            </a>
          </motion.div>

          {/* Reassurance Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-white/50"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Zero Hardware Locks
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-brand-orange" />
              Works on Any Tablet / Phone
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Free Excel Member Import
            </span>
          </motion.div>
        </div>

        {/* Dual-Screen Software Showcase: Balanced Grid Composition */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-20 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
        >
          {/* 🖥️ LEFT (8 COLS): Gym Owner Analytics Command Center */}
          <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-obsidian-900/90 p-6 shadow-2xl backdrop-blur-2xl md:p-8 lg:col-span-8">
            {/* Top Command Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-md shadow-brand-orange/30">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-orange" />
                    <h3 className="font-display text-base font-black uppercase tracking-wide text-white md:text-lg">
                      {gymName} <span className="text-brand-orange">Command Center</span>
                    </h3>
                  </div>
                  <p className="text-[11px] font-medium text-white/40">
                    Downtown Flagship • Real-Time Financial & Attendance Stream
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-white/80 sm:flex">
                  <Users className="h-3.5 w-3.5 text-brand-orange" />
                  Floor Occupancy: 84 / 120
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live Sync
                </div>
              </div>
            </div>

            {/* 4 Metric Tiles */}
            <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20">
                <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-white/40">
                  Today's Collection
                </p>
                <p className="font-display text-xl font-black text-white md:text-2xl">₹48,500</p>
                <p className="mt-1 text-[10px] font-bold text-emerald-400">+22% vs yesterday</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20">
                <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-white/40">
                  Active Members
                </p>
                <p className="font-display text-xl font-black text-white md:text-2xl">428</p>
                <p className="mt-1 text-[10px] font-bold text-blue-400">96% active rate</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20">
                <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-white/40">
                  QR Scans Today
                </p>
                <p className="font-display text-xl font-black text-white md:text-2xl">312</p>
                <p className="mt-1 text-[10px] font-bold text-white/40">Avg 1.2s check-in</p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 transition-all hover:border-rose-500/40">
                <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-rose-400/80">
                  Pending Dues
                </p>
                <p className="font-display text-xl font-black text-rose-400 md:text-2xl">14 Due</p>
                <p className="mt-1 text-[10px] font-bold text-rose-400">Auto-drip active</p>
              </div>
            </div>

            {/* Middle: Hourly Peak Radar Chart */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-brand-orange" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Hourly Floor Footfall & Peak Hours
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-brand-orange">
                  Peak: 7:00 PM (92% Capacity)
                </span>
              </div>
              <div className="flex h-28 items-end gap-1.5 pt-2 md:gap-2">
                {[30, 45, 65, 90, 85, 55, 35, 45, 65, 95, 80, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        h > 80 ? "bg-brand-orange" : "bg-white/20 hover:bg-brand-orange/60"
                      }`}
                    />
                    <span className="text-[9px] font-bold text-white/30">{i + 6}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Quick-Telemetry Row: POS Ledger & Activity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white">5-Sec Counter POS Sales</span>
                  <span className="text-xs font-black text-brand-orange">₹4,850 Total</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-white/70">
                    <span>Whey Isolate Scoop</span>
                    <span className="font-bold text-emerald-400">₹150 (UPI)</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Pre-Workout Can</span>
                    <span className="font-bold text-emerald-400">₹120 (Cash)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white">Revenue Leakage Guard</span>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    PROTECTED
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-white/50">
                  14 expired passes prevented from door entry today. ₹32,200 dues recovered via
                  automated WhatsApp payment links.
                </p>
              </div>
            </div>
          </div>

          {/* 📱 RIGHT (4 COLS): Dedicated Tablet Kiosk Screen */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-brand-orange/30 bg-obsidian-950 p-6 shadow-[0_20px_60px_rgba(255,107,0,0.2)] backdrop-blur-2xl lg:col-span-4">
            <div>
              {/* Tablet Hardware Header Bar */}
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-orange text-white shadow-md shadow-brand-orange/30">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Tablet Self Check-in
                    </h4>
                    <p className="text-[10px] text-white/40">Turnstile Station 1 • 1-Sec Entry</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-400">
                  ONLINE
                </span>
              </div>

              {/* Glowing QR Camera Frame */}
              <div className="relative mb-5 flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-black/70 p-4">
                <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                  <Check className="h-10 w-10 stroke-[3] text-emerald-400" />
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-wider text-emerald-400">
                  ACCESS GRANTED • AMAN G.
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-white/60">
                  Titan Tier #EG-4091 • Valid Dec 2026
                </p>
              </div>

              {/* Instant WhatsApp Receipt Notice */}
              <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">WhatsApp Bot Automated</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400">Delivered</span>
                </div>
                <p className="text-[11px] leading-snug text-white/60">
                  Pass & Tax Invoice PDF dispatched straight to member's WhatsApp chat without app
                  download.
                </p>
              </div>
            </div>

            {/* Bottom Hardware Reassurance */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Runs on any iPad, Android Tablet, or Phone
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
