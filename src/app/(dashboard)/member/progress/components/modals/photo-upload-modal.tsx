"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { addProgressPhoto } from "@/actions/member/progress-actions";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/portal";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  latestWeight: any;
}

export function PhotoUploadModal({ isOpen, onClose, latestWeight }: PhotoUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState("FRONT");
  const [weight, setWeight] = useState(latestWeight || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("photoType", photoType);
    formData.append("weight", weight);

    try {
      const res = await addProgressPhoto(formData);
      if (res.success) {
        toast.success("Progress photo uploaded!");
        onClose();
        window.location.reload();
      } else {
        toast.error(res.error || "Upload failed");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setLoading(false);
    }
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
              <h2 className="text-2xl font-display font-bold text-foreground">Upload <span className="text-brand-orange">Progress</span></h2>
              <button 
                aria-label="Close"
                onClick={onClose} 
                className="p-2 rounded-xl bg-surface-elevated text-txt-tertiary hover:text-foreground transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={cn(
                  "aspect-[3/4] max-h-[400px] mx-auto w-full rounded-3xl border-2 border-dashed transition-all relative overflow-hidden flex flex-col items-center justify-center gap-4 bg-surface-sunken group",
                  preview ? "border-brand-orange/50" : "border-border hover:border-brand-orange/30"
                )}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2 rounded-full text-xs font-bold transition-all border border-white/20">
                         Change Image
                         <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                       </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center">
                      <Upload className="w-8 h-8 text-txt-tertiary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">Select Progress Photo</p>
                      <p className="text-xs text-txt-tertiary">PNG, JPG up to 10MB</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest ml-1">Photo Type</label>
                  <Select 
                    value={photoType}
                    onValueChange={(val) => setPhotoType(val)}
                  >
                    <SelectTrigger className="w-full bg-surface-sunken border border-border rounded-xl px-4 py-3 text-foreground font-bold focus:border-brand-orange outline-none transition-colors h-[50px]">
                      <SelectValue placeholder="Select View" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-card border-border">
                      <SelectItem value="FRONT">Front View</SelectItem>
                      <SelectItem value="SIDE">Side View</SelectItem>
                      <SelectItem value="BACK">Back View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest ml-1">Current Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-surface-sunken border border-border rounded-xl px-4 py-3 text-foreground font-bold focus:border-brand-orange outline-none transition-colors h-[50px]"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !file}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark h-14 rounded-2xl text-white font-bold text-lg shadow-lg shadow-brand-orange/20"
              >
                {loading ? "Uploading..." : "Complete Upload"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
