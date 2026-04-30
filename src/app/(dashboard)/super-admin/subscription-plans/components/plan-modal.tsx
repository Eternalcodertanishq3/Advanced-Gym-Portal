"use client";

import React, { useState, useEffect } from "react";
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
    name: "",
    duration: "30",
    price: "",
    description: "",
    features: [] as string[],
    color: "#F26522",
    maxCheckIns: "0",
    ptSessions: "0",
    guestPasses: "0",
    sortOrder: "0",
    gstIncluded: true,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        duration: plan.duration?.toString() || "30",
        price: plan.price?.toString() || "",
        description: plan.description || "",
        features: plan.features || [],
        color: plan.color || "#F26522",
        maxCheckIns: plan.maxCheckIns?.toString() || "0",
        ptSessions: plan.ptSessions?.toString() || "0",
        guestPasses: plan.guestPasses?.toString() || "0",
        sortOrder: plan.sortOrder?.toString() || "0",
        gstIncluded: plan.gstIncluded ?? true,
      });
    } else {
      setFormData({
        name: "",
        duration: "30",
        price: "",
        description: "",
        features: [],
        color: "#F26522",
        maxCheckIns: "0",
        ptSessions: "0",
        guestPasses: "0",
        sortOrder: "0",
        gstIncluded: true,
      });
    }
  }, [plan, open]);

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
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
      const res = plan 
        ? await updatePlan(plan.id, formData)
        : await createPlan(formData);

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-brand-navy border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-display tracking-tight text-white">
            {plan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Define membership tiers, pricing, and feature access for your gym.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Platinum Annual"
                  className="bg-white/5 border-white/10 text-white"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                    className="bg-white/5 border-white/10 text-white"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    className="bg-white/5 border-white/10 text-white"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What makes this plan special?"
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Brand Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="color"
                      type="color"
                      className="w-12 h-10 p-1 bg-white/5 border-white/10"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                    />
                    <span className="text-xs text-white/50">{formData.color}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="gst"
                    checked={formData.gstIncluded}
                    onCheckedChange={(checked) => setFormData({ ...formData, gstIncluded: !!checked })}
                  />
                  <Label htmlFor="gst" className="text-sm font-medium cursor-pointer">GST Included</Label>
                </div>
              </div>
            </div>

            {/* Features & Limits */}
            <div className="space-y-4">
              <Label>Select Features</Label>
              <div className="grid grid-cols-1 gap-2 p-3 rounded-xl bg-white/5 border border-white/10 max-h-[300px] overflow-y-auto scrollbar-thin">
                {MEMBERSHIP_FEATURES.map((feature) => (
                  <div 
                    key={feature.id} 
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer group",
                      formData.features.includes(feature.id)
                        ? "bg-brand-orange/10 border-brand-orange/30"
                        : "bg-white/5 border-transparent hover:border-white/10"
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
                      className="border-white/20 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="checkins" className="text-[10px] uppercase tracking-wider text-white/50">Max Checkins</Label>
                  <Input
                    id="checkins"
                    type="number"
                    className="bg-white/5 border-white/10 text-white"
                    value={formData.maxCheckIns}
                    onChange={e => setFormData({ ...formData, maxCheckIns: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pt" className="text-[10px] uppercase tracking-wider text-white/50">PT Sessions</Label>
                  <Input
                    id="pt"
                    type="number"
                    className="bg-white/5 border-white/10 text-white"
                    value={formData.ptSessions}
                    onChange={e => setFormData({ ...formData, ptSessions: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-[10px] uppercase tracking-wider text-white/50">Guest Passes</Label>
                  <Input
                    id="guests"
                    type="number"
                    className="bg-white/5 border-white/10 text-white"
                    value={formData.guestPasses}
                    onChange={e => setFormData({ ...formData, guestPasses: e.target.value })}
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
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 shadow-lg shadow-brand-orange/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                plan ? "Update Plan" : "Create Plan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
