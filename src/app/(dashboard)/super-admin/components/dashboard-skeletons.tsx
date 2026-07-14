import React from "react";
import { cn } from "@/lib/utils";

export function StatSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 rounded-2xl border border-border bg-muted/30" />
      ))}
    </div>
  );
}

export function LogsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 rounded-xl border border-border bg-muted/30" />
      ))}
    </div>
  );
}
