"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Plus,
  Search,
  Filter,
  Info,
  Calendar,
  MapPin,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { reportMaintenanceIssue } from "@/server/actions/worker-actions";

interface Props {
  equipment: any[];
}

export function EquipmentClient({ equipment: initialEquipment }: Props) {
  const [items, setItems] = useState(initialEquipment);
  const [search, setSearch] = useState("");
  const [reportingId, setReportingId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleReportIssue = async (equipmentId: string) => {
    const issue = window.prompt("Briefly describe the issue:");
    if (!issue) return;

    setReportingId(equipmentId);
    const res = await reportMaintenanceIssue(equipmentId, issue);
    
    if (res.success) {
      toast.success("Maintenance issue reported. Status updated.");
      setItems(prev => prev.map(item => 
        item.id === equipmentId ? { ...item, status: "UNDER_MAINTENANCE" } : item
      ));
    } else {
      toast.error(res.error);
    }
    setReportingId(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
               <Settings className="w-5 h-5 text-brand-orange" />
            </div>
            Equipment <span className="text-brand-orange">Inventory</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1">Monitor gym assets and report maintenance issues immediately.</p>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
          <Input 
            placeholder="Search equipment..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-surface-elevated border-border/50 rounded-xl h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="surface-card p-6 rounded-[2rem] border border-border/50 hover:border-brand-orange/30 transition-all group relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-20 h-20" />
              </div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center">
                  <Wrench className={cn(
                    "w-6 h-6",
                    item.status === 'WORKING' ? "text-success" : "text-warning"
                  )} />
                </div>
                <Badge className={cn(
                  "text-[10px] font-bold uppercase",
                  item.status === 'WORKING' ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                )}>
                  {item.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-2 mb-6 relative z-10">
                <h3 className="text-xl font-bold text-foreground group-hover:text-brand-orange transition-colors">{item.name}</h3>
                <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">{item.category}</p>
              </div>

              <div className="space-y-3 mb-8 relative z-10">
                <div className="flex items-center gap-3 text-xs text-txt-secondary font-medium">
                  <MapPin className="w-3.5 h-3.5 text-txt-tertiary" />
                  {item.location || "Main Hall"}
                </div>
                <div className="flex items-center gap-3 text-xs text-txt-secondary font-medium">
                  <Calendar className="w-3.5 h-3.5 text-txt-tertiary" />
                  Last Service: {item.lastService ? formatDate(item.lastService) : "N/A"}
                </div>
              </div>

              {item.status === 'WORKING' ? (
                <Button 
                  onClick={() => handleReportIssue(item.id)}
                  disabled={reportingId === item.id}
                  className="w-full bg-surface-elevated hover:bg-danger/10 hover:text-danger border border-border/50 text-txt-secondary rounded-xl text-xs font-bold gap-2 py-6 transition-all"
                >
                  {reportingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                  Report Issue
                </Button>
              ) : (
                <div className="p-4 rounded-xl bg-warning-soft/20 border border-warning/10 text-warning text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Under Maintenance
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-surface-sunken rounded-[2.5rem] border-2 border-dashed border-border">
          <p className="text-sm text-txt-tertiary">No equipment matching your search.</p>
        </div>
      )}
    </div>
  );
}
