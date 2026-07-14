"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  ShieldCheck,
  UserPlus,
  MoreHorizontal,
  Mail,
  Phone,
  Trash2,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { StaffModal } from "./staff-modal";
import { cn } from "@/lib/utils";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  branchName: string;
  lastActive: string;
};

interface Props {
  staff: StaffMember[];
}

export function AdminsClient({ staff }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleInvite = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<StaffMember>[] = [
    {
      accessorKey: "name",
      header: "Staff Member",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-bold text-foreground">{row.getValue("name")}</div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
            <Mail className="h-2.5 w-2.5" /> {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const colorMap: Record<string, string> = {
          SUPER_ADMIN: "text-gold-400 border-gold-400/20 bg-gold-400/10",
          ADMIN: "text-electric-cyan border-electric-cyan/20 bg-electric-cyan/10",
          TRAINER: "text-neon-green border-neon-green/20 bg-neon-green/10",
          RECEPTIONIST: "text-purple-400 border-purple-400/20 bg-purple-400/10",
        };
        return (
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-bold",
              colorMap[role] || "border-border bg-muted/50 text-muted-foreground",
            )}
          >
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-brand-orange/40" />
          <span className="text-xs font-bold text-foreground/80">{row.getValue("branchName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "ACTIVE" ? "bg-success" : "bg-muted-foreground/30",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                status === "ACTIVE" ? "text-foreground" : "text-muted-foreground/60",
              )}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground/60">{row.getValue("lastActive")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            title="Edit Staff"
            className="group rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <MoreHorizontal className="h-4 w-4 text-obsidian-400 group-hover:text-obsidian-950 dark:text-white/50 dark:group-hover:text-white" />
          </button>
          <button
            onClick={async () => {
              if (
                confirm(
                  "Are you sure you want to remove this staff member? They will be marked as INACTIVE.",
                )
              ) {
                const { deleteStaff } = await import("@/actions/super-admin/staff-actions");
                const res = await deleteStaff(row.original.id);
                if (res.success) {
                  const { toast } = await import("sonner");
                  toast.success("Staff member deactivated successfully!");
                  window.location.reload();
                }
              }
            }}
            title="Deactivate Staff"
            className="group rounded-lg p-2 transition-colors hover:bg-danger/10"
          >
            <Trash2 className="h-4 w-4 text-danger/50 group-hover:text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-wide text-foreground">
            <ShieldCheck className="h-6 w-6 text-brand-orange" />
            Staff & Access
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage administrative roles, trainers, and system permissions.
          </p>
        </div>

        <motion.button
          onClick={handleInvite}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:shadow-brand-orange/30"
        >
          <UserPlus className="h-4 w-4" />
          Invite Staff
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={staff}
        searchKey="name"
        searchPlaceholder="Search staff members..."
      />

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staff={selectedStaff}
      />
    </div>
  );
}
