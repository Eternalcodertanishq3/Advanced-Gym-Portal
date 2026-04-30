"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Copy } from "lucide-react";
import { inviteStaff } from "@/actions/super-admin/staff-actions";
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStaffModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as Role,
    };

    const res = await inviteStaff(data);
    
    if (res.success && res.tempPassword) {
      toast.success("Staff member invited successfully!");
      setTempPassword(res.tempPassword);
    } else {
      toast.error(res.error || "Failed to invite staff member");
    }
    
    setIsSubmitting(false);
  };

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
                    <h2 className="text-xl font-display font-bold text-foreground">Invite Staff Member</h2>
                    <button type="button" onClick={onClose} title="Close" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

              {tempPassword ? (
                <div className="space-y-6 py-4">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Invitation Sent!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      The staff member has been created. Please share these temporary login credentials with them.
                    </p>
                  </div>

                  <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Temporary Password</span>
                      <div className="flex items-center gap-2 bg-background border border-border p-3 rounded-xl">
                        <code className="flex-1 font-mono font-bold text-brand-orange text-lg tracking-widest">{tempPassword}</code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(tempPassword);
                            toast.success("Password copied!");
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors group"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTempPassword(null);
                      onClose();
                    }}
                    className="w-full py-3 bg-brand-navy text-white font-bold rounded-xl shadow-lg hover:shadow-brand-navy/20 transition-all"
                  >
                    Close & Finish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/70">First Name</label>
                      <input required name="firstName" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/70">Last Name</label>
                      <input required name="lastName" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter last name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">Email Address</label>
                    <input required name="email" type="email" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter email address" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">Phone Number</label>
                    <input required name="phone" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter phone number" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">Role</label>
                    <Select name="role" required defaultValue="ADMIN">
                      <SelectTrigger className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 h-11 text-foreground focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all">
                        <SelectValue placeholder="Select a role" />
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
                      {isSubmitting ? "Inviting..." : "Send Invitation"}
                    </button>
                  </div>
                </form>
              )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
