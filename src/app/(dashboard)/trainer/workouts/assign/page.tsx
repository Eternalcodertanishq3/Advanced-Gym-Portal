"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Dumbbell, Search, ChevronLeft, CheckCircle2, Clock, Zap, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkoutTemplates } from "@/actions/member/workout-management-actions";
import { assignWorkoutPlan } from "@/actions/admin/trainer-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Assign Workout Plan
// ═══════════════════════════════════════════════════════════════

function AssignWorkoutContent() {
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
      const res = await getWorkoutTemplates();
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
      const res = await assignWorkoutPlan(memberId, planId);
      if (res.success) {
        toast.success("Workout plan assigned successfully");
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
            Assign <span className="text-brand-orange">Workout Plan</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Choose a template to assign to your client.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="surface-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
          <Input
            placeholder="Search templates..."
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
            <p className="text-txt-secondary">No templates found.</p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card group flex flex-col justify-between p-6 transition-all hover:border-brand-orange/30"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-soft text-brand-orange transition-all group-hover:bg-brand-orange group-hover:text-white">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-surface-elevated text-[10px] font-bold uppercase tracking-widest text-txt-tertiary"
                  >
                    {template.difficulty || "ALL LEVELS"}
                  </Badge>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-brand-orange">
                  {template.name}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-txt-secondary">
                  {template.description ||
                    "A professional workout routine designed for optimal results."}
                </p>
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                    <Clock className="h-3.5 w-3.5" />
                    {template.estimatedDuration || "45"} MIN
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                    <Zap className="h-3.5 w-3.5" />
                    {template.exercises?.length || 0} EXERCISES
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleAssign(template.id)}
                disabled={isAssigning !== null}
                className={cn(
                  "h-11 w-full rounded-xl font-bold transition-all",
                  isAssigning === template.id
                    ? "cursor-not-allowed bg-brand-orange/50"
                    : "bg-brand-navy text-white shadow-sm hover:bg-brand-orange",
                )}
              >
                {isAssigning === template.id ? "Assigning..." : "Assign to Member"}
              </Button>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="flex gap-3 rounded-xl border border-info/20 bg-info-soft p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" />
        <p className="text-sm font-medium text-info/80">
          Assigning a template will update the member's current active plan. You can further
          customize the exercises in the member's profile after assignment.
        </p>
      </div>
    </div>
  );
}

export default function AssignWorkoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssignWorkoutContent />
    </Suspense>
  );
}
