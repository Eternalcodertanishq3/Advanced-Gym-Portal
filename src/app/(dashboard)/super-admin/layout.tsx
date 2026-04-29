"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      {/* Super Admin Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-card p-4 rounded-2xl flex items-center gap-4 bg-gradient-to-r from-crimson/10 to-background border border-crimson/20"
      >
        <div className="w-10 h-10 rounded-xl bg-crimson/20 flex items-center justify-center border border-crimson/30 shrink-0 shadow-[0_0_15px_rgba(255,49,49,0.2)]">
          <ShieldAlert className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-widest uppercase flex items-center gap-2">
            Super Admin Access Mode
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse shadow-[0_0_8px_rgba(255,49,49,0.6)]" />
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            God mode active. You have full system control and cross-branch administrative privileges.
          </p>
        </div>
      </motion.div>

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
