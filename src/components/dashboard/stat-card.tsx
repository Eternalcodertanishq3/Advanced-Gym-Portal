"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Glass Stat Card with Sparkline
// ═══════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendUp?: boolean;
  sparklineData?: number[];
  color?: "gold" | "green" | "cyan" | "crimson" | "purple";
  subtitle?: string;
  className?: string;
}

const colorMap = {
  gold: {
    bg: "from-gold-500/20 to-gold-500/5",
    text: "text-gold-400",
    border: "border-gold-500/20",
    iconBg: "bg-gold-500/10",
    sparkline: "#FFD700",
    glow: "shadow-gold-500/10",
  },
  green: {
    bg: "from-neon-green/20 to-neon-green/5",
    text: "text-neon-green",
    border: "border-neon-green/20",
    iconBg: "bg-neon-green/10",
    sparkline: "#39FF14",
    glow: "shadow-neon-green/10",
  },
  cyan: {
    bg: "from-electric-cyan/20 to-electric-cyan/5",
    text: "text-electric-cyan",
    border: "border-electric-cyan/20",
    iconBg: "bg-electric-cyan/10",
    sparkline: "#00F0FF",
    glow: "shadow-electric-cyan/10",
  },
  crimson: {
    bg: "from-crimson/20 to-crimson/5",
    text: "text-crimson",
    border: "border-crimson/20",
    iconBg: "bg-crimson/10",
    sparkline: "#FF3131",
    glow: "shadow-crimson/10",
  },
  purple: {
    bg: "from-purple-500/20 to-purple-500/5",
    text: "text-purple-400",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/10",
    sparkline: "#A855F7",
    glow: "shadow-purple-500/10",
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
    <svg ref={svgRef} viewBox="0 0 120 40" className="w-full h-10 opacity-60">
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
        strokeWidth="2"
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
  color = "gold",
  subtitle,
  className,
}: StatCardProps) {
  const colors = colorMap[color];
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
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "glass-card p-6 h-full group relative cursor-pointer",
        className
      )}
    >
      {/* Decorative Background Glow */}
      <div className={cn(
        "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        colors.bg
      )} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg border",
            colors.bg,
            colors.border
          )}>
            <Icon className={cn("w-6 h-6", colors.text)} />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300",
              trendUp ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            )}>
              {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend}
            </div>
          )}
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="text-3xl font-bold text-foreground tracking-tight flex items-baseline gap-1">
            {formattedValue}
          </h3>
          <p className="text-[11px] font-bold text-muted-foreground/60 tracking-[0.1em] uppercase">
            {label}
          </p>
        </div>

        {subtitle && <p className="text-xs text-muted-foreground/40 mt-auto">{subtitle}</p>}

        {sparklineData && (
          <div className="mt-4 -mx-2">
            <Sparkline data={sparklineData} color={colors.sparkline} />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          colors.bg
        )}
      />
    </motion.div>
  );
}