"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Apple,
  Search,
  ChevronLeft,
  Clock,
  Utensils,
  Info,
  Flame
} from "lucide-react";
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

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-txt-tertiary hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Members</span>
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Assign <span className="text-success">Diet Plan</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1">
            Select a nutrition plan to help your client achieve their goals.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="surface-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
          <Input
            placeholder="Search diet templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-sunken border-border h-11"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))
        ) : filteredTemplates.length === 0 ? (
          <div className="col-span-full py-12 text-center surface-card">
            <p className="text-txt-secondary">No diet templates found.</p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card p-6 flex flex-col justify-between hover:border-success/30 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success-soft flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-all">
                    <Apple className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="bg-surface-elevated text-txt-tertiary uppercase text-[10px] font-bold tracking-widest">
                    {template.type || "NUTRITION"}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-success transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-txt-secondary line-clamp-2 mb-4">
                  {template.description || "A balanced nutrition guide focused on meeting macronutrient requirements."}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                    <Flame className="w-3.5 h-3.5" />
                    {template.totalCalories || "2000"} KCAL
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-txt-tertiary">
                    <Utensils className="w-3.5 h-3.5" />
                    {template.meals?.length || 0} MEALS/DAY
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => handleAssign(template.id)}
                disabled={isAssigning !== null}
                className={cn(
                  "w-full h-11 rounded-xl font-bold transition-all",
                  isAssigning === template.id 
                    ? "bg-success/50 cursor-not-allowed" 
                    : "bg-brand-navy hover:bg-success text-white shadow-sm"
                )}
              >
                {isAssigning === template.id ? "Assigning..." : "Assign to Member"}
              </Button>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-xl bg-success-soft/30 border border-success/20 flex gap-3">
        <Info className="w-5 h-5 text-success shrink-0 mt-0.5" />
        <p className="text-sm text-success/80 font-medium">
          Note: Assigning a template will set it as the primary nutrition guide for the member. Detailed meal breakdowns can be viewed and modified in the member's profile.
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

