"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Droplets,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  user: any;
  stats: any;
}

export function WorkerDashboardClient({ user, stats }: Props) {
  const { pendingTasks, activeMaintenance, faultyEquipment, recentTasks } = stats;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Worker <span className="text-brand-orange">Command</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Hello {user.firstName}, here's your duty overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/worker/tasks">
            <Button className="hover:bg-brand-orange-dark gap-2 rounded-xl bg-brand-orange text-white">
              <Plus className="h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <WorkerStatCard
          icon={<ClipboardList className="h-6 w-6" />}
          label="Pending Tasks"
          value={pendingTasks}
          color="orange"
          subtitle="Assigned to you"
        />
        <WorkerStatCard
          icon={<Wrench className="h-6 w-6" />}
          label="Active Repairs"
          value={activeMaintenance}
          color="navy"
          subtitle="In progress"
        />
        <WorkerStatCard
          icon={<AlertTriangle className="h-6 w-6" />}
          label="Faulty Machines"
          value={faultyEquipment}
          color="danger"
          subtitle="Action required"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Tasks List */}
        <motion.div variants={itemVariants} className="space-y-6 lg:col-span-2">
          <div className="surface-card rounded-3xl border border-border/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Clock className="h-5 w-5 text-brand-orange" />
                Assigned Tasks
              </h3>
              <Link
                href="/worker/tasks"
                className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
              >
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface-sunken py-12 text-center">
                  <p className="text-sm text-txt-tertiary">No tasks assigned at the moment.</p>
                </div>
              ) : (
                recentTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-2xl border border-border/50 bg-surface-sunken p-4 transition-all hover:border-brand-orange/20"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          task.type === "CLEANING"
                            ? "bg-info-soft text-info"
                            : "bg-warning-soft text-warning",
                        )}
                      >
                        {task.type === "CLEANING" ? (
                          <Droplets className="h-5 w-5" />
                        ) : (
                          <Hammer className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{task.title}</p>
                        <p className="text-xs text-txt-tertiary">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-[10px] font-bold uppercase",
                        task.status === "COMPLETED"
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning",
                      )}
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar - Maintenance Quick View */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="surface-card relative overflow-hidden rounded-3xl border border-none border-border/50 bg-brand-navy p-6 text-white">
            <div className="absolute right-0 top-0 rotate-12 p-4 opacity-10">
              <Wrench className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <h3 className="mb-2 text-lg font-bold">Maintenance Hub</h3>
              <p className="mb-6 text-xs text-white/60">
                Report and track gym equipment status efficiently.
              </p>

              <div className="space-y-3">
                <Link href="/worker/equipment" className="block">
                  <Button className="group w-full justify-between rounded-xl border-none bg-white/10 text-white hover:bg-white/20">
                    <span>Equipment List</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/worker/maintenance" className="block">
                  <Button className="group w-full justify-between rounded-xl border-none bg-white/10 text-white hover:bg-white/20">
                    <span>Repair Logs</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-3xl border border-border/50 p-6">
            <h3 className="mb-4 text-sm font-bold text-foreground">Safety Protocols</h3>
            <ul className="space-y-3">
              <ProtocolItem text="Wear safety gear for chemicals" />
              <ProtocolItem text="Mark wet floors immediately" />
              <ProtocolItem text="Report loose electrical wires" />
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WorkerStatCard({ icon, label, value, color, subtitle }: any) {
  const colorMap: any = {
    orange: "bg-brand-orange-soft text-brand-orange",
    navy: "bg-surface-elevated text-brand-navy",
    danger: "bg-danger-soft text-danger",
  };

  return (
    <div className="surface-card rounded-3xl border border-border/50 p-6 transition-all hover:border-brand-orange/30">
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
          colorMap[color],
        )}
      >
        {icon}
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm font-bold text-txt-secondary">{label}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
        {subtitle}
      </p>
    </div>
  );
}

function ProtocolItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
      <p className="text-xs font-medium leading-relaxed text-txt-secondary">{text}</p>
    </li>
  );
}
