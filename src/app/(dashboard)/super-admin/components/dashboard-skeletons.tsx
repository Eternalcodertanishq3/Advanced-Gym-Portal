import React from "react";
import { cn } from "@/lib/utils";

export function StatSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-muted/30 rounded-2xl border border-border" />
      ))}
    </div>
  );
}

export function LogsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 bg-muted/30 rounded-xl border border-border" />
      ))}
    </div>
  );
}
