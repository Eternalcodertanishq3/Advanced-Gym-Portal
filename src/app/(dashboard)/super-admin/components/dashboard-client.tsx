"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { Activity, Users, IndianRupee, Shield, Building2, ServerCrash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SystemHealthPanel from "./system-health-panel";

const quickLinks = [
  { name: "Manage Admins", href: "/super-admin/admins", icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10" },
  { name: "Audit Logs", href: "/super-admin/audit-logs", icon: Activity, color: "text-electric-cyan", bg: "bg-electric-cyan/10" },
  { name: "Subscription Plans", href: "/super-admin/subscription-plans", icon: IndianRupee, color: "text-gold-400", bg: "bg-gold-400/10" },
  { name: "Branch Management", href: "/super-admin/branches", icon: Building2, color: "text-neon-green", bg: "bg-neon-green/10" },
  { name: "System Config", href: "/super-admin/system-config", icon: ServerCrash, color: "text-orange-400", bg: "bg-orange-400/10" },
];

interface Props {
  statsChild: React.ReactNode;
  logsChild: React.ReactNode;
  chartsChild?: React.ReactNode;
}

export function DashboardClient({ statsChild, logsChild, chartsChild }: Props) {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-wide font-display">System Overview</h1>
        <p className="text-sm text-muted-foreground">High-level metrics across all branches and modules.</p>
      </div>

      <div>
        {statsChild}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Master Column (Left 8/12) */}
        <div className="xl:col-span-8 space-y-8">
          {/* Main Charts Row */}
          {chartsChild && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {chartsChild}
            </div>
          )}

          {/* System Health */}
          <SystemHealthPanel />
        </div>

        {/* Sidebar Column (Right 4/12) */}
        <div className="xl:col-span-4 space-y-8">
          {/* Quick Actions */}
          <div className="glass-card p-6 rounded-3xl border border-border relative overflow-hidden flex flex-col gap-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.02),transparent_70%)]" />
            
            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Quick actions
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href} className="group">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl transition-all border border-transparent hover:border-border/50 hover:bg-muted/30 text-center gap-2"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-purple-500/10 transition-all", link.bg)}>
                      <link.icon className={cn("w-6 h-6", link.color)} />
                    </div>
                    <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest leading-tight">{link.name.split(' ')[1] || link.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="glass-card p-6 rounded-3xl border border-border relative overflow-hidden min-h-[300px] flex flex-col gap-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03),transparent_70%)]" />
            
            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                <Activity className="w-5 h-5 text-electric-cyan" />
                Live Audit Stream
              </h2>
            </div>

            <div className="relative z-10 flex-1">
              {logsChild}
            </div>
            
            <div className="pt-2 relative z-10 border-t border-border/40 flex items-center justify-center">
              <Link href="/super-admin/audit-logs">
                <span className="text-[10px] text-electric-cyan hover:text-cyan-300 transition-colors font-bold uppercase tracking-widest">
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
