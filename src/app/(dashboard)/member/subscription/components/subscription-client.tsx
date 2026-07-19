"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  History,
  Download,
  AlertCircle,
  Clock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import html2canvas from "html2canvas";
import { toast } from "sonner";

const containerVariants = {
  // ... (omitted)
};

const itemVariants = {
  // ... (omitted)
};

interface Props {
  subscription: any;
  payments: any[];
}

export function MemberSubscriptionClient({ subscription, payments }: Props) {
  const isActive = subscription?.status === "ACTIVE";
  const plan = subscription?.plan;

  const downloadReceipt = async (payment: any) => {
    toast.loading("Generating receipt...", { id: "receipt-gen" });

    try {
      // Create a hidden receipt element
      const receiptEl = document.createElement("div");
      receiptEl.style.position = "absolute";
      receiptEl.style.left = "-9999px";
      receiptEl.style.top = "-9999px";
      receiptEl.style.width = "800px";
      receiptEl.style.padding = "60px";
      receiptEl.style.backgroundColor = "#ffffff";
      receiptEl.style.color = "#111827";
      receiptEl.style.fontFamily = "sans-serif";

      receiptEl.innerHTML = `
        <div style="border: 2px solid #E85D26; padding: 40px; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 30px; margin-bottom: 40px;">
            <div>
              <h1 style="color: #E85D26; margin: 0; font-size: 32px; letter-spacing: -1px;">EAGLE GYM</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">Official Payment Receipt</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: 700; font-size: 16px;">Receipt #: ${payment.receiptNo || "REC-" + payment.id.slice(0, 8)}</p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <p style="color: #6b7280; text-transform: uppercase; font-size: 12px; font-weight: 700; margin-bottom: 15px;">Billed To</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700;">${subscription.member?.user?.firstName || "Valued Member"}</p>
            <p style="margin: 5px 0 0 0; color: #4b5563;">Membership ID: ${subscription.memberId}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
              <tr style="border-bottom: 2px solid #f3f4f6;">
                <th style="text-align: left; padding: 15px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Description</th>
                <th style="text-align: right; padding: 15px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 20px 0; font-weight: 600;">${payment.description || "Gym Membership Subscription"}</td>
                <td style="padding: 20px 0; text-align: right; font-weight: 700; font-size: 18px;">₹${payment.amount}</td>
              </tr>
            </tbody>
          </table>

          <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Payment Method</p>
              <p style="margin: 5px 0 0 0; font-weight: 700; text-transform: uppercase;">${payment.method}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Paid</p>
              <p style="margin: 5px 0 0 0; color: #E85D26; font-size: 28px; font-weight: 800;">₹${payment.amount}</p>
            </div>
          </div>

          <div style="margin-top: 60px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Thank you for being part of Eagle Gym!</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">This is a computer-generated receipt.</p>
          </div>
        </div>
      `;

      document.body.appendChild(receiptEl);

      const canvas = await html2canvas(receiptEl, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `EagleGym_Receipt_${payment.receiptNo || payment.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      document.body.removeChild(receiptEl);
      toast.success("Receipt downloaded successfully!", { id: "receipt-gen" });
    } catch (error) {
      console.error("Receipt generation failed:", error);
      toast.error("Failed to generate receipt", { id: "receipt-gen" });
    }
  };

  return (
    // ... (logic continues)
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl space-y-10 py-6"
    >
      {/* Navigation Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <Link
          href="/member"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-txt-tertiary transition-colors hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          My <span className="text-brand-orange">Subscription</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Current Plan Card */}
        <motion.div variants={itemVariants} className="space-y-6 lg:col-span-2">
          <div className="surface-card group relative overflow-hidden p-8">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
                    <Crown className="h-8 w-8 text-brand-orange" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-orange">
                      Current Active Plan
                    </p>
                    <h3 className="font-display text-3xl font-bold text-foreground">
                      {plan?.name || "No Active Plan"}
                    </h3>
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest",
                    isActive
                      ? "border-success/20 bg-success-soft text-success"
                      : "border-danger/20 bg-danger-soft text-danger",
                  )}
                >
                  {isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-border pt-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-txt-tertiary">
                    Member Since
                  </p>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    {subscription?.startDate
                      ? formatDate(subscription.startDate, "dd MMM yyyy")
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-txt-tertiary">
                    Renewal Date
                  </p>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Clock className="h-4 w-4 text-brand-orange" />
                    {subscription?.endDate
                      ? formatDate(subscription.endDate, "dd MMM yyyy")
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Link href="/member/select-plan" className="flex-1">
                  <Button className="hover:bg-brand-orange-dark h-12 w-full bg-brand-orange text-base font-bold text-white shadow-lg shadow-brand-orange/20">
                    Change Plan
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="h-12 border border-border px-8 font-bold text-txt-secondary hover:bg-surface-sunken"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <History className="h-5 w-5 text-brand-orange" />
              <h3 className="text-xl font-bold text-foreground">Billing History</h3>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-sunken">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Invoice
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center font-medium italic text-txt-tertiary"
                        >
                          No billing records found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="group transition-colors hover:bg-surface-sunken/50"
                        >
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-foreground">
                              {formatDate(payment.createdAt, "dd MMM yyyy")}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-txt-secondary">
                              {payment.receiptNo || `INV-${payment.id.slice(0, 8)}`}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-foreground">₹{payment.amount}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                                payment.status === "COMPLETED" && "bg-success-soft text-success",
                                payment.status === "FAILED" && "bg-danger-soft text-danger",
                                payment.status === "PENDING" && "bg-warning-soft text-warning",
                              )}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {payment.status === "FAILED" ? (
                                <Link href="/member/select-plan">
                                  <Button className="h-8 rounded-lg bg-red-600 px-3 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-red-700">
                                    Retry
                                  </Button>
                                </Link>
                              ) : (
                                <button
                                  onClick={() => downloadReceipt(payment)}
                                  aria-label="Download Receipt"
                                  className="rounded-lg bg-surface-elevated p-2 text-txt-tertiary transition-colors hover:text-brand-orange"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support & Help Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="surface-card border-dashed bg-surface-sunken p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-soft">
                <AlertCircle className="h-6 w-6 text-info" />
              </div>
              <h4 className="font-bold text-foreground">Payment Help</h4>
            </div>
            <p className="mb-6 text-sm text-txt-secondary">
              Need help with your subscription or have questions about your bill? Our support team
              is here for you.
            </p>
            <Button
              variant="outline"
              className="w-full border-brand-orange/30 font-bold text-brand-orange hover:bg-brand-orange/5"
            >
              Contact Support
            </Button>
          </div>

          <div className="surface-card space-y-4 p-6">
            <h4 className="font-bold text-foreground">Plan Benefits</h4>
            <div className="space-y-3">
              {[
                "Unlimited Gym Access",
                "Personalized Workout Plans",
                "Custom Nutrition Guides",
                "Advanced Progress Tracking",
                "Locker & Shower Access",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-txt-secondary">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
