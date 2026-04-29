"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Activity, ShieldAlert, Monitor } from "lucide-react";

type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  ipAddress: string;
  status: "Success" | "Failed" | "Warning";
};

interface Props {
  initialLogs: AuditLog[];
}

export function AuditLogsClient({ initialLogs }: Props) {
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => <div className="text-muted-foreground font-mono text-[10px]">{row.getValue("timestamp")}</div>,
    },
    {
      accessorKey: "user",
      header: "User / Actor",
      cell: ({ row }) => <div className="font-medium text-foreground text-sm">{row.getValue("user")}</div>,
    },
    {
      accessorKey: "action",
      header: "Action Performed",
      cell: ({ row }) => <div className="text-muted-foreground text-xs">{row.getValue("action")}</div>,
    },
    {
      accessorKey: "entity",
      header: "Target Entity",
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-md text-[10px] font-mono uppercase bg-muted/50 text-muted-foreground border border-border">
          {row.getValue("entity")}
        </span>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono">
          <Monitor className="w-3 h-3" />
          {row.getValue("ipAddress")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorMap: Record<string, string> = {
          "Success": "text-neon-green",
          "Warning": "text-orange-400",
          "Failed": "text-crimson",
        };
        return (
          <span className={`font-semibold text-[10px] tracking-wider uppercase ${colorMap[status]}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wide font-display flex items-center gap-3">
            <Activity className="w-6 h-6 text-brand-orange" />
            System Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Immutable record of all administrative and system actions.</p>
        </div>
        
        <div className="px-4 py-2 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson text-xs font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Strict Auditing Enforced
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={initialLogs} 
        searchKey="user" 
        searchPlaceholder="Filter logs by user..." 
      />
    </div>
  );
}
