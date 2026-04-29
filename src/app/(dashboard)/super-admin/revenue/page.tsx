"use client";

import React from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

export default function RevenuePage() {
  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide font-display flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-gold-400" />
          Financial Analytics
        </h1>
        <p className="text-sm text-white/50 mt-1">Deep dive into revenue, churn, and forecasting across all branches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={TrendingUp}
          label="MRR (Monthly Recurring)"
          value="$124,500"
          trend="+12.5%"
          trendUp={true}
          color="gold"
          sparklineData={[30, 40, 35, 50, 49, 60, 70, 91, 125]}
        />
        <StatCard
          icon={TrendingUp}
          label="ARR (Annual Run Rate)"
          value="$1.49M"
          trend="+18.2%"
          trendUp={true}
          color="cyan"
          sparklineData={[100, 110, 105, 120, 130, 149]}
        />
        <StatCard
          icon={TrendingUp}
          label="Churn Rate"
          value="2.4%"
          trend="-0.5%"
          trendUp={false}
          color="green"
          sparklineData={[3.5, 3.2, 3.0, 2.8, 2.5, 2.4]}
        />
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/5 h-96 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05),transparent_70%)] pointer-events-none" />
        <TrendingUp className="w-12 h-12 text-white/10 mb-4 group-hover:text-gold-500/20 transition-colors duration-500" />
        <h2 className="text-lg font-bold text-white font-display">Revenue Growth Chart</h2>
        <p className="text-sm text-white/40 mt-2">Connect Recharts to render live data visualization here.</p>
      </div>
    </div>
  );
}
