"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Loader2, Trash2, Building2 } from "lucide-react";
import { createBranch, updateBranch, deleteBranch } from "@/actions/super-admin/branch-actions";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Branch {
  id: string;
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branch?: Branch | null;
}

export function BranchModal({ isOpen, onClose, branch }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      status: formData.get("status") as any || "ACTIVE",
    };

    let res;
    if (branch) {
      res = await updateBranch(branch.id, data);
    } else {
      res = await createBranch(data);
    }
    
    if (res.success) {
      toast.success(branch ? "Branch updated successfully!" : "Branch created successfully!");
      onClose();
    } else {
      toast.error(res.error || (branch ? "Failed to update branch" : "Failed to create branch"));
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!branch) return;
    if (!confirm("Are you sure you want to delete this branch? It will be marked as CLOSED.")) return;

    setIsDeleting(true);
    const res = await deleteBranch(branch.id);
    if (res.success) {
      toast.success("Branch closed successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to delete branch");
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-brand-navy border-white/10 text-white p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-orange" />
                  {branch ? "Edit Branch" : "Create New Branch"}
                </DialogTitle>
                <DialogDescription className="text-white/50 text-sm mt-1">
                  {branch ? "Manage your branch location and status." : "Add a new gym branch to your network."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-white/70 uppercase tracking-wider">Branch Name</Label>
              <Input 
                id="name"
                required 
                name="name" 
                type="text" 
                defaultValue={branch?.name} 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                placeholder="Official Branch Identity" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-bold text-white/70 uppercase tracking-wider">Location (Area/City)</Label>
              <Input 
                id="location"
                required 
                name="location" 
                type="text" 
                defaultValue={branch?.location} 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                placeholder="Primary Operational Area" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-bold text-white/70 uppercase tracking-wider">Full Address</Label>
              <Textarea 
                id="address" 
                name="address" 
                rows={3} 
                defaultValue={branch?.address || ""} 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all rounded-xl min-h-[100px]"
                placeholder="Enter complete physical address..." 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-white/70 uppercase tracking-wider">Contact Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="text" 
                  defaultValue={branch?.phone || ""} 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                  placeholder="Contact Phone Number" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold text-white/70 uppercase tracking-wider">Branch Status</Label>
                <Select name="status" defaultValue={branch?.status || "ACTIVE"}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-navy border-white/10 text-white">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? (branch ? "Updating..." : "Creating...") : (branch ? "Update Branch" : "Save Branch Details")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
