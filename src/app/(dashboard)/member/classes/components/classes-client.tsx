"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  MapPin,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { bookClass } from "@/server/actions/class-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  classes: any[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ClassesClient({ classes }: Props) {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [bookingScheduleId, setBookingScheduleId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleBook = async (scheduleId: string) => {
    setBookingScheduleId(scheduleId);
    setIsBooking(true);
    try {
      const res = await bookClass(scheduleId);
      if (res.success) {
        toast.success("Spot secured! See you at the session.");
        setSelectedClass(null);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setIsBooking(false);
      setBookingScheduleId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls: any) => (
          <motion.div 
            key={cls.id} 
            layoutId={`class-${cls.id}`}
            className="surface-card p-6 flex flex-col group border border-border/50 hover:border-brand-orange/30 transition-all rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                {cls.category}
              </span>
              <span className="text-xs font-bold text-txt-tertiary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {cls.duration} min
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-orange transition-colors">
              {cls.name}
            </h3>
            
            <p className="text-sm text-txt-secondary line-clamp-2 mb-6 flex-1">
              {cls.description || "Transform your body with our high-intensity group training sessions."}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-[10px] font-black text-brand-orange border border-brand-orange/20">
                  {cls.trainer?.user?.firstName?.[0]}{cls.trainer?.user?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">
                    {cls.trainer?.user?.firstName} {cls.trainer?.user?.lastName}
                  </p>
                  <p className="text-[8px] text-txt-tertiary uppercase font-bold tracking-widest mt-0.5">Expert Coach</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClass(cls)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-brand-orange hover:text-white text-xs font-bold transition-all shadow-sm"
              >
                View Schedule
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schedule Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedClass && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedClass(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              
              <motion.div 
                layoutId={`class-${selectedClass.id}`}
                className="relative w-full max-w-2xl bg-surface-card rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Modal Header */}
                <div className="p-8 pb-0 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-orange text-white">
                        {selectedClass.category}
                      </span>
                      <span className="text-xs font-bold text-txt-tertiary flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedClass.duration} min
                      </span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-foreground">
                      {selectedClass.name} <span className="text-brand-orange">Schedule</span>
                    </h2>
                    <p className="text-sm text-txt-secondary">{selectedClass.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedClass(null)}
                    aria-label="Close modal"
                    className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-txt-tertiary hover:text-brand-orange transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Weekly Sessions
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {selectedClass.schedules.length === 0 ? (
                        <div className="py-10 text-center surface-sunken rounded-2xl border border-dashed">
                          <p className="text-xs text-txt-tertiary font-bold">No sessions scheduled for this week.</p>
                        </div>
                      ) : (
                        selectedClass.schedules.map((schedule: any) => (
                          <div 
                            key={schedule.id}
                            className="p-5 rounded-2xl bg-surface-sunken border border-border/50 flex items-center justify-between group hover:border-brand-orange/30 transition-all"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-surface-card flex flex-col items-center justify-center border border-border/50">
                                <p className="text-[8px] font-black text-txt-tertiary uppercase">{DAYS[schedule.dayOfWeek].slice(0, 3)}</p>
                                <p className="text-xs font-bold text-foreground">{schedule.startTime}</p>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{DAYS[schedule.dayOfWeek]}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] text-txt-tertiary flex items-center gap-1">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {schedule.room || "Studio A"}
                                  </span>
                                  <span className="text-[10px] text-txt-tertiary flex items-center gap-1">
                                    <Users className="w-2.5 h-2.5" />
                                    {schedule._count.bookings} / {selectedClass.maxCapacity} Booked
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Button 
                              onClick={() => handleBook(schedule.id)}
                              disabled={isBooking || schedule._count.bookings >= selectedClass.maxCapacity}
                              className={cn(
                                "rounded-xl font-bold px-6 h-10 text-xs shadow-sm transition-all",
                                schedule._count.bookings >= selectedClass.maxCapacity 
                                  ? "bg-surface-elevated text-txt-tertiary" 
                                  : "bg-brand-orange hover:bg-brand-orange-dark text-white"
                              )}
                            >
                              {bookingScheduleId === schedule.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : schedule._count.bookings >= selectedClass.maxCapacity ? (
                                "Waitlist"
                              ) : (
                                "Reserve Spot"
                              )}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 pt-0 mt-auto">
                  <div className="p-4 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <p className="text-[10px] text-txt-secondary leading-relaxed">
                      <span className="font-bold text-brand-orange uppercase">Member Policy:</span> Cancellations must be made at least 2 hours before the session. Failure to attend booked classes may result in temporary booking restrictions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
