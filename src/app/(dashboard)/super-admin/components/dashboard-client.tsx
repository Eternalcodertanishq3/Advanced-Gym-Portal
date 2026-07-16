"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/app/(dashboard)/admin/components/stat-card";
import { Activity, Users, IndianRupee, Shield, Building2, ServerCrash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SystemHealthPanel from "./system-health-panel";

const quickLinks = [
  {
    name: "Manage Admins",
    href: "/super-admin/admins",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    name: "Audit Logs",
    href: "/super-admin/audit-logs",
    icon: Activity,
    color: "text-electric-cyan",
    bg: "bg-electric-cyan/10",
  },
  {
    name: "Subscription Plans",
    href: "/super-admin/subscription-plans",
    icon: IndianRupee,
    color: "text-gold-400",
    bg: "bg-gold-400/10",
  },
  {
    name: "Branch Management",
    href: "/super-admin/branches",
    icon: Building2,
    color: "text-neon-green",
    bg: "bg-neon-green/10",
  },
  {
    name: "System Config",
    href: "/super-admin/system-config",
    icon: ServerCrash,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

interface Props {
  statsChild: React.ReactNode;
  logsChild: React.ReactNode;
  chartsChild?: React.ReactNode;
}

export function DashboardClient({ statsChild, logsChild, chartsChild }: Props) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-wide text-foreground">
          System Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          High-level metrics across all branches and modules.
        </p>
      </div>

      <div>{statsChild}</div>

      <div className="grid grid-cols-1 items-stretch gap-8 xl:grid-cols-12">
        {/* Master Column (Left 8/12) */}
        <div className="flex flex-col gap-8 xl:col-span-8">
          {/* Main Charts Row */}
          {chartsChild && (
            <div className="duration-1000 animate-in fade-in slide-in-from-bottom-4">
              {chartsChild}
            </div>
          )}

          {/* System Health */}
          <SystemHealthPanel className="flex-1" />
        </div>

        {/* Sidebar Column (Right 4/12) */}
        <div className="flex flex-col gap-8 xl:col-span-4">
          {/* Quick Actions */}
          <div className="glass-card relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-border p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.02),transparent_70%)]" />

            <div className="relative z-10 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                <Shield className="h-5 w-5 text-purple-400" />
                Quick actions
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href} className="group">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-transparent p-4 text-center transition-all hover:border-border/50 hover:bg-muted/30"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-all group-hover:shadow-purple-500/10",
                        link.bg,
                      )}
                    >
                      <link.icon className={cn("h-6 w-6", link.color)} />
                    </div>
                    <span className="text-[10px] font-bold uppercase leading-tight tracking-widest text-foreground/60">
                      {link.name.split(" ")[1] || link.name}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="glass-card relative flex min-h-[300px] flex-1 flex-col gap-6 overflow-hidden rounded-3xl border border-border p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03),transparent_70%)]" />

            <div className="relative z-10 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                <Activity className="h-5 w-5 text-electric-cyan" />
                Live Audit Stream
              </h2>
            </div>

            <div className="relative z-10 flex-1">{logsChild}</div>

            <div className="relative z-10 flex items-center justify-center border-t border-border/40 pt-2">
              <Link href="/super-admin/audit-logs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-electric-cyan transition-colors hover:text-cyan-300">
                  View Full Feed →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
