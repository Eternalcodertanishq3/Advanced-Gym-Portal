"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Trash2 } from "lucide-react";
import { inviteStaff, updateStaff, deleteStaff } from "@/actions/super-admin/staff-actions";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import { Portal } from "@/components/common/portal";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember | null;
}

export function StaffModal({ isOpen, onClose, staff }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    
    const data = {
      firstName,
      lastName,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as Role,
      status: formData.get("status") as any || "ACTIVE",
    };

    let res;
    if (staff) {
      res = await updateStaff(staff.id, data);
    } else {
      res = await inviteStaff(data);
    }
    
    if (res.success) {
      toast.success(staff ? "Staff updated successfully!" : "Staff invited successfully!");
      onClose();
    } else {
      toast.error(res.error || (staff ? "Failed to update staff" : "Failed to invite staff"));
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!staff) return;
    if (!confirm("Are you sure you want to remove this staff member? They will be marked as INACTIVE.")) return;

    setIsDeleting(true);
    const res = await deleteStaff(staff.id);
    if (res.success) {
      toast.success("Staff member deactivated successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to delete staff member");
    }
    setIsDeleting(false);
  };

  const [firstName, lastName] = staff?.name.split(" ") || ["", ""];

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60"
              onClick={onClose}
            />
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="pointer-events-auto w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-foreground">
                      {staff ? "Edit Staff Member" : "Invite Staff Member"}
                    </h2>
                    <div className="flex items-center gap-2">
                      {staff && (
                        <button 
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="p-2 hover:bg-danger/10 rounded-lg text-danger/50 hover:text-danger transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      )}
                      <button type="button" onClick={onClose} title="Close" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">First Name</label>
                    <input required name="firstName" type="text" defaultValue={firstName} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">Last Name</label>
                    <input required name="lastName" type="text" defaultValue={lastName} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70">Email Address</label>
                  <input required name="email" type="email" defaultValue={staff?.email} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter email address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">Phone Number</label>
                    <input required name="phone" type="text" defaultValue={staff?.phone || ""} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">Status</label>
                    <Select name="status" defaultValue={staff?.status || "ACTIVE"}>
                      <SelectTrigger className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 h-11 text-foreground focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border shadow-2xl rounded-xl z-[110]">
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70">Role</label>
                  <Select name="role" required defaultValue={staff?.role || "ADMIN"}>
                    <SelectTrigger className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 h-11 text-foreground focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border shadow-2xl rounded-xl z-[110]">
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                      <SelectItem value="TRAINER">Trainer</SelectItem>
                      <SelectItem value="WORKER">Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? (staff ? "Updating..." : "Inviting...") : (staff ? "Update Staff Member" : "Send Invitation")}
                  </button>
                </div>
              </form>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    );
}
