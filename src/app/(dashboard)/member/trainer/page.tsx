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
  Linkedin
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
          user: { select: { firstName: true, lastName: true, avatar: true, email: true, phone: true } }
        }
      }
    }
  });

  if (!member) redirect("/member");

  const trainer = member.trainer;

  return (
    <div className="w-full h-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          My <span className="text-brand-orange">Trainer</span>
        </h1>
        <p className="text-sm text-txt-secondary font-medium">Your dedicated partner in achieving your fitness goals.</p>
      </div>

      {!trainer ? (
        <div className="py-20 text-center surface-card border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-txt-tertiary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Trainer Assigned</h3>
          <p className="text-sm text-txt-tertiary max-w-[300px] mx-auto mb-8">
            Upgrade to a Personal Training plan to get assigned a dedicated coach.
          </p>
          <Button className="bg-brand-orange hover:bg-brand-orange-dark">Explore Plans</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trainer Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="surface-card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-brand-orange/20 to-transparent" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-3xl bg-surface-elevated mx-auto mb-6 p-1 border-2 border-brand-orange/30">
                  <div className="w-full h-full rounded-[1.25rem] bg-brand-navy flex items-center justify-center text-3xl font-display font-bold text-white overflow-hidden">
                    {trainer.user.avatar ? (
                      <img src={trainer.user.avatar} alt={trainer.user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      `${trainer.user.firstName?.[0]}${trainer.user.lastName?.[0]}`
                    )}
                  </div>
                </div>
                
                <h2 className="text-2xl font-display font-bold text-foreground mb-1">
                  {trainer.user.firstName} {trainer.user.lastName}
                </h2>
                <p className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-6">
                  Certified Professional Trainer
                </p>

                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{trainer.rating || "4.9"}</p>
                    <p className="text-[10px] font-bold text-txt-tertiary uppercase">Rating</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{trainer.experience || "5"}+</p>
                    <p className="text-[10px] font-bold text-txt-tertiary uppercase">Exp (Yrs)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full gap-2 rounded-xl border-border/50">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Button>
                  <Button className="w-full gap-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark">
                    <Calendar className="w-4 h-4" /> Book
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="surface-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-txt-tertiary uppercase tracking-widest mb-4">Contact Information</h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-txt-tertiary font-medium">Email Address</p>
                  <p className="text-sm font-bold text-foreground truncate">{trainer.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-txt-tertiary font-medium">Phone Number</p>
                  <p className="text-sm font-bold text-foreground truncate">{trainer.user.phone || "+91 98765 43210"}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 py-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-surface-card border border-border/50 flex items-center justify-center text-txt-tertiary hover:text-brand-orange hover:border-brand-orange/30 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-surface-card border border-border/50 flex items-center justify-center text-txt-tertiary hover:text-info hover:border-info/30 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-surface-card border border-border/50 flex items-center justify-center text-txt-tertiary hover:text-navy hover:border-navy/30 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Details & Specializations */}
          <div className="lg:col-span-2 space-y-8">
            <div className="surface-card p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-brand-orange" />
                About & Specializations
              </h3>
              <p className="text-txt-secondary leading-relaxed mb-8">
                {trainer.bio || "Your trainer is a dedicated fitness professional committed to helping you achieve your physical potential through science-based training and personalized nutrition guidance."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainer.specialization?.length > 0 ? (
                  trainer.specialization.map((spec: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-surface-sunken border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                        <Star className="w-4 h-4 text-brand-orange" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{spec}</span>
                    </div>
                  ))
                ) : (
                  ["Weight Loss", "Muscle Gain", "Body Transformation", "HIIT Training"].map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-surface-sunken border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                        <Star className="w-4 h-4 text-brand-orange" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{spec}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="surface-card p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-success" />
                Weekly Availability
              </h3>
              <div className="flex flex-wrap gap-3">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => {
                  const isAvailable = trainer.availableDays?.includes(day);
                  return (
                    <div 
                      key={day}
                      className={cn(
                        "px-4 py-3 rounded-xl border font-bold text-xs transition-all",
                        isAvailable 
                          ? "bg-success-soft text-success border-success/30" 
                          : "bg-surface-sunken text-txt-tertiary border-border/50"
                      )}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-txt-tertiary mt-6 font-medium italic">
                * Regular hours: {trainer.availableFrom || "06:00"} to {trainer.availableTo || "22:00"}. 
                Contact trainer for specific session requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
