import React from "react";
import { getInventoryItems } from "@/actions/admin/inventory-actions";
import { POSClient } from "./components/pos-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Point of Sale | Eagle Gym",
  description: "Process product sales and manage store inventory.",
};

export default async function POSPage() {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  // Fetch all products (high limit for POS quick selection)
  const res = await getInventoryItems(1, 100);

  if (!res.success || !res.data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load inventory</h2>
        <p className="mt-2 text-sm text-txt-secondary">{res.error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <POSClient products={res.data.items} />
    </div>
  );
}
