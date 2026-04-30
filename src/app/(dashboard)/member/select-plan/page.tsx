import React from "react";
import prisma from "@/lib/prisma";
import { SelectPlanClient } from "./components/select-plan-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/membership";

export const metadata = {
  title: "Choose Your Plan | Eagle Gym",
  description: "Select the membership plan that fits your fitness goals.",
};

export default async function SelectPlanPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // If already has active subscription, redirect back to dashboard
  const active = await hasActiveSubscription(session.user.id);
  if (active) {
    redirect("/member");
  }

  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  return (
    <div className="bg-brand-navy-dark min-h-screen">
      <SelectPlanClient plans={plans} />
    </div>
  );
}
