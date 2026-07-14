"use client";

import { useState } from "react";
import {
  Wrench,
  Plus,
  Search,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useEquipment } from "@/hooks/use-equipment";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EquipmentPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, setMaintenance } = useEquipment(page, limit, debouncedSearch);
  const equipmentList = data?.equipment || [];
  const meta = data?.pagination;

  const [maintenanceNotes, setMaintenanceNotes] = useState("");

  const handleSetMaintenance = (id: string) => {
    setMaintenance.mutate(
      { id, notes: maintenanceNotes },
      {
        onSuccess: () => {
          toast.success("Equipment marked for maintenance");
          setMaintenanceNotes("");
        },
        onError: (err) => toast.error(err.message || "Action failed"),
      },
    );
  };

  const getStatus = (item: any) => {
    if (item.quantity === 0) {
      return {
        label: "Under Maintenance",
        badge: "bg-red-100 text-red-800 border-red-200",
        icon: <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />,
      };
    }
    return {
      label: "Operational",
      badge: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Equipment <span className="text-brand-orange">Fleet</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Track machines, weights, and maintenance schedules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-surface-sunken bg-surface-card">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance Logs
          </Button>
          <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Machine
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search by machine name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-base">
              <TableRow>
                <TableHead className="w-16 font-semibold text-obsidian-900">Type</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Machine Name</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Value</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Notes</TableHead>
                <TableHead className="text-right font-semibold text-obsidian-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-24 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : equipmentList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-obsidian-500">
                    <Dumbbell className="mx-auto mb-2 h-8 w-8 text-obsidian-300" />
                    No equipment found.
                  </TableCell>
                </TableRow>
              ) : (
                equipmentList.map((item: any) => {
                  const status = getStatus(item);
                  return (
                    <TableRow key={item.id} className="transition-colors hover:bg-surface-base/50">
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-sunken bg-surface-base">
                          <Dumbbell className="h-5 w-5 text-obsidian-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obsidian-950">{item.name}</p>
                        <p className="mt-0.5 text-xs text-obsidian-500">SKU: {item.sku || "N/A"}</p>
                      </TableCell>
                      <TableCell className="font-medium text-obsidian-700">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {status.icon}
                          <Badge
                            variant="outline"
                            className={cn("border-0 font-medium shadow-none", status.badge)}
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-obsidian-600">
                        {item.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity > 0 ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              >
                                <AlertCircle className="mr-2 h-4 w-4" /> Report Issue
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-white/10 bg-brand-navy text-white sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-display text-xl font-bold text-white">
                                  Report Equipment Issue
                                </DialogTitle>
                                <DialogDescription className="text-white/50">
                                  Mark this machine as under maintenance. It will be temporarily
                                  removed from operational capacity.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                                    Issue Description
                                  </label>
                                  <Input
                                    placeholder="E.g. Frayed cable, squeaking hinge..."
                                    value={maintenanceNotes}
                                    onChange={(e) => setMaintenanceNotes(e.target.value)}
                                    className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                                  />
                                </div>
                                <Button
                                  className="h-11 w-full rounded-xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
                                  onClick={() => handleSetMaintenance(item.id)}
                                  disabled={setMaintenance.isPending || !maintenanceNotes}
                                >
                                  Submit Report
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                            onClick={() => {
                              setMaintenanceNotes(""); // clear
                              toast.info("Maintenance resolved mock function triggered");
                            }}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {meta && meta.pages > 1 && (
          <div className="flex items-center justify-between border-t border-surface-sunken bg-surface-base/30 p-4">
            <span className="text-sm text-obsidian-500">
              Showing page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-surface-card"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page === meta.pages}
                className="bg-surface-card"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
