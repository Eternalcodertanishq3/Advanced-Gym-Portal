"use client";

import React from "react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface DigitalCardProps {
  member: {
    name: string;
    id: string;
    plan: string;
    validUntil: string;
    level: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
    avatarUrl?: string;
  };
  className?: string;
}

export function DigitalCard({ member, className }: DigitalCardProps) {
  const levelConfig = {
    Bronze: "from-orange-800 to-orange-950 border-orange-700/50 text-orange-200",
    Silver: "from-zinc-400 to-zinc-600 border-zinc-300/50 text-zinc-100",
    Gold: "from-gold-500 to-gold-700 border-gold-400/50 text-gold-50",
    Platinum: "from-slate-700 to-slate-900 border-electric-cyan/50 text-electric-cyan",
    Diamond: "from-purple-600 to-indigo-900 border-purple-400/50 text-purple-100",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative aspect-[1.586/1] w-full max-w-sm overflow-hidden rounded-2xl border p-6 shadow-2xl",
        "bg-gradient-to-br",
        levelConfig[member.level],
        className,
      )}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)] opacity-20" />
      <div className="absolute inset-0 bg-[url('/images/bg-noise.png')] opacity-10 mix-blend-overlay" />

      {/* Card Content */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 shadow-inner backdrop-blur-sm">
              <span className="font-display text-lg font-bold tracking-tighter text-white">EG</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-widest opacity-90 drop-shadow-md">
              EAGLE GYM
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-widest opacity-80">Tier</span>
            <span className="text-sm font-bold tracking-wide">{member.level}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h3 className="font-sans text-xl font-bold uppercase tracking-wide drop-shadow-sm">
              {member.name}
            </h3>
            <p className="font-mono text-xs tracking-widest opacity-80">{member.id}</p>
            <div className="mt-3 flex items-center gap-5">
              <div>
                <span className="block text-[8px] uppercase tracking-wider opacity-70">Plan</span>
                <span className="text-xs font-semibold uppercase">{member.plan}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-wider opacity-70">
                  Valid Thru
                </span>
                <span className="text-xs font-semibold">{member.validUntil}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-xl bg-white p-2 shadow-lg">
            {/* We use Lucide QrCode icon here as a placeholder for actual dynamic QR */}
            <QrCode className="h-16 w-16 text-obsidian-950" />
          </div>
        </div>
      </div>

      {/* Glass reflection overlay */}
      <div className="absolute inset-0 translate-x-[150%] -skew-x-12 transform bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50 transition-transform duration-1000 hover:animate-shimmer" />
    </motion.div>
  );
}
