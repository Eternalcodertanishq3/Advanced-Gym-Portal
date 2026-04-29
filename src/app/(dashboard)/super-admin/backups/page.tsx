"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Database, Download, RefreshCw, Archive, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockBackups = [
  { id: "BK-20240324", date: "Mar 24, 2024 09:30 AM", size: "142 MB", type: "Automated", status: "Completed" },
  { id: "BK-20240323", date: "Mar 23, 2024 09:30 AM", size: "140 MB", type: "Automated", status: "Completed" },
  { id: "BK-20240322", date: "Mar 22, 2024 14:15 PM", size: "138 MB", type: "Manual", status: "Completed" },
];

export default function BackupsPage() {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => setIsBackingUp(false), 3000);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide font-display flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-400" />
            Database & Backups
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage PostgreSQL database snapshots and archives.</p>
        </div>
        
        <motion.button 
          onClick={handleBackup}
          disabled={isBackingUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "px-6 py-2.5 font-bold rounded-xl flex items-center gap-2 transition-all",
            isBackingUp 
              ? "bg-white/10 text-white/50 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", isBackingUp && "animate-spin")} />
          {isBackingUp ? "Creating Snapshot..." : "Trigger Manual Backup"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-display text-white border-b border-white/10 pb-4 mb-4">Recent Archives</h2>
          
          <div className="space-y-3">
            {mockBackups.map((bk) => (
              <div key={bk.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Archive className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{bk.id}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">{bk.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[10px] text-electric-cyan uppercase tracking-wider">{bk.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-white/60">{bk.size}</span>
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-crimson/20 bg-crimson/5">
            <h3 className="text-sm font-bold text-crimson flex items-center gap-2 mb-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Restoring a backup will overwrite the live database. All changes made after the snapshot will be permanently lost.
            </p>
            <button className="w-full py-2 bg-crimson/10 text-crimson hover:bg-crimson/20 border border-crimson/20 rounded-lg text-xs font-bold transition-colors">
              Restore from Backup
            </button>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>Database Size</span>
                <span>2.4 GB</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[15%]" />
              </div>
              <p className="text-[10px] text-white/40 text-center pt-2">15% of 15GB allocated storage used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
