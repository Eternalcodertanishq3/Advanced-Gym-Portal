"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  UserCheck,
  ChevronRight,
  Dumbbell,
  Flame,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Upcoming Schedule Widget
// ═══════════════════════════════════════════════════════════════

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: "class" | "pt" | "event";
  trainer?: string;
  room?: string;
  attendees?: number;
  maxCapacity?: number;
  status: "upcoming" | "ongoing" | "completed";
}

const statusConfig = {
  completed: {
    icon: Circle,
    color: "text-muted-foreground/40",
    bg: "bg-muted/30",
    label: "Done",
  },
  ongoing: {
    icon: Flame,
    color: "text-success",
    bg: "bg-success/10",
    label: "Live",
  },
  upcoming: {
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Upcoming",
  },
};

const typeConfig = {
  class: { icon: Dumbbell, label: "Class" },
  pt: { icon: UserCheck, label: "PT Session" },
  event: { icon: Calendar, label: "Event" },
};

export function UpcomingSchedule({ data = [] }: { data?: ScheduleItem[] }) {
  const today = new Date();
  
  if (data.length === 0) {
    return (
      <div className="surface-card p-6 h-full flex flex-col items-center justify-center min-h-[350px]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-bold text-foreground/60">No classes today</h3>
          <p className="text-xs text-muted-foreground/40">The schedule is clear for today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Today&apos;s Schedule</h3>
            <p className="text-xs text-muted-foreground">{formatDate(today, "EEEE, dd MMM")}</p>
          </div>
        </div>
        <Link
          href="/admin/classes"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-all"
        >
          View All
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative flex-1">
        {/* Timeline line - centered at 20px (half of w-10 icon) */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[0.5px] bg-border/40" />

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {data.map((item, index) => {
            const status = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.upcoming;
            const type = typeConfig[item.type as keyof typeof typeConfig];
            const StatusIcon = status.icon;
            const TypeIcon = type.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative flex items-start gap-4 p-3 rounded-xl transition-all duration-200",
                  item.status === "ongoing" && "bg-success/5 border border-success/10",
                  item.status === "upcoming" && "hover:bg-muted/50"
                )}
              >
                {/* Status icon container - Using solid background to break the line */}
                <div
                  className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-[3px] border-card shadow-sm bg-card",
                  )}
                >
                  <div className={cn("w-full h-full rounded-full flex items-center justify-center", status.bg)}>
                    <StatusIcon className={cn("w-4 h-4", status.color)} />
                  </div>
                  {item.status === "ongoing" && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-success/20 -z-10" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={cn("text-[11px] font-bold tracking-tight", status.color)}>
                      {item.time}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                        status.bg,
                        status.color
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                      <TypeIcon className="w-3 h-3" />
                      {type.label}
                    </span>
                    {item.trainer && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                        <UserCheck className="w-3 h-3" />
                        {item.trainer}
                      </span>
                    )}
                  </div>
                  
                  {item.attendees !== undefined && item.maxCapacity && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                        <span className="text-muted-foreground">
                          {item.attendees}/{item.maxCapacity} Seats
                        </span>
                        <span
                          className={cn(
                            item.attendees / item.maxCapacity > 0.9
                              ? "text-destructive"
                              : "text-success"
                          )}
                        >
                          {Math.round((item.attendees / item.maxCapacity) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.attendees / item.maxCapacity > 0.9
                              ? "bg-destructive"
                              : "bg-success"
                          )}
                          style={{
                            ["--progress-width" as any]: `${(item.attendees / item.maxCapacity) * 100}%`,
                            width: "var(--progress-width)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer summary */}
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-base font-bold text-foreground">{data.length}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-success">{data.filter(i => i.status === 'ongoing').length}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-primary">{data.filter(i => i.status === 'upcoming').length}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upcoming</p>
          </div>
        </div>
        <Link
          href="/admin/classes"
        >
          <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
}