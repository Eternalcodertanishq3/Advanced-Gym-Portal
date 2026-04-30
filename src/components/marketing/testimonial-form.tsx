"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitTestimonial } from "@/actions/marketing/testimonial-actions";
import { toast } from "sonner";
import { X, Send, Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <DialogContent className="max-w-xl bg-obsidian-900 border-white/10 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl z-[9999]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent" />
        
        <div className="p-8 sm:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <DialogTitle className="text-3xl font-display font-black text-white tracking-tight uppercase italic">
                Share Your <span className="text-brand-orange">Story.</span>
              </DialogTitle>
              <p className="text-white/40 text-sm font-medium mt-1">Tell the community about your transformation.</p>
            </div>
            <button 
              onClick={onClose}
              type="button"
              title="Close"
              className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-orange block">Rate Your Experience</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all transform hover:scale-110 active:scale-95"
                    title={`Rate ${star} stars`}
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star 
                          ? "text-brand-orange fill-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                          : "text-white/10 fill-none"
                      } transition-all duration-200`} 
                    />
                  </button>
                ))}
                <input type="hidden" name="rating" value={rating} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="author-input" className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Your Full Name</label>
                <input 
                  id="author-input"
                  required
                  name="author"
                  type="text"
                  title="Enter your full name"
                  autoComplete="name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role-input" className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Your Role/Title</label>
                <input 
                  id="role-input"
                  name="role"
                  type="text"
                  title="Enter your role or title (e.g. Member, Athlete)"
                  autoComplete="organization-title"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="quote-input" className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Your Experience</label>
              <textarea 
                id="quote-input"
                required
                name="quote"
                rows={4}
                title="Describe your experience with the gym"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50 focus:bg-white/10 transition-all resize-none"
              />
            </div>

            <button 
              disabled={isPending}
              type="submit"
              className="w-full py-5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isPending ? (
                "Submitting..."
              ) : (
                <>
                  Submit Feedback <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
