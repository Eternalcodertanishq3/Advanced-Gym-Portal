"use client";

import React, { useTransition } from "react";
import { stopImpersonating } from "@/actions/super-admin/impersonate-actions";
import { Eye, LogOut } from "lucide-react";
import { toast } from "sonner";

export function ImpersonationBanner() {
  const [isPending, startTransition] = useTransition();

  const handleExit = () => {
    startTransition(async () => {
      const res = await stopImpersonating();
      if (res.success) {
        toast.success("Exited impersonation session successfully");
        // Force full page reload to clear cache and rebuild session context
        window.location.href = "/admin/members";
      } else {
        toast.error("Failed to exit impersonation session");
      }
    });
  };

  return (
    <div className="relative z-50 flex select-none items-center justify-center gap-3 bg-brand-orange px-4 py-2 text-center text-sm font-semibold tracking-wide text-white">
      <div className="flex items-center gap-1.5">
        <Eye className="h-4 w-4 animate-pulse" />
        <span>You are currently viewing the platform as an impersonated user.</span>
      </div>
      <button
        onClick={handleExit}
        disabled={isPending}
        className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold text-white transition-colors hover:bg-white/30 disabled:opacity-50"
      >
        <LogOut className="h-3 w-3" />
        {isPending ? "Exiting..." : "Exit Impersonation"}
      </button>
    </div>
  );
}
