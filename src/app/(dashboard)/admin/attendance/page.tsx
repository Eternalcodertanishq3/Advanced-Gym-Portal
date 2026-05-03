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
      Mode: log.mode
    }));
    exportToCSV(exportData, `attendance_export_${new Date().getTime()}.csv`);
    toast.success("Attendance exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT": 
        return <Badge className="bg-green-100 text-green-800 border-green-200 shadow-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Present</Badge>;
      case "ABSENT": 
        return <Badge className="bg-red-100 text-red-800 border-red-200 shadow-none"><XCircle className="w-3 h-3 mr-1" /> Absent</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Attendance <span className="text-brand-orange">Logs</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Monitor daily check-ins, facility utilization, and member consistency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface-card border-surface-sunken" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
            <UserCheck className="w-4 h-4 mr-2" />
            Manual Check-In
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card rounded-2xl p-4 border border-surface-sunken shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
          <Input
            placeholder="Search by member name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="bg-surface-base border-surface-sunken">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Date
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-sunken overflow-hidden">
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
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-16 rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-obsidian-500">
                    <UserCheck className="w-8 h-8 text-obsidian-300 mx-auto mb-2" />
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
                    <TableRow key={log.id} className="hover:bg-surface-base/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", avatarColor)}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-obsidian-950">{fullName}</p>
                            <p className="text-xs text-obsidian-500">{log.member?.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-obsidian-700 font-medium">
                        {formatDate(log.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-obsidian-900 font-semibold">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
                          {log.checkIn ? formatDate(log.checkIn, "hh:mm a") : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-obsidian-600">
                          {log.checkOut ? (
                            <>
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-obsidian-400" />
                              {formatDate(log.checkOut, "hh:mm a")}
                            </>
                          ) : (
                            <span className="text-xs text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded font-medium">Active Session</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-surface-base border-surface-sunken text-obsidian-600 font-medium">
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
          <div className="p-4 border-t border-surface-sunken bg-surface-base/30 flex items-center justify-between">
            <span className="text-sm text-obsidian-500">
              Showing page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-surface-card"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
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
