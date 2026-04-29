"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  Crown,
  Flame,
  TrendingUp,
  Calendar,
  Dumbbell,
  Utensils,
  Award,
  ChevronRight,
  Clock,
  Zap,
  Target,
  Droplets,
  Footprints,
  Star,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { ProgressRing } from "@/components/common/progress-ring";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Member Portal Dashboard
// ═══════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function MemberDashboardPage() {
  const [weeklyProgress] = useState([
    { day: "Mon", completed: true, calories: 450 },
    { day: "Tue", completed: true, calories: 520 },
    { day: "Wed", completed: true, calories: 380 },
    { day: "Thu", completed: false, calories: 0 },
    { day: "Fri", completed: false, calories: 0 },
    { day: "Sat", completed: false, calories: 0 },
    { day: "Sun", completed: false, calories: 0 },
  ]);

  const memberStats = {
    name: "Rahul Patel",
    tier: "GOLD",
    plan: "Gold Monthly",
    planExpiry: "2026-05-15",
    daysLeft: 18,
    totalCheckIns: 142,
    currentStreak: 5,
    bestStreak: 12,
    weightLost: 4.5,
    workoutsCompleted: 38,
    caloriesBurned: 18450,
    xp: 2450,
    level: 3,
    nextLevelXP: 4000,
    waterIntake: 1.8, // liters
    waterGoal: 3.0,
  };

  const todayWorkout = {
    name: "Upper Body Power",
    exercises: 6,
    estimatedTime: "45 min",
    completed: 3,
    total: 6,
  };

  const upcomingClasses = [
    { id: "1", name: "Power Yoga", time: "Tomorrow, 6:00 AM", trainer: "Priya Sharma", booked: true },
    { id: "2", name: "HIIT Blast", time: "Wed, 7:30 AM", trainer: "Rahul Patel", booked: true },
    { id: "3", name: "Zumba Dance", time: "Fri, 6:00 PM", trainer: "Neha Gupta", booked: false },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Hello, <span className="text-gold-gradient">{memberStats.name.split(" ")[0]}</span>
          </h1>
          <p className="text-sm text-white/40">Ready to crush your goals today?</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/member/digital-card"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border-gold-500/20 hover:border-gold-500/40 transition-colors"
          >
            <QrCode className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-400">My Card</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MemberStatCard
          icon={Flame}
          label="Current Streak"
          value={`${memberStats.currentStreak} days`}
          color="orange"
          subtitle={`Best: ${memberStats.bestStreak}`}
        />
        <MemberStatCard
          icon={Footprints}
          label="Total Check-ins"
          value={memberStats.totalCheckIns.toString()}
          color="gold"
          subtitle="Since joined"
        />
        <MemberStatCard
          icon={Zap}
          label="Workouts"
          value={memberStats.workoutsCompleted.toString()}
          color="cyan"
          subtitle="Completed"
        />
        <MemberStatCard
          icon={TrendingUp}
          label="Weight Lost"
          value={`${memberStats.weightLost} kg`}
          color="green"
          subtitle="Keep going!"
        />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Workout */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/5 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
                  <p className="text-xs text-white/30">Keep the momentum going!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-neon-green">
                  {weeklyProgress.filter((d) => d.completed).length}/7
                </p>
                <p className="text-[10px] text-white/20">days completed</p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-500 relative group",
                      day.completed
                        ? "bg-gradient-to-t from-neon-green/60 to-neon-green/20"
                        : "bg-white/5"
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: day.completed ? `${(day.calories / 600) * 100}%` : "20%" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {day.completed && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-neon-green font-mono">{day.calories}</span>
                      </div>
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs",
                    day.completed ? "text-neon-green font-medium" : "text-white/20"
                  )}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Today's Workout */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson/20 to-crimson/5 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-crimson" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Today&apos;s Workout</h3>
                  <p className="text-xs text-white/30">{todayWorkout.name}</p>
                </div>
              </div>
              <span className="text-xs text-white/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {todayWorkout.estimatedTime}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Bench Press", sets: "4 x 10", completed: true },
                { name: "Incline Dumbbell Press", sets: "3 x 12", completed: true },
                { name: "Cable Fly", sets: "3 x 15", completed: true },
                { name: "Overhead Press", sets: "4 x 8", completed: false },
                { name: "Lateral Raises", sets: "3 x 15", completed: false },
                { name: "Tricep Pushdown", sets: "3 x 12", completed: false },
              ].map((exercise, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                    exercise.completed ? "bg-neon-green/5" : "bg-white/[0.02]"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      exercise.completed
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-white/5 text-white/20"
                    )}
                  >
                    {exercise.completed ? (
                      <Zap className="w-3 h-3" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm",
                      exercise.completed ? "text-white/60 line-through" : "text-white"
                    )}>
                      {exercise.name}
                    </p>
                    <p className="text-xs text-white/30">{exercise.sets}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/member/workout"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-liquid-gold to-liquid-orange text-obsidian-950 font-semibold text-sm hover:brightness-110 transition-all"
            >
              <Dumbbell className="w-4 h-4" />
              Start Workout
            </Link>
          </motion.div>
        </div>

        {/* Right Column - Profile & Stats */}
        <div className="space-y-6">
          {/* Digital Card Preview */}
          <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                  "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                )}>
                  {memberStats.tier}
                </span>
                <Crown className="w-5 h-5 text-gold-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-1">{memberStats.name}</h3>
              <p className="text-xs text-white/40 mb-4">{memberStats.plan}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30">Valid until</span>
                  <span className="text-white/60">{formatDate(memberStats.planExpiry, "dd MMM yyyy")}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30">Days remaining</span>
                  <span className={cn(
                    "font-mono font-bold",
                    memberStats.daysLeft < 7 ? "text-crimson" : "text-neon-green"
                  )}>
                    {memberStats.daysLeft}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white/5 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-obsidian-950" />
                </div>
              </div>
              <p className="text-center text-[10px] text-white/20 mt-2">Show this at reception</p>
            </div>
          </motion.div>

          {/* XP & Level */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Level {memberStats.level}</h3>
                  <p className="text-xs text-white/30">Gold Member</p>
                </div>
              </div>
              <Trophy className="w-5 h-5 text-gold-400" />
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/30">{memberStats.xp} XP</span>
                <span className="text-white/30">{memberStats.nextLevelXP} XP</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(memberStats.xp / memberStats.nextLevelXP) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <p className="text-xs text-white/20 text-center">
              {memberStats.nextLevelXP - memberStats.xp} XP to Level {memberStats.level + 1}
            </p>
          </motion.div>

          {/* Water Tracker */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Hydration</h3>
                  <p className="text-xs text-white/30">Daily goal: {memberStats.waterGoal}L</p>
                </div>
              </div>
              <span className="text-lg font-mono font-bold text-blue-400">
                {memberStats.waterIntake}L
              </span>
            </div>
            <div className="flex items-end justify-between gap-1 h-16">
              {[...Array(8)].map((_, i) => {
                const filled = (memberStats.waterIntake / memberStats.waterGoal) * 8 > i;
                return (
                  <motion.div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm transition-all",
                      filled ? "bg-blue-400/60" : "bg-white/5"
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: filled ? "100%" : "30%" }}
                    transition={{ delay: i * 0.05 }}
                  />
                );
              })}
            </div>
            <button
              onClick={() => toast.success("Water intake logged!")}
              className="mt-3 w-full py-2 rounded-lg bg-blue-500/10 text-xs text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              + Add Glass (250ml)
            </button>
          </motion.div>

          {/* Upcoming Classes */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Upcoming Classes</h3>
              <Link href="/member/classes" className="text-xs text-gold-400 hover:text-gold-300">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    cls.booked ? "bg-neon-green/10" : "bg-white/5"
                  )}>
                    <Calendar className={cn(
                      "w-5 h-5",
                      cls.booked ? "text-neon-green" : "text-white/20"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{cls.name}</p>
                    <p className="text-xs text-white/30">{cls.time}</p>
                    <p className="text-[10px] text-white/20">{cls.trainer}</p>
                  </div>
                  {cls.booked ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green">
                      Booked
                    </span>
                  ) : (
                    <button
                      onClick={() => toast.success("Class booked!")}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-colors"
                    >
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Member Stat Card
// ═══════════════════════════════════════════════════════════════

function MemberStatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "gold" | "green" | "cyan" | "orange";
  subtitle?: string;
}) {
  const colorMap = {
    gold: "from-gold-500/20 to-gold-500/5 text-gold-400",
    green: "from-neon-green/20 to-neon-green/5 text-neon-green",
    cyan: "from-electric-cyan/20 to-electric-cyan/5 text-electric-cyan",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-400",
  };

  return (
    <motion.div
      className="glass-card p-5"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
        colorMap[color]
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-lg font-mono font-bold text-white">{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
      {subtitle && <p className="text-[10px] text-white/20 mt-1">{subtitle}</p>}
    </motion.div>
  );
}