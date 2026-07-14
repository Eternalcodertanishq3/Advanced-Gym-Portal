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
  SelectValue,
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
          className="relative flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-[2.5rem] border border-border bg-surface-card shadow-2xl"
        >
          <div className="custom-scrollbar overflow-y-auto p-6 md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Upload <span className="text-brand-orange">Progress</span>
              </h2>
              <button
                aria-label="Close"
                onClick={onClose}
                className="rounded-xl bg-surface-elevated p-2 text-txt-tertiary transition-colors hover:text-foreground"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={cn(
                  "group relative mx-auto flex aspect-[3/4] max-h-[400px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 border-dashed bg-surface-sunken transition-all",
                  preview ? "border-brand-orange/50" : "border-border hover:border-brand-orange/30",
                )}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <label className="cursor-pointer rounded-full border border-white/20 bg-white/20 px-6 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/30">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
                      <Upload className="h-8 w-8 text-txt-tertiary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">Select Progress Photo</p>
                      <p className="text-xs text-txt-tertiary">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Photo Type
                  </label>
                  <Select value={photoType} onValueChange={(val) => setPhotoType(val)}>
                    <SelectTrigger className="h-[50px] w-full rounded-xl border border-border bg-surface-sunken px-4 py-3 font-bold text-foreground outline-none transition-colors focus:border-brand-orange">
                      <SelectValue placeholder="Select View" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-surface-card">
                      <SelectItem value="FRONT">Front View</SelectItem>
                      <SelectItem value="SIDE">Side View</SelectItem>
                      <SelectItem value="BACK">Back View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.0"
                    className="h-[50px] w-full rounded-xl border border-border bg-surface-sunken px-4 py-3 font-bold text-foreground outline-none transition-colors focus:border-brand-orange"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !file}
                className="hover:bg-brand-orange-dark h-14 w-full rounded-2xl bg-brand-orange text-lg font-bold text-white shadow-lg shadow-brand-orange/20"
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
