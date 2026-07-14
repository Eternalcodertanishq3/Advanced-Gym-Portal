import React from "react";
import { getMaintenanceLogs } from "@/actions/admin/worker-actions";
import { MaintenanceLogsClient } from "./components/maintenance-logs-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Repair Logs | Eagle Gym",
  description: "Track the history of equipment maintenance.",
};

export default async function MaintenancePage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "WORKER") {
    redirect("/login");
  }

  const res = await getMaintenanceLogs();

  if (!res.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load logs</h2>
        <p className="text-sm text-txt-secondary mt-2">{res.error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MaintenanceLogsClient logs={res.data ?? []} />
    </div>
  );
}

