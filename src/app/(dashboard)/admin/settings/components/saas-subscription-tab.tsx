"use client";

import React, { useEffect, useState } from "react";
import {
  getCurrentTenantSubscription,
  updateTenantSaaSPlan,
} from "@/actions/admin/tenant-subscription-actions";
import { Crown, Check, AlertCircle, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SaasSubscriptionTab() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [data, setData] = useState<{ tenant: any; plans: any[] } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await getCurrentTenantSubscription();
    if (res.success) {
      setData({ tenant: res.tenant, plans: res.plans || [] });
    } else {
      toast.error(res.error || "Failed to load billing information");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePlanChange = async (planId: string, planName: string) => {
    const isUpgrade = data?.tenant?.saasPlanId !== planId;
    const confirmMessage = isUpgrade
      ? `Are you sure you want to upgrade your workspace to the ${planName} Plan?`
      : `Are you sure you want to downgrade to the ${planName} Plan? Downturn plan limits may restrict branches/members.`;

    if (!window.confirm(confirmMessage)) return;

    setUpdating(planId);
    try {
      const res = await updateTenantSaaSPlan(planId);
      if (res.success) {
        toast.success(res.message);
        await loadData();
      } else {
        toast.error(res.error || "Failed to change subscription plan");
      }
    } catch {
      toast.error("Internal transaction error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Loading billing settings...
        </p>
      </div>
    );
  }

  const currentPlan = data?.tenant?.saasPlan;
  const plans = data?.plans || [];

  return (
    <div className="space-y-8 duration-200 animate-in fade-in">
      {/* Overview Block */}
      <div className="rounded-3xl border border-brand-orange/10 bg-brand-orange/5 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
              <Crown className="h-7 w-7 text-brand-orange" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                Workspace Subscription
              </p>
              <h3 className="font-display text-2xl font-black text-foreground">
                {currentPlan?.name || "Free Trial"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Status:{" "}
                <span className="font-bold uppercase text-foreground">
                  {data?.tenant?.saasStatus}
                </span>
                {data?.tenant?.saasExpiry &&
                  ` • Expires: ${new Date(data.tenant.saasExpiry).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              {currentPlan ? `₹${Number(currentPlan.price).toLocaleString()}/month` : "Free"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Current Billing Cycle
            </p>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
            Available SaaS Workspace Plans
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Select the tier to scale your gym facilities, members, and operations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = data?.tenant?.saasPlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-[2rem] border p-6 shadow-md transition-all duration-300",
                  isCurrent
                    ? "border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange"
                    : "border-border bg-surface-card hover:border-brand-orange/50 hover:shadow-lg",
                )}
              >
                {isCurrent && (
                  <span className="absolute right-4 top-4 flex h-6 items-center gap-1 rounded-full bg-brand-orange px-3 text-[9px] font-black uppercase tracking-wider text-white">
                    <Sparkles className="h-3 w-3" /> Active Plan
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                      {plan.name}
                    </h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-foreground">
                        ₹{Number(plan.price).toLocaleString()}
                      </span>
                      <span className="text-xs uppercase text-muted-foreground">
                        /{plan.interval === "MONTHLY" ? "mo" : "yr"}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-brand-orange" />
                      <span>
                        Up to <strong>{plan.maxBranches}</strong> Branches
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-brand-orange" />
                      <span>
                        Up to <strong>{plan.maxMembers}</strong> Members
                      </span>
                    </li>
                    {plan.features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={() => handlePlanChange(plan.id, plan.name)}
                    disabled={isCurrent || updating !== null}
                    className={cn(
                      "h-11 w-full rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95",
                      isCurrent
                        ? "border border-brand-orange/20 bg-brand-orange/10 text-brand-orange"
                        : "bg-brand-orange text-white shadow-md shadow-brand-orange/10 hover:bg-brand-orange-hover",
                    )}
                  >
                    {updating === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : (
                      "Switch Plan"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
