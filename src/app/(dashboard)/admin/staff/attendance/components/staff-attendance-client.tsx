"use client";

import { motion } from "framer-motion";
import { 
  UserCheck, 
  Clock, 
  User, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  attendance: any[];
}

export function StaffAttendanceClient({ attendance }: Props) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
             <UserCheck className="w-5 h-5 text-brand-orange" />
          </div>
          Staff <span className="text-brand-orange">Attendance</span>
        </h1>
        <p className="text-sm text-txt-secondary mt-1">Monitor daily presence and shift timings of gym employees.</p>
      </div>

      <div className="space-y-4">
        {attendance.length === 0 ? (
          <div className="text-center py-20 surface-card rounded-[2.5rem] border border-dashed border-border">
            <p className="text-sm text-txt-tertiary">No staff attendance records for today.</p>
          </div>
        ) : (
          attendance.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="surface-card p-6 rounded-[2rem] border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-orange/20 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-surface-sunken overflow-hidden border border-border/50 shrink-0">
                    {record.user.avatar ? (
                      <img src={record.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-txt-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center border-2 border-background">
                     <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-foreground leading-none">{record.user.firstName} {record.user.lastName}</h3>
                    <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 text-[9px] font-bold uppercase h-5">
                       {record.user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-txt-tertiary">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(record.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      Staff Duty
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 self-end md:self-center">
                <div className="text-right">
                   <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mb-1">Check In</p>
                   <p className="text-sm font-bold text-foreground font-mono">
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                   </p>
                </div>
                
                <ArrowRight className="w-4 h-4 text-txt-tertiary" />

                <div className="text-right">
                   <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mb-1">Check Out</p>
                   <p className="text-sm font-bold text-foreground font-mono">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "On Duty"}
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
