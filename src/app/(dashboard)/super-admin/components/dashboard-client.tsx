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
  stats: {
    totalRevenue: number;
    activeMembersCount: number;
    activeStaffCount: number;
  };
  recentLogs: any[];
}

export function DashboardClient({ stats, recentLogs }: Props) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-wide font-display">System Overview</h1>
        <p className="text-sm text-muted-foreground">High-level metrics across all branches and modules.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <StatCard
            icon={DollarSign}
            label="Total System Revenue"
            value={stats.totalRevenue}
            trend="+0.0%"
            trendUp={true}
            color="gold"
            sparklineData={[0, 0, 0, 0, stats.totalRevenue]}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatCard
            icon={Users}
            label="Active Gym Members"
            value={stats.activeMembersCount}
            trend="Live"
            trendUp={true}
            color="cyan"
            sparklineData={[0, 0, 0, stats.activeMembersCount]}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatCard
            icon={Shield}
            label="Active Staff / Admins"
            value={stats.activeStaffCount}
            trend="Live"
            trendUp={true}
            color="purple"
            sparklineData={[0, 0, stats.activeStaffCount]}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatCard
            icon={Activity}
            label="System Health (API)"
            value="100%"
            trend="Stable"
            trendUp={true}
            color="green"
            sparklineData={[100, 100, 100, 100]}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground font-display">Recent Audit Logs</h2>
          <div className="glass-card p-6 rounded-2xl border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05),transparent_70%)]" />
            
            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 relative z-10">
                <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No audit logs found yet.</p>
              </div>
            ) : (
              <div className="relative z-10 space-y-3">
                {recentLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
                    <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-electric-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user?.firstName || "System"} • {new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
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
                  whileHover={{ x: 5, backgroundColor: "hsl(var(--muted)/0.5)" }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors border border-transparent hover:border-border"
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
