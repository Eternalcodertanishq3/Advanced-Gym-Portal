"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Athletic Clarity Stat Card
// ═══════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendUp?: boolean;
  sparklineData?: number[];
  color?: "orange" | "navy" | "success" | "danger" | "warning" | "info" | "purple";
  subtitle?: string;
  className?: string;
}

const colorMap = {
  orange: {
    bg: "bg-brand-orange-soft",
    text: "text-brand-orange",
    border: "border-brand-orange/20",
    sparkline: "#E85D26",
    accent: "bg-brand-orange",
  },
  navy: {
    bg: "bg-brand-navy-light/20",
    text: "text-brand-navy",
    border: "border-brand-navy/20",
    sparkline: "#1A3A4A",
    accent: "bg-brand-navy",
  },
  success: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/20",
    sparkline: "#16A34A",
    accent: "bg-success",
  },
  danger: {
    bg: "bg-danger-soft",
    text: "text-danger",
    border: "border-danger/20",
    sparkline: "#DC2626",
    accent: "bg-danger",
  },
  warning: {
    bg: "bg-warning-soft",
    text: "text-warning",
    border: "border-warning/20",
    sparkline: "#D97706",
    accent: "bg-warning",
  },
  info: {
    bg: "bg-info-soft",
    text: "text-info",
    border: "border-info/20",
    sparkline: "#2563EB",
    accent: "bg-info",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800/50",
    sparkline: "#9333EA",
    accent: "bg-purple-600",
  },
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    if (!data || data.length < 2) return;

    const width = 120;
    const height = 40;
    const padding = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    // Create smooth curve
    const d = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point}`;
      const prev = points[i - 1].split(",").map(Number);
      const curr = point.split(",").map(Number);
      const cpx1 = prev[0] + (curr[0] - prev[0]) / 2;
      const cpx2 = prev[0] + (curr[0] - prev[0]) / 2;
      return `${acc} C ${cpx1},${prev[1]} ${cpx2},${curr[1]} ${curr[0]},${curr[1]}`;
    }, "");

    setPathD(d);
  }, [data]);

  if (!data || data.length < 2) return null;

  return (
    <svg ref={svgRef} viewBox="0 0 120 40" className="w-full h-10 opacity-70">
      <defs>
        <linearGradient id={`sparklineGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`${pathD} L 120,40 L 0,40 Z`}
        fill={`url(#sparklineGradient-${color})`}
        stroke="none"
      />
    </svg>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp = true,
  sparklineData,
  color = "navy",
  subtitle,
  className,
}: StatCardProps) {
  // Default to navy if old color like "gold" is passed
  const colorKey = colorMap[color as keyof typeof colorMap] ? color : "navy";
  const colors = colorMap[colorKey as keyof typeof colorMap];
  
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === "number";

  // Animated counter
  useEffect(() => {
    if (!isNumeric) return;

    const target = value as number;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const easeOut = 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeOut * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isNumeric]);

  const formattedValue = isNumeric
    ? label.toLowerCase().includes("revenue")
      ? formatCurrency(displayValue, { showSymbol: true, decimals: 0 })
      : formatNumber(displayValue)
    : value;

  return (
    <div
      className={cn(
        "surface-card p-6 h-full group relative transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
            colors.bg,
            colors.text
          )}>
            <Icon className="w-6 h-6" />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
              trendUp ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
            )}>
              {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend}
            </div>
          )}
        </div>

        <div className="space-y-1 mb-2">
          <h3 className="stat-number text-3xl font-display font-bold text-foreground tracking-tight flex items-baseline gap-1">
            {formattedValue}
          </h3>
          <p className="label-text">
            {label}
          </p>
        </div>

        {subtitle && <p className="text-xs text-txt-tertiary mt-auto">{subtitle}</p>}

        {sparklineData && (
          <div className="mt-4 -mx-2">
            <Sparkline data={sparklineData} color={colors.sparkline} />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-[calc(var(--radius)-1px)]",
          colors.accent
        )}
      />
    </div>
  );
}