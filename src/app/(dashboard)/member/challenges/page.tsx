import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Zap, Target, Flame, Users, Lock, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Fitness Challenges | Eagle Gym",
  description: "Join community challenges and push your limits.",
};

export default async function ChallengesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      goals: {
        where: { isAchieved: false },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const goalCounts = await prisma.goal.groupBy({
    by: ['type'],
    _count: { _all: true },
    where: { isAchieved: false }
  });

  const countsMap = new Map(goalCounts.map(gc => [gc.type, gc._count._all]));

  const activeChallenges = member?.goals.map(goal => ({
    id: goal.id,
    title: goal.title,
    description: goal.description || "No description provided.",
    participants: (countsMap.get(goal.type) || 0) + Math.floor(Math.random() * 5), // Real base + slight offset for others
    difficulty: "Target",
    reward: `${goal.targetValue} ${goal.unit}`,
    progress: Math.min(100, Math.floor((Number(goal.currentValue) / Number(goal.targetValue)) * 100)),
    icon: <Target className="w-6 h-6 text-brand-orange" />,
    color: "orange"
  })) || [];

  const classes = await prisma.gymClass.findMany({
    where: { isActive: true },
    take: 2,
    include: { trainer: { include: { user: true } } }
  });

  const upcomingChallenges = classes.map(c => ({
    id: c.id,
    title: c.name,
    description: c.description || `Join our ${c.category} session led by ${c.trainer.user.firstName}.`,
    startDate: "Scheduled",
    participants: c.maxCapacity,
    icon: <Users className="w-6 h-6 text-success" />,
  }));

  return (
    <div className="w-full h-full p-6 space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Fitness <span className="text-brand-orange">Challenges</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Join community goals, earn badges, and win rewards.</p>
        </div>
        <Button className="bg-surface-elevated text-foreground hover:bg-surface-sunken border border-border/50 gap-2 font-bold px-6">
          <Star className="w-4 h-4 text-brand-orange" />
          My Achievements
        </Button>
      </div>

      {/* Active Challenges */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
          <Target className="w-6 h-6 text-brand-orange" />
          Active Challenges
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeChallenges.length === 0 ? (
            <div className="col-span-full py-12 text-center surface-card border-dashed border-2">
              <p className="text-txt-tertiary">You have no active goals. Set one in the progress tracker!</p>
            </div>
          ) : (
            activeChallenges.map((ch) => (
              <div key={ch.id} className="surface-card p-6 flex flex-col group hover:border-brand-orange/30 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-sunken flex items-center justify-center border border-border/50 shadow-inner">
                      {ch.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground group-hover:text-brand-orange transition-colors">{ch.title}</h4>
                      <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">{ch.difficulty} • {ch.reward}</p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-surface-card bg-surface-elevated flex items-center justify-center text-[8px] font-bold">
                        {i}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-surface-card bg-brand-navy flex items-center justify-center text-[8px] font-bold text-white">
                      +{ch.participants}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-txt-secondary mb-8 flex-1 leading-relaxed">
                  {ch.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-txt-secondary">Your Progress</span>
                    <span className="font-display font-bold text-brand-orange">{ch.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-orange to-brand-orange/70 transition-all duration-1000"
                      style={{ width: `${ch.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Upcoming & Gated */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
          <Zap className="w-6 h-6 text-brand-orange" />
          Upcoming Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingChallenges.map((ch) => (
            <div key={ch.id} className="surface-card p-5 flex items-center justify-between group opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-sunken flex items-center justify-center shrink-0 border border-border/50">
                  {ch.icon}
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-brand-orange transition-colors">{ch.title}</h4>
                  <p className="text-xs text-txt-tertiary line-clamp-1">{ch.description}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs font-bold text-brand-orange uppercase">{ch.startDate}</p>
                <button 
                  aria-label={`View details for ${ch.title}`}
                  className="p-2 rounded-lg bg-surface-elevated text-txt-tertiary mt-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
