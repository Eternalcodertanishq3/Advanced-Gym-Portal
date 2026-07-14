"use client";

import { useState } from "react";
import { Download, Filter, Search, UserCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatDate, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { useAttendance } from "@/hooks/use-attendance";
import { useDebounce } from "@/hooks/use-debounce";
import { exportToCSV } from "@/lib/export-utils";
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

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useAttendance(page, limit, debouncedSearch);
  const logs = data?.logs || [];
  const meta = data?.pagination;

  const handleExport = () => {
    if (!logs.length) {
      toast.error("No data to export");
      return;
    }
    const exportData = logs.map((log: any) => ({
      ID: log.id,
      Member: log.member?.user?.name || "Unknown",
      Email: log.member?.user?.email || "Unknown",
      Date: formatDate(log.date),
      CheckIn: formatDate(log.checkIn, "hh:mm a"),
      CheckOut: log.checkOut ? formatDate(log.checkOut, "hh:mm a") : "Active",
      Status: log.status,
      Mode: log.mode,
    }));
    exportToCSV(exportData, `attendance_export_${new Date().getTime()}.csv`);
    toast.success("Attendance exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge className="border-green-200 bg-green-100 text-green-800 shadow-none">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Present
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800 shadow-none">
            <XCircle className="mr-1 h-3 w-3" /> Absent
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Attendance <span className="text-brand-orange">Logs</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Monitor daily check-ins, facility utilization, and member consistency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-surface-sunken bg-surface-card"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
            <UserCheck className="mr-2 h-4 w-4" />
            Manual Check-In
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search by member name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-navy"
          />
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button variant="outline" className="border-surface-sunken bg-surface-base">
            <Filter className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-base">
              <TableRow>
                <TableHead className="font-semibold text-obsidian-900">Member</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Date</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Check In</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Check Out</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-obsidian-900">Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-6 w-16 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-obsidian-500">
                    <UserCheck className="mx-auto mb-2 h-8 w-8 text-obsidian-300" />
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: any) => {
                  const firstName = log.member?.user?.firstName || "";
                  const lastName = log.member?.user?.lastName || "";
                  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Member";
                  const initials = getInitials(fullName);
                  const avatarColor = getAvatarColor(fullName);

                  return (
                    <TableRow key={log.id} className="transition-colors hover:bg-surface-base/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                              avatarColor,
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-obsidian-950">{fullName}</p>
                            <p className="text-xs text-obsidian-500">{log.member?.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium text-obsidian-700">
                        {formatDate(log.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-semibold text-obsidian-900">
                          <Clock className="mr-1.5 h-3.5 w-3.5 text-brand-orange" />
                          {log.checkIn ? formatDate(log.checkIn, "hh:mm a") : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-obsidian-600">
                          {log.checkOut ? (
                            <>
                              <Clock className="mr-1.5 h-3.5 w-3.5 text-obsidian-400" />
                              {formatDate(log.checkOut, "hh:mm a")}
                            </>
                          ) : (
                            <span className="rounded bg-brand-navy/10 px-2 py-0.5 text-xs font-medium text-brand-navy">
                              Active Session
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="border-surface-sunken bg-surface-base font-medium text-obsidian-600"
                        >
                          {log.mode || "MANUAL"}
                        </Badge>
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
