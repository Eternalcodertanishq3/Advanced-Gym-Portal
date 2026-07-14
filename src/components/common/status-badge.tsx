"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status.toUpperCase();

  const config: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Active", className: "bg-green-100 text-green-700 border-green-200" },
    INACTIVE: {
      label: "Inactive",
      className: "bg-obsidian-100 text-obsidian-600 border-obsidian-200",
    },
    SUSPENDED: { label: "Suspended", className: "bg-red-100 text-red-700 border-red-200" },
    PENDING: {
      label: "Pending",
      className: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
    },
    EXPIRED: { label: "Expired", className: "bg-red-100 text-red-700 border-red-200" },
    FROZEN: { label: "Frozen", className: "bg-blue-100 text-blue-700 border-blue-200" },
    PRESENT: { label: "Present", className: "bg-green-100 text-green-700 border-green-200" },
    ABSENT: { label: "Absent", className: "bg-red-100 text-red-700 border-red-200" },
    COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
    FAILED: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
  };

  const current = config[s] || {
    label: status,
    className: "bg-surface-base text-obsidian-600 border-surface-sunken",
  };

  return (
    <Badge
      variant="outline"
      className={cn("px-2.5 py-0.5 font-medium shadow-none", current.className, className)}
    >
      {current.label}
    </Badge>
  );
}
