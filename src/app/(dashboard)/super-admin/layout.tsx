"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-10">
      {/* Super Admin Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex w-full items-center gap-4 rounded-3xl border border-crimson/10 bg-gradient-to-r from-crimson/5 via-background to-background p-4 shadow-sm shadow-crimson/5"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-crimson/20 bg-crimson/10 shadow-[0_0_20px_rgba(255,49,49,0.1)]">
          <ShieldAlert className="h-6 w-6 text-crimson" />
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground">
            Super Admin Access Mode
            <span className="h-2 w-2 animate-pulse rounded-full bg-crimson shadow-[0_0_10px_rgba(255,49,49,0.8)]" />
          </h2>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            God mode active. You have full system control and cross-branch administrative
            privileges.
          </p>
        </div>
      </motion.div>

      {/* Page Content */}
      <div className="w-full">{children}</div>
    </div>
  );
}
