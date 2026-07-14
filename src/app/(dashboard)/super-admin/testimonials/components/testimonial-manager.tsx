"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Clock, Star, MessageSquare } from "lucide-react";
import { approveTestimonial, deleteTestimonial } from "@/actions/super-admin/testimonial-actions";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/confirm-modal";

interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  quote: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
}

export default function TestimonialManager({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const [testimonials, setTestimonials] = React.useState(initialTestimonials);
  const [deleteModal, setDeleteModal] = React.useState({ open: false, id: "" });
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleApprove = async (id: string) => {
    const result = await approveTestimonial(id);
    if (result.success) {
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t)));
      toast.success("Testimonial approved!");
    } else {
      toast.error(result.error || "Failed to approve");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setIsDeleting(true);
    const result = await deleteTestimonial(deleteModal.id);
    setIsDeleting(false);

    if (result.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteModal.id));
      toast.success("Feedback deleted successfully");
      setDeleteModal({ open: false, id: "" });
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-muted/30 py-20">
        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-bold text-foreground">No feedback yet</h3>
        <p className="text-muted-foreground">
          When members share their stories, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {testimonials.map((t) => (
          <motion.div
            layout
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-[2rem] border p-6 transition-all duration-500 ${
              t.isApproved
                ? "border-brand-orange/20 bg-brand-orange/5"
                : "border-border bg-muted/30"
            }`}
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/20">
                  <Star className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{t.author}</h4>
                  <p className="text-sm font-medium text-muted-foreground">{t.role || "Member"}</p>
                </div>
              </div>
              {!t.isApproved ? (
                <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500">
                  <Clock className="h-3 w-3" /> Pending
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <Check className="h-3 w-3" /> Live
                </div>
              )}
            </div>

            <p className="mb-8 italic leading-relaxed text-foreground/80">"{t.quote}"</p>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Submitted on {new Date(t.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                {!t.isApproved && (
                  <button
                    onClick={() => handleApprove(t.id)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                )}
                <button
                  onClick={() => setDeleteModal({ open: true, id: t.id })}
                  title="Delete Feedback"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: "" })}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Feedback?"
        description="This will permanently remove this member story from your records and the landing page. This action cannot be reversed."
        confirmText="Delete Now"
      />
    </div>
  );
}
