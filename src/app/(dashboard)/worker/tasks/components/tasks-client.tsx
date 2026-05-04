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
  Filter
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

  const filteredTasks = tasks.filter(t => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setUpdatingId(taskId);
    const res = await updateTaskStatus(taskId, newStatus);
    
    if (res.success) {
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } else {
      toast.error(res.error);
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
               <ClipboardList className="w-5 h-5 text-brand-orange" />
            </div>
            Assigned <span className="text-brand-orange">Tasks</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1">Manage your daily gym duties and report progress.</p>
        </div>

        <div className="flex bg-surface-elevated p-1 rounded-2xl border border-border">
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                filter === f ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "text-txt-tertiary hover:text-foreground"
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
              className="text-center py-24 surface-card rounded-[2rem] border-2 border-dashed border-border"
            >
              <Sparkles className="w-12 h-12 text-txt-tertiary/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">All Clear!</h3>
              <p className="text-sm text-txt-secondary">No {filter !== 'ALL' ? filter.toLowerCase() : ''} tasks found.</p>
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
                  "surface-card p-6 rounded-[2rem] border border-border/50 hover:border-brand-orange/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6",
                  task.status === 'COMPLETED' && "opacity-60 grayscale-[0.5]"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                    task.type === 'CLEANING' ? "bg-info-soft text-info" : "bg-warning-soft text-warning"
                  )}>
                    {task.type === 'CLEANING' ? <Droplets className="w-7 h-7" /> : <Hammer className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-foreground leading-none">{task.title}</h3>
                      <Badge className={cn(
                        "text-[9px] font-bold h-5 px-2",
                        task.priority === 'HIGH' || task.priority === 'URGENT' ? "bg-danger-soft text-danger" : "bg-surface-elevated text-txt-tertiary"
                      )}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-txt-secondary line-clamp-1 mb-2">{task.description || "General gym duty assigned to your department."}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-txt-tertiary">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {task.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {task.status !== 'COMPLETED' && (
                    <>
                      {task.status === 'PENDING' ? (
                        <Button 
                          onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                          disabled={updatingId === task.id}
                          className="bg-surface-elevated hover:bg-surface-base text-foreground rounded-xl text-xs font-bold"
                        >
                          {updatingId === task.id ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                          Start Task
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleUpdateStatus(task.id, "COMPLETED")}
                          disabled={updatingId === task.id}
                          className="bg-success hover:bg-success-dark text-white rounded-xl text-xs font-bold gap-2"
                        >
                          {updatingId === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Finish Task
                        </Button>
                      )}
                    </>
                  )}
                  {task.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 text-success font-bold text-sm bg-success-soft/30 px-4 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
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

