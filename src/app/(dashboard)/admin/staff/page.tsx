"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  UserCircle,
  Briefcase,
  Mail,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate, getInitials, getAvatarColor, cn, formatCurrency } from "@/lib/utils";
import { useStaff } from "@/hooks/use-staff";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useStaff(page, limit, debouncedSearch);
  const staffList = data?.staff || [];
  const meta = data?.pagination;

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "GENERAL":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CLEANING":
        return "bg-green-100 text-green-800 border-green-200";
      case "MAINTENANCE":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "SECURITY":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-surface-base text-obsidian-700 border-surface-sunken";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Staff <span className="text-brand-orange">Directory</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage your facility team, shifts, and payroll details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search by name or email..."
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
                <TableHead className="w-12 font-semibold text-obsidian-900">Worker</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Role & Dept</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Contact</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Shift</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Salary</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
                <TableHead className="w-12 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-obsidian-500">
                    <UserCircle className="mx-auto mb-2 h-8 w-8 text-obsidian-300" />
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((worker: any) => {
                  const name = worker.user?.name || "Unknown Worker";
                  const initials = getInitials(name);
                  const avatarColor = getAvatarColor(name);

                  return (
                    <TableRow
                      key={worker.id}
                      className="transition-colors hover:bg-surface-base/50"
                    >
                      <TableCell>
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm",
                            avatarColor,
                          )}
                        >
                          {initials}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obsidian-950">{name}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "mt-1 border-0 text-xs",
                            getDepartmentColor(worker.department),
                          )}
                        >
                          {worker.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="mb-1 flex items-center text-sm text-obsidian-600">
                          <Mail className="mr-2 h-3.5 w-3.5 text-obsidian-400" />
                          {worker.user?.email || "No email"}
                        </div>
                        <div className="flex items-center text-sm text-obsidian-600">
                          <Phone className="mr-2 h-3.5 w-3.5 text-obsidian-400" />
                          {worker.user?.phone || "No phone"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm font-medium text-obsidian-900">
                          <Briefcase className="mr-2 h-3.5 w-3.5 text-brand-orange" />
                          {worker.shiftStart} - {worker.shiftEnd}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-obsidian-700">
                        {worker.salary ? formatCurrency(worker.salary) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {worker.isActive ? (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-surface-base text-obsidian-500">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4 text-obsidian-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-surface-sunken bg-surface-card"
                          >
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="mr-2 h-4 w-4" /> Terminate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
