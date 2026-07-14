import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Award,
  Star,
  Calendar,
  MessageSquare,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My Trainer | Eagle Gym",
  description: "Connect with your personal trainer and view your training history.",
};

export default async function TrainerPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      trainer: {
        include: {
          user: {
            select: { firstName: true, lastName: true, avatar: true, email: true, phone: true },
          },
        },
      },
    },
  });

  if (!member) redirect("/member");

  const trainer = member.trainer;

  return (
    <div className="h-full w-full space-y-8 p-6">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
          My <span className="text-brand-orange">Trainer</span>
        </h1>
        <p className="text-sm font-medium text-txt-secondary">
          Your dedicated partner in achieving your fitness goals.
        </p>
      </div>

      {!trainer ? (
        <div className="surface-card border-2 border-dashed py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
            <User className="h-8 w-8 text-txt-tertiary" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">No Trainer Assigned</h3>
          <p className="mx-auto mb-8 max-w-[300px] text-sm text-txt-tertiary">
            Upgrade to a Personal Training plan to get assigned a dedicated coach.
          </p>
          <Button className="hover:bg-brand-orange-dark bg-brand-orange">Explore Plans</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Trainer Profile Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="surface-card relative overflow-hidden p-8 text-center">
              <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-br from-brand-orange/20 to-transparent" />

              <div className="relative z-10">
                <div className="mx-auto mb-6 h-24 w-24 rounded-3xl border-2 border-brand-orange/30 bg-surface-elevated p-1">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.25rem] bg-brand-navy font-display text-3xl font-bold text-white">
                    {trainer.user.avatar ? (
                      <img
                        src={trainer.user.avatar}
                        alt={trainer.user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      `${trainer.user.firstName?.[0]}${trainer.user.lastName?.[0]}`
                    )}
                  </div>
                </div>

                <h2 className="mb-1 font-display text-2xl font-bold text-foreground">
                  {trainer.user.firstName} {trainer.user.lastName}
                </h2>
                <p className="mb-6 text-sm font-bold uppercase tracking-widest text-brand-orange">
                  Certified Professional Trainer
                </p>

                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{trainer.rating || "4.9"}</p>
                    <p className="text-[10px] font-bold uppercase text-txt-tertiary">Rating</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {trainer.experience || "5"}+
                    </p>
                    <p className="text-[10px] font-bold uppercase text-txt-tertiary">Exp (Yrs)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full gap-2 rounded-xl border-border/50">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                  <Button className="hover:bg-brand-orange-dark w-full gap-2 rounded-xl bg-brand-orange">
                    <Calendar className="h-4 w-4" /> Book
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="surface-card space-y-4 p-6">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                Contact Information
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-sunken">
                  <Mail className="h-4 w-4 text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-txt-tertiary">Email Address</p>
                  <p className="truncate text-sm font-bold text-foreground">{trainer.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-sunken">
                  <Phone className="h-4 w-4 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-txt-tertiary">Phone Number</p>
                  <p className="truncate text-sm font-bold text-foreground">
                    {trainer.user.phone || "+91 98765 43210"}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 py-2">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface-card text-txt-tertiary transition-all hover:border-brand-orange/30 hover:text-brand-orange"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface-card text-txt-tertiary transition-all hover:border-info/30 hover:text-info"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-navy hover:border-navy/30 flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface-card text-txt-tertiary transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Details & Specializations */}
          <div className="space-y-8 lg:col-span-2">
            <div className="surface-card p-8">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
                <Award className="h-6 w-6 text-brand-orange" />
                About & Specializations
              </h3>
              <p className="mb-8 leading-relaxed text-txt-secondary">
                {trainer.bio ||
                  "Your trainer is a dedicated fitness professional committed to helping you achieve your physical potential through science-based training and personalized nutrition guidance."}
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {trainer.specialization?.length > 0
                  ? trainer.specialization.map((spec: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface-sunken p-4"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10">
                          <Star className="h-4 w-4 text-brand-orange" />
                        </div>
                        <span className="text-sm font-bold text-foreground">{spec}</span>
                      </div>
                    ))
                  : ["Weight Loss", "Muscle Gain", "Body Transformation", "HIIT Training"].map(
                      (spec, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface-sunken p-4"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10">
                            <Star className="h-4 w-4 text-brand-orange" />
                          </div>
                          <span className="text-sm font-bold text-foreground">{spec}</span>
                        </div>
                      ),
                    )}
              </div>
            </div>

            <div className="surface-card p-8">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
                <Calendar className="h-6 w-6 text-success" />
                Weekly Availability
              </h3>
              <div className="flex flex-wrap gap-3">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => {
                  const isAvailable = trainer.availableDays?.includes(day);
                  return (
                    <div
                      key={day}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-xs font-bold transition-all",
                        isAvailable
                          ? "border-success/30 bg-success-soft text-success"
                          : "border-border/50 bg-surface-sunken text-txt-tertiary",
                      )}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-xs font-medium italic text-txt-tertiary">
                * Regular hours: {trainer.availableFrom || "06:00"} to{" "}
                {trainer.availableTo || "22:00"}. Contact trainer for specific session requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
