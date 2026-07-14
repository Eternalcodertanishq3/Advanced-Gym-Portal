"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon = <Search className="h-12 w-12 text-obsidian-300" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-sunken bg-surface-card px-4 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-surface-base p-4">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold text-obsidian-950">{title}</h3>
      {description && <p className="mb-6 max-w-xs text-sm text-obsidian-500">{description}</p>}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
