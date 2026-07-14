"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  CreditCard,
  Mail,
  Phone,
  ArrowUpDown,
  Filter,
  Copy,
  Check,
} from "lucide-react";
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { useMembers } from "@/hooks/use-members";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "next-auth/react";
import { getBranches } from "@/actions/super-admin/branch-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export default function MembersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("ALL");
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const limit = 30;

  useEffect(() => {
    if (isSuperAdmin) {
      getBranches().then((res) => {
        if (res.success && res.branches) {
          setBranches(res.branches);
        }
      });
    }
  }, [isSuperAdmin]);

  const { data, isLoading, isError } = useMembers(page, limit, debouncedSearch, selectedBranchId);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const members = data?.data || [];
  const meta = data?.meta;

  const toggleSelectAll = () => {
    if (selectedIds.size === members.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(members.map((m: any) => m.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Members <span className="text-obsidian-500">Directory</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage your gym members, subscriptions, and statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-surface-sunken bg-surface-card"
            onClick={() => toast.info("Exporting...")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className="border-surface-sunken bg-surface-card"
            onClick={() => router.push("/admin/members/import")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={() => router.push("/admin/members/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-orange"
            />
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            {isSuperAdmin && branches.length > 0 && (
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger className="w-[180px] border-surface-sunken bg-surface-base">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent className="border-surface-sunken bg-surface-card">
                  <SelectItem value="ALL">All Branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" className="border-surface-sunken bg-surface-base">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-base">
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={members.length > 0 && selectedIds.size === members.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-obsidian-900">Member</TableHead>
                {isSuperAdmin && (
                  <TableHead className="font-semibold text-obsidian-900">Branch</TableHead>
                )}
                <TableHead className="font-semibold text-obsidian-900">Phone</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Plan</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Join Date</TableHead>
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
                      <Skeleton className="h-4 w-4 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isSuperAdmin ? 8 : 7}
                    className="h-32 text-center text-obsidian-500"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member: any) => {
                  const name = `${member.user.firstName} ${member.user.lastName}`;
                  const initials = getInitials(name);
                  const avatarColor = getAvatarColor(name);
                  const planName = member.subscription?.plan?.name || "No Active Plan";

                  return (
                    <TableRow
                      key={member.id}
                      className="group transition-colors hover:bg-surface-base/50"
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.has(member.id)}
                          onCheckedChange={() => toggleSelect(member.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm",
                              avatarColor,
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-obsidian-950">{name}</p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-obsidian-500">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {member.user.email}
                              </span>
                              <CopyButton text={member.user.email} />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <span className="whitespace-nowrap text-sm font-medium text-obsidian-700">
                            {member.user.branch?.name || "-"}
                          </span>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-obsidian-700">
                            {member.user.phone || "-"}
                          </span>
                          <CopyButton text={member.user.phone} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("font-semibold", getStatusColor(member.status))}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-obsidian-700">{planName}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-obsidian-600">
                          {formatDate(member.joinDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-obsidian-500 hover:text-obsidian-950"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 border-surface-sunken bg-surface-card"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/members/${member.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/members/${member.id}/edit`)}
                            >
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-surface-sunken" />
                            <DropdownMenuItem
                              onClick={() => toast.success("Payment prompt opened")}
                            >
                              <CreditCard className="mr-2 h-4 w-4" /> Collect Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Member
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

function CopyButton({ text }: { text: string | null }) {
  const [copied, setCopied] = useState(false);

  if (!text) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center rounded-md p-0.5 text-obsidian-400 opacity-0 transition-all hover:bg-surface-sunken hover:text-brand-orange group-hover:opacity-100"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
