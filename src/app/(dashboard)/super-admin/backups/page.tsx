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
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSystemMetrics,
  getBackups,
  triggerBackup,
  deleteBackup,
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
    const [mRes, bRes] = await Promise.all([getSystemMetrics(), getBackups()]);

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
    const confirmed = confirm(
      "WARNING: This will overwrite the live database with the selected snapshot. All current session data will be lost. Proceed?",
    );
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
    <div className="w-full max-w-6xl space-y-6 p-4 duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-4 font-display text-3xl font-bold tracking-tight text-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
              <Database className="h-6 w-6 text-brand-orange" />
            </div>
            Data <span className="text-brand-orange">Archiving</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-txt-secondary">
            PostgreSQL Snapshot Engine & System Recovery
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleBackup}
            disabled={isBackingUp || isRestoring}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-all",
              isBackingUp
                ? "cursor-not-allowed bg-surface-elevated text-txt-tertiary"
                : "bg-brand-orange text-white shadow-brand-orange/20 hover:shadow-brand-orange/30",
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isBackingUp && "animate-spin")} />
            {isBackingUp ? "Capturing..." : "Create Snapshot"}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Backup History */}
        <div className="space-y-6 lg:col-span-2">
          <div className="surface-card flex min-h-[500px] flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-border bg-surface-base/50 p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                <Archive className="h-5 w-5 text-brand-orange" />
                Snapshot History
              </h2>
              <span className="rounded-full bg-surface-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                {backups.length} Records Found
              </span>
            </div>

            <div className="flex-1 space-y-4 p-6">
              {loading ? (
                <div className="flex h-full items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
                    <p className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                      Scanning cloud storage...
                    </p>
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
                      className="group flex items-center justify-between rounded-xl border border-border/50 bg-surface-sunken p-4 transition-all hover:border-brand-orange/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/5 transition-transform group-hover:scale-110">
                          <Archive className="h-5 w-5 text-brand-orange/40 group-hover:text-brand-orange" />
                        </div>
                        <div>
                          <h4 className="font-mono text-sm font-bold text-foreground">{bk.id}</h4>
                          <div className="mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-txt-tertiary">
                              <Clock className="h-3 w-3" /> {bk.date} • {bk.time}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-success-soft">
                              {bk.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-surface-elevated px-2 py-1 font-mono text-xs font-medium text-txt-tertiary">
                          {bk.size}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleRestore(bk.dbId)}
                            title="Restore snapshot"
                            className="rounded-lg p-2 text-txt-secondary transition-colors hover:bg-info/10 hover:text-info"
                          >
                            <RefreshCw className={cn("h-4 w-4", isRestoring && "animate-spin")} />
                          </button>
                          <button
                            title="Download ZIP"
                            className="rounded-lg p-2 text-txt-secondary transition-colors hover:bg-brand-orange/10 hover:text-brand-orange"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bk.dbId)}
                            title="Delete Archive"
                            className="rounded-lg p-2 text-txt-secondary transition-colors hover:bg-danger-soft hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface-base/30 py-20">
                  <Archive className="mb-4 h-12 w-12 text-txt-tertiary/20" />
                  <h3 className="text-base font-bold text-foreground">Cloud Storage Empty</h3>
                  <p className="mt-1 text-xs text-txt-secondary">
                    Create your first snapshot to secure your data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Metrics & Settings */}
        <div className="space-y-6">
          {/* Real-time Storage Metric */}
          <div className="surface-card relative overflow-hidden rounded-2xl p-6">
            <div className="absolute right-0 top-0 p-4 opacity-5">
              <HardDrive className="h-20 w-20" />
            </div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground">
              <Zap className="h-4 w-4 text-brand-orange" /> Storage Usage
            </h3>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="font-display text-3xl font-bold text-foreground">
                    {loading ? "..." : metrics?.databaseSize || "0 GB"}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Active Database Size
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-orange">
                    {metrics?.usagePercentage || 0}%
                  </p>
                  <p className="text-[10px] font-bold text-txt-tertiary">
                    Of {metrics?.allocatedStorage || "0 GB"}
                  </p>
                </div>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: loading ? "0%" : `${metrics?.usagePercentage || 0}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={cn(
                    "relative h-full shadow-brand-glow",
                    (metrics?.usagePercentage || 0) > 80 ? "bg-danger" : "bg-brand-orange",
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Backup Schedule (UI) */}
          <div className="surface-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground">
              <Clock className="h-4 w-4 text-info" /> Auto-Scheduler
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-surface-sunken p-3">
                <div>
                  <p className="text-xs font-bold text-foreground">Daily Snapshots</p>
                  <p className="text-[10px] font-medium text-txt-tertiary">Runs at 03:00 AM</p>
                </div>
                <div className="flex h-5 w-10 justify-end rounded-full border border-brand-orange/30 bg-brand-orange/20 p-1">
                  <div className="h-3 w-3 rounded-full bg-brand-orange" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-sunken p-3 opacity-50">
                <div>
                  <p className="text-xs font-bold text-foreground">Off-site Rotation</p>
                  <p className="text-[10px] font-medium text-txt-tertiary">Amazon S3 (Disabled)</p>
                </div>
                <div className="flex h-5 w-10 justify-start rounded-full border border-border bg-surface-elevated p-1">
                  <div className="h-3 w-3 rounded-full bg-txt-tertiary" />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Restore */}
          <div className="surface-card rounded-2xl border-danger/20 bg-danger-soft/10 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-danger">
              <AlertTriangle className="h-4 w-4" /> System Recovery
            </h3>
            <p className="mb-4 text-[10px] font-medium leading-relaxed text-txt-secondary">
              CRITICAL: Restoring a backup will force-reboot the instance and overwrite all live
              data with the selected snapshot.
            </p>
            <button
              onClick={() => handleRestore()}
              disabled={isRestoring || isBackingUp}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold shadow-lg transition-all",
                isRestoring
                  ? "bg-surface-elevated text-txt-tertiary"
                  : "bg-danger text-white shadow-danger/20 hover:bg-danger-dark",
              )}
            >
              {isRestoring ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Recovering System...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
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
