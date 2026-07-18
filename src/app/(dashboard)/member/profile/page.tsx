import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/app/(dashboard)/admin/components/profile/profile-form";
import { User, Shield, Bell, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecuritySettings } from "./components/security-settings";
import { NotificationSettings } from "./components/notification-settings";

export const metadata = {
  title: "My Profile | Eagle Gym",
  description: "Manage your personal information and account settings.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatar: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto h-full w-full max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
          Account <span className="text-brand-orange">Settings</span>
        </h1>
        <p className="text-sm font-medium text-txt-secondary">
          Manage your personal information, security, and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-8 rounded-2xl border border-border/50 bg-surface-sunken p-1">
          <TabsTrigger
            value="general"
            className="rounded-xl px-6 py-2.5 transition-all data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange data-[state=active]:shadow-sm"
          >
            <User className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-6 py-2.5 transition-all data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange data-[state=active]:shadow-sm"
          >
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-xl px-6 py-2.5 transition-all data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange data-[state=active]:shadow-sm"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <ProfileForm initialData={user} twoFactorEnabled={user.twoFactorEnabled} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
