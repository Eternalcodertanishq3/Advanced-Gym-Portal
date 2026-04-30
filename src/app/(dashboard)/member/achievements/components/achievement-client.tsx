"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Star, 
  Zap, 
  Flame, 
  Award,
  Crown,
  Medal,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: {
    achievements: any[];
    earnedCount: number;
    totalCount: number;
  };
}

export function AchievementClient({ data }: Props) {
  const progress = (data.earnedCount / data.totalCount) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-display flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
              <Trophy className="w-6 h-6 text-brand-orange" />
            </div>
            Legacy <span className="text-brand-orange">Hall</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1 font-medium">Build your legacy. Claim your glory.</p>
        </div>
      </div>

      {/* Progress Summary Card */}
      <div className="surface-card p-8 rounded-[2.5rem] border border-border/50 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <Crown className="w-32 h-32 text-brand-orange" />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-4">
               <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-[0.3em]">Total Progress</p>
               <h2 className="text-5xl font-display font-bold text-foreground">
                 {data.earnedCount} <span className="text-2xl text-txt-tertiary">/ {data.totalCount}</span>
               </h2>
               <div className="space-y-2 pt-2">
                  <div className="h-3 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-brand-orange shadow-brand-glow"
                    />
                  </div>
                  <p className="text-xs font-bold text-brand-orange">{Math.round(progress)}% Complete</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               <SummaryStat label="Points" value="2,450" icon={<Star className="w-5 h-5 mb-2 text-warning" />} color="text-warning" />
               <SummaryStat label="Rank" value="#12" icon={<Flame className="w-5 h-5 mb-2 text-danger" />} color="text-danger" />
               <SummaryStat label="XP" value="12k" icon={<Zap className="w-5 h-5 mb-2 text-info" />} color="text-info" />
            </div>
         </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.achievements.map((achievement, idx) => (
          <motion.div 
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "surface-card p-6 rounded-[2rem] border transition-all group relative overflow-hidden",
              achievement.unlocked 
                ? "border-brand-orange/30 bg-brand-orange/5 hover:border-brand-orange/50" 
                : "border-border/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
            )}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-5 transition-opacity">
               <Award className="w-24 h-24" />
            </div>

            <div className="flex items-center gap-6 relative z-10">
              {/* Badge Icon */}
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500",
                achievement.unlocked 
                  ? "bg-brand-orange shadow-brand-glow border-brand-orange/20 group-hover:rotate-12" 
                  : "bg-surface-elevated border-border"
              )}>
                {achievement.unlocked ? (
                  <Trophy className="w-8 h-8 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-txt-tertiary" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">{achievement.xpValue} XP</p>
                   {achievement.unlocked && <CheckCircle2 className="w-4 h-4 text-success" />}
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight">{achievement.name}</h3>
                <p className="text-xs text-txt-secondary font-medium line-clamp-1">{achievement.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/30 flex justify-between items-center relative z-10">
               <p className="text-[9px] font-bold text-txt-tertiary uppercase tracking-widest">
                 {achievement.unlocked 
                   ? `Achieved ${new Date(achievement.unlockedAt).toLocaleDateString()}` 
                   : "Locked"}
               </p>
               <div className="flex gap-1">
                 {[1,2,3].map(i => (
                   <div key={i} className={cn("w-1 h-1 rounded-full", achievement.unlocked ? "bg-brand-orange" : "bg-border")} />
                 ))}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, icon, color }: any) {
  return (
    <div className="bg-surface-sunken/50 border border-border/30 p-4 rounded-3xl flex flex-col items-center justify-center text-center">
       {icon}
       <p className="text-lg font-display font-bold text-foreground">{value}</p>
       <p className="text-[9px] font-bold text-txt-tertiary uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}
