"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Building2, Plus, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
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
      cell: ({ row }) => <div className="font-bold text-foreground">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-3 h-3" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => <div className="font-medium text-foreground/80">{row.getValue("manager")}</div>,
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
          "CLOSED": "bg-crimson/10 text-crimson border-crimson/20 font-bold",
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
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(row.original)}
            title="Edit Branch"
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors group"
          >
            <MoreHorizontal className="w-4 h-4 text-obsidian-400 dark:text-white/50 group-hover:text-obsidian-950 dark:group-hover:text-white" />
          </button>
          <button 
            onClick={async () => {
              if (confirm("Are you sure you want to delete this branch? It will be marked as CLOSED.")) {
                const { deleteBranch } = await import("@/actions/super-admin/branch-actions");
                const res = await deleteBranch(row.original.id);
                if (res.success) {
                  const { toast } = await import("sonner");
                  toast.success("Branch closed successfully!");
                  // We might need to refresh the page or the data
                  window.location.reload();
                }
              }
            }}
            title="Delete Branch"
            className="p-2 hover:bg-danger/10 rounded-lg transition-colors group"
          >
            <Trash2 className="w-4 h-4 text-danger/50 group-hover:text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wide font-display flex items-center gap-3">
            <Building2 className="w-6 h-6 text-success" />
            Branch Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage multiple gym locations, managers, and member distribution.</p>
        </div>
        
        <motion.button 
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all flex items-center gap-2"
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
