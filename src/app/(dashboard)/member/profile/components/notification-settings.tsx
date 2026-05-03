"use client";

import React, { useState } from "react";
import { Bell, Mail, Phone, Smartphone, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateNotificationPreferences } from "@/actions/member/profile-actions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    workoutReminders: true,
    nutritionTips: true,
    billingAlerts: true,
    trainerMessages: true,
    newsletter: false,
    appUpdates: true
  });

  const handleSave = async () => {
    setLoading(true);
    const res = await updateNotificationPreferences(prefs);
    if (res.success) {
      toast.success("Preferences updated");
    } else {
      toast.error("Failed to save preferences");
    }
    setLoading(false);
  };

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="surface-card p-10 rounded-[2.5rem] border border-border/50 shadow-xl overflow-hidden relative">
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center border border-info/20 shadow-info-glow">
              <Bell className="w-6 h-6 text-info" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">Signal Control</h2>
              <p className="text-sm text-txt-tertiary font-medium">Calibrate how you receive intelligence and alerts.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] ml-1">Engagement Alerts</h3>
            <div className="grid grid-cols-1 gap-4">
              <NotificationToggle 
                title="Trainer Communications" 
                desc="Direct messages and feedback from your coach." 
                active={prefs.trainerMessages} 
                onToggle={() => toggle('trainerMessages')} 
                icon={<Mail className="w-4 h-4" />}
              />
              <NotificationToggle 
                title="Workout Reminders" 
                desc="Daily signals to ensure you never miss a mission." 
                active={prefs.workoutReminders} 
                onToggle={() => toggle('workoutReminders')} 
                icon={<Smartphone className="w-4 h-4" />}
              />
              <NotificationToggle 
                title="Nutrition Optimization" 
                desc="Updates to your meal blueprints and hydration targets." 
                active={prefs.nutritionTips} 
                onToggle={() => toggle('nutritionTips')} 
                icon={<Info className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] ml-1">System Intelligence</h3>
            <div className="grid grid-cols-1 gap-4">
              <NotificationToggle 
                title="Billing & Membership" 
                desc="Invoices, plan updates, and payment confirmations." 
                active={prefs.billingAlerts} 
                onToggle={() => toggle('billingAlerts')} 
                icon={<CheckCircle2 className="w-4 h-4" />}
              />
              <NotificationToggle 
                title="Eagle Gym Intelligence" 
                desc="New feature drops, gym events, and community news." 
                active={prefs.appUpdates} 
                onToggle={() => toggle('appUpdates')} 
                icon={<Bell className="w-4 h-4" />}
              />
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={loading}
            className="w-full h-14 bg-info hover:bg-info/90 text-white font-bold rounded-2xl shadow-xl shadow-info/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? "Calibrating..." : "Save Communication Protocol"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationToggle({ title, desc, active, onToggle, icon }: any) {
  return (
    <div className="p-6 rounded-[2rem] bg-surface-sunken/50 border border-border/50 flex items-center justify-between group hover:border-info/30 transition-all">
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
          active ? "bg-info text-white" : "bg-surface-elevated text-txt-tertiary"
        )}>
          {icon}
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground leading-tight">{title}</h4>
          <p className="text-xs text-txt-tertiary font-medium mt-1">{desc}</p>
        </div>
      </div>
      <Switch checked={active} onCheckedChange={onToggle} />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
