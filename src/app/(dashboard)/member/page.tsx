import React from "react";
import { auth } from "@/auth";
import { getMemberFeatures } from "@/lib/membership";
import { getMemberDashboardStats } from "@/server/actions/member-dashboard-actions";
import { MemberDashboardClient } from "./components/dashboard-client";
import { redirect } from "next/navigation";

export default async function MemberDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const allowedFeatures = await getMemberFeatures();
  const res = await getMemberDashboardStats(session.user.id);
  const stats = res.success ? res.data : null;

  return (
    <MemberDashboardClient 
      user={session.user as any}
      stats={stats}
      allowedFeatures={allowedFeatures}
    />
  );
}