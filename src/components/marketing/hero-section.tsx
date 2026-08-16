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
} from "lucide-react";

export function HeroSection({
  gymName = "GymFlow SaaS",
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
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-obsidian-950 pb-24 pt-32">
      {/* Background Radial Ambiance */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-10 right-[-100px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />

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

        {/* Dual-Screen Software Showcase Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="relative mx-auto mt-20 max-w-6xl"
        >
          {/* Main Screen: Gym Owner Analytics Dashboard */}
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-obsidian-900/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-10">
            {/* Mock Dashboard Topbar */}
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-md shadow-brand-orange/30">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black uppercase tracking-wide text-white">
                    {gymName} <span className="text-brand-orange">Command Center</span>
                  </h3>
                  <p className="text-xs font-medium text-white/40">
                    Branch: Downtown Flagship • Live Telemetry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 sm:flex">
                  <Users className="h-4 w-4 text-brand-orange" />
                  Floor Occupancy: 84 / 120
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live Sync
                </div>
              </div>
            </div>

            {/* Dashboard Stats Row */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-white/40">
                  Today's Collection
                </p>
                <p className="font-display text-2xl font-black text-white md:text-3xl">₹48,500</p>
                <p className="mt-1 text-[11px] font-bold text-emerald-400">+22% vs yesterday</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-white/40">
                  Active Memberships
                </p>
                <p className="font-display text-2xl font-black text-white md:text-3xl">428</p>
                <p className="mt-1 text-[11px] font-bold text-blue-400">96% active rate</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-white/40">
                  QR Scans Today
                </p>
                <p className="font-display text-2xl font-black text-white md:text-3xl">312</p>
                <p className="mt-1 text-[11px] font-bold text-white/40">Avg 1.2s / check-in</p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-rose-400/70">
                  Pending Dues Flagged
                </p>
                <p className="font-display text-2xl font-black text-rose-400 md:text-3xl">14 Due</p>
                <p className="mt-1 text-[11px] font-bold text-rose-400">Auto-drip dispatched</p>
              </div>
            </div>

            {/* Mock Chart & Floor Radar preview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    Hourly Peak Utilization
                  </h4>
                  <span className="text-xs font-semibold text-brand-orange">
                    Peak Hour: 7:00 PM (92%)
                  </span>
                </div>
                {/* Visual Bar Chart Mock */}
                <div className="flex h-32 items-end gap-2 pt-4">
                  {[35, 50, 75, 90, 85, 60, 40, 45, 70, 95, 80, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
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

              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div>
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-white">
                    5-Second Counter POS
                  </h4>
                  <p className="mb-4 text-xs text-white/50">Quick Tap Settlement Log</p>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 py-1.5 text-xs">
                      <span className="font-semibold text-white/80">Whey Protein Scoop</span>
                      <span className="font-bold text-emerald-400">₹150 (UPI)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-1.5 text-xs">
                      <span className="font-semibold text-white/80">Pre-Workout Can</span>
                      <span className="font-bold text-emerald-400">₹120 (Cash)</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-xs">
                      <span className="font-semibold text-white/80">BCAA Hydration Bottle</span>
                      <span className="font-bold text-emerald-400">₹90 (UPI)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-bold">
                  <span className="text-white/50">Today POS Total:</span>
                  <span className="text-sm font-black text-brand-orange">₹4,850</span>
                </div>
              </div>
            </div>
          </div>

          {/* Foreground Overlay: Kiosk Tablet with Glowing QR Check-in Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="-bottom-10 -right-6 mt-6 w-full rounded-3xl border-2 border-brand-orange/40 bg-obsidian-950 p-6 shadow-[0_20px_50px_rgba(255,107,0,0.25)] backdrop-blur-2xl lg:absolute lg:mt-0 lg:w-[420px]"
          >
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <QrCode className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    Tablet Self Check-in Kiosk
                  </h4>
                  <p className="text-[10px] text-white/40">Station 1 • 1-Second Entry</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-400">
                ACTIVE
              </span>
            </div>

            {/* Glowing QR Camera Mock Frame */}
            <div className="relative mb-4 flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-black/60 p-4">
              <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="mt-3 text-xs font-black uppercase tracking-wider text-emerald-400">
                ACCESS GRANTED • AMAN G.
              </p>
              <p className="text-[10px] font-semibold text-white/60">Titan Tier • Valid Dec 2026</p>
            </div>

            {/* Floating WhatsApp Receipt Badge */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="text-[11px] font-bold leading-tight text-white">
                    WhatsApp Receipt Dispatched
                  </p>
                  <p className="text-[9px] text-emerald-400/80">Digital Pass + PDF Invoice</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-400">Delivered</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
