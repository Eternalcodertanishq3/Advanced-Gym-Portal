"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  Award, 
  Flame, 
  Zap, 
  Target, 
  Crown,
  ChevronRight,
  TrendingUp,
  Star,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Props {
  user: any;
  achievementsData: any;
  leaderboard: any[];
}

export function AchievementClient({ user, achievementsData, leaderboard }: Props) {
  const { achievements, earnedCount, totalCount } = achievementsData;
  const userXP = user.xp || 0;
  const level = Math.floor(userXP / 1000) + 1;
  const xpInLevel = userXP % 1000;
  const xpProgress = (xpInLevel / 1000) * 100;

  return (
    <div className="space-y-10 max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-700">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 surface-card p-8 rounded-[3rem] border border-border/50 relative overflow-hidden bg-brand-navy"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-brand-orange/30 flex items-center justify-center p-2">
                <div className="w-full h-full rounded-full border-4 border-brand-orange bg-surface-sunken flex items-center justify-center">
                   <span className="text-5xl font-display font-bold text-white">{level}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 right-4 bg-brand-orange text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                 Level
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-4xl font-display font-bold text-white">Your <span className="text-brand-orange">Athletic Journey</span></h1>
              <p className="text-white/60 text-lg">You've earned {userXP} XP and unlocked {earnedCount} achievements.</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Progress to Level {level + 1}</span>
                  <span>{xpInLevel} / 1000 XP</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${xpProgress}%` }}
                     className="h-full bg-brand-orange rounded-full shadow-brand-glow"
                   />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="surface-card p-8 rounded-[3rem] border border-border/50 flex flex-col items-center justify-center text-center gap-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 flex items-center justify-center">
             <Trophy className="w-10 h-10 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Hall of Fame</h3>
            <p className="text-sm text-txt-tertiary mt-1">Global ranking among Eagle Gym members.</p>
          </div>
          <div className="text-5xl font-display font-bold text-brand-orange">#{leaderboard.findIndex(l => l.id === user.id) + 1 || "100+"}</div>
          <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
             Top 5%
          </Badge>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Achievements Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
               <Medal className="w-6 h-6 text-brand-orange" />
               Badges & Achievements
            </h2>
            <span className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">{earnedCount} / {totalCount} Unlocked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement: any, idx: number) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "surface-card p-6 rounded-3xl border border-border/50 flex items-center gap-6 relative overflow-hidden group transition-all",
                  achievement.unlocked ? "border-brand-orange/30 bg-brand-orange/[0.02]" : "opacity-60 grayscale-[0.5]"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  achievement.unlocked ? "bg-brand-orange text-white shadow-brand-orange/20" : "bg-surface-sunken text-txt-tertiary"
                )}>
                  {/* Map icon names to actual Lucide components if needed, or use a default */}
                  <Award className="w-8 h-8" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-base font-bold text-foreground">{achievement.name}</h4>
                  <p className="text-xs text-txt-secondary line-clamp-1">{achievement.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold text-brand-orange flex items-center gap-1">
                       <Zap className="w-3 h-3 fill-current" />
                       {achievement.xpValue} XP
                    </span>
                    {achievement.unlocked && (
                      <span className="text-[10px] font-bold text-success">Unlocked!</span>
                    )}
                  </div>
                </div>

                {!achievement.unlocked && (
                  <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="bg-surface-elevated text-[10px] font-bold uppercase px-4 py-1.5 rounded-full border border-border shadow-xl">Locked</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
               <TrendingUp className="w-6 h-6 text-brand-orange" />
               Leaderboard
            </h2>
            <Link href="/member/leaderboard" className="text-xs font-bold text-brand-orange hover:underline">Full View</Link>
          </div>

          <div className="surface-card p-4 rounded-[2.5rem] border border-border/50 bg-surface-sunken/30">
            <div className="space-y-2">
              {leaderboard.map((member, idx) => (
                <div 
                  key={member.id} 
                  className={cn(
                    "p-4 rounded-2xl flex items-center gap-4 transition-all",
                    member.id === user.id ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "hover:bg-surface-elevated"
                  )}
                >
                  <div className="w-8 text-center font-display font-bold text-lg opacity-50">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-sunken overflow-hidden border border-border/20 shrink-0">
                    {member.avatar ? (
                      <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-txt-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{member.firstName} {member.lastName}</p>
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      member.id === user.id ? "text-white/60" : "text-txt-tertiary"
                    )}>{member.xp} XP</p>
                  </div>
                  {idx === 0 && <Crown className="w-4 h-4 text-brand-orange" />}
                  {idx === 1 && <Star className="w-4 h-4 text-warning" />}
                  {idx === 2 && <Star className="w-4 h-4 text-txt-tertiary" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Challenges */}
          <div className="surface-card p-8 rounded-[2.5rem] border border-border/50 bg-brand-orange/5 relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-10">
                <Flame className="w-32 h-32 text-brand-orange" />
             </div>
             <h3 className="text-xl font-bold mb-2">Active Challenge</h3>
             <p className="text-sm text-txt-secondary mb-6">Complete 5 cardio sessions this week to earn bonus 500 XP.</p>
             <Button className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl font-bold">
                Join Challenge
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ href, children, className }: any) {
  return <a href={href} className={className}>{children}</a>;
}
