"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  Clock,
  FileText,
  Plus,
  MoreVertical,
  ChevronRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { setDefaultPaymentMethod } from "@/actions/member/billing-actions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Props {
  initialData: {
    subscription: any;
    paymentMethods: any[];
    invoices: any[];
  };
}

export function BillingClient({ initialData }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { subscription, paymentMethods, invoices } = initialData;

  const handleSetDefault = async (pmId: string) => {
    setLoading(pmId);
    const res = await setDefaultPaymentMethod(pmId);
    if (res.success) {
      toast.success("Default payment protocol updated");
    } else {
      toast.error(res.error || "Failed to update protocol");
    }
    setLoading(null);
  };

  return (
    <div className="mx-auto h-full w-full max-w-6xl space-y-12 p-6 duration-700 animate-in fade-in md:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground">
            Financial <span className="text-brand-orange">Protocols</span>
          </h1>
          <p className="mt-2 max-w-md text-sm font-medium text-txt-secondary">
            Manage your membership blueprints, payment methods, and historical invoices.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="surface-card flex items-center gap-3 rounded-2xl border border-border/50 px-6 py-3">
            <ShieldCheck className="h-5 w-5 text-success" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                Status
              </p>
              <p className="text-sm font-bold text-foreground">Verified Member</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {/* Active Subscription */}
          <section className="space-y-6">
            <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
              Current Blueprint
            </h3>
            <div className="surface-card group relative overflow-hidden rounded-[3rem] border border-border/50 p-10">
              <div className="absolute right-0 top-0 p-12 opacity-5 transition-transform duration-700 group-hover:scale-110">
                <Zap className="h-48 w-48" />
              </div>

              <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
                      <Zap className="h-7 w-7 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
                        {subscription?.plan?.name || "Standard Protocol"}
                      </h2>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-success">
                        Active Membership
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-10">
                    <div>
                      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                        Cycle Price
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        ₹{subscription?.plan?.price || "4999"}
                        <span className="text-xs text-txt-tertiary">/mo</span>
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                        Next Renewal
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {subscription?.endDate ? formatDate(subscription.endDate) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="hover:bg-brand-orange-dark h-14 rounded-2xl bg-brand-orange px-8 font-bold text-white shadow-xl shadow-brand-orange/20">
                    Upgrade Tier
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-10 text-[10px] font-black uppercase tracking-widest text-txt-tertiary transition-colors hover:text-danger"
                  >
                    Deactivate Cycle
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
                Payment Protocols
              </h3>
              <Button
                variant="outline"
                className="h-10 rounded-xl border-border/50 px-4 text-[10px] font-bold uppercase tracking-widest"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className={cn(
                    "surface-card flex h-48 flex-col justify-between rounded-3xl border p-6 transition-all",
                    pm.isDefault
                      ? "border-brand-orange/50 bg-gradient-to-br from-surface-card to-brand-navy/30 shadow-xl"
                      : "border-border/50 hover:border-border",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-sunken">
                      <CreditCard
                        className={cn(
                          "h-6 w-6",
                          pm.isDefault ? "text-brand-orange" : "text-txt-tertiary",
                        )}
                      />
                    </div>
                    {pm.isDefault && (
                      <span className="rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-brand-orange">
                        Primary
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-lg font-bold text-foreground">
                      •••• •••• •••• {pm.last4}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                      Exp: {pm.expMonth}/{pm.expYear}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border/10 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                      {pm.brand}
                    </p>
                    {!pm.isDefault && (
                      <button
                        onClick={() => handleSetDefault(pm.id)}
                        disabled={!!loading}
                        className="text-[9px] font-black uppercase tracking-widest text-brand-orange hover:underline disabled:opacity-50"
                      >
                        {loading === pm.id ? "Syncing..." : "Set Primary"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Invoice History Sidebar */}
        <section className="space-y-6">
          <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
            Archive
          </h3>
          <div className="surface-card flex h-[600px] flex-col rounded-[3rem] border border-border/50 p-8">
            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="group flex items-center justify-between rounded-2xl border border-border/30 bg-surface-sunken/50 p-5 transition-all hover:border-brand-orange/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated">
                      <FileText className="h-5 w-5 text-txt-tertiary transition-colors group-hover:text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">₹{inv.amount}</p>
                      <p className="text-[10px] font-medium text-txt-tertiary">
                        {formatDate(inv.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-success">
                      {inv.status}
                    </span>
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      aria-label={`View invoice for ₹${inv.amount}`}
                      className="hover:text-brand-orange-dark flex items-center gap-1.5 rounded-lg border border-brand-orange/10 bg-brand-orange/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-orange transition-colors"
                    >
                      View
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {invoices.length === 0 && (
                <div className="py-20 text-center">
                  <Clock className="mx-auto mb-4 h-10 w-10 text-txt-tertiary/20" />
                  <p className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                    No Records Found
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-brand-navy/50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-[10px] font-medium leading-relaxed text-txt-tertiary">
                  All billing cycles are secured with 256-bit encryption. VAT invoices are
                  dispatched automatically to your primary terminal.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-border/50 text-xs font-bold uppercase tracking-widest"
              >
                Download Full Archive
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Invoice Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedInvoice && (
              <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedInvoice(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border bg-surface-card p-10 shadow-2xl"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
                        <FileText className="h-7 w-7 text-brand-orange" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          Mission <span className="text-brand-orange">Receipt</span>
                        </h2>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                          Ref: {selectedInvoice.id.slice(0, 12).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      aria-label="Close Receipt"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-txt-tertiary transition-all hover:text-brand-orange"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6 rounded-[2rem] border border-border/50 bg-surface-sunken/50 p-8">
                    <div className="flex justify-between border-b border-border/30 pb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Transaction Date
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {formatDate(selectedInvoice.date)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Auth Status
                      </span>
                      <span className="rounded border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-success">
                        {selectedInvoice.status}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Protocol Tier
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {subscription?.plan?.name || "Standard"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                        Total Charged
                      </span>
                      <span className="font-display text-3xl font-bold tabular-nums text-brand-orange">
                        ₹{selectedInvoice.amount}
                      </span>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <Button className="hover:bg-brand-orange-dark h-14 flex-1 rounded-2xl bg-brand-orange font-bold text-white shadow-xl shadow-brand-orange/20">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex-1 rounded-2xl border-border/50 font-bold"
                    >
                      Email Copy
                    </Button>
                  </div>

                  <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-txt-tertiary opacity-40">
                    Eagle Gym — Integrated Member Finance
                  </p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
