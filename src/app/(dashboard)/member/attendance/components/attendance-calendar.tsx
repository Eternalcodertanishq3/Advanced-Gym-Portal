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
  Activity
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

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getLogsForDay = (day: number) => {
    return logs.filter(log => {
      const d = new Date(log.checkIn);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Check-ins" 
          value={stats.total} 
          icon={<CheckCircle2 className="w-6 h-6 text-success" />} 
          desc="Lifetime consistency"
        />
        <StatCard 
          label="Active Streak" 
          value={`${stats.streak} Days`} 
          icon={<Zap className="w-6 h-6 text-brand-orange" />} 
          desc="Unstoppable momentum"
        />
        <StatCard 
          label="This Month" 
          value={stats.thisMonth} 
          icon={<Activity className="w-6 h-6 text-info" />} 
          desc="Current cycle performance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Calendar Core */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h2 className="text-3xl font-display font-bold text-foreground">
                   {monthName} <span className="text-brand-orange">{year}</span>
                 </h2>
                 <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.3em]">Temporal Log Archive</p>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" onClick={prevMonth} className="w-12 h-12 rounded-2xl border-border/50 bg-surface-sunken/50 hover:bg-surface-elevated transition-all">
                    <ChevronLeft className="w-5 h-5" />
                 </Button>
                 <Button variant="outline" onClick={nextMonth} className="w-12 h-12 rounded-2xl border-border/50 bg-surface-sunken/50 hover:bg-surface-elevated transition-all">
                    <ChevronRight className="w-5 h-5" />
                 </Button>
              </div>
           </div>

           <div className="surface-card p-4 md:p-8 rounded-[3rem] border border-border/50 shadow-2xl relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <CalendarIcon className="w-96 h-96" />
              </div>

              <div className="grid grid-cols-7 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-txt-tertiary uppercase tracking-widest py-4">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 md:gap-4 relative z-10">
                {padding.map(i => (
                  <div key={`pad-${i}`} className="aspect-square rounded-2xl bg-surface-sunken/20 opacity-20" />
                ))}
                {days.map(day => {
                  const dayLogs = getLogsForDay(day);
                  const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                  const hasLogs = dayLogs.length > 0;

                  return (
                    <div 
                      key={day} 
                      className={cn(
                        "aspect-square rounded-2xl md:rounded-3xl border flex flex-col items-center justify-center relative group transition-all cursor-pointer",
                        hasLogs 
                          ? "bg-brand-orange/10 border-brand-orange/30 shadow-brand-glow" 
                          : "bg-surface-sunken/40 border-border/50 hover:border-border",
                        isToday && "ring-2 ring-brand-orange ring-offset-4 ring-offset-background"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-bold",
                        hasLogs ? "text-brand-orange" : "text-txt-tertiary"
                      )}>
                        {day}
                      </span>
                      {hasLogs && (
                        <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_#F26522]" />
                      )}
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                         {hasLogs ? (
                            <div className="bg-brand-navy/95 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl w-48 space-y-3">
                               {dayLogs.map(log => (
                                 <div key={log.id} className="space-y-1">
                                    <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Logged Access</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                       <Clock className="w-3 h-3" />
                                       {mounted ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium">
                                       <MapPin className="w-3 h-3" />
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
              <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] ml-1">Live Feed</h3>
              <div className="surface-card p-6 rounded-[2.5rem] border border-border/50 flex flex-col h-[500px]">
                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="p-5 rounded-2xl bg-surface-sunken/50 border border-border/30 flex items-center justify-between group hover:border-brand-orange/30 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center">
                               <CheckCircle2 className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-foreground">Entry Authorized</p>
                               <p className="text-[10px] text-txt-tertiary font-medium">
                                 {mounted ? `${new Date(log.checkIn).toLocaleDateString()} • ${new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "--:--"}
                               </p>
                            </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-txt-tertiary group-hover:text-brand-orange transition-transform" />
                      </div>
                    ))}

                    {logs.length === 0 && (
                      <div className="py-20 text-center">
                         <Activity className="w-10 h-10 text-txt-tertiary/20 mx-auto mb-4" />
                         <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Archive Empty</p>
                      </div>
                    )}
                 </div>
                 
                 <div className="pt-6 mt-4 border-t border-border/50">
                    <div className="p-4 rounded-2xl bg-brand-navy/50 border border-border/50 flex items-center gap-4">
                       <Trophy className="w-8 h-8 text-brand-orange" />
                       <div>
                          <p className="text-xs font-bold text-foreground">Monthly Goal</p>
                          <p className="text-[10px] text-txt-tertiary font-medium">15/20 Sessions complete</p>
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
    <div className="surface-card p-6 rounded-[2rem] border border-border/50 shadow-xl flex items-center gap-5 hover:border-brand-orange/30 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-surface-sunken flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        <p className="text-[9px] text-txt-tertiary font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}
