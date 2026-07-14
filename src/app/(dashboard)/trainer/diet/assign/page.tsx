"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Apple, Search, ChevronLeft, Clock, Utensils, Info, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDietTemplates } from "@/actions/admin/diet-actions";
import { assignDietPlan } from "@/actions/admin/trainer-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Assign Diet Plan
// ═══════════════════════════════════════════════════════════════

function AssignDietContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("memberId");

  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) {
      toast.error("No member selected");
      router.push("/trainer/my-members");
      return;
    }

    async function loadTemplates() {
      const res = await getDietTemplates();
      if (res.success && res.data) {
        setTemplates(res.data);
      } else {
        toast.error("Failed to load templates");
      }
      setIsLoading(false);
    }
    loadTemplates();
  }, [memberId, router]);

  const handleAssign = async (planId: string) => {
    if (!memberId) return;

    setIsAssigning(planId);
    try {
      const res = await assignDietPlan(memberId, planId);
      if (res.success) {
        toast.success("Diet plan assigned successfully");
        router.push("/trainer/my-members");
      } else {
        toast.error(res.error || "Failed to assign plan");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsAssigning(null);
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex w-fit items-center gap-2 text-txt-tertiary transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Members</span>
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Assign <span className="text-success">Diet Plan</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Select a nutrition plan to help your client achieve their goals.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="surface-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
          <Input
            placeholder="Search diet templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-border bg-surface-sunken pl-9"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))
        ) : filteredTemplates.length === 0 ? (
          <div className="surface-card col-span-full py-12 text-center">
            <p className="text-txt-secondary">No diet templates found.</p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card group flex flex-col justify-between p-6 transition-all hover:border-success/30"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft text-success transition-all group-hover:bg-success group-hover:text-white">
                    <Apple className="h-6 w-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-surface-elevated text-[10px] font-bold uppercase tracking-widest text-txt-tertiary"
                  >
                    {template.type || "NUTRITION"}
                  </Badge>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-success">
                  {template.name}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-txt-secondary">
                  {template.description ||
                    "A balanced nutrition guide focused on meeting macronutrient requirements."}
                </p>
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                    <Flame className="h-3.5 w-3.5" />
                    {template.totalCalories || "2000"} KCAL
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                    <Utensils className="h-3.5 w-3.5" />
                    {template.meals?.length || 0} MEALS/DAY
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleAssign(template.id)}
                disabled={isAssigning !== null}
                className={cn(
                  "h-11 w-full rounded-xl font-bold transition-all",
                  isAssigning === template.id
                    ? "cursor-not-allowed bg-success/50"
                    : "bg-brand-navy text-white shadow-sm hover:bg-success",
                )}
              >
                {isAssigning === template.id ? "Assigning..." : "Assign to Member"}
              </Button>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="flex gap-3 rounded-xl border border-success/20 bg-success-soft/30 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        <p className="text-sm font-medium text-success/80">
          Note: Assigning a template will set it as the primary nutrition guide for the member.
          Detailed meal breakdowns can be viewed and modified in the member's profile.
        </p>
      </div>
    </div>
  );
}

export default function AssignDietPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssignDietContent />
    </Suspense>
  );
}
