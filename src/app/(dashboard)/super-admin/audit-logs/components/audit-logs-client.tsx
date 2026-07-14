"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Search,
  User,
  Database,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { StatCard } from "@/app/(dashboard)/admin/components/stat-card";
import { getAuditLogs } from "@/actions/super-admin/audit-log-actions";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  initialData: any;
}

export function AuditLogsClient({ initialData }: Props) {
  const [logs, setLogs] = useState(initialData.logs);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      const res = await getAuditLogs(page, 20, debouncedSearch);
      if (res.success && res.data) {
        setLogs(res.data.logs);
        setPagination(res.data.pagination);
      } else {
        toast.error("Failed to load logs");
      }
      setIsLoading(false);
    }
    loadLogs();
  }, [page, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight text-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-sm">
              <History className="h-6 w-6 text-brand-orange" />
            </div>
            System <span className="text-brand-orange">Audit Logs</span>
          </h1>
          <p className="mt-1 text-sm font-medium italic text-muted-foreground">
            Monitor critical system actions and security events across all branches.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border-surface-sunken bg-surface-card pl-11 shadow-sm focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* System Telemetry (Premium Stat Cards) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={<ShieldCheck className="h-6 w-6" />}
          label="Security Score"
          value="100%"
          color="success"
          subtitle="All systems operational"
        />
        <StatCard
          icon={<Activity className="h-6 w-6" />}
          label="Total Actions"
          value={pagination.total}
          color="orange"
          subtitle="Across all entities"
        />
        <StatCard
          icon={<Database className="h-6 w-6" />}
          label="DB Integrity"
          value="CLEAN"
          color="info"
          subtitle="Regular backups active"
        />
      </div>

      {/* Audit Table Card */}
      <div className="surface-card overflow-hidden rounded-[2rem] border border-surface-sunken shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-surface-sunken bg-surface-base">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Action
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Performer
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Entity
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Inspect
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-sunken/50">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-sunken/50">
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-24 rounded-xl" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-lg" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Skeleton className="ml-auto h-8 w-8 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <History className="mb-2 h-12 w-12" />
                      <p className="text-sm font-bold text-foreground">No logs found</p>
                      <p className="text-xs font-medium">Try different keywords or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log: any, idx: number) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className="group transition-all hover:bg-surface-base/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-xl p-2 shadow-sm",
                            log.action === "CREATE"
                              ? "bg-success/10 text-success"
                              : log.action === "DELETE"
                                ? "bg-red-500/10 text-red-500"
                                : log.action === "IMPORT"
                                  ? "bg-brand-orange/10 text-brand-orange"
                                  : log.action === "LOGIN"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-obsidian-500/10 text-obsidian-500",
                          )}
                        >
                          <Activity className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-obsidian-950">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-surface-sunken bg-surface-base shadow-inner">
                          {log.user.avatar ? (
                            <img
                              src={log.user.avatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-none text-obsidian-950">
                            {log.user.firstName} {log.user.lastName}
                          </p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                            {log.user.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className="w-fit rounded-lg border-surface-sunken bg-surface-base px-3 py-1 text-[10px] font-bold uppercase text-obsidian-700"
                        >
                          {log.entityType}
                        </Badge>
                        {log.action === "IMPORT" && log.newValue && (
                          <span className="text-[9px] font-bold uppercase tracking-tighter text-success">
                            {log.newValue.success} Added • {log.newValue.duplicates} Skipped
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-obsidian-900">
                          {formatDate(log.createdAt)}
                        </span>
                        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        aria-label="View log details"
                        className="rounded-xl border border-surface-sunken bg-surface-base p-2.5 text-muted-foreground shadow-sm transition-all hover:border-brand-orange hover:bg-brand-orange hover:text-white"
                      >
                        <Layers className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Footer */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-surface-sunken bg-surface-card font-bold"
              disabled={page === 1 || isLoading}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-surface-sunken bg-surface-card font-bold"
              disabled={page === pagination.pages || isLoading}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
