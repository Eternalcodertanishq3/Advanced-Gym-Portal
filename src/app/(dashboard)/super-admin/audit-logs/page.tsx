import React from "react";
import { getAuditLogs } from "@/actions/super-admin/audit-log-actions";
import { AuditLogsClient } from "./components/audit-logs-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Audit Logs | Eagle Gym",
  description: "Monitor system actions and data changes.",
};

export default async function AuditLogsPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const res = await getAuditLogs();

  if (!res.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load audit logs</h2>
        <p className="text-sm text-txt-secondary mt-2">{res.error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <AuditLogsClient initialData={res.data} />
    </div>
  );
}

