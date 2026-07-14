"use client";

import { motion } from "framer-motion";
import { Users, Activity, TrendingUp, UserCheck } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface LiveOccupancyProps {
  current: number;
  capacity: number;
  lastHour: number;
  peakToday: number;
  className?: string;
}

export function LiveOccupancy({
  current,
  capacity,
  lastHour,
  peakToday,
  className,
}: LiveOccupancyProps) {
  const percentage = Math.min(Math.round((current / capacity) * 100), 100);

  // Dynamic color based on occupancy percentage
  const getStatusColor = (pct: number) => {
    if (pct < 50) return "text-success";
    if (pct < 85) return "text-warning";
    return "text-danger";
  };

  const getStatusBg = (pct: number) => {
    if (pct < 50) return "bg-success/10";
    if (pct < 85) return "bg-warning/10";
    return "bg-danger/10";
  };

  const statusColor = getStatusColor(percentage);
  const statusBg = getStatusBg(percentage);

  return (
    <div className={cn("surface-card flex h-full flex-col p-6", className)}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
            <Users className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Live Occupancy</h3>
            <p className="text-xs text-muted-foreground">Real-time gym floor status</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-success">Live</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="relative mx-auto mb-8 h-48 w-48">
          {/* Progress Ring Background */}
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-muted/20"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 88}
              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={statusColor}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-display text-4xl font-bold text-foreground"
            >
              {percentage}%
            </motion.p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Capacity Used
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Current
            </p>
            <p className="font-display text-xl font-bold text-foreground">{current}</p>
            <p className="mt-1 text-[9px] text-muted-foreground">out of {capacity}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Peak Today
            </p>
            <p className="font-display text-xl font-bold text-foreground">{peakToday}</p>
            <p className="mt-1 text-[9px] text-muted-foreground">recorded at 6:45 PM</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Flow: </span>
          <span
            className={cn(
              "text-xs font-bold",
              percentage > lastHour ? "text-danger" : "text-success",
            )}
          >
            {percentage > lastHour ? "Increasing" : "Decreasing"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Available: </span>
          <span className="text-xs font-bold text-foreground">{capacity - current} spots</span>
        </div>
      </div>
    </div>
  );
}
