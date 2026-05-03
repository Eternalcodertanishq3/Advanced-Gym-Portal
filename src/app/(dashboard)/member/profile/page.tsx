import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";
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
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="w-full h-full p-6 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          Account <span className="text-brand-orange">Settings</span>
        </h1>
        <p className="text-sm text-txt-secondary font-medium">Manage your personal information, security, and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-surface-sunken p-1 rounded-2xl mb-8 border border-border/50">
          <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange data-[state=active]:shadow-sm transition-all">
            <User className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange data-[state=active]:shadow-sm transition-all">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange data-[state=active]:shadow-sm transition-all">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <ProfileForm initialData={user} />
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
