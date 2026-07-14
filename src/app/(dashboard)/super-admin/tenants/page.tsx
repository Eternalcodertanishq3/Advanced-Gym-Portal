"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getTenants, suspendTenant, activateTenant } from "@/actions/super-admin/tenant-actions";
import { toast } from "sonner";
import { Globe, Users, ShieldAlert, CheckCircle, Ban, RefreshCw, Layers } from "lucide-react";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    const res = await getTenants();
    if (res.success && res.data) {
      setTenants(res.data);
    } else {
      toast.error(res.error || "Failed to load tenants");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    startTransition(async () => {
      let res;
      if (currentStatus === "ACTIVE") {
        res = await suspendTenant(id);
      } else {
        res = await activateTenant(id);
      }

      if (res.success) {
        toast.success(
          `Tenant status updated to ${currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE"}`,
        );
        loadData();
      } else {
        toast.error(res.error || "Failed to update tenant status");
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <Globe className="h-6 w-6 text-brand-orange" />
            Tenant Management
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Manage multi-tenant SaaS domains, branding, locales, and system statuses.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading || isPending}
          className="hover:bg-surface-hover inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface-sunken px-4 text-sm font-semibold text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tenants Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60 bg-surface-sunken/40">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Tenant Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Subdomain
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Plan
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Billing Currency
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Users Count
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  SaaS Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-txt-secondary">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-brand-orange" />
                      Fetching tenants...
                    </div>
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-txt-secondary">
                    No tenants found. Add your first tenant to get started!
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-surface-hover/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{tenant.name}</div>
                      <div className="text-xs text-txt-tertiary">Locale: {tenant.locale}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-brand-orange">
                      {tenant.subdomain}.gymflow.saas
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-semibold text-brand-orange">
                        <Layers className="h-3.5 w-3.5" />
                        {tenant.saasPlan?.name || "Free Trial"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{tenant.currency}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-foreground">
                        <Users className="h-4 w-4 text-txt-tertiary" />
                        {tenant._count?.users || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tenant.saasStatus === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {tenant.saasStatus === "ACTIVE" ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldAlert className="h-3.5 w-3.5" />
                        )}
                        {tenant.saasStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(tenant.id, tenant.saasStatus)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          tenant.saasStatus === "ACTIVE"
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        }`}
                      >
                        {tenant.saasStatus === "ACTIVE" ? (
                          <>
                            <Ban className="h-3.5 w-3.5" /> Suspend
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" /> Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
