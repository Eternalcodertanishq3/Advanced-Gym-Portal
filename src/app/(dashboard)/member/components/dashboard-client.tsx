"use client";

import { motion } from "framer-motion";
import {
  QrCode,
  Crown,
  Flame,
  TrendingUp,
  Calendar,
  Dumbbell,
  Clock,
  Zap,
  Droplets,
  Footprints,
  Star,
  Trophy,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Member Portal Dashboard Client
// ═══════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

interface Props {
  user: any;
  stats: any;
  allowedFeatures: string[];
}

export function MemberDashboardClient({ user, stats, allowedFeatures }: Props) {
  const { weeklyProgress, todayWorkout, upcomingClasses } = stats || { 
    weeklyProgress: [], 
    todayWorkout: null, 
    upcomingClasses: [] 
  };

  const daysLeft = stats?.expiresAt 
    ? Math.ceil((new Date(stats.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const hasFeature = (id: string) => allowedFeatures.includes(id);

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
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Hello, <span className="text-brand-orange">{user?.firstName || "Member"}</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Ready to crush your goals today?</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFeature("gym_access") ? (
            <Link
              href="/member/digital-card"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl surface-card border-brand-orange/20 hover:border-brand-orange/40 transition-colors"
            >
              <QrCode className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-semibold text-brand-orange">My Card</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-sunken opacity-50 cursor-not-allowed">
              <Lock className="w-3 h-3 text-txt-tertiary" />
              <span className="text-sm font-semibold text-txt-tertiary">Upgrade Required</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <MemberStatCard
          icon={Flame}
          label="Current Streak"
          value={`${stats?.streak || 0} days`}
          color="orange"
          subtitle="Keep it up!"
        />
        <MemberStatCard
          icon={Footprints}
          label="Total Check-ins"
          value={stats?.totalAttendance?.toString() || "0"}
          sparklineData={stats.attendanceSparkline || []}
          color="navy"
          subtitle="Since joined"
        />
        <MemberStatCard
          icon={Zap}
          label="Classes"
          value={stats?.totalClasses?.toString() || "0"}
          color="info"
          subtitle="Completed"
        />
        <MemberStatCard
          icon={TrendingUp}
          label="Upcoming"
          value={stats?.upcomingClasses?.toString() || "0"}
          color="success"
          subtitle="Booked classes"
        />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Workout */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress */}
          <motion.div variants={itemVariants} className="surface-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success-soft flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Weekly Progress</h3>
                  <p className="text-sm text-txt-secondary">Keep the momentum going!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-display font-bold text-success">
                  {weeklyProgress.filter((d: any) => d.completed).length}/7
                </p>
                <p className="label-text">days completed</p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 h-40">
              {weeklyProgress.map((day: any, index: number) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-xl transition-all duration-500 relative group",
                      day.completed
                        ? "bg-success"
                        : "bg-surface-elevated"
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: day.completed ? `${(day.calories / 600) * 100}%` : "20%" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {day.completed && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded shadow-lg">
                        <span className="text-xs font-bold">{day.calories} kcal</span>
                      </div>
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-sm font-medium",
                    day.completed ? "text-success" : "text-txt-tertiary"
                  )}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Today's Workout - Gated by gym_access */}
          <motion.div variants={itemVariants} className="surface-card p-6 relative overflow-hidden">
            {!hasFeature("gym_access") && (
              <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-background/40 flex flex-col items-center justify-center text-center p-6">
                <Lock className="w-10 h-10 text-brand-orange mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Workout Access Restricted</h3>
                <p className="text-sm text-white/70 mb-6">Upgrade your plan to unlock personalized workout routines.</p>
                <Link href="/member/select-plan">
                  <Button className="bg-brand-orange hover:bg-brand-orange-dark">View Plans</Button>
                </Link>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-danger-soft flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Today's Workout</h3>
                  <p className="text-sm text-txt-secondary">{todayWorkout?.name || "Ready to start?"}</p>
                </div>
              </div>
              {todayWorkout && (
                <span className="text-sm font-semibold text-txt-secondary flex items-center gap-1.5 bg-surface-elevated px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4" />
                  {todayWorkout.estimatedTime}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {!todayWorkout && (
                <div className="p-8 text-center bg-surface-sunken rounded-xl border border-dashed border-border">
                  <p className="text-sm text-txt-tertiary">No workout assigned for today.</p>
                </div>
              )}
              {todayWorkout?.exerciseList?.map((exercise: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl transition-all border border-transparent",
                    exercise.completed ? "bg-success-soft border-success/10" : "bg-surface-sunken"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      exercise.completed
                        ? "bg-success text-white"
                        : "bg-surface-elevated text-txt-secondary"
                    )}
                  >
                    {exercise.completed ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "text-base font-semibold",
                      exercise.completed ? "text-success line-through opacity-70" : "text-foreground"
                    )}>
                      {exercise.name}
                    </p>
                    <p className="text-sm text-txt-tertiary font-medium">{exercise.sets}</p>
                  </div>
                </div>
              ))}
            </div>

            {hasFeature("gym_access") && (
              <Link
                href="/member/workout"
                className="mt-6 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-orange text-white font-bold text-base hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/20"
              >
                <Dumbbell className="w-5 h-5" />
                Start Workout
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right Column - Profile & Stats */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <motion.div variants={itemVariants} className="surface-card p-6 relative overflow-hidden bg-brand-navy border-none text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                  {stats?.subscriptionStatus || "MEMBER"}
                </span>
                <Crown className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-1">{user?.firstName || "Member"}</h3>
              <p className="text-sm text-white/60 font-medium mb-6">{stats?.planName || "No active plan"}</p>
              
              <div className="space-y-3 bg-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Valid until</span>
                  <span className="text-white font-semibold">
                    {stats?.expiresAt ? formatDate(stats.expiresAt, "dd MMM yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Days remaining</span>
                  <span className={cn(
                    "font-display font-bold text-lg",
                    daysLeft < 7 ? "text-danger" : "text-brand-orange"
                  )}>
                    {daysLeft > 0 ? daysLeft : 0}
                  </span>
                </div>
              </div>

              {hasFeature("gym_access") ? (
                <div className="mt-6 p-4 rounded-xl bg-white flex flex-col items-center justify-center">
                  <QrCode className="w-24 h-24 text-brand-navy mb-2" />
                  <p className="text-[10px] uppercase tracking-wider font-bold text-brand-navy/50">Show at reception</p>
                </div>
              ) : (
                <Link href="/member/select-plan" className="block mt-6">
                  <Button className="w-full bg-brand-orange hover:bg-brand-orange-dark">Activate Member Card</Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Gated: Upcoming Classes */}
          <motion.div variants={itemVariants} className="surface-card p-6 relative overflow-hidden">
            {!hasFeature("group_classes") && (
              <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-background/40 flex flex-col items-center justify-center text-center p-6">
                <Lock className="w-6 h-6 text-brand-orange mb-2" />
                <p className="text-xs font-bold text-white mb-4">Class Access Locked</p>
                <Link href="/member/select-plan">
                  <Button size="sm" variant="outline" className="text-xs border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">Upgrade</Button>
                </Link>
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Upcoming Classes</h3>
              <Link href="/member/classes" className="text-sm font-bold text-brand-orange hover:underline">
                Explore
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingClasses.length === 0 && (
                <div className="p-4 text-center bg-surface-sunken rounded-xl">
                  <p className="text-sm text-txt-tertiary">No upcoming classes booked.</p>
                </div>
              )}
              {upcomingClasses.map((item: any) => (
                <div key={item.id} className="p-4 rounded-xl bg-surface-sunken border border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-foreground">{item.name}</h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-success-soft text-success">
                      Booked
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-txt-tertiary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-brand-orange" />
                      {item.trainer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function MemberStatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
  sparklineData,
}: {
  icon: any;
  label: string;
  value: string;
  color: "navy" | "success" | "info" | "orange";
  subtitle?: string;
  sparklineData?: number[];
}) {
  const colorMap = {
    navy: "bg-surface-elevated text-brand-navy",
    success: "bg-success-soft text-success",
    info: "bg-info-soft text-info",
    orange: "bg-brand-orange-soft text-brand-orange",
  };

  return (
    <motion.div
      className="surface-card p-6"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        colorMap[color]
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm font-semibold text-txt-secondary mt-1">{label}</p>
      {subtitle && <p className="text-xs font-medium text-txt-tertiary mt-2">{subtitle}</p>}
    </motion.div>
  );
}
