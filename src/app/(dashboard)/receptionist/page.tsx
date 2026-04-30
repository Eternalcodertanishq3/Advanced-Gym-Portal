"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  UserPlus,
  CreditCard,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Search,
  Bell,
  Calendar,
  Zap,
} from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { toast } from "sonner";
import { getReceptionistDashboardStats } from "@/server/actions/receptionist-actions";
import { SkeletonStatGrid } from "@/components/loaders/eagle-loader";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Receptionist Dashboard
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
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ReceptionistDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [checkInQuery, setCheckInQuery] = useState("");
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      const res = await getReceptionistDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
        setRecentCheckIns(res.data.recentCheckIns || []);
      } else {
        toast.error("Failed to load stats.");
      }
      setIsLoading(false);
    }
    loadStats();
  }, []);

  const handleQuickCheckIn = () => {
    if (!checkInQuery.trim()) {
      toast.error("Please enter member name or ID");
      return;
    }
    toast.success(`Checked in ${checkInQuery}`);
    setCheckInQuery("");
  };

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
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Reception <span className="text-brand-orange">Desk</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Quick actions for daily operations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-info-soft border border-info/20">
          <Clock className="w-3 h-3 text-info" />
          <span className="text-xs text-info font-bold tracking-wide">
            {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          icon={<QrCode className="w-6 h-6" />}
          label="Quick Check-In"
          description="Scan QR or search member"
          color="orange"
          href="/receptionist/check-in"
        />
        <QuickActionCard
          icon={<UserPlus className="w-6 h-6" />}
          label="Walk-In Register"
          description="New member registration"
          color="success"
          href="/receptionist/walk-in"
        />
        <QuickActionCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Collect Payment"
          description="Record cash/card/UPI"
          color="info"
          href="/receptionist/payments"
        />
        <QuickActionCard
          icon={<Users className="w-6 h-6" />}
          label="View Members"
          description="Search & view profiles"
          color="navy"
          href="/receptionist/members"
        />
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Checked In Today"
          value={stats?.todayCheckIns || 0}
          trend="+12"
          trendUp
          color="success"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Today's Collection"
          value={formatCurrency(stats?.todayCollection || 0, { showSymbol: true, decimals: 0 })}
          color="orange"
        />
        <StatCard
          icon={<UserPlus className="w-6 h-6" />}
          label="New Registrations"
          value={stats?.newWalkIns || 0}
          color="info"
        />
        <StatCard
          icon={<Bell className="w-6 h-6" />}
          label="Pending Dues"
          value={stats?.pendingPayments || 0}
          color="danger"
          subtitle="Follow-up needed"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Check-In */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="surface-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-orange-soft flex items-center justify-center">
                <QrCode className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Quick Check-In</h3>
                <p className="text-sm text-txt-secondary">Search by name, phone, or member ID</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
                <input
                  type="text"
                  placeholder="Enter member name or ID..."
                  value={checkInQuery}
                  onChange={(e) => setCheckInQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickCheckIn()}
                  className="w-full bg-surface-sunken border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-txt-tertiary outline-none focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/20 transition-all"
                />
              </div>
              <button
                onClick={handleQuickCheckIn}
                className="px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Check In
              </button>
            </div>

            {/* Recent Check-Ins */}
            <div>
              <h4 className="text-xs font-bold text-txt-tertiary uppercase tracking-wider mb-4">
                Recent Activity
              </h4>
              <div className="space-y-3">
                {recentCheckIns.map((checkIn, index) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                          checkIn.status === "checked-in"
                            ? "bg-success text-white shadow-sm"
                            : "bg-surface-elevated text-txt-secondary"
                        )}
                      >
                        {checkIn.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{checkIn.name}</p>
                        <p className="text-xs font-medium text-txt-tertiary flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {checkIn.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-3 py-1 rounded-full font-bold tracking-wide uppercase",
                        checkIn.status === "checked-in"
                          ? "bg-success-soft text-success"
                          : "bg-surface-elevated text-txt-secondary"
                      )}
                    >
                      {checkIn.status === "checked-in" ? "Checked In" : "Checked Out"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Summary */}
        <motion.div variants={itemVariants}>
          <div className="surface-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-info-soft flex items-center justify-center">
                <Calendar className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Today's Summary</h3>
                <p className="text-sm text-txt-secondary">Overview for {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
            </div>

            <div className="space-y-3">
              <SummaryRow
                icon={<Users className="w-5 h-5 text-txt-secondary" />}
                label="Total Check-ins"
                value={stats?.todayCheckIns?.toString() || "0"}
                positive
              />
              <SummaryRow
                icon={<CreditCard className="w-5 h-5 text-txt-secondary" />}
                label="Revenue"
                value={formatCurrency(stats?.todayCollection || 0, { showSymbol: true, decimals: 0 })}
                positive
              />
              <SummaryRow
                icon={<UserPlus className="w-5 h-5 text-txt-secondary" />}
                label="New Members"
                value={stats?.newWalkIns?.toString() || "0"}
                positive
              />
              <SummaryRow
                icon={<Zap className="w-5 h-5 text-txt-secondary" />}
                label="Peak Hour"
                value="6:00 PM"
                neutral
              />
              <SummaryRow
                icon={<TrendingUp className="w-5 h-5 text-txt-secondary" />}
                label="Occupancy"
                value="78%"
                positive
              />
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex items-center justify-between text-sm font-medium text-txt-secondary mb-2">
                <span>Shift started at</span>
                <span className="text-foreground">6:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-txt-secondary">
                <span>Shift ends at</span>
                <span className="text-foreground">2:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Quick Action Card
// ═══════════════════════════════════════════════════════════════

function QuickActionCard({
  icon,
  label,
  description,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: "orange" | "success" | "info" | "navy";
  href: string;
}) {
  const colorMap = {
    orange: "bg-brand-orange-soft text-brand-orange",
    success: "bg-success-soft text-success",
    info: "bg-info-soft text-info",
    navy: "bg-brand-navy-soft text-brand-navy",
  };

  return (
    <motion.a
      href={href}
      className={cn(
        "group flex flex-col p-6 rounded-2xl surface-card border-2 border-transparent",
        "hover:border-border transition-all duration-300",
        "active:scale-[0.98] hover:shadow-lg"
      )}
      whileHover={{ y: -4 }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
          colorMap[color]
        )}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{label}</h3>
      <p className="text-sm font-medium text-txt-secondary">{description}</p>
      <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-txt-tertiary group-hover:text-brand-orange transition-colors">
        <span>Open</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.a>
  );
}

// ═══════════════════════════════════════════════════════════════
// Summary Row
// ═══════════════════════════════════════════════════════════════

function SummaryRow({
  icon,
  label,
  value,
  change,
  positive,
  neutral,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-txt-tertiary tracking-wide uppercase mb-0.5">{label}</p>
          <p className="text-base font-bold text-foreground">{value}</p>
        </div>
      </div>
      {change && (
        <span
          className={cn(
            "text-xs px-2.5 py-1 rounded-full font-bold",
            positive ? "bg-success-soft text-success" : neutral ? "bg-surface-elevated text-txt-secondary" : "bg-danger-soft text-danger"
          )}
        >
          {change}
        </span>
      )}
    </div>
  );
}