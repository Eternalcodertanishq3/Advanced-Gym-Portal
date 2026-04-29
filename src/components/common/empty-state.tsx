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
  icon = <Search className="w-12 h-12 text-obsidian-300" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center bg-surface-card rounded-2xl border border-dashed border-surface-sunken",
      className
    )}>
      <div className="mb-4 p-4 bg-surface-base rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-obsidian-950 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-obsidian-500 max-w-xs mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="bg-brand-navy hover:bg-brand-navy/90 text-white">
          {action.label}
        </Button>
      )}
    </div>
  );
}
