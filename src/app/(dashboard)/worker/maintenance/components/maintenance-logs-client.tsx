"use client";

import { motion } from "framer-motion";
import { Wrench, CheckCircle2, Clock, AlertCircle, History, Hammer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  logs: any[];
}

export function MaintenanceLogsClient({ logs }: Props) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 duration-500 animate-in fade-in md:p-10">
      <div>
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
            <History className="h-5 w-5 text-brand-orange" />
          </div>
          Repair <span className="text-brand-orange">Logs</span>
        </h1>
        <p className="mt-1 text-sm text-txt-secondary">
          Track the history of equipment repairs and maintenance activities.
        </p>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="surface-card rounded-[2rem] border border-dashed border-border py-24 text-center">
            <p className="text-sm text-txt-tertiary">No maintenance logs recorded yet.</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="surface-card flex flex-col justify-between gap-6 rounded-[2rem] border border-border/50 p-6 md:flex-row md:items-center"
            >
              <div className="flex items-center gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-sunken">
                  <Wrench className="h-6 w-6 text-txt-secondary" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground">{log.equipment.name}</h3>
                  <p className="text-sm italic text-txt-secondary">"{log.issue}"</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Reported on {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>

              <Badge
                className={cn(
                  "rounded-full px-4 py-1.5 text-[10px] font-bold uppercase",
                  log.status === "COMPLETED"
                    ? "bg-success-soft text-success"
                    : "bg-warning-soft text-warning",
                )}
              >
                {log.status}
              </Badge>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
