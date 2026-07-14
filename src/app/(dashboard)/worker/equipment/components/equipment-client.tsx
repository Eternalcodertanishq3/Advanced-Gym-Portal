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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { reportMaintenanceIssue } from "@/actions/admin/worker-actions";

interface Props {
  equipment: any[];
}

export function EquipmentClient({ equipment: initialEquipment }: Props) {
  const [items, setItems] = useState(initialEquipment);
  const [search, setSearch] = useState("");
  const [reportingId, setReportingId] = useState<string | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleReportIssue = async (equipmentId: string) => {
    const issue = window.prompt("Briefly describe the issue:");
    if (!issue) return;

    setReportingId(equipmentId);
    const res = await reportMaintenanceIssue(equipmentId, issue);

    if (res.success) {
      toast.success("Maintenance issue reported. Status updated.");
      setItems((prev) =>
        prev.map((item) =>
          item.id === equipmentId ? { ...item, status: "UNDER_MAINTENANCE" } : item,
        ),
      );
    } else {
      toast.error(res.error);
    }
    setReportingId(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 duration-500 animate-in fade-in md:p-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
              <Settings className="h-5 w-5 text-brand-orange" />
            </div>
            Equipment <span className="text-brand-orange">Inventory</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Monitor gym assets and report maintenance issues immediately.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-xl border-border/50 bg-surface-elevated pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="surface-card group relative overflow-hidden rounded-[2rem] border border-border/50 p-6 transition-all hover:border-brand-orange/30"
            >
              {/* Background Accent */}
              <div className="absolute right-0 top-0 p-6 opacity-5 transition-transform group-hover:scale-110">
                <Dumbbell className="h-20 w-20" />
              </div>

              <div className="relative z-10 mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-sunken">
                  <Wrench
                    className={cn(
                      "h-6 w-6",
                      item.status === "WORKING" ? "text-success" : "text-warning",
                    )}
                  />
                </div>
                <Badge
                  className={cn(
                    "text-[10px] font-bold uppercase",
                    item.status === "WORKING"
                      ? "bg-success-soft text-success"
                      : "bg-warning-soft text-warning",
                  )}
                >
                  {item.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="relative z-10 mb-6 space-y-2">
                <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-brand-orange">
                  {item.name}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                  {item.category}
                </p>
              </div>

              <div className="relative z-10 mb-8 space-y-3">
                <div className="flex items-center gap-3 text-xs font-medium text-txt-secondary">
                  <MapPin className="h-3.5 w-3.5 text-txt-tertiary" />
                  {item.location || "Main Hall"}
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-txt-secondary">
                  <Calendar className="h-3.5 w-3.5 text-txt-tertiary" />
                  Last Service: {item.lastService ? formatDate(item.lastService) : "N/A"}
                </div>
              </div>

              {item.status === "WORKING" ? (
                <Button
                  onClick={() => handleReportIssue(item.id)}
                  disabled={reportingId === item.id}
                  className="w-full gap-2 rounded-xl border border-border/50 bg-surface-elevated py-6 text-xs font-bold text-txt-secondary transition-all hover:bg-danger/10 hover:text-danger"
                >
                  {reportingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  Report Issue
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-warning/10 bg-warning-soft/20 p-4 text-center text-xs font-bold text-warning">
                  <Wrench className="h-4 w-4" />
                  Under Maintenance
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-[2.5rem] border-2 border-dashed border-border bg-surface-sunken py-20 text-center">
          <p className="text-sm text-txt-tertiary">No equipment matching your search.</p>
        </div>
      )}
    </div>
  );
}
