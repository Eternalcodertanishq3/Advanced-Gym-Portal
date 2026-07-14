import React from "react";
import { getMemberWorkouts } from "@/actions/member/workout-actions";
import { WorkoutClient } from "./components/workout-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Training Arena | Eagle Gym",
  description: "View your assigned workout plans and track your progress.",
};

export default async function WorkoutPage() {
  const res = await getMemberWorkouts();

  if (!res.success || !res.data) {
    redirect("/member");
  }

  return (
    <div className="h-full w-full">
      <WorkoutClient data={res.data} />
    </div>
  );
}
