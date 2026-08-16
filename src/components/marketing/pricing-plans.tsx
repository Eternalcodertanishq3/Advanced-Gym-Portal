"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, FileSpreadsheet, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
}

const SAAS_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Gym",
    description: "Perfect for single-location studios and boutique fitness centres.",
    monthlyPrice: 2499,
    annualPrice: 1999,
    features: [
      "1 Gym Location / Branch",
      "Up to 250 Active Members",
      "Tablet QR Self Check-in Kiosk",
      "5-Second Counter POS & Stock Decrement",
      "Automated WhatsApp Invoices & Passes",
      "2 Front-Desk & Trainer Seats",
      "Standard Email & WhatsApp Support",
    ],
  },
  {
    id: "growth",
    name: "Growth Commercial",
    badge: "Most Popular",
    popular: true,
    description: "Built for high-volume commercial gyms looking to stop fee leakage.",
    monthlyPrice: 4999,
    annualPrice: 3999,
    features: [
      "1 Gym Location (Expandable)",
      "Up to 1,000 Active Members",
      "Unlimited Kiosk Terminals",
      "Automated WhatsApp Due Recovery Drip",
      "Trainer Workout & Diet Builder Portal",
      "Member Gamification & XP Leaderboard",
      "Full Role-Based Access (6 Staff Roles)",
      "Priority 24/7 Phone & WhatsApp Support",
    ],
  },
  {
    id: "franchise",
    name: "Multi-Branch Franchise",
    badge: "Franchise Scale",
    description: "Consolidated command for multi-branch gym chains and franchise brands.",
    monthlyPrice: 9999,
    annualPrice: 7999,
    features: [
      "Up to 5 Gym Locations / Branches",
      "Unlimited Active Members",
      "Centralized Multi-Branch Financial Radar",
      "Cross-Branch Member Roaming Passes",
      "Custom Subdomain & White-Label Branding",
      "Dedicated Database Pool & SLA Guarantee",
      "Dedicated Account Manager & VIP Onboarding",
    ],
  },
];

export function PricingPlans({ plans: _plans }: { plans?: any[] }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="relative overflow-hidden bg-obsidian-900 py-28">
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-orange/5 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-orange">
              Transparent Flat Pricing
            </span>
          </div>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            Simple Pricing. <span className="text-brand-orange">Zero Per-Member Surcharges.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/60 md:text-lg">
            Choose the plan that matches your gym scale. All plans include a 14-day free pilot with
            full feature access and zero credit card upfront.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-xl px-5 py-2 text-xs font-bold transition-all",
                billingCycle === "monthly"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-white/60 hover:text-white",
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all",
                billingCycle === "annual"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-white/60 hover:text-white",
              )}
            >
              Annual Billing
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mb-16 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {SAAS_TIERS.map((tier, idx) => {
            const price = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "relative flex flex-col justify-between rounded-3xl border p-8 transition-all md:p-10",
                  tier.popular
                    ? "border-brand-orange/60 bg-gradient-to-b from-brand-orange/[0.12] to-obsidian-950 shadow-2xl shadow-brand-orange/20"
                    : "border-white/10 bg-obsidian-950/80 hover:border-white/20",
                )}
              >
                {tier.badge && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-orange/50 bg-brand-orange px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-orange/30">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="mb-2 text-xl font-black uppercase tracking-wide text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-white/50">{tier.description}</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-1.5 border-b border-white/10 pb-6">
                    <span className="font-display text-4xl font-black text-white md:text-5xl">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                      / month {billingCycle === "annual" && "(billed annually)"}
                    </span>
                  </div>

                  <ul className="mb-10 space-y-3.5">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-semibold text-white/80 md:text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/register"
                  className={cn(
                    "group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all",
                    tier.popular
                      ? "bg-brand-orange text-white shadow-xl shadow-brand-orange/30 hover:bg-brand-orange/90"
                      : "border border-white/10 bg-white/10 text-white hover:bg-white/15",
                  )}
                >
                  Start 14-Day Free Pilot
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* The "Founding Partner" Onboarding Promise Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border-2 border-dashed border-brand-orange/40 bg-brand-orange/[0.04] p-8 md:p-10"
        >
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/30">
                <FileSpreadsheet className="h-7 w-7" />
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-orange/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-orange">
                  Zero Effort Onboarding
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                  The "Founding Partner" Member Migration Promise
                </h4>
                <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-white/70">
                  "We will personally format and upload your existing member list from Excel into
                  your account for free during your 14-day trial. Zero manual re-typing required."
                </p>
              </div>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-obsidian-950 shadow-xl transition-all hover:scale-105 hover:bg-white/90 active:scale-95"
            >
              Claim Free Data Migration
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
