"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Download, 
  RefreshCw, 
  Archive, 
  AlertTriangle, 
  Loader2, 
  Trash2, 
  Clock, 
  ShieldCheck,
  Zap,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getSystemMetrics, 
  getBackups, 
  triggerBackup, 
  deleteBackup 
} from "@/actions/super-admin/system-actions";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Database & Backup Management (Super Admin)
// ═══════════════════════════════════════════════════════════════

export default function BackupsPage() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
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

  const handleDelete = async (dbId: string) => {
    if (!confirm("Permanently delete this archive?")) return;
    
    const res = await deleteBackup(dbId);
    if (res.success) {
      toast.success("Archive deleted");
      await fetchData();
    } else {
      toast.error(res.error);
    }
  };

  const handleRestore = async (id?: string) => {
    const confirmed = confirm("WARNING: This will overwrite the live database with the selected snapshot. All current session data will be lost. Proceed?");
    if (!confirmed) return;

    setIsRestoring(true);
    const { restoreBackup } = await import("@/actions/super-admin/system-actions");
    const res = await restoreBackup(id || backups[0]?.dbId);
    
    if (res.success) {
      toast.success(res.message);
      await fetchData();
    } else {
      toast.error(res.error);
    }
    setIsRestoring(false);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-display flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
              <Database className="w-6 h-6 text-brand-orange" />
            </div>
            Data <span className="text-brand-orange">Archiving</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1 font-medium">PostgreSQL Snapshot Engine & System Recovery</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleBackup}
            disabled={isBackingUp || isRestoring}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-6 py-3 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg",
              isBackingUp 
                ? "bg-surface-elevated text-txt-tertiary cursor-not-allowed"
                : "bg-brand-orange text-white shadow-brand-orange/20 hover:shadow-brand-orange/30"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", isBackingUp && "animate-spin")} />
            {isBackingUp ? "Capturing..." : "Create Snapshot"}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Backup History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-border bg-surface-base/50 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Archive className="w-5 h-5 text-brand-orange" />
                Snapshot History
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-txt-tertiary px-3 py-1 rounded-full bg-surface-elevated">
                {backups.length} Records Found
              </span>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              {loading ? (
                <div className="h-full flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                    <p className="text-xs text-txt-tertiary font-bold uppercase tracking-widest">Scanning cloud storage...</p>
                  </div>
                </div>
              ) : backups.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {backups.map((bk, idx) => (
                    <motion.div 
                      key={bk.dbId} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken border border-border/50 hover:border-brand-orange/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-orange/5 flex items-center justify-center transition-transform group-hover:scale-110">
                          <Archive className="w-5 h-5 text-brand-orange/40 group-hover:text-brand-orange" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground font-mono">{bk.id}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] text-txt-tertiary font-bold">
                              <Clock className="w-3 h-3" /> {bk.date} • {bk.time}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="text-[10px] text-success-soft font-bold uppercase tracking-widest">{bk.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-txt-tertiary font-medium bg-surface-elevated px-2 py-1 rounded-md">{bk.size}</span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                          <button 
                            onClick={() => handleRestore(bk.dbId)}
                            title="Restore snapshot"
                            className="p-2 hover:bg-info/10 rounded-lg text-txt-secondary hover:text-info transition-colors"
                          >
                            <RefreshCw className={cn("w-4 h-4", isRestoring && "animate-spin")} />
                          </button>
                          <button 
                            title="Download ZIP"
                            className="p-2 hover:bg-brand-orange/10 rounded-lg text-txt-secondary hover:text-brand-orange transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(bk.dbId)}
                            title="Delete Archive"
                            className="p-2 hover:bg-danger-soft rounded-lg text-txt-secondary hover:text-danger transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl bg-surface-base/30">
                  <Archive className="w-12 h-12 text-txt-tertiary/20 mb-4" />
                  <h3 className="text-base font-bold text-foreground">Cloud Storage Empty</h3>
                  <p className="text-xs text-txt-secondary mt-1">Create your first snapshot to secure your data.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Metrics & Settings */}
        <div className="space-y-6">
          {/* Real-time Storage Metric */}
          <div className="surface-card p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
              <HardDrive className="w-20 h-20" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-orange" /> Storage Usage
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-3xl font-display font-bold text-foreground">{loading ? "..." : metrics?.databaseSize || "0 GB"}</p>
                  <p className="text-[10px] text-txt-tertiary font-bold uppercase tracking-widest">Active Database Size</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-orange">{metrics?.usagePercentage || 0}%</p>
                  <p className="text-[10px] text-txt-tertiary font-bold">Of {metrics?.allocatedStorage || "0 GB"}</p>
                </div>
              </div>

              <div className="h-3 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: loading ? "0%" : `${metrics?.usagePercentage || 0}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={cn(
                    "h-full shadow-brand-glow relative",
                    (metrics?.usagePercentage || 0) > 80 ? "bg-danger" : "bg-brand-orange"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Backup Schedule (UI) */}
          <div className="surface-card p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-info" /> Auto-Scheduler
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken">
                <div>
                  <p className="text-xs font-bold text-foreground">Daily Snapshots</p>
                  <p className="text-[10px] text-txt-tertiary font-medium">Runs at 03:00 AM</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-brand-orange/20 border border-brand-orange/30 p-1 flex justify-end">
                  <div className="w-3 h-3 rounded-full bg-brand-orange" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken opacity-50">
                <div>
                  <p className="text-xs font-bold text-foreground">Off-site Rotation</p>
                  <p className="text-[10px] text-txt-tertiary font-medium">Amazon S3 (Disabled)</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-surface-elevated border border-border p-1 flex justify-start">
                  <div className="w-3 h-3 rounded-full bg-txt-tertiary" />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Restore */}
          <div className="surface-card p-6 rounded-2xl border-danger/20 bg-danger-soft/10">
            <h3 className="text-sm font-bold text-danger flex items-center gap-2 mb-3 uppercase tracking-widest">
              <AlertTriangle className="w-4 h-4" /> System Recovery
            </h3>
            <p className="text-[10px] text-txt-secondary mb-4 leading-relaxed font-medium">
              CRITICAL: Restoring a backup will force-reboot the instance and overwrite all live data with the selected snapshot.
            </p>
            <button 
              onClick={handleRestore}
              disabled={isRestoring || isBackingUp}
              className={cn(
                "w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2",
                isRestoring 
                  ? "bg-surface-elevated text-txt-tertiary" 
                  : "bg-danger text-white hover:bg-danger-dark shadow-danger/20"
              )}
            >
              {isRestoring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Recovering System...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Initialize Data Restore
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
