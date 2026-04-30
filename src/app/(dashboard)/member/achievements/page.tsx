import React from "react";
import { getMemberAchievements } from "@/actions/member/achievement-actions";
import { AchievementClient } from "./components/achievement-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Legacy Hall | Eagle Gym",
  description: "View your earned achievements and gym milestones.",
};

export default async function AchievementsPage() {
  const res = await getMemberAchievements();

  if (!res.success || !res.data) {
    redirect("/member");
  }

  return (
    <div className="w-full h-full">
      <AchievementClient data={res.data} />
    </div>
  );
}
