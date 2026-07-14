import React from "react";
import { getEquipment } from "@/actions/admin/equipment-actions";
import { EquipmentClient } from "./components/equipment-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Asset Inventory | Eagle Gym",
  description: "Monitor and report issues for gym equipment.",
};

export default async function EquipmentPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "WORKER") {
    redirect("/login");
  }

  // Fetch all equipment (no pagination for worker quick view, or high limit)
  const res = await getEquipment(1, 100);

  if (!res.success) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load equipment</h2>
        <p className="mt-2 text-sm text-txt-secondary">{res.error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <EquipmentClient equipment={res.data?.equipment ?? []} />
    </div>
  );
}
