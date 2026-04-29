import React from "react";
import { getAuditLogs } from "@/actions/super-admin/audit-actions";
import { AuditLogsClient } from "./components/audit-logs-client";

export default async function AuditLogsPage() {
  const res = await getAuditLogs();
  const logs = res.success ? res.logs : [];

  return <AuditLogsClient initialLogs={logs as any} />;
}
