"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Users,
  Calendar,
  Clock,
  Dumbbell,
  TrendingUp,
  Star,
  ChevronRight,
  ClipboardList,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/app/(dashboard)/admin/components/stat-card";
import { getTrainerDashboardStats } from "@/actions/admin/trainer-actions";
import { SkeletonStatGrid } from "@/components/loaders/eagle-loader";
import { toast } from "sonner";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Trainer Dashboard
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

export default function TrainerDashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const trainerId = session?.user?.id;
      if (!trainerId) return;

      try {
        const res = await getTrainerDashboardStats(trainerId);
        if (res.success && res.data) {
          setStats(res.data);
          setSchedule(res.data.schedule || []);
        } else {
          toast.error(res.error || "Failed to load dashboard data");
        }
      } catch (e) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      loadStats();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="animate-pulse-fade space-y-8">
        <div className="mb-8 h-16 w-1/3 rounded-xl bg-surface-elevated" />
        <SkeletonStatGrid count={4} />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
            Trainer <span className="text-brand-orange">Portal</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Welcome back, {session?.user?.name || "Coach"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5">
            <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
            <span className="text-xs font-bold text-foreground">{stats?.rating || "4.8"}</span>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-navy/90">
            <Calendar className="h-4 w-4" />
            My Schedule
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="My Active Clients"
          value={stats?.myMembers || 0}
          trend="+2 this week"
          trendUp
          color="info"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          label="Upcoming Sessions"
          value={stats?.upcomingSessions || 0}
          subtitle="Next: 11:00 AM"
          color="orange"
        />
        <StatCard
          icon={<Target className="h-6 w-6" />}
          label="Completed Sessions"
          value={stats?.completedSessions || 0}
          subtitle="This month"
          color="success"
        />
        <StatCard
          icon={<Dumbbell className="h-6 w-6" />}
          label="Active Classes"
          value={stats?.activeClasses || 0}
          color="navy"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="surface-card h-full p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-soft">
                  <Calendar className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Today's Schedule</h3>
                  <p className="text-sm text-txt-secondary">
                    You have {stats?.upcomingSessions || 0} sessions left today
                  </p>
                </div>
              </div>
              <Link
                href="/trainer/schedule"
                className="flex items-center gap-1 text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange/80"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border">
              {schedule.map((session, _index) => (
                <div key={session.id} className="group relative flex items-center gap-4 pl-12">
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-surface-card",
                      session.status === "completed"
                        ? "bg-success"
                        : session.status === "in-progress"
                          ? "animate-pulse bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                          : "border-border bg-surface-elevated",
                    )}
                  />

                  {/* Session Card */}
                  <div
                    className={cn(
                      "flex flex-1 flex-col justify-between gap-4 rounded-xl border p-4 transition-all sm:flex-row sm:items-center",
                      session.status === "in-progress"
                        ? "border-brand-orange/30 bg-brand-orange-soft/30 shadow-sm"
                        : "border-border/50 bg-surface-sunken hover:border-border",
                    )}
                  >
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                        {session.time}
                      </p>
                      <h4 className="text-base font-bold text-foreground">{session.client}</h4>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-txt-secondary">
                        {session.type === "Group Class" ? (
                          <Users className="h-3.5 w-3.5" />
                        ) : (
                          <Dumbbell className="h-3.5 w-3.5" />
                        )}
                        {session.type}
                      </p>
                    </div>

                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
                          session.status === "completed"
                            ? "bg-success-soft text-success"
                            : session.status === "in-progress"
                              ? "bg-brand-orange text-white"
                              : "bg-surface-elevated text-txt-secondary",
                        )}
                      >
                        {session.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & Recent Activity */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <div className="surface-card p-6">
            <h3 className="mb-4 text-base font-bold text-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionBtn
                icon={<Users className="h-5 w-5 transition-transform group-hover:scale-110" />}
                label="My Clients"
                href="/trainer/clients"
                color="info"
              />
              <QuickActionBtn
                icon={
                  <ClipboardList className="h-5 w-5 transition-transform group-hover:scale-110" />
                }
                label="Workouts"
                href="/trainer/workouts"
                color="orange"
              />
              <QuickActionBtn
                icon={<Target className="h-5 w-5 transition-transform group-hover:scale-110" />}
                label="Assessments"
                href="/trainer/assessments"
                color="success"
              />
              <QuickActionBtn
                icon={<TrendingUp className="h-5 w-5 transition-transform group-hover:scale-110" />}
                label="Progress"
                href="/trainer/progress"
                color="navy"
              />
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-soft">
                <ClipboardList className="h-5 w-5 text-danger" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Action Needed</h3>
                <p className="text-xs text-txt-secondary">Pending plans & reviews</p>
              </div>
            </div>

            <div className="space-y-3">
              <ActionItem title="Update workout plan" client="Rahul Patel" due="Today" />
              <ActionItem title="Log assessment results" client="Priya Sharma" due="Tomorrow" />
              <ActionItem title="Review diet progress" client="Amit Kumar" due="Overdue" urgent />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// UI Components
// ═══════════════════════════════════════════════════════════════

function QuickActionBtn({
  icon,
  label,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}) {
  const colorMap: any = {
    orange: "bg-brand-orange-soft text-brand-orange hover:bg-brand-orange hover:text-white",
    success: "bg-success-soft text-success hover:bg-success hover:text-white",
    info: "bg-info-soft text-info hover:bg-info hover:text-white",
    navy: "bg-brand-navy-soft text-brand-navy hover:bg-brand-navy hover:text-white",
  };

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition-all duration-300",
        colorMap[color],
      )}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
}

function ActionItem({
  title,
  client,
  due,
  urgent,
}: {
  title: string;
  client: string;
  due: string;
  urgent?: boolean;
}) {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-surface-sunken p-3 transition-colors hover:border-border hover:bg-surface-elevated">
      <div>
        <p className="mb-0.5 text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs font-medium text-txt-tertiary">For: {client}</p>
      </div>
      <span
        className={cn(
          "rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide",
          urgent ? "bg-danger-soft text-danger" : "bg-surface-elevated text-txt-secondary",
        )}
      >
        {due}
      </span>
    </div>
  );
}
