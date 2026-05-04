import React from "react";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { SelectPlanClient } from "./components/select-plan-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/membership";
import { getSystemConfig } from "@/actions/super-admin/config-actions";

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

  const configRes = await getSystemConfig();
  const paymentMethods = (configRes.success && configRes.config?.paymentMethods)
    ? JSON.parse(configRes.config.paymentMethods) 
    : null;

  const rawPlans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  // Convert Decimal to numbers for serialization to client component
  const plans = rawPlans.map(plan => ({
    ...plan,
    price: Number(plan.price),
  }));

  const branches = await prisma.branch.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, location: true }
  });

  const userBranchId = (session.user as any).branchId;

  return (
    <div className="bg-brand-navy-dark min-h-screen">
      <SelectPlanClient 
        plans={plans} 
        customPaymentMethods={paymentMethods}
        branches={branches}
        userBranchId={userBranchId}
      />
    </div>
  );
}
