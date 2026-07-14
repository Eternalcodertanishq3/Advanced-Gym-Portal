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
    <div className="mx-auto h-full w-full max-w-4xl space-y-8 p-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
            Community <span className="text-brand-orange">Leaderboard</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Top performers this month based on XP and consistency.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface-sunken p-2">
          <div className="rounded-xl bg-surface-card px-4 py-2 text-xs font-bold text-brand-orange shadow-sm">
            Monthly
          </div>
          <div className="px-4 py-2 text-xs font-bold text-txt-tertiary">All-Time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leaderboardData.length === 0 ? (
          <div className="surface-card border-2 border-dashed py-20 text-center">
            <p className="text-txt-tertiary">Leaderboard data is currently being calculated.</p>
          </div>
        ) : (
          leaderboardData.map((entry: any, index: number) => (
            <div
              key={entry.id}
              className={cn(
                "surface-card flex items-center justify-between p-4 transition-all hover:scale-[1.01]",
                entry.id === session.user.id &&
                  "border-brand-orange/20 bg-brand-orange/5 ring-2 ring-inset ring-brand-orange",
              )}
            >
              <div className="flex items-center gap-6">
                <div className="flex w-8 justify-center">
                  {index === 0 ? (
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-6 w-6 text-slate-400" />
                  ) : index === 2 ? (
                    <Medal className="h-6 w-6 text-amber-700" />
                  ) : (
                    <span className="font-display text-lg font-bold text-txt-tertiary">
                      #{index + 1}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-surface-elevated text-lg font-bold text-brand-navy">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      `${entry.firstName?.[0]}${entry.lastName?.[0]}`
                    )}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-bold text-foreground">
                      {entry.firstName} {entry.lastName}
                      {entry.id === session.user.id && (
                        <span className="rounded-md bg-brand-orange px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-txt-tertiary">
                      Level {Math.floor(entry.xp / 1000) + 1} Warrior
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display text-lg font-bold text-foreground">
                  {entry.xp.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                  XP points
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {leaderboardData.length > 0 && (
        <p className="pt-4 text-center text-xs font-medium italic text-txt-tertiary">
          * Leaderboard resets on the 1st of every month. Keep training to stay on top!
        </p>
      )}
    </div>
  );
}
