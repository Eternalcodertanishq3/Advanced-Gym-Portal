import React from "react";
import { getLeaderboard } from "@/actions/member/achievement-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Trophy, Medal, Star, TrendingUp, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Leaderboard | Eagle Gym",
  description: "See how you stack up against other members in the Eagle Gym community.",
};

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const res = await getLeaderboard(50);
  const leaderboard = res.success ? res.data : [];

  const leaderboardData = leaderboard || [];

  return (
    <div className="w-full h-full p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Community <span className="text-brand-orange">Leaderboard</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Top performers this month based on XP and consistency.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-sunken p-2 rounded-2xl border border-border/50">
          <div className="px-4 py-2 rounded-xl bg-surface-card text-xs font-bold text-brand-orange shadow-sm">Monthly</div>
          <div className="px-4 py-2 text-xs font-bold text-txt-tertiary">All-Time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leaderboardData.length === 0 ? (
          <div className="py-20 text-center surface-card border-dashed border-2">
            <p className="text-txt-tertiary">Leaderboard data is currently being calculated.</p>
          </div>
        ) : (
          leaderboardData.map((entry: any, index: number) => (
            <div 
              key={entry.id} 
              className={cn(
                "surface-card p-4 flex items-center justify-between transition-all hover:scale-[1.01]",
                entry.id === session.user.id && "ring-2 ring-brand-orange ring-inset bg-brand-orange/5 border-brand-orange/20"
              )}
            >
              <div className="flex items-center gap-6">
                <div className="w-8 flex justify-center">
                  {index === 0 ? (
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="w-6 h-6 text-slate-400" />
                  ) : index === 2 ? (
                    <Medal className="w-6 h-6 text-amber-700" />
                  ) : (
                    <span className="text-lg font-display font-bold text-txt-tertiary">#{index + 1}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center text-lg font-bold text-brand-navy overflow-hidden">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.firstName} className="w-full h-full object-cover" />
                    ) : (
                      `${entry.firstName?.[0]}${entry.lastName?.[0]}`
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      {entry.firstName} {entry.lastName}
                      {entry.id === session.user.id && (
                        <span className="text-[10px] bg-brand-orange text-white px-1.5 py-0.5 rounded-md uppercase font-black">You</span>
                      )}
                    </p>
                    <p className="text-xs text-txt-tertiary">Level {Math.floor(entry.xp / 1000) + 1} Warrior</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-display font-bold text-foreground">{entry.xp.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">XP points</p>
              </div>
            </div>
          ))
        )}
      </div>

      {leaderboardData.length > 0 && (
        <p className="text-center text-xs text-txt-tertiary font-medium italic pt-4">
          * Leaderboard resets on the 1st of every month. Keep training to stay on top!
        </p>
      )}
    </div>
  );
}
