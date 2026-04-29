import React from "react";
import { getPlans } from "@/actions/super-admin/plan-actions";
import { SubscriptionPlansClient } from "./components/plans-client";

export default async function SubscriptionPlansPage() {
  const { plans = [] } = await getPlans();

  // Convert Decimal to number for the client component
  const formattedPlans = plans?.map(p => ({
    ...p,
    price: Number(p.price),
  })) || [];

  return <SubscriptionPlansClient plans={formattedPlans} />;
}
