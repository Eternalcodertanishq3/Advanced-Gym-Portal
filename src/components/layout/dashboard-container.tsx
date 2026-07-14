"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/auth-store";

interface DashboardContainerProps {
  children: React.ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  const { collapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen transition-[padding-left] duration-300 ease-in-out",
        // Only apply persistent state after hydration to avoid FOUC/gap
        mounted && collapsed ? "lg:pl-20" : "lg:pl-[260px]",
      )}
    >
      {children}
    </div>
  );
}
