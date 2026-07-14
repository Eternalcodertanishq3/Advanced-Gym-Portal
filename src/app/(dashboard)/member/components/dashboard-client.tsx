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
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

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
    upcomingClasses: [],
  };

  const daysLeft = stats?.expiresAt
    ? Math.ceil(
        (new Date(stats.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
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
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
            Hello, <span className="text-brand-orange">{user?.firstName || "Member"}</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">Ready to crush your goals today?</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFeature("gym_access") ? (
            <Link
              href="/member/digital-card"
              className="surface-card flex items-center gap-2 rounded-xl border-brand-orange/20 px-4 py-2.5 transition-colors hover:border-brand-orange/40"
            >
              <QrCode className="h-4 w-4 text-brand-orange" />
              <span className="text-sm font-semibold text-brand-orange">My Card</span>
            </Link>
          ) : (
            <div className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-surface-sunken px-4 py-2.5 opacity-50">
              <Lock className="h-3 w-3 text-txt-tertiary" />
              <span className="text-sm font-semibold text-txt-tertiary">Upgrade Required</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <MemberStatCard
          icon={<Flame className="h-6 w-6" />}
          label="Current Streak"
          value={`${stats?.streak || 0} days`}
          color="orange"
          subtitle="Keep it up!"
        />
        <MemberStatCard
          icon={<Footprints className="h-6 w-6" />}
          label="Total Check-ins"
          value={stats?.totalAttendance?.toString() || "0"}
          sparklineData={stats?.attendanceSparkline || []}
          color="navy"
          subtitle="Since joined"
        />
        <MemberStatCard
          icon={<Zap className="h-6 w-6" />}
          label="Classes"
          value={stats?.totalClasses?.toString() || "0"}
          color="info"
          subtitle="Completed"
        />
        <MemberStatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Upcoming"
          value={upcomingClasses.length.toString()}
          color="success"
          subtitle="Booked classes"
        />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Progress & Workout */}
        <div className="space-y-6 lg:col-span-2">
          {/* Weekly Progress */}
          <motion.div variants={itemVariants} className="surface-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Weekly Progress</h3>
                  <p className="text-sm text-txt-secondary">Keep the momentum going!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-success">
                  {weeklyProgress.filter((d: any) => d.completed).length}/7
                </p>
                <p className="label-text">days completed</p>
              </div>
            </div>

            <div className="flex h-40 items-end justify-between gap-3">
              {weeklyProgress.map((day: any, index: number) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    className={cn(
                      "group relative w-full rounded-t-xl transition-all duration-500",
                      day.completed ? "bg-success" : "bg-surface-elevated",
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: day.completed ? `${(day.calories / 600) * 100}%` : "20%" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {day.completed && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-bold">{day.calories} kcal</span>
                      </div>
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      day.completed ? "text-success" : "text-txt-tertiary",
                    )}
                  >
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Today's Workout */}
          <motion.div variants={itemVariants} className="surface-card relative overflow-hidden p-6">
            {!hasFeature("gym_access") && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl border border-brand-orange/10 bg-white/70 p-6 text-center backdrop-blur-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-brand-orange/20 bg-brand-orange/5">
                  <Lock className="h-8 w-8 text-brand-orange" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold text-obsidian-950">
                  Premium Training
                </h3>
                <p className="mb-6 max-w-[200px] text-sm font-medium text-obsidian-600">
                  Upgrade your plan to unlock personalized workout routines.
                </p>
                <Link href="/member/select-plan">
                  <Button className="hover:bg-brand-orange-dark bg-brand-orange px-8 font-bold text-white shadow-lg shadow-brand-orange/20">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft">
                  <Dumbbell className="h-6 w-6 text-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Today's Workout</h3>
                  <p className="text-sm text-txt-secondary">
                    {todayWorkout?.name || "No workout assigned"}
                  </p>
                </div>
              </div>
              {todayWorkout && (
                <span className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-sm font-semibold text-txt-secondary">
                  <Clock className="h-4 w-4" />
                  {todayWorkout.estimatedTime}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {todayWorkout?.exerciseList?.slice(0, 3).map((exercise: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl bg-surface-sunken p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-sm font-bold text-txt-secondary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-foreground">{exercise.name}</p>
                    <p className="text-sm font-medium text-txt-tertiary">{exercise.sets}</p>
                  </div>
                </div>
              ))}
              {todayWorkout && todayWorkout.exerciseList.length > 3 && (
                <p className="pt-2 text-center text-xs font-bold text-txt-tertiary">
                  + {todayWorkout.exerciseList.length - 3} MORE EXERCISES
                </p>
              )}
            </div>

            {hasFeature("gym_access") && todayWorkout && (
              <Link
                href="/member/workout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-4 text-base font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange/90"
              >
                <Dumbbell className="h-5 w-5" />
                Start Training
              </Link>
            )}
          </motion.div>

          {/* Today's Nutrition */}
          <motion.div variants={itemVariants} className="surface-card relative overflow-hidden p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft">
                  <Apple className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Nutrition Plan</h3>
                  <p className="text-sm text-txt-secondary">
                    {stats?.todayDiet?.name || "Fuel your body"}
                  </p>
                </div>
              </div>
              {stats?.todayDiet && (
                <span className="flex items-center gap-1.5 rounded-lg bg-success-soft/30 px-3 py-1.5 text-sm font-semibold text-success">
                  <Flame className="h-4 w-4" />
                  {stats.todayDiet.totalCalories} kcal
                </span>
              )}
            </div>

            <div className="space-y-3">
              {stats?.todayDiet?.mealList ? (
                stats.todayDiet.mealList.slice(0, 3).map((meal: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl bg-surface-sunken p-4"
                  >
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-surface-elevated">
                      <span className="text-[10px] font-bold uppercase text-success">
                        {meal.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-foreground">{meal.name}</p>
                      <p className="text-sm font-medium text-txt-tertiary">{meal.calories} kcal</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface-sunken p-8 text-center">
                  <p className="text-sm text-txt-tertiary">No diet plan assigned yet.</p>
                </div>
              )}
            </div>

            {stats?.todayDiet && (
              <Link
                href="/member/diet"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated py-4 text-base font-bold text-foreground transition-all hover:bg-surface-sunken"
              >
                <Apple className="h-5 w-5 text-success" />
                View Full Diet
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right Column - Profile & Stats */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <motion.div
            variants={itemVariants}
            className="surface-card relative overflow-hidden border-none bg-brand-navy p-6 text-white"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full border border-brand-orange/30 bg-brand-orange/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                  {stats?.subscriptionStatus || "MEMBER"}
                </span>
                <Crown className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="mb-1 font-display text-2xl font-bold text-white">
                {user?.firstName || "Member"}
              </h3>
              <p className="mb-6 text-sm font-medium text-white/60">
                {stats?.planName || "No active plan"}
              </p>

              <div className="space-y-3 rounded-xl bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Valid until</span>
                  <span className="font-semibold text-white">
                    {stats?.expiresAt ? formatDate(stats.expiresAt, "dd MMM yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Days remaining</span>
                  <span
                    className={cn(
                      "font-display text-lg font-bold",
                      daysLeft < 7 ? "text-danger" : "text-brand-orange",
                    )}
                  >
                    {daysLeft > 0 ? daysLeft : 0}
                  </span>
                </div>
              </div>

              {hasFeature("gym_access") ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-white p-4">
                  <div className="mb-2 rounded-lg border-2 border-brand-navy/5 p-2">
                    <QRCodeSVG value={user?.id || "N/A"} size={100} level="H" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">
                    Show at reception
                  </p>
                </div>
              ) : (
                <Link href="/member/select-plan" className="mt-6 block">
                  <Button className="hover:bg-brand-orange-dark w-full bg-brand-orange">
                    Activate Member Card
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Gated: Upcoming Classes */}
          <motion.div variants={itemVariants} className="surface-card relative overflow-hidden p-6">
            {!hasFeature("group_classes") && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/70 p-4 text-center backdrop-blur-md">
                <Lock className="mb-3 h-8 w-8 text-brand-orange" />
                <p className="mb-4 font-display text-sm font-bold text-obsidian-950">
                  Class Access Locked
                </p>
                <Link href="/member/select-plan">
                  <Button
                    size="sm"
                    className="hover:bg-brand-orange-dark border-none bg-brand-orange px-6 font-bold text-white"
                  >
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            )}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Upcoming Classes</h3>
              <Link
                href="/member/classes"
                className="text-sm font-bold text-brand-orange hover:underline"
              >
                Explore
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingClasses.length === 0 && (
                <div className="rounded-xl bg-surface-sunken p-4 text-center">
                  <p className="text-sm text-txt-tertiary">No upcoming classes booked.</p>
                </div>
              )}
              {upcomingClasses.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/50 bg-surface-sunken p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-bold text-foreground">{item.name}</h4>
                    <span className="rounded bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase text-success">
                      Booked
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-txt-tertiary">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-brand-orange" />
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
  icon,
  label,
  value,
  color,
  subtitle,
  sparklineData,
}: {
  icon: React.ReactNode;
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
    <motion.div className="surface-card p-6" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
          colorMap[color],
        )}
      >
        {icon}
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm font-semibold text-txt-secondary">{label}</p>
      {subtitle && <p className="mt-2 text-xs font-medium text-txt-tertiary">{subtitle}</p>}
    </motion.div>
  );
}
