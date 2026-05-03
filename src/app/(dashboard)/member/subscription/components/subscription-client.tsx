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
  Crown
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
              <p style="margin: 0; font-weight: 700; font-size: 16px;">Receipt #: ${payment.receiptNo || 'REC-' + payment.id.slice(0,8)}</p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <p style="color: #6b7280; text-transform: uppercase; font-size: 12px; font-weight: 700; margin-bottom: 15px;">Billed To</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700;">${subscription.member?.user?.firstName || 'Valued Member'}</p>
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
                <td style="padding: 20px 0; font-weight: 600;">${payment.description || 'Gym Membership Subscription'}</td>
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
        useCORS: true
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
      className="max-w-5xl mx-auto space-y-10 py-6"
    >
      {/* Navigation Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <Link 
          href="/member"
          className="flex items-center gap-2 text-txt-tertiary hover:text-brand-orange transition-colors text-sm font-bold uppercase tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
          My <span className="text-brand-orange">Subscription</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="surface-card p-8 relative overflow-hidden group">

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                    <Crown className="w-8 h-8 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-1">Current Active Plan</p>
                    <h3 className="text-3xl font-display font-bold text-foreground">{plan?.name || "No Active Plan"}</h3>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border",
                  isActive 
                    ? "bg-success-soft text-success border-success/20" 
                    : "bg-danger-soft text-danger border-danger/20"
                )}>
                  {isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-txt-tertiary uppercase tracking-wider">Member Since</p>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Calendar className="w-4 h-4 text-brand-orange" />
                    {subscription?.startDate ? formatDate(subscription.startDate, "dd MMM yyyy") : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-txt-tertiary uppercase tracking-wider">Renewal Date</p>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Clock className="w-4 h-4 text-brand-orange" />
                    {subscription?.endDate ? formatDate(subscription.endDate, "dd MMM yyyy") : "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Link href="/member/select-plan" className="flex-1">
                  <Button className="w-full bg-brand-orange hover:bg-brand-orange-dark h-12 text-white font-bold text-base shadow-lg shadow-brand-orange/20">
                    Change Plan
                  </Button>
                </Link>
                <Button variant="ghost" className="h-12 border border-border px-8 font-bold text-txt-secondary hover:bg-surface-sunken">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <History className="w-5 h-5 text-brand-orange" />
              <h3 className="text-xl font-bold text-foreground">Billing History</h3>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-sunken">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-txt-tertiary uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-txt-tertiary uppercase tracking-widest">Invoice</th>
                      <th className="px-6 py-4 text-xs font-bold text-txt-tertiary uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-txt-tertiary uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-txt-tertiary uppercase tracking-widest text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-txt-tertiary font-medium italic">
                          No billing records found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-surface-sunken/50 transition-colors group">
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-foreground">{formatDate(payment.createdAt, "dd MMM yyyy")}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-txt-secondary">{payment.receiptNo || `INV-${payment.id.slice(0, 8)}`}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-foreground">₹{payment.amount}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 rounded-full bg-success-soft text-success text-[10px] font-bold uppercase tracking-wider">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => downloadReceipt(payment)}
                              aria-label="Download Receipt"
                              className="p-2 rounded-lg bg-surface-elevated text-txt-tertiary hover:text-brand-orange transition-colors"
                            >
                              <Download className="w-4 h-4" />
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
        </motion.div>

        {/* Support & Help Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="surface-card p-6 bg-surface-sunken border-dashed">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-info-soft flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-info" />
              </div>
              <h4 className="font-bold text-foreground">Payment Help</h4>
            </div>
            <p className="text-sm text-txt-secondary mb-6">
              Need help with your subscription or have questions about your bill? Our support team is here for you.
            </p>
            <Button variant="outline" className="w-full border-brand-orange/30 text-brand-orange hover:bg-brand-orange/5 font-bold">
              Contact Support
            </Button>
          </div>

          <div className="surface-card p-6 space-y-4">
            <h4 className="font-bold text-foreground">Plan Benefits</h4>
            <div className="space-y-3">
              {[
                "Unlimited Gym Access",
                "Personalized Workout Plans",
                "Custom Nutrition Guides",
                "Advanced Progress Tracking",
                "Locker & Shower Access"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-txt-secondary">
                  <ShieldCheck className="w-4 h-4 text-success" />
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
