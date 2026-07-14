import React from "react";
import { getWorkerTasks } from "@/actions/admin/worker-actions";
import { TasksClient } from "./components/tasks-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Duty Roster | Eagle Gym",
  description: "View and manage your assigned tasks and duties.",
};

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "WORKER") {
    redirect("/login");
  }

  const res = await getWorkerTasks();

  if (!res.success) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load tasks</h2>
        <p className="mt-2 text-sm text-txt-secondary">{res.error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <TasksClient tasks={res.data ?? []} />
    </div>
  );
}
