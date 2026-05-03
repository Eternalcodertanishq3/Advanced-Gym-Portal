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
  Hammer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">
            Worker <span className="text-brand-orange">Command</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1">Hello {user.firstName}, here's your duty overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/worker/tasks">
            <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              New Report
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WorkerStatCard 
          icon={<ClipboardList className="w-6 h-6" />}
          label="Pending Tasks"
          value={pendingTasks}
          color="orange"
          subtitle="Assigned to you"
        />
        <WorkerStatCard 
          icon={<Wrench className="w-6 h-6" />}
          label="Active Repairs"
          value={activeMaintenance}
          color="navy"
          subtitle="In progress"
        />
        <WorkerStatCard 
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Faulty Machines"
          value={faultyEquipment}
          color="danger"
          subtitle="Action required"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks List */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6 rounded-3xl border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-orange" />
                Assigned Tasks
              </h3>
              <Link href="/worker/tasks" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <div className="text-center py-12 bg-surface-sunken rounded-2xl border border-dashed border-border">
                  <p className="text-sm text-txt-tertiary">No tasks assigned at the moment.</p>
                </div>
              ) : (
                recentTasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-2xl bg-surface-sunken border border-border/50 hover:border-brand-orange/20 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        task.type === 'CLEANING' ? "bg-info-soft text-info" : "bg-warning-soft text-warning"
                      )}>
                        {task.type === 'CLEANING' ? <Droplets className="w-5 h-5" /> : <Hammer className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{task.title}</p>
                        <p className="text-xs text-txt-tertiary">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase",
                      task.status === 'COMPLETED' ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                    )}>
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
          <div className="surface-card p-6 rounded-3xl border border-border/50 bg-brand-navy border-none text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
              <Wrench className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Maintenance Hub</h3>
              <p className="text-xs text-white/60 mb-6">Report and track gym equipment status efficiently.</p>
              
              <div className="space-y-3">
                <Link href="/worker/equipment" className="block">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none justify-between group rounded-xl">
                    <span>Equipment List</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/worker/maintenance" className="block">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none justify-between group rounded-xl">
                    <span>Repair Logs</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 rounded-3xl border border-border/50">
            <h3 className="text-sm font-bold text-foreground mb-4">Safety Protocols</h3>
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
    <div className="surface-card p-6 rounded-3xl border border-border/50 hover:border-brand-orange/30 transition-all">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", colorMap[color])}>
        {icon}
      </div>
      <p className="text-3xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm font-bold text-txt-secondary mt-1">{label}</p>
      <p className="text-[10px] text-txt-tertiary uppercase font-bold tracking-widest mt-2">{subtitle}</p>
    </div>
  );
}

function ProtocolItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
      <p className="text-xs text-txt-secondary font-medium leading-relaxed">{text}</p>
    </li>
  );
}
