"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Download, RefreshCw, Archive, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSystemMetrics, getBackups, triggerBackup } from "@/actions/super-admin/system-actions";
import { toast } from "sonner";

export default function BackupsPage() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [mRes, bRes] = await Promise.all([
      getSystemMetrics(),
      getBackups()
    ]);

    if (mRes.success) setMetrics(mRes.metrics);
    if (bRes.success) setBackups(bRes.backups || []);
    setLoading(false);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    const res = await triggerBackup();
    if (res.success) {
      toast.success(res.message);
      await fetchData();
    } else {
      toast.error(res.error);
    }
    setIsBackingUp(false);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wide font-display flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-role-super-admin/10 flex items-center justify-center border border-role-super-admin/20">
              <Database className="w-5 h-5 text-role-super-admin" />
            </div>
            Database & Backups
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Manage PostgreSQL database snapshots and archives.</p>
        </div>
        
        <motion.button 
          onClick={handleBackup}
          disabled={isBackingUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "px-6 py-2.5 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg",
            isBackingUp 
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-role-super-admin text-white shadow-role-super-admin/20 hover:shadow-role-super-admin/30"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", isBackingUp && "animate-spin")} />
          {isBackingUp ? "Creating Snapshot..." : "Trigger Manual Backup"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 surface-card p-6 rounded-2xl min-h-[400px] flex flex-col">
          <h2 className="text-lg font-display font-bold text-foreground border-b border-border pb-4 mb-4">Recent Archives</h2>
          
          <div className="space-y-3 flex-1">
            {loading ? (
              <div className="h-full flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-role-super-admin animate-spin" />
                  <p className="text-sm text-muted-foreground font-bold">Scanning archives...</p>
                </div>
              </div>
            ) : backups.length > 0 ? (
              backups.map((bk) => (
                <div key={bk.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-role-super-admin/10 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Archive className="w-5 h-5 text-role-super-admin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground font-mono">{bk.id}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{bk.date} at {bk.time}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] text-info uppercase tracking-wider font-bold">{bk.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground font-medium">{bk.size}</span>
                    <button 
                      aria-label="Download backup"
                      className="p-2 bg-muted hover:bg-border rounded-lg text-foreground transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border bg-muted/20 flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Archive className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <h3 className="text-sm font-bold text-foreground">No system backups found</h3>
                <p className="text-xs text-muted-foreground mt-1">Run a manual backup to see your archives here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6 rounded-2xl border-crimson/20 bg-crimson/5">
            <h3 className="text-sm font-bold text-crimson flex items-center gap-2 mb-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">
              Restoring a backup will overwrite the live database. All changes made after the snapshot will be permanently lost.
            </p>
            <button className="w-full py-2.5 bg-crimson text-white hover:bg-crimson/90 rounded-xl text-xs font-bold transition-all shadow-md shadow-crimson/20 active:scale-95 flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Restore from Backup
            </button>
          </div>
          
          <div className="surface-card p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Storage Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Database Size</span>
                <span className="text-foreground">{loading ? "..." : metrics?.databaseSize || "0 GB"}</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: loading ? "0%" : `${metrics?.usagePercentage || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-role-super-admin shadow-[0_0_10px_rgba(124,58,237,0.4)]" 
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold text-center pt-2">
                {loading ? "Calculating..." : `${metrics?.usagePercentage || 0}% of ${metrics?.allocatedStorage || "0 GB"} allocated storage used`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
