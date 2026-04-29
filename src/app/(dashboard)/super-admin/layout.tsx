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
        className="w-full glass-card p-4 rounded-2xl flex items-center gap-4 bg-gradient-to-r from-crimson/5 via-background to-background border border-crimson/10 shadow-sm shadow-crimson/5"
      >
        <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center border border-crimson/20 shrink-0 shadow-[0_0_20px_rgba(255,49,49,0.1)]">
          <ShieldAlert className="w-6 h-6 text-crimson" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-widest uppercase flex items-center gap-2">
            Super Admin Access Mode
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse shadow-[0_0_10px_rgba(255,49,49,0.8)]" />
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
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
