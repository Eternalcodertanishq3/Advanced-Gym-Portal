import React, { Suspense } from "react";
import { getMemberProgress } from "@/actions/member/progress-actions";
import { ProgressClient } from "./components/progress-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Evolution Tracker | Eagle Gym",
  description: "Monitor your body metrics, photos, and fitness goals.",
};

export default async function ProgressPage() {
  const res = await getMemberProgress();

  if (!res.success || !res.data) {
    redirect("/member");
  }

  return (
    <div className="w-full h-full">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading Evolution Tracker...</div>}>
        <ProgressClient data={res.data} />
      </Suspense>
    </div>
  );
}
