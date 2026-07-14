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
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { bookClass } from "@/actions/admin/class-actions";
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
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls: any) => (
          <motion.div
            key={cls.id}
            layoutId={`class-${cls.id}`}
            className="surface-card group flex flex-col rounded-3xl border border-border/50 p-6 transition-all hover:border-brand-orange/30"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded border border-brand-orange/20 bg-brand-orange/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                {cls.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                <Clock className="h-3.5 w-3.5" />
                {cls.duration} min
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-brand-orange">
              {cls.name}
            </h3>

            <p className="mb-6 line-clamp-2 flex-1 text-sm text-txt-secondary">
              {cls.description ||
                "Transform your body with our high-intensity group training sessions."}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-orange/20 bg-surface-elevated text-[10px] font-black text-brand-orange">
                  {cls.trainer?.user?.firstName?.[0]}
                  {cls.trainer?.user?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight text-foreground">
                    {cls.trainer?.user?.firstName} {cls.trainer?.user?.lastName}
                  </p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Expert Coach
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClass(cls)}
                className="flex items-center gap-2 rounded-xl bg-surface-elevated px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-brand-orange hover:text-white"
              >
                View Schedule
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schedule Modal */}
      {mounted &&
        createPortal(
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
                  className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-border/50 bg-surface-card shadow-2xl"
                >
                  {/* Modal Header */}
                  <div className="flex items-start justify-between p-8 pb-0">
                    <div className="space-y-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-full bg-brand-orange px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                          {selectedClass.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                          <Clock className="h-3.5 w-3.5" />
                          {selectedClass.duration} min
                        </span>
                      </div>
                      <h2 className="font-display text-3xl font-bold text-foreground">
                        {selectedClass.name} <span className="text-brand-orange">Schedule</span>
                      </h2>
                      <p className="text-sm text-txt-secondary">{selectedClass.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedClass(null)}
                      aria-label="Close modal"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-txt-tertiary transition-all hover:text-brand-orange"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                        <Calendar className="h-3 w-3" />
                        Weekly Sessions
                      </h4>

                      <div className="grid grid-cols-1 gap-3">
                        {selectedClass.schedules.length === 0 ? (
                          <div className="surface-sunken rounded-2xl border border-dashed py-10 text-center">
                            <p className="text-xs font-bold text-txt-tertiary">
                              No sessions scheduled for this week.
                            </p>
                          </div>
                        ) : (
                          selectedClass.schedules.map((schedule: any) => (
                            <div
                              key={schedule.id}
                              className="group flex items-center justify-between rounded-2xl border border-border/50 bg-surface-sunken p-5 transition-all hover:border-brand-orange/30"
                            >
                              <div className="flex items-center gap-5">
                                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface-card">
                                  <p className="text-[8px] font-black uppercase text-txt-tertiary">
                                    {DAYS[schedule.dayOfWeek].slice(0, 3)}
                                  </p>
                                  <p className="text-xs font-bold text-foreground">
                                    {schedule.startTime}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground">
                                    {DAYS[schedule.dayOfWeek]}
                                  </p>
                                  <div className="mt-1 flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-[10px] text-txt-tertiary">
                                      <MapPin className="h-2.5 w-2.5" />
                                      {schedule.room || "Studio A"}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-txt-tertiary">
                                      <Users className="h-2.5 w-2.5" />
                                      {schedule._count.bookings} / {selectedClass.maxCapacity}{" "}
                                      Booked
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <Button
                                onClick={() => handleBook(schedule.id)}
                                disabled={
                                  isBooking || schedule._count.bookings >= selectedClass.maxCapacity
                                }
                                className={cn(
                                  "h-10 rounded-xl px-6 text-xs font-bold shadow-sm transition-all",
                                  schedule._count.bookings >= selectedClass.maxCapacity
                                    ? "bg-surface-elevated text-txt-tertiary"
                                    : "hover:bg-brand-orange-dark bg-brand-orange text-white",
                                )}
                              >
                                {bookingScheduleId === schedule.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
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
                  <div className="mt-auto p-8 pt-0">
                    <div className="flex items-start gap-3 rounded-2xl border border-brand-orange/10 bg-brand-orange/5 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                      <p className="text-[10px] leading-relaxed text-txt-secondary">
                        <span className="font-bold uppercase text-brand-orange">
                          Member Policy:
                        </span>{" "}
                        Cancellations must be made at least 2 hours before the session. Failure to
                        attend booked classes may result in temporary booking restrictions.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
