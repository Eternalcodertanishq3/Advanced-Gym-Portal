"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Athletic Clarity Stat Card
// ═══════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: React.ReactNode;
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
    <svg
      ref={svgRef}
      viewBox="0 0 120 40"
      className="h-12 w-full opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
    >
      <defs>
        <linearGradient id={`sparklineGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-1000"
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
  icon,
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
      setDisplayValue(Math.round(easeOut * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
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
        "surface-card group relative h-full overflow-hidden p-5 transition-all duration-300",
        className,
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
              colors.bg,
              colors.text,
            )}
          >
            {icon}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-tight",
                trendUp ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend}
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h3 className="stat-number font-display text-3xl font-bold tracking-tight text-foreground">
            {formattedValue}
          </h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>

        {subtitle && <p className="mt-auto text-xs text-txt-tertiary">{subtitle}</p>}

        {sparklineData && (
          <div className="-mx-2 mt-4">
            <Sparkline data={sparklineData} color={colors.sparkline} />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[calc(var(--radius)-1px)] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          colors.accent,
        )}
      />
    </div>
  );
}
