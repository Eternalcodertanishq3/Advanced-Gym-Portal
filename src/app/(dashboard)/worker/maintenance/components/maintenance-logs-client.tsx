"use client";

import { motion } from "framer-motion";
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  History,
  Tool
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  logs: any[];
}

export function MaintenanceLogsClient({ logs }: Props) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
             <History className="w-5 h-5 text-brand-orange" />
          </div>
          Repair <span className="text-brand-orange">Logs</span>
        </h1>
        <p className="text-sm text-txt-secondary mt-1">Track the history of equipment repairs and maintenance activities.</p>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-24 surface-card rounded-[2rem] border border-dashed border-border">
            <p className="text-sm text-txt-tertiary">No maintenance logs recorded yet.</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="surface-card p-6 rounded-[2rem] border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center shrink-0">
                  <Wrench className="w-6 h-6 text-txt-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{log.equipment.name}</h3>
                  <p className="text-sm text-txt-secondary italic">"{log.issue}"</p>
                  <p className="text-[10px] text-txt-tertiary font-bold uppercase tracking-widest mt-2">
                    Reported on {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>

              <Badge className={cn(
                "text-[10px] font-bold uppercase py-1.5 px-4 rounded-full",
                log.status === 'COMPLETED' ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
              )}>
                {log.status}
              </Badge>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
