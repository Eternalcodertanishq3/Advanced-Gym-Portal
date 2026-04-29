"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Golden Eagle + Dumbbell Loader
// ═══════════════════════════════════════════════════════════════

interface EagleLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  subText?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: { container: "w-16 h-16", dumbbell: "w-8 h-3", plate: "w-3 h-5", text: "text-xs" },
  md: { container: "w-24 h-24", dumbbell: "w-12 h-4", plate: "w-4 h-7", text: "text-sm" },
  lg: { container: "w-32 h-32", dumbbell: "w-16 h-5", plate: "w-5 h-9", text: "text-base" },
  xl: { container: "w-40 h-40", dumbbell: "w-20 h-6", plate: "w-6 h-11", text: "text-lg" },
};

export function EagleLoader({
  size = "md",
  text = "EAGLE GYM",
  subText,
  className,
  fullScreen = false,
}: EagleLoaderProps) {
  const s = sizeMap[size];

  const loaderContent = (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      {/* Dumbbell Animation */}
      <div className={cn("relative", s.container)}>
        {/* Central glow */}
        <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-xl animate-pulse" />

        {/* Dumbbell container */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Bar */}
          <div
            className={cn(
              "absolute h-1 rounded-full bg-gradient-to-r from-liquid-gold via-liquid-amber to-liquid-orange",
              s.dumbbell
            )}
          />

          {/* Left plate */}
          <motion.div
            className={cn(
              "absolute left-0 rounded-lg bg-gradient-to-b from-liquid-gold via-liquid-amber to-liquid-orange shadow-lg shadow-gold-500/30",
              s.plate
            )}
            style={{ left: "10%" }}
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right plate */}
          <motion.div
            className={cn(
              "absolute right-0 rounded-lg bg-gradient-to-b from-liquid-gold via-liquid-amber to-liquid-orange shadow-lg shadow-gold-500/30",
              s.plate
            )}
            style={{ right: "10%" }}
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>

        {/* Eagle silhouette (centered, pulsing) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 100 100"
            className={cn("text-liquid-gold drop-shadow-lg", size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : size === "lg" ? "w-10 h-10" : "w-12 h-12")}
            fill="currentColor"
          >
            <path d="M50 15 L60 35 L80 30 L70 45 L85 55 L65 60 L70 75 L50 65 L30 75 L35 60 L15 55 L30 45 L20 30 L40 35 Z" />
            <circle cx="50" cy="50" r="8" fill="#050505" />
          </svg>
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-liquid-gold"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 3) * 60, 0],
              y: [0, Math.sin((i * Math.PI) / 3) * 60, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2">
        <motion.h3
          className={cn(
            "font-display font-bold tracking-[0.3em] text-gold-gradient uppercase",
            s.text
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.h3>

        {subText && (
          <motion.p
            className="text-xs text-white/40 tracking-wider"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {subText}
          </motion.p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-liquid-gold to-liquid-orange"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}

// ═══════════════════════════════════════════════════════════════
// Page Transition Loader
// ═══════════════════════════════════════════════════════════════

export function PageLoader() {
  return <EagleLoader size="lg" fullScreen text="EAGLE GYM" subText="Loading your dashboard..." />;
}

// ═══════════════════════════════════════════════════════════════
// Skeleton Loaders
// ═══════════════════════════════════════════════════════════════

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-6 space-y-4", className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 rounded bg-white/5 shimmer" />
          <div className="h-3 w-1/4 rounded bg-white/5 shimmer" />
        </div>
      </div>
      <div className="h-8 w-2/3 rounded bg-white/5 shimmer" />
      <div className="h-2 w-full rounded-full bg-white/5 shimmer" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={cn("h-4 rounded bg-white/5 shimmer", i === 1 ? "w-8" : "flex-1")} />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0">
          <div className="w-8 h-4 rounded bg-white/5 shimmer" />
          <div className="w-10 h-10 rounded-full bg-white/5 shimmer" />
          <div className="flex-1 h-4 rounded bg-white/5 shimmer" />
          <div className="flex-1 h-4 rounded bg-white/5 shimmer" />
          <div className="w-20 h-6 rounded-full bg-white/5 shimmer" />
          <div className="w-8 h-8 rounded-lg bg-white/5 shimmer" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="h-6 w-1/3 rounded bg-white/5 shimmer" />
      <div className="h-64 w-full rounded-xl bg-white/5 shimmer" />
    </div>
  );
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}