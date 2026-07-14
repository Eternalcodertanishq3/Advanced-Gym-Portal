"use client";

import React from "react";
import { Zap, Target, Lock, Star, Trophy, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { joinChallenge } from "@/actions/member/challenge-actions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  challenges: any[];
}

export function ChallengesClient({ challenges }: Props) {
  const activeChallenges = challenges.filter((c: any) => c.participants.length > 0);
  const discoverChallenges = challenges.filter((c: any) => c.participants.length === 0);

  return (
    <div className="mx-auto h-full w-full max-w-6xl space-y-12 p-6 duration-500 animate-in fade-in">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground">
            Fitness <span className="text-brand-orange">Challenges</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Join community goals, earn badges, and dominate the leaderboard.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="surface-card flex items-center gap-3 rounded-2xl border border-border/50 px-5 py-2.5">
            <Star className="h-5 w-5 text-brand-orange" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                Global Rank
              </p>
              <p className="text-sm font-bold text-foreground">#42</p>
            </div>
          </div>
          <Button className="hover:bg-brand-orange-dark h-12 rounded-2xl bg-brand-orange px-8 font-bold text-white shadow-xl shadow-brand-orange/20 transition-all active:scale-95">
            My Trophies
          </Button>
        </div>
      </div>

      {/* Active Member Challenges */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
            <Activity className="h-5 w-5 text-brand-orange" />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Active Operations
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {activeChallenges.length === 0 ? (
            <div className="surface-card col-span-full rounded-[2.5rem] border-2 border-dashed bg-surface-sunken/10 py-20 text-center">
              <Target className="mx-auto mb-4 h-12 w-12 text-txt-tertiary/20" />
              <p className="text-sm font-bold uppercase tracking-widest text-txt-tertiary">
                No Active Missions
              </p>
              <p className="mt-2 text-xs text-txt-tertiary">
                Discover and join a challenge below to start tracking.
              </p>
            </div>
          ) : (
            activeChallenges.map((ch: any) => {
              const participation = ch.participants[0];
              const progress = participation.progress;
              return (
                <div
                  key={ch.id}
                  className="surface-card group flex flex-col rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-surface-card to-surface-sunken p-8 shadow-xl transition-all hover:border-brand-orange/30"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/5 bg-brand-navy shadow-inner transition-transform group-hover:scale-110">
                        <Zap className="h-8 w-8 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{ch.title}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full border border-brand-orange/20 bg-brand-orange/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-brand-orange">
                            {ch.difficulty}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                            • Reward: {ch.reward}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-full border-2 border-surface-card bg-surface-elevated"
                        />
                      ))}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-card bg-brand-navy text-[10px] font-bold text-white">
                        +{ch._count.participants}
                      </div>
                    </div>
                  </div>

                  <p className="mb-10 flex-1 text-sm font-medium leading-relaxed text-txt-secondary">
                    {ch.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                        Mission Progress
                      </span>
                      <span className="font-display font-bold text-brand-orange">{progress}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-brand-orange shadow-[0_0_15px_rgba(242,101,34,0.3)] transition-all duration-1000"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Discovery Challenges */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <Zap className="h-5 w-5 text-success" />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Available Missions
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {discoverChallenges.map((ch: any) => (
            <div
              key={ch.id}
              className="surface-card group flex flex-col rounded-[2rem] border border-border/50 p-6 opacity-90 transition-all hover:border-success/30 hover:opacity-100"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-surface-sunken transition-transform group-hover:scale-105">
                  <Target className="h-6 w-6 text-txt-tertiary group-hover:text-success" />
                </div>
                <div className="rounded-full border border-border/50 bg-surface-sunken px-3 py-1 text-[9px] font-black uppercase tracking-widest text-txt-tertiary">
                  {ch._count.participants} Joined
                </div>
              </div>

              <div className="mb-6 flex-1 space-y-2">
                <h4 className="text-lg font-bold text-foreground transition-colors group-hover:text-success">
                  {ch.title}
                </h4>
                <p className="line-clamp-2 text-xs font-medium text-txt-tertiary">
                  {ch.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/10 pt-6">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-txt-tertiary">
                    Reward
                  </p>
                  <p className="text-xs font-bold text-foreground">{ch.reward}</p>
                </div>
                <Button
                  onClick={async () => {
                    const res = await joinChallenge(ch.id);
                    if (res.success) {
                      window.location.reload();
                    }
                  }}
                  className="h-10 gap-2 rounded-xl bg-success px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-success/20 transition-all hover:bg-success-dark active:scale-95"
                >
                  Join Mission
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {discoverChallenges.length === 0 && (
            <div className="surface-card col-span-full rounded-[2.5rem] border-2 border-dashed py-16 text-center">
              <Lock className="mx-auto mb-4 h-10 w-10 text-txt-tertiary/20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                Intelligence Locked
              </p>
              <p className="mt-2 text-xs font-medium text-txt-tertiary">
                No new missions detected at this time.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
