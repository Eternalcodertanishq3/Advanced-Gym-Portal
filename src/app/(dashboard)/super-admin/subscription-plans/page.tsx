import React from "react";
import { getPlans } from "@/actions/super-admin/plan-actions";
import { PlanClient } from "./components/plan-client";

export const metadata = {
  title: "Subscription Plans | Super Admin Dashboard",
  description: "Manage membership tiers and feature access levels.",
};

export default async function SubscriptionPlansPage() {
  const { plans } = await getPlans();

  return (
    <div className="p-4 md:p-8">
      <PlanClient initialPlans={plans || []} />
    </div>
  );
}
