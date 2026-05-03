import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "My Bookings | Eagle Gym",
  description: "View and manage your gym class reservations.",
};

export default async function MyBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id }
  });

  if (!member) redirect("/member");

  const bookings = await prisma.classBooking.findMany({
    where: { memberId: member.id },
    orderBy: { bookedAt: 'desc' },
    include: {
      schedule: {
        include: {
          class: {
            include: {
              trainer: {
                include: { user: { select: { firstName: true, lastName: true, avatar: true } } }
              }
            }
          }
        }
      }
    }
  });

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="w-full h-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          My <span className="text-brand-orange">Bookings</span>
        </h1>
        <p className="text-sm text-txt-secondary font-medium">Keep track of your upcoming and past class reservations.</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="py-20 text-center surface-card border-dashed border-2">
            <p className="text-txt-tertiary">You haven't booked any classes yet.</p>
          </div>
        ) : (
          bookings.map((booking: any) => (
            <div key={booking.id} className="surface-card p-5 group hover:border-brand-orange/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-surface-elevated flex flex-col items-center justify-center border border-border/50 shrink-0">
                    <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-tighter">
                      {days[booking.schedule.dayOfWeek].substring(0, 3)}
                    </span>
                    <span className="text-xl font-display font-bold text-brand-orange leading-none">
                      {booking.schedule.startTime.split(':')[0]}
                    </span>
                    <span className="text-[8px] font-bold text-txt-tertiary uppercase">
                      {Number(booking.schedule.startTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-brand-orange transition-colors">
                        {booking.schedule.class.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        booking.status === "CONFIRMED" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-3">
                      <div className="flex items-center gap-2 text-xs text-txt-secondary">
                        <Clock className="w-3.5 h-3.5 text-txt-tertiary" />
                        <span className="font-medium">{booking.schedule.startTime} ({booking.schedule.class.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-txt-secondary">
                        <MapPin className="w-3.5 h-3.5 text-txt-tertiary" />
                        <span className="font-medium">{booking.schedule.room || "Studio A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-txt-secondary">
                        <User className="w-3.5 h-3.5 text-txt-tertiary" />
                        <span className="font-medium">
                          {booking.schedule.class.trainer.user.firstName} {booking.schedule.class.trainer.user.lastName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button className="text-xs font-bold text-txt-tertiary hover:text-danger transition-colors px-4 py-2 rounded-lg bg-surface-sunken">
                    Cancel Booking
                  </button>
                  <button 
                    aria-label="View class details"
                    className="p-2.5 rounded-xl bg-surface-elevated text-txt-tertiary hover:text-brand-orange transition-all border border-border/50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
