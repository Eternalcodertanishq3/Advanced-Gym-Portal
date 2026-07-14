"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  UserPlus,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SECURITY } from "@/lib/constants";

interface MemberFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  mode?: "create" | "edit";
  branches?: any[];
}

export function MemberForm({
  initialData,
  onSubmit,
  loading,
  mode = "create",
  branches = [],
}: MemberFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.user?.firstName || "",
    lastName: initialData?.user?.lastName || "",
    email: initialData?.user?.email || "",
    phone: initialData?.user?.phone || "",
    gender: initialData?.gender || "",
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
      : "",
    address: initialData?.address || "",
    emergencyContact: initialData?.emergencyContact || "",
    branchId: initialData?.user?.branchId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card space-y-6 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
            <p className="text-xs text-muted-foreground">Core details of the gym member.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-bold text-foreground">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="border-border/50 bg-muted/30 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-bold text-foreground">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="border-border/50 bg-muted/30 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                disabled={mode === "edit"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-border/50 bg-muted/30 pl-10 focus:border-primary/50 disabled:opacity-70"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-bold text-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-border/50 bg-muted/30 pl-10 focus:border-primary/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-bold text-foreground">
              Gender
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(val) => setFormData({ ...formData, gender: val })}
            >
              <SelectTrigger className="border-border/50 bg-muted/30 focus:border-primary/50">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="border-surface-sunken bg-surface-card">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm font-bold text-foreground">
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="border-border/50 bg-muted/30 pl-10 focus:border-primary/50"
              />
            </div>
          </div>

          {branches.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-sm font-bold text-foreground">
                Assigned Branch
              </Label>
              <Select
                value={formData.branchId}
                onValueChange={(val) => setFormData({ ...formData, branchId: val })}
                required
              >
                <SelectTrigger className="border-border/50 bg-muted/30 focus:border-primary/50">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="border-surface-sunken bg-surface-card">
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name} ({branch.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact & Emergency Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-card space-y-6 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Location & Emergency</h2>
            <p className="text-xs text-muted-foreground">Address and safety contact information.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-bold text-foreground">
              Residential Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter full address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="min-h-[100px] border-border/50 bg-muted/30 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency" className="text-sm font-bold text-foreground">
              Emergency Contact (Relation - Phone)
            </Label>
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="emergency"
                placeholder="e.g. Father - 9876543210"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="border-border/50 bg-muted/30 pl-10 focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center justify-end gap-4 pt-4 sm:flex-row">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary px-8 font-bold text-white hover:bg-primary/90 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : (
            <>
              {mode === "create" ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Member Account
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {mode === "create" && (
        <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h4 className="mb-1 font-bold text-primary">What happens next?</h4>
            <p className="text-sm leading-relaxed text-primary/80">
              After creation, the member will receive a welcome email with their login credentials.
              A secure randomly generated temporary password will be assigned, which they can change
              on first login.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
