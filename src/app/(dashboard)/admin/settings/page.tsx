"use client";

import { useState } from "react";
import { Settings2, Building, Clock, Bell, Palette, Save, Moon, Sun, Smartphone } from "lucide-react";
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
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    let promises = [];
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
      .catch((err) => toast.error("Failed to update settings"));
  };

  const tabs = [
    { id: "general", label: "General", icon: <Building className="w-4 h-4 mr-2" /> },
    { id: "hours", label: "Working Hours", icon: <Clock className="w-4 h-4 mr-2" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4 mr-2" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Platform <span className="text-brand-orange">Settings</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Configure your gym details, themes, and global preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-brand-navy hover:bg-brand-navy/90 text-white"
            onClick={handleSave}
            disabled={updateSetting.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {updateSetting.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                activeTab === tab.id 
                  ? "bg-surface-card text-brand-orange shadow-sm border border-surface-sunken"
                  : "text-obsidian-600 hover:bg-surface-card/50 hover:text-obsidian-900 border border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface-card rounded-3xl border border-surface-sunken shadow-sm p-6 md:p-8">
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* General Settings */}
              {activeTab === "general" && (
                <>
                  <div>
                    <h2 className="text-xl font-display font-bold text-obsidian-950">General Information</h2>
                    <p className="text-sm text-obsidian-500 mt-1">Basic details about your gym facility.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Gym Name</label>
                      <Input 
                        value={formValues["gym_name"] || ""} 
                        onChange={(e) => handleChange("gym_name", e.target.value)}
                        placeholder="Eagle Gym"
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy max-w-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Contact Email</label>
                      <Input 
                        type="email"
                        value={formValues["contact_email"] || ""} 
                        onChange={(e) => handleChange("contact_email", e.target.value)}
                        placeholder="admin@eaglegym.com"
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy max-w-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Contact Phone</label>
                      <Input 
                        value={formValues["contact_phone"] || ""} 
                        onChange={(e) => handleChange("contact_phone", e.target.value)}
                        placeholder="+91 9876543210"
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy max-w-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Address</label>
                      <Input 
                        value={formValues["gym_address"] || ""} 
                        onChange={(e) => handleChange("gym_address", e.target.value)}
                        placeholder="123 Fitness Street, New Delhi"
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Working Hours */}
              {activeTab === "hours" && (
                <>
                  <div>
                    <h2 className="text-xl font-display font-bold text-obsidian-950">Operating Hours</h2>
                    <p className="text-sm text-obsidian-500 mt-1">Configure when the gym is open for members.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Weekday Opening Time</label>
                      <Input 
                        type="time"
                        value={formValues["weekday_open"] || "06:00"} 
                        onChange={(e) => handleChange("weekday_open", e.target.value)}
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Weekday Closing Time</label>
                      <Input 
                        type="time"
                        value={formValues["weekday_close"] || "22:00"} 
                        onChange={(e) => handleChange("weekday_close", e.target.value)}
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Weekend Opening Time</label>
                      <Input 
                        type="time"
                        value={formValues["weekend_open"] || "08:00"} 
                        onChange={(e) => handleChange("weekend_open", e.target.value)}
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-obsidian-900">Weekend Closing Time</label>
                      <Input 
                        type="time"
                        value={formValues["weekend_close"] || "20:00"} 
                        onChange={(e) => handleChange("weekend_close", e.target.value)}
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <>
                  <div>
                    <h2 className="text-xl font-display font-bold text-obsidian-950">Interface Appearance</h2>
                    <p className="text-sm text-obsidian-500 mt-1">Customize the portal's visual theme.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-obsidian-900 mb-2">Theme Preference</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-brand-orange bg-brand-orange/5 text-brand-orange">
                        <Sun className="w-6 h-6" />
                        <span className="font-semibold text-sm">Athletic Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-surface-sunken bg-surface-base text-obsidian-500 hover:border-obsidian-300">
                        <Moon className="w-6 h-6" />
                        <span className="font-semibold text-sm">Carbon Dark</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-surface-sunken bg-surface-base text-obsidian-500 hover:border-obsidian-300">
                        <Smartphone className="w-6 h-6" />
                        <span className="font-semibold text-sm">System Sync</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <>
                  <div>
                    <h2 className="text-xl font-display font-bold text-obsidian-950">Notification Channels</h2>
                    <p className="text-sm text-obsidian-500 mt-1">Toggle automated messaging channels.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-surface-sunken bg-surface-base">
                      <div>
                        <p className="font-medium text-obsidian-950">Email Notifications</p>
                        <p className="text-xs text-obsidian-500 mt-0.5">Send invoices and reminders via email.</p>
                      </div>
                      {/* Placeholder for Switch component */}
                      <div className="w-10 h-5 bg-brand-navy rounded-full flex items-center justify-end px-1 cursor-pointer">
                        <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-surface-sunken bg-surface-base">
                      <div>
                        <p className="font-medium text-obsidian-950">WhatsApp Integration</p>
                        <p className="text-xs text-obsidian-500 mt-0.5">Send instant messages via WhatsApp Business API.</p>
                      </div>
                      <div className="w-10 h-5 bg-brand-navy rounded-full flex items-center justify-end px-1 cursor-pointer">
                        <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
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
