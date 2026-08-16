"use client";

import React from "react";
import { Check, X, AlertTriangle, Layers, ArrowRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  feature: string;
  category?: string;
  paperWhatsApp: { text: string; status: "no" | "warn" | "yes" };
  legacySoftware: { text: string; status: "no" | "warn" | "yes" };
  gymflowSaas: { text: string; status: "yes"; highlight?: boolean };
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Self-Service QR Entry Kiosk",
    paperWhatsApp: { text: "No (Manual logbook)", status: "no" },
    legacySoftware: { text: "Requires ₹40k+ RFID hardware", status: "warn" },
    gymflowSaas: { text: "Zero hardware; runs on any tablet", status: "yes", highlight: true },
  },
  {
    feature: "Automated WhatsApp Invoicing & Passes",
    paperWhatsApp: { text: "Manual copy-pasting", status: "no" },
    legacySoftware: { text: "Outdated SMS (paid per credit)", status: "warn" },
    gymflowSaas: {
      text: "Direct, instant & automated PDF receipts",
      status: "yes",
      highlight: true,
    },
  },
  {
    feature: "Due Gatekeeper & Expired Alert",
    paperWhatsApp: { text: "Awkward verbal checks", status: "no" },
    legacySoftware: { text: "Static desktop popup only", status: "warn" },
    gymflowSaas: {
      text: "Real-time door block & 3-day WhatsApp drip",
      status: "yes",
      highlight: true,
    },
  },
  {
    feature: "Trainer Workout & Macro Diet Builder",
    paperWhatsApp: { text: "Paper charts or messy chats", status: "no" },
    legacySoftware: { text: "Not included (3rd party add-on)", status: "no" },
    gymflowSaas: {
      text: "Full trainer & client portal with 200+ exercises",
      status: "yes",
      highlight: true,
    },
  },
  {
    feature: "Cloud Multi-Branch Access",
    paperWhatsApp: { text: "Physical register locked onsite", status: "no" },
    legacySoftware: { text: "Single Windows PC locked", status: "no" },
    gymflowSaas: {
      text: "Live access on any phone, laptop, or tablet",
      status: "yes",
      highlight: true,
    },
  },
  {
    feature: "Front-Desk 5-Second Counter POS",
    paperWhatsApp: { text: "Separate cash diary", status: "no" },
    legacySoftware: { text: "Slow clunky billing ERP", status: "warn" },
    gymflowSaas: {
      text: "2-tap checkout + automated stock decrement",
      status: "yes",
      highlight: true,
    },
  },
  {
    feature: "Gamification & Member Retention XP",
    paperWhatsApp: { text: "None", status: "no" },
    legacySoftware: { text: "None", status: "no" },
    gymflowSaas: {
      text: "Titan Tier levels, badges & attendance streaks",
      status: "yes",
      highlight: true,
    },
  },
  {
    feature: "Setup & Free Excel Member Migration",
    paperWhatsApp: { text: "Manual re-entry", status: "no" },
    legacySoftware: { text: "Complex days of manual setup", status: "warn" },
    gymflowSaas: {
      text: "Free CSV import done in 24 hours by our team",
      status: "yes",
      highlight: true,
    },
  },
];

export function ComparisonMatrix() {
  return (
    <section id="compare" className="relative overflow-hidden bg-obsidian-950 py-28">
      {/* Glow */}
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-brand-orange/5 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Title */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-orange" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-orange">
              Competitive Benchmark
            </span>
          </div>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            Why Modern Gyms Upgrade from{" "}
            <span className="text-brand-orange">Registers & Legacy ERPs</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/60 md:text-lg">
            See how GymFlow's cloud-native architecture replaces fragmented diaries, bulky desktop
            software, and expensive hardware locks.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-obsidian-900/60 shadow-2xl backdrop-blur-xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="w-1/4 p-6 text-xs font-black uppercase tracking-widest text-white/50 md:p-8">
                  Feature / Capability
                </th>
                <th className="w-1/4 p-6 text-xs font-black uppercase tracking-widest text-white/50 md:p-8">
                  Paper Register / WhatsApp
                </th>
                <th className="w-1/4 p-6 text-xs font-black uppercase tracking-widest text-white/50 md:p-8">
                  Legacy Desktop ERPs
                </th>
                <th className="w-1/4 border-x border-brand-orange/30 bg-brand-orange/10 p-6 text-xs font-black uppercase tracking-widest text-brand-orange md:p-8">
                  GymFlow SaaS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-white/[0.02]">
                  {/* Feature Title */}
                  <td className="p-6 text-sm font-bold leading-snug text-white md:p-8">
                    {row.feature}
                  </td>

                  {/* Paper Register */}
                  <td className="p-6 text-xs font-medium text-white/60 md:p-8 md:text-sm">
                    <div className="flex items-start gap-2.5">
                      {row.paperWhatsApp.status === "no" && (
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                          <X className="h-3 w-3" />
                        </div>
                      )}
                      <span>{row.paperWhatsApp.text}</span>
                    </div>
                  </td>

                  {/* Legacy Software */}
                  <td className="p-6 text-xs font-medium text-white/60 md:p-8 md:text-sm">
                    <div className="flex items-start gap-2.5">
                      {row.legacySoftware.status === "no" && (
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                          <X className="h-3 w-3" />
                        </div>
                      )}
                      {row.legacySoftware.status === "warn" && (
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                          <AlertTriangle className="h-3 w-3" />
                        </div>
                      )}
                      <span>{row.legacySoftware.text}</span>
                    </div>
                  </td>

                  {/* GymFlow SaaS (Highlighted Column) */}
                  <td className="border-x border-brand-orange/30 bg-brand-orange/[0.04] p-6 text-xs font-bold text-white md:p-8 md:text-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white shadow-md shadow-brand-orange/30">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="leading-snug text-white">{row.gymflowSaas.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 text-brand-orange">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Switch Without Losing Any Historical Member Records
              </h4>
              <p className="mt-0.5 text-xs text-white/50">
                Send us your existing Excel sheet or CSV export and our engineering team handles
                full setup free.
              </p>
            </div>
          </div>

          <a
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-orange/30 transition-all hover:scale-105 hover:bg-brand-orange/90"
          >
            Start Free 14-Day Pilot
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
