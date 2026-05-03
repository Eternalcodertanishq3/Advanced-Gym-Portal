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
  className 
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
    <div className={cn("surface-card p-6 h-full flex flex-col", className)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Live Occupancy</h3>
            <p className="text-xs text-muted-foreground">Real-time gym floor status</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-success font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Progress Ring Background */}
          <svg className="w-full h-full transform -rotate-90">
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
              className="text-4xl font-display font-bold text-foreground"
            >
              {percentage}%
            </motion.p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Capacity Used
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Current</p>
            <p className="text-xl font-display font-bold text-foreground">{current}</p>
            <p className="text-[9px] text-muted-foreground mt-1">out of {capacity}</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Peak Today</p>
            <p className="text-xl font-display font-bold text-foreground">{peakToday}</p>
            <p className="text-[9px] text-muted-foreground mt-1">recorded at 6:45 PM</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Flow: </span>
          <span className={cn("text-xs font-bold", percentage > lastHour ? "text-danger" : "text-success")}>
            {percentage > lastHour ? "Increasing" : "Decreasing"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Available: </span>
          <span className="text-xs font-bold text-foreground">{capacity - current} spots</span>
        </div>
      </div>
    </div>
  );
}
