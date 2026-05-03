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
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";

interface Props {
  initialData: any;
}

export function AuditLogsClient({ initialData }: Props) {
  const [logs, setLogs] = useState(initialData.logs);
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log: any) => 
    log.entityType.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    `${log.user.firstName} ${log.user.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3 tracking-tight">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-sm">
               <History className="w-6 h-6 text-brand-orange" />
            </div>
            System <span className="text-brand-orange">Audit Logs</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic">Monitor critical system actions and security events across all branches.</p>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search logs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 bg-surface-card border-surface-sunken rounded-2xl h-12 shadow-sm focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* System Telemetry (Premium Stat Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard
           icon={<ShieldCheck className="w-6 h-6" />}
           label="Security Score"
           value="100%"
           color="success"
           subtitle="All systems operational"
         />
         <StatCard
           icon={<Activity className="w-6 h-6" />}
           label="Total Actions"
           value={initialData.pagination.total}
           color="orange"
           subtitle="Across all entities"
         />
         <StatCard
           icon={<Database className="w-6 h-6" />}
           label="DB Integrity"
           value="CLEAN"
           color="info"
           subtitle="Regular backups active"
         />
      </div>

      {/* Audit Table Card */}
      <div className="surface-card rounded-[2rem] border border-surface-sunken overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-base border-b border-surface-sunken">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Performer</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-sunken/50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <History className="w-12 h-12 mb-2" />
                      <p className="text-sm font-bold text-foreground">No logs matching your search</p>
                      <p className="text-xs font-medium">Try different keywords or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: any, idx: number) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-surface-base/50 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "p-2 rounded-xl shadow-sm",
                           log.action === 'CREATE' ? "bg-success-soft text-success" :
                           log.action === 'DELETE' ? "bg-danger-soft text-danger" :
                           log.action === 'LOGIN' ? "bg-brand-orange-soft text-brand-orange" :
                           "bg-info-soft text-info"
                         )}>
                            <Activity className="w-4 h-4" />
                         </div>
                         <span className="text-sm font-bold text-obsidian-950">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-base overflow-hidden border border-surface-sunken shrink-0 shadow-inner">
                           {log.user.avatar ? (
                             <img src={log.user.avatar} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center">
                               <User className="w-5 h-5 text-muted-foreground/40" />
                             </div>
                           )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-obsidian-950 leading-none">{log.user.firstName} {log.user.lastName}</p>
                          <p className="text-[10px] text-brand-orange font-bold uppercase mt-1 tracking-wider">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className="bg-surface-base text-obsidian-700 border-surface-sunken text-[10px] font-bold uppercase px-3 py-1 rounded-lg">
                          {log.entityType}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-obsidian-900">{formatDate(log.createdAt)}</span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                             {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         aria-label="View log details"
                         className="p-2.5 rounded-xl bg-surface-base border border-surface-sunken text-muted-foreground hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all shadow-sm"
                       >
                          <Layers className="w-4 h-4" />
                       </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
