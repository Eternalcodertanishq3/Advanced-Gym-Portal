import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, Download, ExternalLink, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Billing & Payments | Eagle Gym",
  description: "View your payment history and manage your subscriptions.",
};

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id }
  });

  if (!member) redirect("/member");

  const payments = await prisma.payment.findMany({
    where: { memberId: member.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full h-full p-6 space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Billing <span className="text-brand-orange">& Payments</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Keep track of your subscription invoices and transaction history.</p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange-dark font-bold gap-2 px-6">
          <CreditCard className="w-4 h-4" />
          Update Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {payments.length === 0 ? (
          <div className="py-20 text-center surface-card border-dashed border-2">
            <div className="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-brand-orange" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Transactions Found</h3>
            <p className="text-sm text-txt-tertiary max-w-[320px] mx-auto">
              You haven't made any payments yet. Your subscription invoices will appear here once generated.
            </p>
          </div>
        ) : (
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-sunken border-b border-border/50">
                    <th className="px-6 py-4 text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-txt-tertiary uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-surface-sunken/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-foreground font-mono">{payment.transactionId || payment.receiptNo}</p>
                        <p className="text-[10px] text-txt-tertiary uppercase font-bold tracking-tighter">{payment.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-txt-secondary font-medium">
                          <Calendar className="w-3.5 h-3.5 text-txt-tertiary" />
                          {formatDate(payment.createdAt, "dd MMM yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-display font-bold text-foreground">₹{Number(payment.total).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                          payment.status === "COMPLETED" ? "bg-success-soft text-success" : 
                          payment.status === "PENDING" ? "bg-info-soft text-info" : 
                          "bg-danger-soft text-danger"
                        }`}>
                          {payment.status === "COMPLETED" ? <CheckCircle2 className="w-3 h-3" /> : 
                           payment.status === "PENDING" ? <Clock className="w-3 h-3" /> : 
                           <AlertCircle className="w-3 h-3" />}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          aria-label={`Download receipt ${payment.receiptNo}`}
                          className="p-2 rounded-xl bg-surface-elevated text-txt-tertiary hover:text-brand-orange border border-border/50 transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
