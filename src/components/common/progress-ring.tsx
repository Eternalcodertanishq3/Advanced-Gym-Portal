"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: "gold" | "green" | "cyan" | "orange" | "crimson";
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "gold",
  showValue = true,
  label,
  className,
}: ProgressRingProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (safeProgress / 100) * circumference;

  const colorMap = {
    gold: "text-gold-400",
    green: "text-neon-green",
    cyan: "text-electric-cyan",
    orange: "text-orange-400",
    crimson: "text-crimson",
  };

  const strokeColorMap = {
    gold: "stroke-gold-400",
    green: "stroke-neon-green",
    cyan: "stroke-electric-cyan",
    orange: "stroke-orange-400",
    crimson: "stroke-crimson",
  };

  return (
    <div 
      className={cn("relative flex flex-col items-center justify-center", className)} 
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/10"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress track */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("transition-colors duration-300", strokeColorMap[color])}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        {showValue && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn("font-mono font-bold text-xl", colorMap[color])}
          >
            {safeProgress}%
          </motion.span>
        )}
        {label && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-[10px] text-white/40 mt-1 uppercase tracking-wider"
          >
            {label}
          </motion.span>
        )}
      </div>
    </div>
  );
}
