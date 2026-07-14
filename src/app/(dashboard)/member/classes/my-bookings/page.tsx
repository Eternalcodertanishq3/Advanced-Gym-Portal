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
    where: { userId: session.user.id },
  });

  if (!member) redirect("/member");

  const bookings = await prisma.classBooking.findMany({
    where: { memberId: member.id },
    orderBy: { bookedAt: "desc" },
    include: {
      schedule: {
        include: {
          class: {
            include: {
              trainer: {
                include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
              },
            },
          },
        },
      },
    },
  });

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="h-full w-full space-y-8 p-6">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
          My <span className="text-brand-orange">Bookings</span>
        </h1>
        <p className="text-sm font-medium text-txt-secondary">
          Keep track of your upcoming and past class reservations.
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="surface-card border-2 border-dashed py-20 text-center">
            <p className="text-txt-tertiary">You haven't booked any classes yet.</p>
          </div>
        ) : (
          bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="surface-card group p-5 transition-all hover:border-brand-orange/30"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface-elevated">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-txt-tertiary">
                      {days[booking.schedule.dayOfWeek].substring(0, 3)}
                    </span>
                    <span className="font-display text-xl font-bold leading-none text-brand-orange">
                      {booking.schedule.startTime.split(":")[0]}
                    </span>
                    <span className="text-[8px] font-bold uppercase text-txt-tertiary">
                      {Number(booking.schedule.startTime.split(":")[0]) >= 12 ? "PM" : "AM"}
                    </span>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-brand-orange">
                        {booking.schedule.class.name}
                      </h3>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          booking.status === "CONFIRMED"
                            ? "bg-success-soft text-success"
                            : "bg-danger-soft text-danger"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-xs text-txt-secondary">
                        <Clock className="h-3.5 w-3.5 text-txt-tertiary" />
                        <span className="font-medium">
                          {booking.schedule.startTime} ({booking.schedule.class.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-txt-secondary">
                        <MapPin className="h-3.5 w-3.5 text-txt-tertiary" />
                        <span className="font-medium">{booking.schedule.room || "Studio A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-txt-secondary">
                        <User className="h-3.5 w-3.5 text-txt-tertiary" />
                        <span className="font-medium">
                          {booking.schedule.class.trainer.user.firstName}{" "}
                          {booking.schedule.class.trainer.user.lastName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button className="rounded-lg bg-surface-sunken px-4 py-2 text-xs font-bold text-txt-tertiary transition-colors hover:text-danger">
                    Cancel Booking
                  </button>
                  <button
                    aria-label="View class details"
                    className="rounded-xl border border-border/50 bg-surface-elevated p-2.5 text-txt-tertiary transition-all hover:text-brand-orange"
                  >
                    <ChevronRight className="h-5 w-5" />
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
