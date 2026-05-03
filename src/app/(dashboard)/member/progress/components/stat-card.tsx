"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  unit: string;
  icon: React.ReactNode;
  color: "orange" | "info" | "purple" | "success";
}

export function StatCard({ label, value, trend, unit, icon, color }: StatCardProps) {
  const colorMap: any = {
    orange: "text-brand-orange bg-brand-orange/10 border-brand-orange/20 shadow-brand-glow",
    info: "text-info bg-info/10 border-info/20 shadow-info-glow",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-glow",
    success: "text-success bg-success/10 border-success/20 shadow-success-glow",
  };

  return (
    <div className="surface-card p-6 rounded-3xl border border-border/50 hover:border-brand-orange/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", colorMap[color])}>
          {icon}
        </div>
        {trend !== 0 && (
          <div className={cn(
            "flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
            trend > 0 ? "text-danger bg-danger/10" : "text-success bg-success/10"
          )}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}{unit}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
