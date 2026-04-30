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
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { getTrainerDashboardStats } from "@/server/actions/trainer-actions";
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
      <div className="space-y-8 animate-pulse-fade">
        <div className="h-16 bg-surface-elevated rounded-xl w-1/3 mb-8" />
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Trainer <span className="text-brand-orange">Portal</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Welcome back, {session?.user?.name || "Coach"}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
            <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
            <span className="text-xs font-bold text-foreground">{stats?.rating || "4.8"}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-navy/90 transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            My Schedule
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="My Active Clients"
          value={stats?.myMembers || 0}
          trend="+2 this week"
          trendUp
          color="info"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Upcoming Sessions"
          value={stats?.upcomingSessions || 0}
          subtitle="Next: 11:00 AM"
          color="orange"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Completed Sessions"
          value={stats?.completedSessions || 0}
          subtitle="This month"
          color="success"
        />
        <StatCard
          icon={<Dumbbell className="w-6 h-6" />}
          label="Active Classes"
          value={stats?.activeClasses || 0}
          color="navy"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="surface-card p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange-soft flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Today's Schedule</h3>
                  <p className="text-sm text-txt-secondary">You have {stats?.upcomingSessions || 0} sessions left today</p>
                </div>
              </div>
              <Link href="/trainer/schedule" className="text-sm font-bold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border">
              {schedule.map((session, index) => (
                <div key={session.id} className="relative pl-12 flex items-center gap-4 group">
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute left-4 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-surface-card z-10",
                    session.status === 'completed' ? "bg-success" :
                    session.status === 'in-progress' ? "bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" :
                    "bg-surface-elevated border-border"
                  )} />
                  
                  {/* Session Card */}
                  <div className={cn(
                    "flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all",
                    session.status === 'in-progress' 
                      ? "bg-brand-orange-soft/30 border-brand-orange/30 shadow-sm" 
                      : "bg-surface-sunken border-border/50 hover:border-border"
                  )}>
                    <div>
                      <p className="text-xs font-bold text-txt-tertiary uppercase tracking-wide mb-1">{session.time}</p>
                      <h4 className="text-base font-bold text-foreground">{session.client}</h4>
                      <p className="text-sm font-medium text-txt-secondary flex items-center gap-1 mt-1">
                        {session.type === 'Group Class' ? <Users className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
                        {session.type}
                      </p>
                    </div>
                    
                    <div>
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                        session.status === 'completed' ? "bg-success-soft text-success" :
                        session.status === 'in-progress' ? "bg-brand-orange text-white" :
                        "bg-surface-elevated text-txt-secondary"
                      )}>
                        {session.status.replace('-', ' ')}
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
            <h3 className="text-base font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionBtn icon={<Users className="w-5 h-5 transition-transform group-hover:scale-110" />} label="My Clients" href="/trainer/clients" color="info" />
              <QuickActionBtn icon={<ClipboardList className="w-5 h-5 transition-transform group-hover:scale-110" />} label="Workouts" href="/trainer/workouts" color="orange" />
              <QuickActionBtn icon={<Target className="w-5 h-5 transition-transform group-hover:scale-110" />} label="Assessments" href="/trainer/assessments" color="success" />
              <QuickActionBtn icon={<TrendingUp className="w-5 h-5 transition-transform group-hover:scale-110" />} label="Progress" href="/trainer/progress" color="navy" />
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-danger-soft flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-danger" />
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

function QuickActionBtn({ icon, label, href, color }: { icon: React.ReactNode, label: string, href: string, color: string }) {
  const colorMap: any = {
    orange: "bg-brand-orange-soft text-brand-orange hover:bg-brand-orange hover:text-white",
    success: "bg-success-soft text-success hover:bg-success hover:text-white",
    info: "bg-info-soft text-info hover:bg-info hover:text-white",
    navy: "bg-brand-navy-soft text-brand-navy hover:bg-brand-navy hover:text-white"
  };

  return (
    <Link 
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 group text-center",
        colorMap[color]
      )}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
}

function ActionItem({ title, client, due, urgent }: { title: string, client: string, due: string, urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken hover:bg-surface-elevated transition-colors border border-transparent hover:border-border cursor-pointer">
      <div>
        <p className="text-sm font-bold text-foreground mb-0.5">{title}</p>
        <p className="text-xs font-medium text-txt-tertiary">For: {client}</p>
      </div>
      <span className={cn(
        "text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide",
        urgent ? "bg-danger-soft text-danger" : "bg-surface-elevated text-txt-secondary"
      )}>
        {due}
      </span>
    </div>
  );
}
