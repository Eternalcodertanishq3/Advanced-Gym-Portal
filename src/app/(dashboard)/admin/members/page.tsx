"use client";

import { useState } from "react";
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
} from "lucide-react";
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { useMembers } from "@/hooks/use-members";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useMembers(page, limit, debouncedSearch);

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
      case "ACTIVE": return "bg-green-100 text-green-800 border-green-200";
      case "EXPIRED": return "bg-red-100 text-red-800 border-red-200";
      case "PENDING": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Members <span className="text-obsidian-500">Directory</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Manage your gym members, subscriptions, and statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface-card border-surface-sunken" onClick={() => toast.info("Exporting...")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="bg-surface-card border-surface-sunken" onClick={() => toast.info("Importing...")}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white" onClick={() => router.push("/admin/members/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-sunken p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface-base border-surface-sunken focus-visible:ring-brand-orange"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="bg-surface-base border-surface-sunken">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-sunken overflow-hidden">
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
                <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Plan</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Join Date</TableHead>
                <TableHead className="text-right font-semibold text-obsidian-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-obsidian-500">
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
                    <TableRow key={member.id} className="hover:bg-surface-base/50 transition-colors">
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={selectedIds.has(member.id)}
                          onCheckedChange={() => toggleSelect(member.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold", avatarColor)}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-obsidian-950">{name}</p>
                            <div className="flex items-center gap-3 mt-0.5 text-xs text-obsidian-500">
                              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {member.user.email}</span>
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {member.user.phone || "-"}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-semibold", getStatusColor(member.status))}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obsidian-700 font-medium">{planName}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-obsidian-600">{formatDate(member.joinDate)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-obsidian-500 hover:text-obsidian-950">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-surface-card border-surface-sunken">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/members/${member.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/members/${member.id}/edit`)}>
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-surface-sunken" />
                            <DropdownMenuItem onClick={() => toast.success("Payment prompt opened")}>
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
          <div className="p-4 border-t border-surface-sunken bg-surface-base/30 flex items-center justify-between">
            <span className="text-sm text-obsidian-500">
              Showing page {meta.page} of {meta.totalPages}
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
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
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