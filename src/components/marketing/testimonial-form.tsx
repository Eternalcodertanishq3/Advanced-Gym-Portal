"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitTestimonial } from "@/actions/marketing/testimonial-actions";
import { toast } from "react-hot-toast";
import { X, Send, Star } from "lucide-react";

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialForm({ isOpen, onClose }: TestimonialFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitTestimonial(formData);

    setIsPending(false);
    if (result.success) {
      toast.success(result.message as string);
      onClose();
    } else {
      toast.error((result.error as string) || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-obsidian-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent" />
            
            <div className="p-8 sm:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase italic">Share Your <span className="text-brand-orange">Story.</span></h2>
                  <p className="text-white/40 text-sm font-medium mt-1">Tell the community about your transformation.</p>
                </div>
                <button 
                  onClick={onClose}
                  title="Close"
                  className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="author-input" className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Your Full Name</label>
                    <input 
                      id="author-input"
                      required
                      name="author"
                      type="text"
                      title="Enter your full name"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
