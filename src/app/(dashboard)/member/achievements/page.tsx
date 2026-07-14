import React from "react";
import { getMemberAchievements, getLeaderboard } from "@/actions/member/achievement-actions";
import { AchievementClient } from "./components/achievement-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Hall of Fame | Eagle Gym",
  description: "Track your achievements and climb the leaderboard.",
};

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const [achievementsRes, leaderboardRes, user] = await Promise.all([
    getMemberAchievements(),
    getLeaderboard(10),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, firstName: true, lastName: true, xp: true, avatar: true },
    }),
  ]);

  if (!achievementsRes.success || !leaderboardRes.success) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load gamification data</h2>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <AchievementClient
        user={user}
        achievementsData={achievementsRes.data}
        leaderboard={leaderboardRes.data || []}
      />
    </div>
  );
}
