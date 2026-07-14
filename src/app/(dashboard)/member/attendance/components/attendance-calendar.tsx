"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Zap,
  CheckCircle2,
  Trophy,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AttendanceLog {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  branch: { name: string } | null;
}

interface Props {
  initialLogs: AttendanceLog[];
  stats: any;
}

export function AttendanceCalendar({ initialLogs, stats }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState(initialLogs);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const getLogsForDay = (day: number) => {
    return logs.filter((log) => {
      const d = new Date(log.checkIn);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="w-full space-y-12 duration-700 animate-in fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total Check-ins"
          value={stats.total}
          icon={<CheckCircle2 className="h-6 w-6 text-success" />}
          desc="Lifetime consistency"
        />
        <StatCard
          label="Active Streak"
          value={`${stats.streak} Days`}
          icon={<Zap className="h-6 w-6 text-brand-orange" />}
          desc="Unstoppable momentum"
        />
        <StatCard
          label="This Month"
          value={stats.thisMonth}
          icon={<Activity className="h-6 w-6 text-info" />}
          desc="Current cycle performance"
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Calendar Core */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-display text-3xl font-bold text-foreground">
                {monthName} <span className="text-brand-orange">{year}</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-txt-tertiary">
                Temporal Log Archive
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={prevMonth}
                className="h-12 w-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all hover:bg-surface-elevated"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={nextMonth}
                className="h-12 w-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all hover:bg-surface-elevated"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="surface-card relative overflow-hidden rounded-[3rem] border border-border/50 p-4 shadow-2xl md:p-8">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute right-0 top-0 p-12 opacity-[0.02]">
              <CalendarIcon className="h-96 w-96" />
            </div>

            <div className="mb-6 grid grid-cols-7">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-txt-tertiary"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="relative z-10 grid grid-cols-7 gap-2 md:gap-4">
              {padding.map((i) => (
                <div
                  key={`pad-${i}`}
                  className="aspect-square rounded-2xl bg-surface-sunken/20 opacity-20"
                />
              ))}
              {days.map((day) => {
                const dayLogs = getLogsForDay(day);
                const isToday =
                  day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                const hasLogs = dayLogs.length > 0;

                return (
                  <div
                    key={day}
                    className={cn(
                      "group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border transition-all md:rounded-3xl",
                      hasLogs
                        ? "border-brand-orange/30 bg-brand-orange/10 shadow-brand-glow"
                        : "border-border/50 bg-surface-sunken/40 hover:border-border",
                      isToday && "ring-2 ring-brand-orange ring-offset-4 ring-offset-background",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold",
                        hasLogs ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    >
                      {day}
                    </span>
                    {hasLogs && (
                      <div className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_#F26522]" />
                    )}

                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-4 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                      {hasLogs ? (
                        <div className="w-48 space-y-3 rounded-2xl border border-white/10 bg-brand-navy/95 p-4 shadow-2xl backdrop-blur-md">
                          {dayLogs.map((log) => (
                            <div key={log.id} className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                                Logged Access
                              </p>
                              <div className="flex items-center gap-2 text-xs font-bold text-white">
                                <Clock className="h-3 w-3" />
                                {mounted
                                  ? new Date(log.checkIn).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "--:--"}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-medium text-white/60">
                                <MapPin className="h-3 w-3" />
                                {log.branch?.name || "Main Hub"}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: Details / Milestones */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
              Live Feed
            </h3>
            <div className="surface-card flex h-[500px] flex-col rounded-[2.5rem] border border-border/50 p-6">
              <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="group flex items-center justify-between rounded-2xl border border-border/30 bg-surface-sunken/50 p-5 transition-all hover:border-brand-orange/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated">
                        <CheckCircle2 className="h-5 w-5 text-success transition-transform group-hover:scale-110" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Entry Authorized</p>
                        <p className="text-[10px] font-medium text-txt-tertiary">
                          {mounted
                            ? `${new Date(log.checkIn).toLocaleDateString()} • ${new Date(log.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                            : "--:--"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-txt-tertiary transition-transform group-hover:text-brand-orange" />
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="py-20 text-center">
                    <Activity className="mx-auto mb-4 h-10 w-10 text-txt-tertiary/20" />
                    <p className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                      Archive Empty
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-border/50 pt-6">
                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-brand-navy/50 p-4">
                  <Trophy className="h-8 w-8 text-brand-orange" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Monthly Goal</p>
                    <p className="text-[10px] font-medium text-txt-tertiary">
                      15/20 Sessions complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, desc }: any) {
  return (
    <div className="surface-card group flex items-center gap-5 rounded-[2rem] border border-border/50 p-6 shadow-xl transition-all hover:border-brand-orange/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-sunken transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div>
        <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
          {label}
        </p>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-[9px] font-medium text-txt-tertiary">{desc}</p>
      </div>
    </div>
  );
}
