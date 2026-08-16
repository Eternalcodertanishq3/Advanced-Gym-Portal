"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  QrCode,
  Dumbbell,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Flame,
  Award,
  CreditCard,
  Smartphone,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RoleKey = "owner" | "desk" | "trainer" | "member";

interface RoleData {
  id: RoleKey;
  label: string;
  badge: string;
  title: string;
  description: string;
  bulletPoints: string[];
  mockUi: {
    title: string;
    subtitle: string;
    stats: { label: string; value: string; change?: string; positive?: boolean }[];
    feedItems: { title: string; subtitle: string; tag: string; tagColor: string; time: string }[];
  };
}

const ROLES: RoleData[] = [
  {
    id: "owner",
    label: "For Gym Owners",
    badge: "Executive Command",
    title: "Complete Financial & Branch Visibility in Real-Time",
    description:
      "Stop wondering if counter cash was logged or how many renewals lapsed today. Track consolidated revenue, multi-branch attendance, and trainer payouts from any device.",
    bulletPoints: [
      "Live daily collection meters with cash/UPI settlement logs",
      "Automated WhatsApp alerts for memberships expiring in 3 days",
      "Multi-branch comparative utilization and trainer commission auditing",
      "One-click export for GST invoices and accountant-ready CSVs",
    ],
    mockUi: {
      title: "Executive Revenue & Operations Radar",
      subtitle: "Live Telemetry • Multi-Branch Consolidated",
      stats: [
        { label: "Today's Collection", value: "₹48,500", change: "+18% vs avg", positive: true },
        { label: "Floor Headcount", value: "84 / 120", change: "70% capacity" },
        { label: "Pending Renewals", value: "14 Members", change: "₹32,200 due", positive: false },
      ],
      feedItems: [
        {
          title: "New Annual VIP Membership",
          subtitle: "Rahul Sharma • ₹18,000 via UPI QR",
          tag: "Paid",
          tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          time: "2m ago",
        },
        {
          title: "3 Days Expiration Alert Sent",
          subtitle: "Pooja Verma (Gold Tier) • WhatsApp Delivered",
          tag: "Auto-Alert",
          tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          time: "14m ago",
        },
        {
          title: "Trainer Commission Auto-Logged",
          subtitle: "Coach Vikram • 4 PT Sessions Verified",
          tag: "Audited",
          tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          time: "1h ago",
        },
      ],
    },
  },
  {
    id: "desk",
    label: "For Front-Desk Staff",
    badge: "1-Second Front-Desk Flow",
    title: "Zero Lineups, Instant Check-Ins & 5-Second Cash/UPI POS",
    description:
      "Empower receptionists with a friction-free terminal. Members scan their badge at the door, and counter sales for drinks or supplements take 2 taps.",
    bulletPoints: [
      "1-Second instant QR scan with loud audible audio confirmation",
      "Automatic gatekeeping: instantly flags expired or suspended dues",
      "Quick visitor pass entry with photo capture & lead capture",
      "Integrated POS for shakes, protein bars, and gym merchandise",
    ],
    mockUi: {
      title: "Front-Desk Fast Action Terminal",
      subtitle: "Station 1 • Main Turnstile Gate",
      stats: [
        { label: "Check-ins Today", value: "312", change: "Peak: 7:30 AM" },
        { label: "Counter POS Sales", value: "₹6,400", change: "28 items sold", positive: true },
        { label: "Visitors Logged", value: "9 Passes", change: "4 converted", positive: true },
      ],
      feedItems: [
        {
          title: "QR Check-in Verified",
          subtitle: "Aman Gupta • Active Plan (Titan Tier)",
          tag: "Access OK",
          tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          time: "Just now",
        },
        {
          title: "Counter POS • Whey Isolate Shake",
          subtitle: "₹180 • Paid via PhonePe QR",
          tag: "Completed",
          tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          time: "4m ago",
        },
        {
          title: "Gatekeeper Block: Due Expired",
          subtitle: "Sameer K. • Expired 2 days ago • Prompted desk",
          tag: "Renew Prompt",
          tagColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          time: "9m ago",
        },
      ],
    },
  },
  {
    id: "trainer",
    label: "For Personal Trainers",
    badge: "Client Results Engine",
    title: "Professional Workout & Macro Diet Builder on Mobile",
    description:
      "Ditch handwritten paper charts and messy WhatsApp notes. Assign customized workout splits, macro meal plans, and monitor member PRs right from the gym floor.",
    bulletPoints: [
      "Drag-and-drop workout program builder with exercise GIF library",
      "Indian & International macro diet charts (Veg, Non-Veg, Keto)",
      "Body composition logging: Body fat %, weight, and tape measurements",
      "Trainer PT session scheduler with automated client check-in confirmation",
    ],
    mockUi: {
      title: "Trainer Client Management Console",
      subtitle: "Coach Vikram • 18 Active PT Clients",
      stats: [
        { label: "Active PT Clients", value: "18", change: "94% adherence", positive: true },
        { label: "Assigned Diet Plans", value: "24 Active", change: "Updated weekly" },
        { label: "Completed Sessions", value: "6 Today", change: "2 remaining" },
      ],
      feedItems: [
        {
          title: "New PR Logged: Deadlift 160kg",
          subtitle: "Client: Rohit M. (+10kg progression)",
          tag: "Strength PR",
          tagColor: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
          time: "12m ago",
        },
        {
          title: "High-Protein Diet Plan Assigned",
          subtitle: "Target: 2,400 kcal • 160g Protein • 4 Meals",
          tag: "Diet Active",
          tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          time: "1h ago",
        },
        {
          title: "Body Composition Updated",
          subtitle: "Ananya S. • Body Fat: 21.4% (-1.8% in 30 days)",
          tag: "Progress",
          tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          time: "3h ago",
        },
      ],
    },
  },
  {
    id: "member",
    label: "For Gym Members",
    badge: "Gamified Member Experience",
    title: "Dynamic Mobile QR Pass & Gamified Workout Streak",
    description:
      "Give your members an addictive, modern fitness experience. A digital QR membership badge on their phone, workout logs, and XP rewards that drive 40% higher renewals.",
    bulletPoints: [
      "Instant digital QR badge for kiosk check-in (no plastic cards needed)",
      "Daily workout logger with set, rep, and weight tracking",
      "Gamified XP Level progression: climb from Rookie to Titan Tier",
      "Direct WhatsApp receipts and digital membership extension notices",
    ],
    mockUi: {
      title: "Member Digital Pass & XP Dashboard",
      subtitle: "Member: Arjun Mehta • Membership #EG-4091",
      stats: [
        { label: "Current Level", value: "Level 14", change: "Titan Tier", positive: true },
        {
          label: "Attendance Streak",
          value: "18 Days 🔥",
          change: "Top 5% in gym",
          positive: true,
        },
        { label: "Valid Until", value: "Dec 2026", change: "Annual VIP Pass" },
      ],
      feedItems: [
        {
          title: "Workout Streak Achievement Unlocked",
          subtitle: "Earned +250 XP • 'Unstoppable Titan' Badge",
          tag: "Level Up",
          tagColor: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
          time: "Today",
        },
        {
          title: "Session Completed: Push Hypertrophy",
          subtitle: "Chest & Triceps • 18 Sets • 4,200kg Volume",
          tag: "Logged",
          tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          time: "Today",
        },
        {
          title: "Digital Receipt Generated",
          subtitle: "Annual VIP Renewal • ₹14,999 • WhatsApp Sent",
          tag: "Verified",
          tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          time: "Yesterday",
        },
      ],
    },
  },
];

export function RoleSwitcher() {
  const [activeTab, setActiveTab] = useState<RoleKey>("owner");

  const currentRole = ROLES.find((r) => r.id === activeTab) || ROLES[0];

  return (
    <section id="roles" className="relative overflow-hidden bg-obsidian-950 py-28">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-brand-orange/5 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-1.5">
            <Users className="h-3.5 w-3.5 text-brand-orange" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-orange">
              Role-Based Architecture
            </span>
          </div>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            Built for Your <span className="text-brand-orange">Entire Gym Team</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/60 md:text-lg">
            From the gym owner tracking monthly P&L to front-desk staff scanning morning
            check-ins—see how GymFlow streamlines every single workflow.
          </p>

          {/* Interactive Role Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
            {ROLES.map((role) => {
              const isActive = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={cn(
                    "relative rounded-xl px-5 py-3 text-xs font-bold tracking-wide transition-all duration-300 md:text-sm",
                    isActive
                      ? "text-white shadow-lg shadow-brand-orange/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleTab"
                      className="absolute inset-0 rounded-xl bg-brand-orange"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {role.id === "owner" && <TrendingUp className="h-4 w-4" />}
                    {role.id === "desk" && <QrCode className="h-4 w-4" />}
                    {role.id === "trainer" && <Dumbbell className="h-4 w-4" />}
                    {role.id === "member" && <Smartphone className="h-4 w-4" />}
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
          >
            {/* Left Column: Description & Bullet Points */}
            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-brand-orange">
                {currentRole.badge}
              </div>

              <h3 className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
                {currentRole.title}
              </h3>

              <p className="text-base font-medium leading-relaxed text-white/60">
                {currentRole.description}
              </p>

              <div className="space-y-3.5 pt-2">
                {currentRole.bulletPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-orange/20 text-brand-orange">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-semibold leading-snug text-white/90">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href="/register"
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-7 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:border-brand-orange hover:bg-brand-orange hover:text-white"
                >
                  Test {currentRole.label} Flow
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Live Mockup Console */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-obsidian-900/90 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
                {/* Console Top Header */}
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wide text-white">
                        {currentRole.mockUi.title}
                      </h4>
                      <p className="text-[11px] font-medium text-white/40">
                        {currentRole.mockUi.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Live Sync
                    </span>
                  </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="mb-6 grid grid-cols-3 gap-3 md:gap-4">
                  {currentRole.mockUi.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20"
                    >
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                        {stat.label}
                      </p>
                      <p className="font-display text-xl font-black text-white md:text-2xl">
                        {stat.value}
                      </p>
                      {stat.change && (
                        <p
                          className={cn(
                            "mt-1 text-[10px] font-bold",
                            stat.positive === true
                              ? "text-emerald-400"
                              : stat.positive === false
                                ? "text-rose-400"
                                : "text-white/50",
                          )}
                        >
                          {stat.change}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Activity Feed in Role Mockup */}
                <div className="space-y-2.5">
                  <p className="px-1 text-[10px] font-black uppercase tracking-widest text-white/30">
                    Live Operational Stream
                  </p>
                  {currentRole.mockUi.feedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
                          {idx === 0 && <Zap className="h-4 w-4 text-brand-orange" />}
                          {idx === 1 && <Clock className="h-4 w-4 text-blue-400" />}
                          {idx === 2 && <Shield className="h-4 w-4 text-emerald-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight text-white md:text-sm">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-white/50">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                            item.tagColor,
                          )}
                        >
                          {item.tag}
                        </span>
                        <span className="text-[10px] font-medium text-white/30">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
