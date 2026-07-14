"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  UserCircle,
  Mail,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { formatDate, getInitials, getAvatarColor, cn, formatCurrency } from "@/lib/utils";
import { useReceptionists } from "@/hooks/use-receptionists";
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
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Receptionists Roster
// ═══════════════════════════════════════════════════════════════

export default function ReceptionistsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useReceptionists(page, limit, debouncedSearch);
  const receptionists = (data as any)?.data || data || [];
  const meta = (data as any)?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Reception <span className="text-brand-orange">Staff</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage your front-desk team and attendance monitoring permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={() => router.push("/admin/receptionists/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Receptionist
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm">
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
                <TableHead className="w-12 font-semibold text-obsidian-900">Staff</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Name</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Contact</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Joined Date</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Permissions</TableHead>
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
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mb-1 h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : receptionists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-obsidian-500">
                    <UserCircle className="mx-auto mb-2 h-8 w-8 text-obsidian-300" />
                    No receptionists found.
                  </TableCell>
                </TableRow>
              ) : (
                receptionists.map((rec: any) => {
                  const name = `${rec.user.firstName} ${rec.user.lastName}`;
                  const initials = getInitials(name);
                  const avatarColor = getAvatarColor(name);

                  return (
                    <TableRow key={rec.id} className="transition-colors hover:bg-surface-base/50">
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
                        <p className="text-xs text-obsidian-500">ID: {rec.id.substring(0, 8)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="mb-1 flex items-center text-sm text-obsidian-600">
                          <Mail className="mr-2 h-3.5 w-3.5 text-obsidian-400" />
                          {rec.user.email}
                        </div>
                        {rec.user.phone && (
                          <div className="flex items-center text-sm text-obsidian-600">
                            <Phone className="mr-2 h-3.5 w-3.5 text-obsidian-400" />
                            {rec.user.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-obsidian-600">
                          {formatDate(rec.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-brand-navy/10 bg-brand-navy/5 text-[10px] font-bold text-brand-navy"
                        >
                          <ShieldCheck className="mr-1 h-3 w-3" /> FULL ACCESS
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
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
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/receptionists/${rec.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="mr-2 h-4 w-4" /> Remove Staff
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

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-surface-sunken bg-surface-base/30 p-4">
            <span className="text-sm text-obsidian-500">
              Showing page {meta.page} of {meta.totalPages}
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
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
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
