"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Trash2, X } from "lucide-react";
import { inviteStaff, updateStaff, deleteStaff } from "@/actions/super-admin/staff-actions";
import { getBranches } from "@/actions/super-admin/branch-actions";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  branchId?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember | null;
}

export function StaffModal({ isOpen, onClose, staff }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    async function loadBranches() {
      const res = await getBranches();
      if (res.success) {
        setBranches(res.branches || []);
      }
    }
    if (isOpen) {
      loadBranches();
    }
  }, [isOpen]);

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
      status: (formData.get("status") as any) || "ACTIVE",
      branchId: formData.get("branchId") as string,
    };

    let res;
    if (staff) {
      res = await updateStaff(staff.id, data);
    } else {
      res = await inviteStaff(data);
    }

    if (res.success) {
      const inviteRes = res as { tempPassword?: string };
      toast.success(
        staff
          ? "Staff updated successfully!"
          : `Staff invited! Temp Password: ${inviteRes.tempPassword || "Sent to email"}`,
        {
          duration: staff ? 3000 : 10000,
        },
      );
      onClose();
    } else {
      toast.error(res.error || (staff ? "Failed to update staff" : "Failed to invite staff"));
    }

    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!staff) return;
    if (
      !confirm(
        "Are you sure you want to remove this staff member? They will be marked as INACTIVE.",
      )
    ) {
      return;
    }

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
      <DialogContent className="max-w-lg overflow-hidden border-white/10 bg-brand-navy p-0 text-white">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="font-display text-xl font-bold tracking-tight text-white">
                  {staff ? "Edit Staff Member" : "Invite Staff Member"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-white/50">
                  {staff
                    ? "Update details and permissions for this staff member."
                    : "Send an invitation to a new team member."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  required
                  name="firstName"
                  type="text"
                  defaultValue={firstName}
                  className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                  placeholder="Official First Name"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  required
                  name="lastName"
                  type="text"
                  defaultValue={lastName}
                  className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                  placeholder="Official Last Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-white/70"
              >
                Email Address
              </Label>
              <Input
                id="email"
                required
                name="email"
                type="email"
                defaultValue={staff?.email}
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                placeholder="Official Email Address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  required
                  name="phone"
                  type="text"
                  defaultValue={staff?.phone || ""}
                  className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                  placeholder="Secure Phone Number"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Status
                </Label>
                <Select name="status" defaultValue={staff?.status || "ACTIVE"}>
                  <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all focus:border-brand-orange/50 focus:ring-brand-orange/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-brand-navy text-white">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Role
                </Label>
                <Select name="role" required defaultValue={staff?.role || "ADMIN"}>
                  <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all focus:border-brand-orange/50 focus:ring-brand-orange/20">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-brand-navy text-white">
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                    <SelectItem value="TRAINER">Trainer</SelectItem>
                    <SelectItem value="WORKER">Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="branchId"
                  className="text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Assign Branch
                </Label>
                <Select name="branchId" defaultValue={staff?.branchId || "none"}>
                  <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all focus:border-brand-orange/50 focus:ring-brand-orange/20">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-brand-navy text-white">
                    <SelectItem value="none">Global / No Branch</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="hover:bg-brand-orange-dark flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange font-bold text-white shadow-lg shadow-brand-orange/20 transition-all"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? staff
                    ? "Updating..."
                    : "Inviting..."
                  : staff
                    ? "Update Staff Member"
                    : "Send Invitation"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
