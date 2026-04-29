"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Building2, Plus, MapPin, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { BranchModal } from "./branch-modal";
import { cn } from "@/lib/utils";

type Branch = {
  id: string;
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  manager: string;
  activeMembers: number;
  status: string;
};

interface Props {
  branches: Branch[];
}

export function BranchesClient({ branches }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "name",
      header: "Branch Name",
      cell: ({ row }) => <div className="font-bold text-white">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <MapPin className="w-3 h-3" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => <div className="font-medium text-white/80">{row.getValue("manager")}</div>,
    },
    {
      accessorKey: "activeMembers",
      header: "Active Members",
      cell: ({ row }) => <div className="font-mono text-electric-cyan font-bold">{row.getValue("activeMembers")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorMap: Record<string, string> = {
          "ACTIVE": "bg-neon-green/10 text-neon-green border-neon-green/20",
          "MAINTENANCE": "bg-orange-400/10 text-orange-400 border-orange-400/20",
          "CLOSED": "bg-crimson/10 text-crimson border-crimson/20",
        };
        return (
          <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${colorMap[status] || colorMap["ACTIVE"]}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <button 
          onClick={() => handleEdit(row.original)}
          title="Branch Actions"
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
            <Building2 className="w-6 h-6 text-neon-green" />
            Branch Management
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage multiple gym locations, managers, and member distribution.</p>
        </div>
        
        <motion.button 
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2.5 bg-gradient-to-r from-neon-green to-green-500 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Branch
        </motion.button>
      </div>

      <DataTable 
        columns={columns} 
        data={branches} 
        searchKey="name" 
        searchPlaceholder="Search branches..." 
      />

      <BranchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        branch={selectedBranch}
      />
    </div>
  );
}
