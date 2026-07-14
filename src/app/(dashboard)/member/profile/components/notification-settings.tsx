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
    appUpdates: true,
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
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="surface-card relative overflow-hidden rounded-[2.5rem] border border-border/50 p-10 shadow-xl">
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-5">
            <div className="shadow-info-glow flex h-14 w-14 items-center justify-center rounded-2xl border border-info/20 bg-info/10">
              <Bell className="h-6 w-6 text-info" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                Signal Control
              </h2>
              <p className="text-sm font-medium text-txt-tertiary">
                Calibrate how you receive intelligence and alerts.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
              Engagement Alerts
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <NotificationToggle
                title="Trainer Communications"
                desc="Direct messages and feedback from your coach."
                active={prefs.trainerMessages}
                onToggle={() => toggle("trainerMessages")}
                icon={<Mail className="h-4 w-4" />}
              />
              <NotificationToggle
                title="Workout Reminders"
                desc="Daily signals to ensure you never miss a mission."
                active={prefs.workoutReminders}
                onToggle={() => toggle("workoutReminders")}
                icon={<Smartphone className="h-4 w-4" />}
              />
              <NotificationToggle
                title="Nutrition Optimization"
                desc="Updates to your meal blueprints and hydration targets."
                active={prefs.nutritionTips}
                onToggle={() => toggle("nutritionTips")}
                icon={<Info className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
              System Intelligence
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <NotificationToggle
                title="Billing & Membership"
                desc="Invoices, plan updates, and payment confirmations."
                active={prefs.billingAlerts}
                onToggle={() => toggle("billingAlerts")}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
              <NotificationToggle
                title="Eagle Gym Intelligence"
                desc="New feature drops, gym events, and community news."
                active={prefs.appUpdates}
                onToggle={() => toggle("appUpdates")}
                icon={<Bell className="h-4 w-4" />}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-info font-bold text-white shadow-xl shadow-info/20 transition-all hover:bg-info/90 active:scale-95"
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
    <div className="group flex items-center justify-between rounded-[2rem] border border-border/50 bg-surface-sunken/50 p-6 transition-all hover:border-info/30">
      <div className="flex items-center gap-5">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
            active ? "bg-info text-white" : "bg-surface-elevated text-txt-tertiary",
          )}
        >
          {icon}
        </div>
        <div>
          <h4 className="text-base font-bold leading-tight text-foreground">{title}</h4>
          <p className="mt-1 text-xs font-medium text-txt-tertiary">{desc}</p>
        </div>
      </div>
      <Switch checked={active} onCheckedChange={onToggle} />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
