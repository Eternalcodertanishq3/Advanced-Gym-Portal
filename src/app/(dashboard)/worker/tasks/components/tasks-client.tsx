"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  CheckCircle,
  Loader2,
  Droplets,
  Hammer,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { updateTaskStatus } from "@/actions/admin/worker-actions";

interface Props {
  tasks: any[];
}

export function TasksClient({ tasks: initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setUpdatingId(taskId);
    const res = await updateTaskStatus(taskId, newStatus);

    if (res.success) {
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } else {
      toast.error(res.error);
    }
    setUpdatingId(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 duration-500 animate-in fade-in md:p-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
              <ClipboardList className="h-5 w-5 text-brand-orange" />
            </div>
            Assigned <span className="text-brand-orange">Tasks</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Manage your daily gym duties and report progress.
          </p>
        </div>

        <div className="flex rounded-2xl border border-border bg-surface-elevated p-1">
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                filter === f
                  ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
                  : "text-txt-tertiary hover:text-foreground",
              )}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="surface-card rounded-[2rem] border-2 border-dashed border-border py-24 text-center"
            >
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-txt-tertiary/20" />
              <h3 className="text-lg font-bold text-foreground">All Clear!</h3>
              <p className="text-sm text-txt-secondary">
                No {filter !== "ALL" ? filter.toLowerCase() : ""} tasks found.
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "surface-card flex flex-col justify-between gap-6 rounded-[2rem] border border-border/50 p-6 transition-all hover:border-brand-orange/20 md:flex-row md:items-center",
                  task.status === "COMPLETED" && "opacity-60 grayscale-[0.5]",
                )}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                      task.type === "CLEANING"
                        ? "bg-info-soft text-info"
                        : "bg-warning-soft text-warning",
                    )}
                  >
                    {task.type === "CLEANING" ? (
                      <Droplets className="h-7 w-7" />
                    ) : (
                      <Hammer className="h-7 w-7" />
                    )}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-lg font-bold leading-none text-foreground">
                        {task.title}
                      </h3>
                      <Badge
                        className={cn(
                          "h-5 px-2 text-[9px] font-bold",
                          task.priority === "HIGH" || task.priority === "URGENT"
                            ? "bg-danger-soft text-danger"
                            : "bg-surface-elevated text-txt-tertiary",
                        )}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="mb-2 line-clamp-1 text-sm text-txt-secondary">
                      {task.description || "General gym duty assigned to your department."}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-txt-tertiary">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {task.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {task.status !== "COMPLETED" && (
                    <>
                      {task.status === "PENDING" ? (
                        <Button
                          onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                          disabled={updatingId === task.id}
                          className="rounded-xl bg-surface-elevated text-xs font-bold text-foreground hover:bg-surface-base"
                        >
                          {updatingId === task.id ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : null}
                          Start Task
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleUpdateStatus(task.id, "COMPLETED")}
                          disabled={updatingId === task.id}
                          className="gap-2 rounded-xl bg-success text-xs font-bold text-white hover:bg-success-dark"
                        >
                          {updatingId === task.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          Finish Task
                        </Button>
                      )}
                    </>
                  )}
                  {task.status === "COMPLETED" && (
                    <div className="flex items-center gap-2 rounded-xl bg-success-soft/30 px-4 py-2 text-sm font-bold text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
