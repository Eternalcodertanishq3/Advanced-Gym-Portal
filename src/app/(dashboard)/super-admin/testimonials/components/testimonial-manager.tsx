"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Clock, Star, MessageSquare } from "lucide-react";
import { approveTestimonial, deleteTestimonial } from "@/actions/super-admin/testimonial-actions";
import { toast } from "react-hot-toast";

interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  quote: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
}

export default function TestimonialManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = React.useState(initialTestimonials);

  const handleApprove = async (id: string) => {
    const result = await approveTestimonial(id);
    if (result.success) {
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, isApproved: true } : t));
      toast.success("Testimonial approved!");
    } else {
      toast.error(result.error || "Failed to approve");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    const result = await deleteTestimonial(id);
    if (result.success) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success("Feedback deleted");
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/30 border border-dashed border-border rounded-[2rem]">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold text-foreground">No feedback yet</h3>
        <p className="text-muted-foreground">When members share their stories, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
        {testimonials.map((t) => (
          <motion.div 
            layout
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-[2rem] border transition-all duration-500 ${
              t.isApproved 
                ? "bg-brand-orange/5 border-brand-orange/20" 
                : "bg-muted/30 border-border"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">{t.author}</h4>
                  <p className="text-muted-foreground text-sm font-medium">{t.role || "Member"}</p>
                </div>
              </div>
              {!t.isApproved ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                  <Clock className="w-3 h-3" /> Pending
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <Check className="w-3 h-3" /> Live
                </div>
              )}
            </div>

            <p className="text-foreground/80 leading-relaxed italic mb-8">"{t.quote}"</p>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Submitted on {new Date(t.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                {!t.isApproved && (
                  <button 
                    onClick={() => handleApprove(t.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(t.id)}
                  title="Delete Feedback"
                  className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
