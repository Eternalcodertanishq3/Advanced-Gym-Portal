"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, TrendingUp, Clock, ShieldCheck, Sparkles } from "lucide-react";

export function RoiCalculator() {
  const [memberCount, setMemberCount] = useState<number>(300);

  // Dynamic calculations
  // Average gym plan: ~₹1,500/mo. ~8% of members default or lapse late unnoticed without automated gatekeeper = ~₹120 recovered/member/mo
  const monthlyLeakageRecovered = Math.round(memberCount * 120);
  // Front-desk check-in time + manual excel receipt writing saved = ~8 hours per 60 members
  const monthlyAdminHoursSaved = Math.round((memberCount / 60) * 8);
  // Total Annual Economic Value Delivered
  const annualTotalValue = Math.round(
    monthlyLeakageRecovered * 12 + monthlyAdminHoursSaved * 250 * 12,
  );

  return (
    <section id="roi-calculator" className="relative overflow-hidden bg-obsidian-900 py-28">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
            <Calculator className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Interactive ROI Calculator
            </span>
          </div>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            Stop Losing <span className="text-brand-orange">₹30,000+ Every Month</span> to Fee
            Leakage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/60 md:text-lg">
            Drag the slider to your current active member count and see how much uncollected revenue
            and admin hours GymFlow automatically recovers for your gym.
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-obsidian-950/80 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          {/* Slider Control Container */}
          <div className="mb-12 space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <label
                  htmlFor="member-slider"
                  className="mb-1 block text-xs font-black uppercase tracking-widest text-white/50"
                >
                  Your Active Members
                </label>
                <p className="text-sm font-semibold text-white/80">
                  Total registered gym members & active subscriptions
                </p>
              </div>

              <div className="flex items-baseline gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5">
                <span className="font-display text-3xl font-black text-brand-orange md:text-4xl">
                  {memberCount.toLocaleString()}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Members
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-3">
              <input
                id="member-slider"
                type="range"
                min={50}
                max={1500}
                step={25}
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className="h-3.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-brand-orange transition-all focus:outline-none"
              />
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-white/40">
                <span>50 Members (Studio)</span>
                <span>500 Members (Commercial)</span>
                <span>1,500+ Members (Multi-Branch)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Metrics Output Grid */}
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Metric 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-colors hover:border-brand-orange/40">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-white/40">
                Recovered Uncollected Dues
              </p>
              <p className="font-display text-2xl font-black text-emerald-400 md:text-3xl">
                ₹{monthlyLeakageRecovered.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white/40">
                per month from gatekeeping
              </p>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-colors hover:border-brand-orange/40">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
              <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-white/40">
                Front-Desk Time Saved
              </p>
              <p className="font-display text-2xl font-black text-blue-400 md:text-3xl">
                {monthlyAdminHoursSaved} Hours
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white/40">
                per month on check-ins & billing
              </p>
            </div>

            {/* Metric 3 (Grand Total) */}
            <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-6 text-center shadow-lg shadow-brand-orange/10">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-brand-orange">
                Total Value Delivered
              </p>
              <p className="font-display text-2xl font-black text-white md:text-3xl">
                ₹{annualTotalValue.toLocaleString()}+
              </p>
              <p className="mt-1 text-[11px] font-bold text-white/60">
                estimated annual bottom-line impact
              </p>
            </div>
          </div>

          {/* Action Guarantee Footer */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400" />
              <p className="text-xs font-semibold text-white/70">
                Guaranteed payback in under 7 days of launch or 100% free pilot extension.
              </p>
            </div>

            <a
              href="/register"
              className="inline-flex shrink-0 items-center gap-3 rounded-full bg-brand-orange px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-orange/30 transition-all hover:scale-105 hover:bg-brand-orange/90 active:scale-95"
            >
              Start 14-Day Free Pilot
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
