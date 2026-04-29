"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  CreditCard,
  Mail,
  Phone,
  Crown,
  UserCheck,
  X,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { cn, formatDate, formatCurrency, getInitials, getAvatarColor } from "@/lib/utils";
import { TIER_BADGE_COLORS } from "@/lib/constants";
import { SkeletonTable } from "@/components/loaders/eagle-loader";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Member Management List
// ═══════════════════════════════════════════════════════════════

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "FROZEN" | "PENDING";
  tier: string;
  planName: string;
  planExpiry: string;
  trainerName?: string;
  joinDate: string;
  lastCheckIn?: string;
  pendingAmount?: number;
}

const mockMembers: Member[] = [
  {
    id: "1",
    firstName: "Rahul",
    lastName: "Patel",
    email: "rahul.patel@gmail.com",
    phone: "+91 98765 43210",
    status: "ACTIVE",
    tier: "GOLD",
    planName: "Gold Monthly",
    planExpiry: "2026-05-15",
    trainerName: "Vikram Singh",
    joinDate: "2025-03-10",
    lastCheckIn: "2026-04-26",
  },
  {
    id: "2",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.s@yahoo.com",
    phone: "+91 98765 43211",
    status: "ACTIVE",
    tier: "PLATINUM",
    planName: "Platinum Quarterly",
    planExpiry: "2026-07-20",
    trainerName: "Rahul Patel",
    joinDate: "2024-11-05",
    lastCheckIn: "2026-04-26",
  },
  {
    id: "3",
    firstName: "Amit",
    lastName: "Kumar",
    email: "amit.k@gmail.com",
    phone: "+91 98765 43212",
    status: "EXPIRED",
    tier: "SILVER",
    planName: "Silver Monthly",
    planExpiry: "2026-03-30",
    joinDate: "2025-01-15",
    pendingAmount: 1499,
  },
  {
    id: "4",
    firstName: "Neha",
    lastName: "Gupta",
    email: "neha.gupta@outlook.com",
    phone: "+91 98765 43213",
    status: "FROZEN",
    tier: "DIAMOND",
    planName: "Diamond Annual",
    planExpiry: "2026-12-31",
    joinDate: "2024-06-20",
  },
  {
    id: "5",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 98765 43214",
    status: "ACTIVE",
    tier: "GOLD",
    planName: "Gold Monthly",
    planExpiry: "2026-05-10",
    trainerName: "Priya Sharma",
    joinDate: "2025-08-12",
    lastCheckIn: "2026-04-25",
  },
  {
    id: "6",
    firstName: "Kiran",
    lastName: "Shah",
    email: "kiran.shah@yahoo.com",
    phone: "+91 98765 43215",
    status: "PENDING",
    tier: "BRONZE",
    planName: "Bronze Monthly",
    planExpiry: "2026-05-01",
    joinDate: "2026-04-26",
  },
  {
    id: "7",
    firstName: "Aditya",
    lastName: "Rao",
    email: "aditya.rao@gmail.com",
    phone: "+91 98765 43216",
    status: "ACTIVE",
    tier: "PLATINUM",
    planName: "Platinum Quarterly",
    planExpiry: "2026-08-15",
    trainerName: "Vikram Singh",
    joinDate: "2025-02-28",
    lastCheckIn: "2026-04-26",
  },
  {
    id: "8",
    firstName: "Sneha",
    lastName: "Verma",
    email: "sneha.v@outlook.com",
    phone: "+91 98765 43217",
    status: "INACTIVE",
    tier: "SILVER",
    planName: "Silver Monthly",
    planExpiry: "2026-02-28",
    joinDate: "2025-05-10",
  },
];

const statusConfig = {
  ACTIVE: {
    icon: CheckCircle2,
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    border: "border-neon-green/20",
    label: "Active",
  },
  INACTIVE: {
    icon: XCircle,
    color: "text-white/40",
    bg: "bg-white/5",
    border: "border-white/10",
    label: "Inactive",
  },
  EXPIRED: {
    icon: Clock,
    color: "text-crimson",
    bg: "bg-crimson/10",
    border: "border-crimson/20",
    label: "Expired",
  },
  FROZEN: {
    icon: Snowflake,
    color: "text-electric-cyan",
    bg: "bg-electric-cyan/10",
    border: "border-electric-cyan/20",
    label: "Frozen",
  },
  PENDING: {
    icon: Clock,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Pending",
  },
};

export default function MembersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "ALL" || member.status === statusFilter;
    const matchesTier = tierFilter === "ALL" || member.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  // Sort
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aVal = (a as any)[sortField];
    const bVal = (b as any)[sortField];
    if (sortDirection === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = useCallback(() => {
    if (selectedMembers.length === paginatedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(paginatedMembers.map((m) => m.id));
    }
  }, [selectedMembers.length, paginatedMembers]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    toast.success("Export started. You will receive an email when ready.");
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedMembers.length} members`);
    setSelectedMembers([]);
  };

  const handleDelete = (id: string) => {
    toast.success("Member deleted successfully");
    setActionMenuOpen(null);
  };

  if (isLoading) {
    return <SkeletonTable rows={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Members <span className="text-gold-gradient">Management</span>
          </h1>
          <p className="text-sm text-white/40">
            {mockMembers.length} total members · {mockMembers.filter((m) => m.status === "ACTIVE").length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => toast.info("Import wizard coming soon!")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={() => router.push("/admin/members/new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-liquid-gold to-liquid-orange text-obsidian-950 font-semibold text-sm hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-gold-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors",
              showFilters
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {(statusFilter !== "ALL" || tierFilter !== "ALL") && (
              <span className="w-5 h-5 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold flex items-center justify-center">
                {[statusFilter, tierFilter].filter((f) => f !== "ALL").length}
              </span>
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-xs text-white/40 mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-gold-500/30"
              >
                <option value="ALL" className="bg-obsidian-900">All Statuses</option>
                <option value="ACTIVE" className="bg-obsidian-900">Active</option>
                <option value="INACTIVE" className="bg-obsidian-900">Inactive</option>
                <option value="EXPIRED" className="bg-obsidian-900">Expired</option>
                <option value="FROZEN" className="bg-obsidian-900">Frozen</option>
                <option value="PENDING" className="bg-obsidian-900">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Membership Tier</label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-gold-500/30"
              >
                <option value="ALL" className="bg-obsidian-900">All Tiers</option>
                <option value="BRONZE" className="bg-obsidian-900">Bronze</option>
                <option value="SILVER" className="bg-obsidian-900">Silver</option>
                <option value="GOLD" className="bg-obsidian-900">Gold</option>
                <option value="PLATINUM" className="bg-obsidian-900">Platinum</option>
                <option value="DIAMOND" className="bg-obsidian-900">Diamond</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setTierFilter("ALL");
                  setSearchQuery("");
                }}
                className="px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">
              <span className="text-gold-400 font-medium">{selectedMembers.length}</span> selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("Export")}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => handleBulkAction("Message")}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              Message
            </button>
            <button
              onClick={() => handleBulkAction("Renew")}
              className="px-3 py-1.5 rounded-lg bg-gold-500/20 text-xs text-gold-400 hover:bg-gold-500/30 transition-colors"
            >
              Renew All
            </button>
            <button
              onClick={() => setSelectedMembers([])}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Members Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 w-12">
                  <button
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded border transition-all flex items-center justify-center",
                      selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0
                        ? "bg-gold-500 border-gold-500"
                        : "border-white/20 hover:border-white/40"
                    )}
                  >
                    {selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0 && (
                      <CheckCircle2 className="w-3 h-3 text-obsidian-950" />
                    )}
                  </button>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                  onClick={() => handleSort("firstName")}
                >
                  <div className="flex items-center gap-1">
                    Member
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Plan
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                  onClick={() => handleSort("planExpiry")}
                >
                  <div className="flex items-center gap-1">
                    Expiry
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Last Check-in
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedMembers.map((member, index) => {
                const status = statusConfig[member.status];
                const StatusIcon = status.icon;
                const initials = getInitials(`${member.firstName} ${member.lastName}`);
                const avatarColor = getAvatarColor(`${member.firstName} ${member.lastName}`);
                const isSelected = selectedMembers.includes(member.id);

                return (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-white/5 last:border-0 transition-all duration-200 group",
                      isSelected ? "bg-gold-500/5" : "hover:bg-white/[0.02]"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(member.id)}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          isSelected
                            ? "bg-gold-500 border-gold-500"
                            : "border-white/20 hover:border-white/40"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-obsidian-950" />}
                      </button>
                    </td>

                    {/* Member Info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                            avatarColor
                          )}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {member.firstName} {member.lastName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-[10px] text-white/30">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] text-white/30">
                              <Phone className="w-3 h-3" />
                              {member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      {member.pendingAmount && (
                        <span className="block mt-1 text-[10px] text-crimson">
                          Due: {formatCurrency(member.pendingAmount, { showSymbol: true, decimals: 0 })}
                        </span>
                      )}
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-medium border",
                            TIER_BADGE_COLORS[member.tier] || TIER_BADGE_COLORS.BRONZE
                          )}
                        >
                          {member.tier}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">{member.planName}</p>
                    </td>

                    {/* Expiry */}
                    <td className="px-4 py-4">
                      <p
                        className={cn(
                          "text-sm",
                          member.status === "EXPIRED"
                            ? "text-crimson"
                            : new Date(member.planExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? "text-orange-400"
                            : "text-white/60"
                        )}
                      >
                        {formatDate(member.planExpiry, "dd MMM yyyy")}
                      </p>
                      {new Date(member.planExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                        member.status !== "EXPIRED" && (
                          <p className="text-[10px] text-orange-400 mt-0.5">Expiring soon</p>
                        )}
                    </td>

                    {/* Trainer */}
                    <td className="px-4 py-4">
                      {member.trainerName ? (
                        <span className="text-sm text-white/60">{member.trainerName}</span>
                      ) : (
                        <span className="text-sm text-white/20">—</span>
                      )}
                    </td>

                    {/* Last Check-in */}
                    <td className="px-4 py-4">
                      {member.lastCheckIn ? (
                        <span className="text-sm text-white/60">
                          {formatDate(member.lastCheckIn, "dd MMM")}
                        </span>
                      ) : (
                        <span className="text-sm text-white/20">Never</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/members/${member.id}`)}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-electric-cyan transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/members/${member.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-gold-400 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.info(`Collect payment for ${member.firstName}`)}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-neon-green transition-colors"
                          title="Collect Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionMenuOpen(actionMenuOpen === member.id ? null : member.id)
                            }
                            className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Dropdown */}
                          {actionMenuOpen === member.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActionMenuOpen(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-full mt-1 w-48 glass-card rounded-xl overflow-hidden z-50 border border-white/10"
                              >
                                <button
                                  onClick={() => {
                                    toast.success(`Message sent to ${member.firstName}`);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <Mail className="w-4 h-4" />
                                  Send Message
                                </button>
                                <button
                                  onClick={() => {
                                    toast.success(`${member.firstName}'s subscription renewed`);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Renew Plan
                                </button>
                                <div className="border-t border-white/5" />
                                <button
                                  onClick={() => handleDelete(member.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-crimson hover:bg-crimson/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Member
                                </button>
                              </motion.div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedMembers.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-lg font-medium text-white/40 mb-1">No members found</p>
            <p className="text-sm text-white/20">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-white/5">
            <p className="text-xs text-white/30">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedMembers.length)} of{" "}
              {sortedMembers.length} members
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                    currentPage === i + 1
                      ? "bg-gold-500/20 text-gold-400"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}