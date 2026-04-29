"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, ServerCrash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateSystemConfig } from "@/actions/super-admin/config-actions";
import { toast } from "sonner";

interface Props {
  initialConfig: Record<string, any>;
}

export function SystemConfigClient({ initialConfig }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("General Settings");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const res = await updateSystemConfig(data);
    
    if (res.success) {
      toast.success("System configurations saved!");
    } else {
      toast.error(res.error || "Failed to save settings");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide font-display flex items-center gap-3">
          <ServerCrash className="w-6 h-6 text-orange-400" />
          System Configuration
        </h1>
        <p className="text-sm text-white/50 mt-1">Manage global gym variables and system behaviors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col - Navigation */}
        <div className="space-y-2">
          {["General Settings", "Localization", "Notifications", "Security"].map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                activeTab === item ? "bg-white/10 text-white border border-white/10" : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Col - Forms */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-white/5 space-y-6 bg-obsidian-900/50 backdrop-blur-xl">
            {activeTab === "General Settings" && (
              <>
                <h2 className="text-lg font-display text-white border-b border-white/10 pb-2">General Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Gym Name</label>
                    <input 
                      name="gymName"
                      type="text" 
                      title="Gym Name"
                      defaultValue={initialConfig.gymName || "Eagle Gym"}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Support Email</label>
                      <input 
                        name="supportEmail"
                        type="email" 
                        title="Support Email"
                        defaultValue={initialConfig.supportEmail || "support@eaglegym.com"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Contact Phone</label>
                      <input 
                        name="contactPhone"
                        type="text" 
                        title="Contact Phone"
                        defaultValue={initialConfig.contactPhone || "+91 98765 43210"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-display text-white border-b border-white/10 pb-2 mt-8">Operational Hours</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Opening Time</label>
                    <input 
                      name="openingTime"
                      type="time" 
                      title="Opening Time"
                      defaultValue={initialConfig.openingTime || "05:00"}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Closing Time</label>
                    <input 
                      name="closingTime"
                      type="time" 
                      title="Closing Time"
                      defaultValue={initialConfig.closingTime || "23:00"}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab !== "General Settings" && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <Save className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-white/40 text-sm italic">Configuring {activeTab} will be available in the next system update.</p>
              </div>
            )}

            <div className="pt-6 flex justify-end border-t border-white/5 mt-6">
              <motion.button 
                type="submit"
                disabled={isSubmitting || activeTab !== "General Settings"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "Saving..." : "Save Configurations"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
