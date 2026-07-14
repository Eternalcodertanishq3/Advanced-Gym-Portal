"use client";

import { motion } from "framer-motion";
import { Clock, Calendar, UserCheck, ChevronRight, Dumbbell, Flame, Circle } from "lucide-react";
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
      <div className="surface-card flex h-full min-h-[350px] flex-col items-center justify-center p-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-bold text-foreground/60">No classes today</h3>
          <p className="text-xs text-muted-foreground/40">The schedule is clear for today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card flex h-full flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Today&apos;s Schedule</h3>
            <p className="text-xs text-muted-foreground">{formatDate(today, "EEEE, dd MMM")}</p>
          </div>
        </div>
        <Link
          href="/admin/classes"
          className="flex items-center gap-1 text-xs font-bold text-primary transition-all hover:underline"
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative flex-1">
        {/* Timeline line - centered at 20px (half of w-10 icon) */}
        <div className="absolute bottom-2 left-[19px] top-2 w-[0.5px] bg-border/40" />

        <div className="scrollbar-thin max-h-[380px] space-y-2 overflow-y-auto pr-1">
          {data.map((item, index) => {
            const status =
              statusConfig[item.status as keyof typeof statusConfig] || statusConfig.upcoming;
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
                  "relative flex items-start gap-4 rounded-xl p-3 transition-all duration-200",
                  item.status === "ongoing" && "border border-success/10 bg-success/5",
                  item.status === "upcoming" && "hover:bg-muted/50",
                )}
              >
                {/* Status icon container - Using solid background to break the line */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-card bg-card shadow-sm",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-full w-full items-center justify-center rounded-full",
                      status.bg,
                    )}
                  >
                    <StatusIcon className={cn("h-4 w-4", status.color)} />
                  </div>
                  {item.status === "ongoing" && (
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-success/20" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className={cn("text-[11px] font-bold tracking-tight", status.color)}>
                      {item.time}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        status.bg,
                        status.color,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <h4 className="truncate text-sm font-bold text-foreground">{item.title}</h4>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                      <TypeIcon className="h-3 w-3" />
                      {type.label}
                    </span>
                    {item.trainer && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        <UserCheck className="h-3 w-3" />
                        {item.trainer}
                      </span>
                    )}
                  </div>

                  {item.attendees !== undefined && item.maxCapacity && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">
                          {item.attendees}/{item.maxCapacity} Seats
                        </span>
                        <span
                          className={cn(
                            item.attendees / item.maxCapacity > 0.9
                              ? "text-destructive"
                              : "text-success",
                          )}
                        >
                          {Math.round((item.attendees / item.maxCapacity) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.attendees / item.maxCapacity > 0.9
                              ? "bg-destructive"
                              : "bg-success",
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
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-base font-bold text-foreground">{data.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total
            </p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-success">
              {data.filter((i) => i.status === "ongoing").length}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Live
            </p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-primary">
              {data.filter((i) => i.status === "upcoming").length}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Upcoming
            </p>
          </div>
        </div>
        <Link href="/admin/classes">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[11px] font-bold uppercase tracking-wider"
          >
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
}
