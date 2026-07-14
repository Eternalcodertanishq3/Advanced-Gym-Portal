"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MEMBERSHIP_FEATURES } from "@/lib/constants/features";
import { createPlan, updatePlan } from "@/actions/super-admin/plan-actions";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  plan?: any; // If provided, we are in edit mode
}

export function PlanModal({ open, onClose, plan }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    duration: plan?.duration?.toString() || "30",
    price: plan?.price?.toString() || "",
    description: plan?.description || "",
    features: plan?.features || ([] as string[]),
    color: plan?.color || "#F26522",
    maxCheckIns: plan?.maxCheckIns?.toString() || "0",
    ptSessions: plan?.ptSessions?.toString() || "0",
    guestPasses: plan?.guestPasses?.toString() || "0",
    sortOrder: plan?.sortOrder?.toString() || "0",
    gstIncluded: plan?.gstIncluded ?? true,
  });

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id: string) => id !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = plan ? await updatePlan(plan.id, formData) : await createPlan(formData);

      if (res.success) {
        toast.success(plan ? "Plan updated successfully" : "Plan created successfully");
        onClose();
      } else {
        toast.error(res.error || "Operation failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="scrollbar-thin max-h-[90vh] max-w-3xl overflow-y-auto border-white/10 bg-brand-navy text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight text-white">
            {plan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Define membership tiers, pricing, and feature access for your gym.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  placeholder="Official Tier Identity"
                  className="border-white/10 bg-white/5 text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="999"
                    className="border-white/10 bg-white/5 text-white"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    className="border-white/10 bg-white/5 text-white"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What makes this plan special?"
                  className="min-h-[100px] border-white/10 bg-white/5 text-white"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      className="h-10 w-12 border-white/10 bg-white/5 p-1"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                    <span className="text-xs text-white/50">{formData.color}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="gst"
                    checked={formData.gstIncluded}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, gstIncluded: !!checked })
                    }
                  />
                  <Label htmlFor="gst" className="cursor-pointer text-sm font-medium">
                    GST Included
                  </Label>
                </div>
              </div>
            </div>

            {/* Features & Limits */}
            <div className="space-y-4">
              <Label>Select Features</Label>
              <div className="scrollbar-thin grid max-h-[300px] grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3">
                {MEMBERSHIP_FEATURES.map((feature) => (
                  <div
                    key={feature.id}
                    className={cn(
                      "group flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-all",
                      formData.features.includes(feature.id)
                        ? "border-brand-orange/30 bg-brand-orange/10"
                        : "border-transparent bg-white/5 hover:border-white/10",
                    )}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{feature.label}</span>
                      <span className="text-[10px] text-white/40">{feature.description}</span>
                    </div>
                    <Checkbox
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={() => toggleFeature(feature.id)}
                      onClick={(e) => e.stopPropagation()} // Prevent double trigger
                      className="border-white/20 data-[state=checked]:border-brand-orange data-[state=checked]:bg-brand-orange"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="checkins"
                    className="text-[10px] uppercase tracking-wider text-white/50"
                  >
                    Max Checkins
                  </Label>
                  <Input
                    id="checkins"
                    type="number"
                    className="border-white/10 bg-white/5 text-white"
                    value={formData.maxCheckIns}
                    onChange={(e) => setFormData({ ...formData, maxCheckIns: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="pt"
                    className="text-[10px] uppercase tracking-wider text-white/50"
                  >
                    PT Sessions
                  </Label>
                  <Input
                    id="pt"
                    type="number"
                    className="border-white/10 bg-white/5 text-white"
                    value={formData.ptSessions}
                    onChange={(e) => setFormData({ ...formData, ptSessions: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="guests"
                    className="text-[10px] uppercase tracking-wider text-white/50"
                  >
                    Guest Passes
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    className="border-white/10 bg-white/5 text-white"
                    value={formData.guestPasses}
                    onChange={(e) => setFormData({ ...formData, guestPasses: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="hover:bg-brand-orange-dark bg-brand-orange px-8 font-bold text-white shadow-lg shadow-brand-orange/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : plan ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
