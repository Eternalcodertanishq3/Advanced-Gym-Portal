import React from "react";
import { getWorkerDashboardStats } from "@/actions/admin/worker-actions";
import { WorkerDashboardClient } from "./components/worker-dashboard-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Worker Command | Eagle Gym",
  description: "Manage tasks, cleaning schedules, and equipment maintenance.",
};

export default async function WorkerPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "WORKER") {
    redirect("/login");
  }

  const res = await getWorkerDashboardStats();

  if (!res.success) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Error loading dashboard</h2>
        <p className="mt-2 text-sm text-txt-secondary">{res.error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <WorkerDashboardClient user={session.user} stats={res.data} />
    </div>
  );
}
