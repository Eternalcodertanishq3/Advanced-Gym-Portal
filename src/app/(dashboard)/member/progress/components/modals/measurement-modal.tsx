"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addMeasurement } from "@/actions/member/progress-actions";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/portal";

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  latest: any;
}

export function MeasurementModal({ isOpen, onClose, latest }: MeasurementModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: latest.weight || "",
    bodyFat: latest.bodyFat || "",
    chest: latest.chest || "",
    waist: latest.waist || "",
    hips: latest.hips || "",
    biceps: latest.biceps || "",
    thighs: latest.thighs || "",
    neck: latest.neck || "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await addMeasurement(formData);
      if (res.success) {
        toast.success("Measurement recorded!");
        onClose();
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-xl bg-surface-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-foreground">Log <span className="text-brand-orange">Measurement</span></h2>
              <button 
                aria-label="Close"
                onClick={onClose} 
                className="p-2 rounded-xl bg-surface-elevated text-txt-tertiary hover:text-foreground transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest ml-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full bg-surface-sunken border border-border rounded-xl px-4 py-3 text-foreground font-bold focus:border-brand-orange outline-none transition-colors h-[50px]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest ml-1">Body Fat (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="bodyFat"
                    value={formData.bodyFat}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full bg-surface-sunken border border-border rounded-xl px-4 py-3 text-foreground font-bold focus:border-brand-orange outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "chest", label: "Chest (cm)" },
                  { name: "waist", label: "Waist (cm)" },
                  { name: "hips", label: "Hips (cm)" },
                  { name: "biceps", label: "Biceps (cm)" },
                  { name: "thighs", label: "Thighs (cm)" },
                  { name: "neck", label: "Neck (cm)" },
                ].map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest ml-1">{field.label}</label>
                    <input 
                      type="number" 
                      step="0.1"
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      placeholder="0.0"
                      className="w-full bg-surface-sunken border border-border rounded-xl px-4 py-3 text-foreground font-medium focus:border-brand-orange outline-none transition-colors text-sm h-[50px]"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest ml-1">Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="How are you feeling today?"
                  className="w-full bg-surface-sunken border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-orange outline-none transition-colors min-h-[100px] resize-none text-sm"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark h-14 rounded-2xl text-white font-bold text-lg shadow-lg shadow-brand-orange/20"
              >
                {loading ? "Recording..." : "Save Measurement"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
