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
  Users,
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
    <div className="mx-auto max-w-7xl space-y-10 p-4 duration-700 animate-in fade-in md:p-10">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="surface-card relative overflow-hidden rounded-[3rem] border border-border/50 bg-brand-navy p-8 lg:col-span-2"
        >
          <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-brand-orange/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
            <div className="relative">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-brand-orange/30 p-2">
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-brand-orange bg-surface-sunken">
                  <span className="font-display text-5xl font-bold text-white">{level}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 right-4 rounded-full bg-brand-orange px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                Level
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h1 className="font-display text-4xl font-bold text-white">
                Your <span className="text-brand-orange">Athletic Journey</span>
              </h1>
              <p className="text-lg text-white/60">
                You've earned {userXP} XP and unlocked {earnedCount} achievements.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Progress to Level {level + 1}</span>
                  <span>{xpInLevel} / 1000 XP</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full rounded-full bg-brand-orange shadow-brand-glow"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="surface-card flex flex-col items-center justify-center gap-6 rounded-[3rem] border border-border/50 p-8 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-orange/10">
            <Trophy className="h-10 w-10 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Hall of Fame</h3>
            <p className="mt-1 text-sm text-txt-tertiary">
              Global ranking among Eagle Gym members.
            </p>
          </div>
          <div className="font-display text-5xl font-bold text-brand-orange">
            #{leaderboard.findIndex((l) => l.id === user.id) + 1 || "100+"}
          </div>
          <Badge className="rounded-full border-brand-orange/20 bg-brand-orange/10 px-6 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
            Top 5%
          </Badge>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Achievements Grid */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <Medal className="h-6 w-6 text-brand-orange" />
              Badges & Achievements
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
              {earnedCount} / {totalCount} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {achievements.map((achievement: any, idx: number) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "surface-card group relative flex items-center gap-6 overflow-hidden rounded-3xl border border-border/50 p-6 transition-all",
                  achievement.unlocked
                    ? "border-brand-orange/30 bg-brand-orange/[0.02]"
                    : "opacity-60 grayscale-[0.5]",
                )}
              >
                <div
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg",
                    achievement.unlocked
                      ? "bg-brand-orange text-white shadow-brand-orange/20"
                      : "bg-surface-sunken text-txt-tertiary",
                  )}
                >
                  {/* Map icon names to actual Lucide components if needed, or use a default */}
                  <Award className="h-8 w-8" />
                </div>

                <div className="flex-1">
                  <h4 className="text-base font-bold text-foreground">{achievement.name}</h4>
                  <p className="line-clamp-1 text-xs text-txt-secondary">
                    {achievement.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-brand-orange">
                      <Zap className="h-3 w-3 fill-current" />
                      {achievement.xpValue} XP
                    </span>
                    {achievement.unlocked && (
                      <span className="text-[10px] font-bold text-success">Unlocked!</span>
                    )}
                  </div>
                </div>

                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/5 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                    <span className="rounded-full border border-border bg-surface-elevated px-4 py-1.5 text-[10px] font-bold uppercase shadow-xl">
                      Locked
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <TrendingUp className="h-6 w-6 text-brand-orange" />
              Leaderboard
            </h2>
            <Link
              href="/member/leaderboard"
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Full View
            </Link>
          </div>

          <div className="surface-card rounded-[2.5rem] border border-border/50 bg-surface-sunken/30 p-4">
            <div className="space-y-2">
              {leaderboard.map((member, idx) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl p-4 transition-all",
                    member.id === user.id
                      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
                      : "hover:bg-surface-elevated",
                  )}
                >
                  <div className="w-8 text-center font-display text-lg font-bold opacity-50">
                    {idx + 1}
                  </div>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/20 bg-surface-sunken">
                    {member.avatar ? (
                      <img src={member.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Users className="h-5 w-5 text-txt-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {member.firstName} {member.lastName}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        member.id === user.id ? "text-white/60" : "text-txt-tertiary",
                      )}
                    >
                      {member.xp} XP
                    </p>
                  </div>
                  {idx === 0 && <Crown className="h-4 w-4 text-brand-orange" />}
                  {idx === 1 && <Star className="h-4 w-4 text-warning" />}
                  {idx === 2 && <Star className="h-4 w-4 text-txt-tertiary" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Challenges */}
          <div className="surface-card relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-brand-orange/5 p-8">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Flame className="h-32 w-32 text-brand-orange" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Active Challenge</h3>
            <p className="mb-6 text-sm text-txt-secondary">
              Complete 5 cardio sessions this week to earn bonus 500 XP.
            </p>
            <Button className="hover:bg-brand-orange-dark w-full rounded-xl bg-brand-orange font-bold text-white">
              Join Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ href, children, className }: any) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
