import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Pill, Zap, Clock, ShieldCheck, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Supplement Tracker | Eagle Gym",
  description: "Manage your daily supplement stack and performance boosters.",
};

export default async function SupplementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) redirect("/member");

  // Fetch real supplements from member's purchase history
  const userSales = await prisma.sale.findMany({
    where: { customerId: member.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const boughtSupplements = Array.from(
    new Set(
      userSales.flatMap((sale) =>
        sale.items
          .filter((item) => item.product.category === "SUPPLEMENT")
          .map((item) => item.product),
      ),
    ),
  );

  const activeStack =
    boughtSupplements.length > 0
      ? boughtSupplements.map((product) => ({
          id: product.id,
          name: product.name,
          dosage: "Per Label",
          time: "Daily",
          purpose: product.description || "Health & Recovery",
          status: "In Use",
          icon: <Zap className="h-5 w-5 text-brand-orange" />,
        }))
      : [];

  return (
    <div className="mx-auto h-full w-full max-w-5xl space-y-10 p-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
            Supplement <span className="text-brand-orange">Stack</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Optimize your recovery and performance with a smart supplement routine.
          </p>
        </div>
        <Button className="hover:bg-brand-orange-dark gap-2 bg-brand-orange px-6 font-bold">
          <Pill className="h-4 w-4" />
          Add Supplement
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Daily Stack */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="flex items-center gap-3 text-xl font-bold text-foreground">
            <Clock className="h-6 w-6 text-brand-orange" />
            Daily Routine
          </h3>
          <div className="space-y-4">
            {activeStack.length === 0 ? (
              <div className="surface-card border-2 border-dashed py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken">
                  <Pill className="h-8 w-8 text-txt-tertiary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Stack is Empty</h3>
                <p className="mx-auto mb-8 max-w-[300px] text-sm text-txt-tertiary">
                  You haven't added any supplements to your routine yet. Visit the store to get
                  started.
                </p>
                <Button variant="outline" className="border-border/50">
                  Browse Recommendations
                </Button>
              </div>
            ) : (
              activeStack.map((sup) => (
                <div
                  key={sup.id}
                  className="surface-card group flex items-center justify-between p-5 transition-all hover:border-brand-orange/30"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-surface-sunken">
                      {sup.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground transition-colors group-hover:text-brand-orange">
                          {sup.name}
                        </h4>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${
                            sup.status === "Taken"
                              ? "bg-success-soft text-success"
                              : "bg-surface-elevated text-txt-tertiary"
                          }`}
                        >
                          {sup.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-txt-tertiary">
                        {sup.dosage} • {sup.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden max-w-[150px] truncate text-[10px] font-bold uppercase tracking-widest text-txt-tertiary sm:block">
                      {sup.purpose}
                    </span>
                    <button
                      aria-label={`View details for ${sup.name}`}
                      className="rounded-lg bg-surface-elevated p-2 text-txt-tertiary hover:text-brand-orange"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shop Supplements */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-3 text-xl font-bold text-foreground">
            <ShoppingCart className="h-6 w-6 text-brand-orange" />
            Gym Store
          </h3>
          <div className="surface-card group relative cursor-pointer overflow-hidden border-none bg-brand-navy p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative z-10">
              <h4 className="mb-2 font-display text-lg font-bold text-white">Refill Your Stack</h4>
              <p className="mb-6 text-sm text-white/60">
                Get 10% member discount on all premium supplements at the Eagle Gym Store.
              </p>
              <Button className="hover:bg-brand-orange-dark w-full border-none bg-brand-orange shadow-lg shadow-brand-orange/20">
                Browse Shop
              </Button>
            </div>
          </div>

          <div className="surface-card space-y-4 p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
              Stack Insights
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-txt-secondary">Consistency</span>
                <span
                  className={`font-bold ${activeStack.length > 0 ? "text-success" : "text-txt-tertiary"}`}
                >
                  {activeStack.length > 0 ? "92%" : "N/A"}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                <div
                  className={`h-full ${activeStack.length > 0 ? "bg-success" : "bg-surface-elevated"} transition-all duration-1000`}
                  style={{ width: activeStack.length > 0 ? "92%" : "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
