import React from "react";
import { getClasses } from "@/server/actions/class-actions";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

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
    <div className="w-full h-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          Gym <span className="text-brand-orange">Classes</span>
        </h1>
        <p className="text-sm text-txt-secondary font-medium">Explore and book your favorite training sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full py-20 text-center surface-card border-dashed border-2">
            <p className="text-txt-tertiary">No classes available at the moment.</p>
          </div>
        ) : (
          classes.map((cls: any) => (
            <div key={cls.id} className="surface-card p-6 flex flex-col group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                  {cls.category}
                </span>
                <span className="text-xs font-bold text-txt-tertiary">
                  {cls.duration} min
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-orange transition-colors">
                {cls.name}
              </h3>
              <p className="text-sm text-txt-secondary line-clamp-2 mb-6 flex-1">
                {cls.description || "No description provided."}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold">
                    {cls.trainer?.user?.firstName?.[0]}{cls.trainer?.user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {cls.trainer?.user?.firstName} {cls.trainer?.user?.lastName}
                    </p>
                    <p className="text-[10px] text-txt-tertiary">Head Trainer</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-sunken text-xs font-bold transition-all">
                  View Schedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
