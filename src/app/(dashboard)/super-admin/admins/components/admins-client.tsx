"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { ShieldCheck, UserPlus, MoreHorizontal, Mail, Phone } from "lucide-react";
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
          <div className="font-bold text-white">{row.getValue("name")}</div>
          <div className="flex items-center gap-2 text-[10px] text-white/40">
             <Mail className="w-2.5 h-2.5" /> {row.original.email}
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
          "SUPER_ADMIN": "text-gold-400 border-gold-400/20 bg-gold-400/10",
          "ADMIN": "text-electric-cyan border-electric-cyan/20 bg-electric-cyan/10",
          "TRAINER": "text-neon-green border-neon-green/20 bg-neon-green/10",
          "RECEPTIONIST": "text-purple-400 border-purple-400/20 bg-purple-400/10",
        };
        return (
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", colorMap[role] || "text-white/40 border-white/10 bg-white/5")}>
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", status === "ACTIVE" ? "bg-neon-green" : "bg-white/20")} />
            <span className={cn("text-xs font-medium", status === "ACTIVE" ? "text-white" : "text-white/40")}>{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => <div className="text-white/60 text-xs">{row.getValue("lastActive")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <button 
          onClick={() => handleEdit(row.original)}
          title="Staff Actions"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
        >
          <MoreHorizontal className="w-4 h-4 text-white/50 group-hover:text-white" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide font-display flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gold-400" />
            Staff & Access
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage administrative roles, trainers, and system permissions.</p>
        </div>
        
        <motion.button 
          onClick={handleInvite}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
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
