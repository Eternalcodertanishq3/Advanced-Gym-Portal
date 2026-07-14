import React from "react";
import { getClasses } from "@/actions/admin/class-actions";
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
    <div className="mx-auto h-full w-full max-w-6xl space-y-10 p-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground">
            Gym <span className="text-brand-orange">Schedules</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Precision training blocks for dedicated athletes.
          </p>
        </div>
        <div className="flex rounded-2xl border border-border bg-surface-elevated p-1">
          <div className="rounded-xl bg-brand-orange px-6 py-2 text-xs font-bold text-white shadow-lg">
            Available Classes
          </div>
          <div className="rounded-xl px-6 py-2 text-xs font-bold text-txt-tertiary">
            My Bookings
          </div>
        </div>
      </div>

      <ClassesClient classes={classes} />
    </div>
  );
}
