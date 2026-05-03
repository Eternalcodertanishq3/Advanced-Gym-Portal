import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBillingInfo } from "@/actions/member/billing-actions";
import { BillingClient } from "./components/billing-client";

export const metadata = {
  title: "Billing & Subscriptions | Eagle Gym",
  description: "Manage your membership plans and payment methods.",
};

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const res = await getBillingInfo();
  if (!res.success || !res.data) {
     // Handle error or redirect
     redirect("/member");
  }

  return <BillingClient initialData={res.data} />;
}
