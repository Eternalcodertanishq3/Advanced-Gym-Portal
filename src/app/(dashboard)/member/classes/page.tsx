import React from "react";
import { getClasses } from "@/server/actions/class-actions";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ClassesClient } from "./components/classes-client";

export const metadata = {
  title: "Book Classes | Eagle Gym",
  description: "Book your favorite gym classes and manage your schedule.",
};

export default async function ClassesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const res = await getClasses(1, 50); 
  const classes = res.success && res.data ? res.data.classes : [];

  return (
    <div className="w-full h-full p-6 space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1 uppercase tracking-tight">
            Gym <span className="text-brand-orange">Schedules</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Precision training blocks for dedicated athletes.</p>
        </div>
        <div className="flex bg-surface-elevated p-1 rounded-2xl border border-border">
          <div className="px-6 py-2 rounded-xl text-xs font-bold bg-brand-orange text-white shadow-lg">
            Available Classes
          </div>
          <div className="px-6 py-2 rounded-xl text-xs font-bold text-txt-tertiary">
            My Bookings
          </div>
        </div>
      </div>

      <ClassesClient classes={classes} />
    </div>
  );
}
