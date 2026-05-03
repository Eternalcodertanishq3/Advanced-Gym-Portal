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
    <div className="w-full h-full p-6 space-y-12 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
            Fitness <span className="text-brand-orange">Challenges</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Join community goals, earn badges, and dominate the leaderboard.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="surface-card px-5 py-2.5 rounded-2xl border border-border/50 flex items-center gap-3">
              <Star className="w-5 h-5 text-brand-orange" />
              <div>
                <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Global Rank</p>
                <p className="text-sm font-bold text-foreground">#42</p>
              </div>
           </div>
           <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold h-12 px-8 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all active:scale-95">
              My Trophies
           </Button>
        </div>
      </div>

      {/* Active Member Challenges */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-brand-orange" />
           </div>
           <h3 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">Active Operations</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeChallenges.length === 0 ? (
            <div className="col-span-full py-20 text-center surface-card border-dashed border-2 rounded-[2.5rem] bg-surface-sunken/10">
              <Target className="w-12 h-12 text-txt-tertiary/20 mx-auto mb-4" />
              <p className="text-sm font-bold text-txt-tertiary uppercase tracking-widest">No Active Missions</p>
              <p className="text-xs text-txt-tertiary mt-2">Discover and join a challenge below to start tracking.</p>
            </div>
          ) : (
            activeChallenges.map((ch: any) => {
              const participation = ch.participants[0];
              const progress = participation.progress;
              return (
                <div key={ch.id} className="surface-card p-8 rounded-[2.5rem] border border-border/50 flex flex-col group hover:border-brand-orange/30 transition-all shadow-xl bg-gradient-to-br from-surface-card to-surface-sunken">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-brand-navy flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                        <Zap className="w-8 h-8 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{ch.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[9px] font-black uppercase tracking-widest border border-brand-orange/20">
                             {ch.difficulty}
                           </span>
                           <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">• Reward: {ch.reward}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-card bg-surface-elevated" />
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-surface-card bg-brand-navy flex items-center justify-center text-[10px] font-bold text-white">
                        +{ch._count.participants}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-txt-secondary mb-10 flex-1 leading-relaxed font-medium">
                    {ch.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Mission Progress</span>
                      <span className="font-display font-bold text-brand-orange">{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30">
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
           <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-success" />
           </div>
           <h3 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">Available Missions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverChallenges.map((ch: any) => (
            <div key={ch.id} className="surface-card p-6 rounded-[2rem] border border-border/50 flex flex-col group hover:border-success/30 transition-all opacity-90 hover:opacity-100">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform">
                     <Target className="w-6 h-6 text-txt-tertiary group-hover:text-success" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-surface-sunken text-[9px] font-black text-txt-tertiary uppercase tracking-widest border border-border/50">
                    {ch._count.participants} Joined
                  </div>
               </div>
               
               <div className="flex-1 space-y-2 mb-6">
                  <h4 className="text-lg font-bold text-foreground group-hover:text-success transition-colors">{ch.title}</h4>
                  <p className="text-xs text-txt-tertiary font-medium line-clamp-2">{ch.description}</p>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-border/10">
                  <div>
                    <p className="text-[8px] font-black text-txt-tertiary uppercase tracking-widest">Reward</p>
                    <p className="text-xs font-bold text-foreground">{ch.reward}</p>
                  </div>
                  <Button 
                    onClick={async () => {
                      const res = await joinChallenge(ch.id);
                      if (res.success) {
                        window.location.reload();
                      }
                    }}
                    className="h-10 px-6 rounded-xl text-xs font-black bg-success hover:bg-success-dark text-white shadow-lg shadow-success/20 uppercase tracking-widest gap-2 transition-all active:scale-95"
                  >
                    Join Mission
                    <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
          ))}
          
          {discoverChallenges.length === 0 && (
            <div className="col-span-full py-16 text-center surface-card border-dashed border-2 rounded-[2.5rem]">
               <Lock className="w-10 h-10 text-txt-tertiary/20 mx-auto mb-4" />
               <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Intelligence Locked</p>
               <p className="text-xs text-txt-tertiary mt-2 font-medium">No new missions detected at this time.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


