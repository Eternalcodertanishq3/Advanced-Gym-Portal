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
    <div className="surface-card group rounded-3xl border border-border/50 p-6 transition-all hover:border-brand-orange/30">
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110",
            colorMap[color],
          )}
        >
          {icon}
        </div>
        {trend !== 0 && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
              trend > 0 ? "bg-danger/10 text-danger" : "bg-success/10 text-success",
            )}
          >
            {trend > 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(trend)}
            {unit}
          </div>
        )}
      </div>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-tertiary">
          {label}
        </p>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
