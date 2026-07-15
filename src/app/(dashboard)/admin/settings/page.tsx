"use client";

import { useState } from "react";
import {
  Settings2,
  Building,
  Clock,
  Bell,
  Palette,
  Save,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: settings, isLoading, updateSetting } = useSettings();
  const [activeTab, setActiveTab] = useState("general");

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Sync state once data loads
  if (settings && Object.keys(formValues).length === 0) {
    setFormValues(settings);
  }

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const promises = [];
    for (const [key, value] of Object.entries(formValues)) {
      if (settings && settings[key] !== value) {
        promises.push(updateSetting.mutateAsync({ key, value }));
      }
    }

    if (promises.length === 0) {
      toast.info("No changes to save");
      return;
    }

    Promise.all(promises)
      .then(() => toast.success("Settings updated successfully!"))
      .catch((_err) => toast.error("Failed to update settings"));
  };

  const tabs = [
    { id: "general", label: "General", icon: <Building className="mr-2 h-4 w-4" /> },
    { id: "hours", label: "Working Hours", icon: <Clock className="mr-2 h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="mr-2 h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Platform <span className="text-brand-orange">Settings</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Configure your gym details, themes, and global preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-brand-navy text-white hover:bg-brand-navy/90"
            onClick={handleSave}
            disabled={updateSetting.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {updateSetting.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 space-y-1 md:w-64">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border border-surface-sunken bg-surface-card text-brand-orange shadow-sm"
                  : "border border-transparent text-obsidian-600 hover:bg-surface-card/50 hover:text-obsidian-900",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-3xl border border-surface-sunken bg-surface-card p-6 shadow-sm md:p-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-4 pt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-8 duration-300 animate-in fade-in slide-in-from-bottom-2">
              {/* General Settings */}
              {activeTab === "general" && (
                <>
                  <div>
                    <h2 className="font-display text-xl font-bold text-obsidian-950">
                      General Information
                    </h2>
                    <p className="mt-1 text-sm text-obsidian-500">
                      Basic details about your gym facility.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Gym Name</label>
                      <Input
                        value={formValues["gym_name"] || ""}
                        onChange={(e) => handleChange("gym_name", e.target.value)}
                        placeholder="Eagle Gym"
                        className="max-w-md border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Contact Email</label>
                      <Input
                        type="email"
                        value={formValues["contact_email"] || ""}
                        onChange={(e) => handleChange("contact_email", e.target.value)}
                        placeholder="admin@eaglegym.com"
                        className="max-w-md border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Contact Phone</label>
                      <Input
                        value={formValues["contact_phone"] || ""}
                        onChange={(e) => handleChange("contact_phone", e.target.value)}
                        placeholder="+91 9876543210"
                        className="max-w-md border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Address</label>
                      <Input
                        value={formValues["gym_address"] || ""}
                        onChange={(e) => handleChange("gym_address", e.target.value)}
                        placeholder="123 Fitness Street, New Delhi"
                        className="border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Working Hours */}
              {activeTab === "hours" && (
                <>
                  <div>
                    <h2 className="font-display text-xl font-bold text-obsidian-950">
                      Operating Hours
                    </h2>
                    <p className="mt-1 text-sm text-obsidian-500">
                      Configure when the gym is open for members.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">
                        Weekday Opening Time
                      </label>
                      <Input
                        type="time"
                        value={formValues["weekday_open"] || "06:00"}
                        onChange={(e) => handleChange("weekday_open", e.target.value)}
                        className="border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">
                        Weekday Closing Time
                      </label>
                      <Input
                        type="time"
                        value={formValues["weekday_close"] || "22:00"}
                        onChange={(e) => handleChange("weekday_close", e.target.value)}
                        className="border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">
                        Weekend Opening Time
                      </label>
                      <Input
                        type="time"
                        value={formValues["weekend_open"] || "08:00"}
                        onChange={(e) => handleChange("weekend_open", e.target.value)}
                        className="border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">
                        Weekend Closing Time
                      </label>
                      <Input
                        type="time"
                        value={formValues["weekend_close"] || "20:00"}
                        onChange={(e) => handleChange("weekend_close", e.target.value)}
                        className="border-surface-sunken bg-surface-base focus-visible:ring-brand-navy"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <>
                  <div>
                    <h2 className="font-display text-xl font-bold text-obsidian-950">
                      Interface Appearance
                    </h2>
                    <p className="mt-1 text-sm text-obsidian-500">
                      Customize the portal's visual theme.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="mb-2 text-sm font-medium text-obsidian-900">Theme Preference</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-brand-orange bg-brand-orange/5 p-4 text-brand-orange">
                        <Sun className="h-6 w-6" />
                        <span className="text-sm font-semibold">Athletic Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-surface-sunken bg-surface-base p-4 text-obsidian-500 hover:border-obsidian-300">
                        <Moon className="h-6 w-6" />
                        <span className="text-sm font-semibold">Carbon Dark</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-surface-sunken bg-surface-base p-4 text-obsidian-500 hover:border-obsidian-300">
                        <Smartphone className="h-6 w-6" />
                        <span className="text-sm font-semibold">System Sync</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <>
                  <div>
                    <h2 className="font-display text-xl font-bold text-obsidian-950">
                      Notification Channels
                    </h2>
                    <p className="mt-1 text-sm text-obsidian-500">
                      Toggle automated messaging channels.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-surface-sunken bg-surface-base p-4">
                      <div>
                        <p className="font-medium text-obsidian-950">Email Notifications</p>
                        <p className="mt-0.5 text-xs text-obsidian-500">
                          Send invoices and reminders via email.
                        </p>
                      </div>
                      {/* Placeholder for Switch component */}
                      <div className="flex h-5 w-10 cursor-pointer items-center justify-end rounded-full bg-brand-navy px-1">
                        <div className="h-3.5 w-3.5 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-surface-sunken bg-surface-base p-4">
                      <div>
                        <p className="font-medium text-obsidian-950">WhatsApp Integration</p>
                        <p className="mt-0.5 text-xs text-obsidian-500">
                          Send instant messages via WhatsApp Business API.
                        </p>
                      </div>
                      <div className="flex h-5 w-10 cursor-pointer items-center justify-end rounded-full bg-brand-navy px-1">
                        <div className="h-3.5 w-3.5 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
