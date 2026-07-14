"use client";

import { motion } from "framer-motion";
import {
  UserCheck,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  attendance: any[];
}

export function StaffAttendanceClient({ attendance }: Props) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 duration-500 animate-in fade-in md:p-10">
      <div>
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
            <UserCheck className="h-5 w-5 text-brand-orange" />
          </div>
          Staff <span className="text-brand-orange">Attendance</span>
        </h1>
        <p className="mt-1 text-sm text-txt-secondary">
          Monitor daily presence and shift timings of gym employees.
        </p>
      </div>

      <div className="space-y-4">
        {attendance.length === 0 ? (
          <div className="surface-card rounded-[2.5rem] border border-dashed border-border py-20 text-center">
            <p className="text-sm text-txt-tertiary">No staff attendance records for today.</p>
          </div>
        ) : (
          attendance.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="surface-card group flex flex-col justify-between gap-6 rounded-[2rem] border border-border/50 p-6 transition-all hover:border-brand-orange/20 md:flex-row md:items-center"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-surface-sunken">
                    {record.user.avatar ? (
                      <img src={record.user.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-txt-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-success">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="text-lg font-bold leading-none text-foreground">
                      {record.user.firstName} {record.user.lastName}
                    </h3>
                    <Badge className="h-5 border-brand-orange/20 bg-brand-orange/10 text-[9px] font-bold uppercase text-brand-orange">
                      {record.user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-txt-tertiary">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(record.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Staff Duty
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 self-end md:self-center">
                <div className="text-right">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Check In
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground">
                    {record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-txt-tertiary" />

                <div className="text-right">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Check Out
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground">
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "On Duty"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
