"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitTestimonial } from "@/actions/marketing/testimonial-actions";
import { toast } from "sonner";
import { X, Send, Star } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialForm({ isOpen, onClose }: TestimonialFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating first!");
      return;
    }

    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitTestimonial(formData);

    setIsPending(false);
    if (!result) {
      toast.error("Server connection failed. Please try again.");
      return;
    }

    if (result.success) {
      toast.success(result.message || "Feedback submitted!");
      onClose();
    } else {
      toast.error((result.error as string) || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[9999] max-w-xl overflow-hidden rounded-[2.5rem] border-white/10 bg-obsidian-900 p-0 shadow-2xl">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

        <div className="p-8 sm:p-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-3xl font-black uppercase italic tracking-tight text-white">
                Share Your <span className="text-brand-orange">Story.</span>
              </DialogTitle>
              <p className="mt-1 text-sm font-medium text-white/40">
                Tell the community about your transformation.
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              title="Close"
              className="rounded-full bg-white/5 p-2 text-white/40 transition-all hover:bg-white/10 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-orange">
                Rate Your Experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transform transition-all hover:scale-110 active:scale-95"
                    title={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating || rating) >= star
                          ? "fill-brand-orange text-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                          : "fill-none text-white/10"
                      } transition-all duration-200`}
                    />
                  </button>
                ))}
                <input type="hidden" name="rating" value={rating} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="author-input"
                  className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
                >
                  Your Full Name
                </label>
                <input
                  id="author-input"
                  required
                  name="author"
                  type="text"
                  title="Enter your full name"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="role-input"
                  className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
                >
                  Your Role/Title
                </label>
                <input
                  id="role-input"
                  name="role"
                  type="text"
                  title="Enter your role or title (e.g. Member, Athlete)"
                  autoComplete="organization-title"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="quote-input"
                className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
              >
                Your Experience
              </label>
              <textarea
                id="quote-input"
                required
                name="quote"
                rows={4}
                title="Describe your experience with the gym"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none"
              />
            </div>

            <button
              disabled={isPending}
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange py-5 font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange/90 disabled:opacity-50"
            >
              {isPending ? (
                "Submitting..."
              ) : (
                <>
                  Submit Feedback{" "}
                  <Send className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
