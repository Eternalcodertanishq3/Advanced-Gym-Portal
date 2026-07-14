"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  TrendingUp,
  UserCheck,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn, formatNumber } from "@/lib/utils";
import { LiveOccupancy } from "@/app/(dashboard)/admin/components/live-occupancy";
import { getLiveAttendanceData } from "@/actions/admin/live-attendance-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Live Attendance Dashboard
// ═══════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminLiveAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    const res = await getLiveAttendanceData();
    if (res.success) {
      setData(res.data);
    } else {
      toast.error("Failed to update live data");
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
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
      {/* Header Area */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Live Attendance</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor real-time gym occupancy and recent check-ins.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button size="sm" className="gap-2 bg-primary font-bold text-white hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Live Occupancy Card */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <LiveOccupancy
            current={data?.live.current}
            capacity={data?.live.capacity}
            lastHour={data?.live.lastHour}
            peakToday={data?.live.peakToday}
          />
        </motion.div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
          {/* Daily Total Unique */}
          <motion.div
            variants={itemVariants}
            className="surface-card flex flex-col justify-between p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Unique Visitors
                </p>
                <h3 className="font-display text-3xl font-bold text-foreground">
                  {data?.stats.totalUniqueToday}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">
                <span className="font-bold text-success">+12%</span> vs yesterday
              </span>
            </div>
          </motion.div>

          {/* Average Stay */}
          <motion.div
            variants={itemVariants}
            className="surface-card flex flex-col justify-between p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Average Stay
                </p>
                <h3 className="font-display text-3xl font-bold text-foreground">
                  {data?.stats.averageStayMinutes}m
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Optimal duration: 45-60m</span>
            </div>
          </motion.div>

          {/* Busy Hour Prediction */}
          <motion.div variants={itemVariants} className="surface-card p-6 md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-bold text-foreground">
                <Activity className="h-4 w-4 text-primary" />
                Peak Hour Prediction
              </h4>
              <span className="text-xs text-muted-foreground">Next 24 Hours</span>
            </div>
            <div className="flex h-24 items-end gap-1 px-2">
              {[
                30, 40, 20, 10, 5, 2, 8, 25, 45, 60, 80, 95, 70, 50, 40, 60, 85, 90, 65, 40, 30, 20,
                15, 10,
              ].map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm transition-all duration-500",
                    i === 17 ? "bg-primary shadow-[0_0_10px_rgba(232,93,38,0.5)]" : "bg-muted/30",
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between px-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
              <span>6 AM</span>
              <span>12 PM</span>
              <span className="text-primary">6 PM (Peak)</span>
              <span>12 AM</span>
              <span>6 AM</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Table/Feed */}
      <motion.div variants={itemVariants} className="surface-card">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Check-ins</h3>
              <p className="text-xs text-muted-foreground">
                Chronological log of today&apos;s entries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search member..."
                className="h-9 w-[200px] border-border/50 bg-muted/20 pl-9 sm:w-[250px]"
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/20">
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Plan & Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Time In
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Mode
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data?.recentCheckins.map((checkin: any) => (
                <tr key={checkin.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        {checkin.avatar ? (
                          <img
                            src={checkin.avatar}
                            alt={checkin.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/5 font-bold text-primary">
                            {checkin.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                          {checkin.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{checkin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">{checkin.plan}</p>
                      <span
                        className={cn(
                          "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                          checkin.status === "ACTIVE"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger",
                        )}
                      >
                        {checkin.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">
                        {format(new Date(checkin.time), "hh:mm a")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-muted/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {checkin.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-bold text-primary hover:bg-primary/5 hover:text-primary"
                    >
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.recentCheckins.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">No check-ins recorded today.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center border-t border-border p-4">
          <Button
            variant="link"
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            View All History
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
