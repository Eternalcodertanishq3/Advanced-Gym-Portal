import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  CreditCard,
  Download,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
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
    where: { userId: session.user.id },
  });

  if (!member) redirect("/member");

  const payments = await prisma.payment.findMany({
    where: { memberId: member.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto h-full w-full max-w-5xl space-y-10 p-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
            Billing <span className="text-brand-orange">& Payments</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Keep track of your subscription invoices and transaction history.
          </p>
        </div>
        <Button className="hover:bg-brand-orange-dark gap-2 bg-brand-orange px-6 font-bold">
          <CreditCard className="h-4 w-4" />
          Update Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {payments.length === 0 ? (
          <div className="surface-card border-2 border-dashed py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken">
              <CreditCard className="h-8 w-8 text-brand-orange" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">No Transactions Found</h3>
            <p className="mx-auto max-w-[320px] text-sm text-txt-tertiary">
              You haven't made any payments yet. Your subscription invoices will appear here once
              generated.
            </p>
          </div>
        ) : (
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-surface-sunken">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="group transition-colors hover:bg-surface-sunken/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs font-bold text-foreground">
                          {payment.transactionId || payment.receiptNo}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-txt-tertiary">
                          {payment.type}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-txt-secondary">
                          <Calendar className="h-3.5 w-3.5 text-txt-tertiary" />
                          {formatDate(payment.createdAt, "dd MMM yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-display text-sm font-bold text-foreground">
                          ₹{Number(payment.total).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${
                            payment.status === "COMPLETED"
                              ? "bg-success-soft text-success"
                              : payment.status === "PENDING"
                                ? "bg-info-soft text-info"
                                : "bg-danger-soft text-danger"
                          }`}
                        >
                          {payment.status === "COMPLETED" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : payment.status === "PENDING" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          aria-label={`Download receipt ${payment.receiptNo}`}
                          className="rounded-xl border border-border/50 bg-surface-elevated p-2 text-txt-tertiary transition-all hover:text-brand-orange"
                        >
                          <Download className="h-4 w-4" />
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
