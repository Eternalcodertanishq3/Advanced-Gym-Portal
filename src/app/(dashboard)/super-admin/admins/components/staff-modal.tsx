"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Loader2, Trash2, X } from "lucide-react";
import { inviteStaff, updateStaff, deleteStaff } from "@/actions/super-admin/staff-actions";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-brand-navy border-white/10 text-white p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold font-display tracking-tight text-white">
                  {staff ? "Edit Staff Member" : "Invite Staff Member"}
                </DialogTitle>
                <DialogDescription className="text-white/50 text-sm mt-1">
                  {staff ? "Update details and permissions for this staff member." : "Send an invitation to a new team member."}
                </DialogDescription>
              </div>
              {staff && (
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-danger/50 hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </Button>
              )}
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-bold text-white/70 uppercase tracking-wider">First Name</Label>
                <Input 
                  id="firstName"
                  required 
                  name="firstName" 
                  type="text" 
                  defaultValue={firstName} 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                  placeholder="Enter first name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-bold text-white/70 uppercase tracking-wider">Last Name</Label>
                <Input 
                  id="lastName"
                  required 
                  name="lastName" 
                  type="text" 
                  defaultValue={lastName} 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                  placeholder="Enter last name" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-white/70 uppercase tracking-wider">Email Address</Label>
              <Input 
                id="email"
                required 
                name="email" 
                type="email" 
                defaultValue={staff?.email} 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                placeholder="Enter email address" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-white/70 uppercase tracking-wider">Phone Number</Label>
                <Input 
                  id="phone"
                  required 
                  name="phone" 
                  type="text" 
                  defaultValue={staff?.phone || ""} 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                  placeholder="Enter phone number" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold text-white/70 uppercase tracking-wider">Status</Label>
                <Select name="status" defaultValue={staff?.status || "ACTIVE"}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-navy border-white/10 text-white">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-bold text-white/70 uppercase tracking-wider">Role</Label>
              <Select name="role" required defaultValue={staff?.role || "ADMIN"}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-brand-navy border-white/10 text-white">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="TRAINER">Trainer</SelectItem>
                  <SelectItem value="WORKER">Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? (staff ? "Updating..." : "Inviting...") : (staff ? "Update Staff Member" : "Send Invitation")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
