"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Trash2 } from "lucide-react";
import { inviteStaff, updateStaff, deleteStaff } from "@/actions/super-admin/staff-actions";
import { toast } from "sonner";
import { Role } from "@prisma/client";

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">
                {staff ? "Edit Staff Member" : "Invite Staff Member"}
              </h2>
              <div className="flex items-center gap-2">
                {staff && (
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                )}
                <button type="button" onClick={onClose} title="Close" className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">First Name</label>
                  <input required name="firstName" type="text" defaultValue={firstName} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Last Name</label>
                  <input required name="lastName" type="text" defaultValue={lastName} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email Address</label>
                <input required name="email" type="email" defaultValue={staff?.email} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="john@eaglegym.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Phone Number</label>
                  <input required name="phone" type="text" defaultValue={staff?.phone || ""} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Status</label>
                  <select name="status" title="User Status" defaultValue={staff?.status || "ACTIVE"} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors appearance-none">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Role</label>
                <select required name="role" title="User Role" defaultValue={staff?.role || "ADMIN"} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors appearance-none">
                  <option value="ADMIN">Admin</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="TRAINER">Trainer</option>
                  <option value="WORKER">Worker</option>
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? (staff ? "Updating..." : "Inviting...") : (staff ? "Update Staff Member" : "Send Invitation")}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
