"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { Activity, Users, DollarSign, Shield, Building2, ServerCrash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const quickLinks = [
  { name: "Manage Admins", href: "/super-admin/admins", icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10" },
  { name: "Audit Logs", href: "/super-admin/audit-logs", icon: Activity, color: "text-electric-cyan", bg: "bg-electric-cyan/10" },
  { name: "Subscription Plans", href: "/super-admin/subscription-plans", icon: DollarSign, color: "text-gold-400", bg: "bg-gold-400/10" },
  { name: "Branch Management", href: "/super-admin/branches", icon: Building2, color: "text-neon-green", bg: "bg-neon-green/10" },
  { name: "System Config", href: "/super-admin/system-config", icon: ServerCrash, color: "text-orange-400", bg: "bg-orange-400/10" },
];

interface Props {
  statsChild: React.ReactNode;
  logsChild: React.ReactNode;
}

export function DashboardClient({ statsChild, logsChild }: Props) {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-wide font-display">System Overview</h1>
        <p className="text-sm text-muted-foreground">High-level metrics across all branches and modules.</p>
      </div>

      <div>
        {statsChild}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground font-display">Recent Audit Logs</h2>
          <div className="glass-card p-6 rounded-2xl border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05),transparent_70%)]" />
            
            {logsChild}
            
            <Link href="/super-admin/audit-logs">
              <span className="text-xs text-electric-cyan hover:text-cyan-300 transition-colors mt-4 inline-block relative z-10">
                View Full Logs →
              </span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground font-display">Quick Actions</h2>
          <div className="glass-card p-4 rounded-2xl border border-border space-y-2">
            {quickLinks.map((link) => (
              <Link key={link.name} href={link.href} className="block">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors border border-transparent hover:border-border hover:bg-muted/50"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", link.bg)}>
                    <link.icon className={cn("w-5 h-5", link.color)} />
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{link.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
