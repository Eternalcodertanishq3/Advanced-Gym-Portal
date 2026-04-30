"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Universal Confirmation Modal
// ═══════════════════════════════════════════════════════════════

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record from our servers.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          bg: "bg-red-500/10",
          icon: "text-red-500",
          button: "bg-red-500 hover:bg-red-600 text-white",
          border: "border-red-500/20",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10",
          icon: "text-amber-500",
          button: "bg-amber-500 hover:bg-amber-600 text-white",
          border: "border-amber-500/20",
        };
      case "info":
        return {
          bg: "bg-brand-orange/10",
          icon: "text-brand-orange",
          button: "bg-brand-orange hover:bg-brand-orange/90 text-white",
          border: "border-brand-orange/20",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] bg-card border-border rounded-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Warning Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-16 h-16 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-center`}
            >
              {variant === "danger" ? (
                <Trash2 className={`w-8 h-8 ${styles.icon}`} />
              ) : (
                <AlertTriangle className={`w-8 h-8 ${styles.icon}`} />
              )}
            </motion.div>

            <div className="space-y-2">
              <DialogTitle className="text-xl font-display font-bold text-foreground uppercase tracking-widest">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground font-medium leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="mt-8 grid grid-cols-2 gap-3 sm:space-x-0">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="h-11 px-4 rounded-xl border border-border bg-transparent hover:bg-muted text-foreground text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`h-11 px-4 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-sm ${
                variant === "danger" ? "bg-danger hover:bg-danger-dark" : "bg-brand-orange hover:bg-brand-orange-hover"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
