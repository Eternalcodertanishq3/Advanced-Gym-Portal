import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminPendingPaymentsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  // Fetch pending / due payments
  const pendingPayments = await prisma.payment.findMany({
    where: { status: "PENDING" },
    take: 30,
    orderBy: { createdAt: "desc" },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/payments">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Dues & Failed Renewals</h1>
        <p className="text-sm text-muted-foreground">
          Track outstanding member dues, invoices awaiting counter cash collection, and dunning
          grace periods.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-amber-500" />
            Pending Transactions ({pendingPayments.length})
          </CardTitle>
          <CardDescription>Invoices with pending payment settlement</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No pending dues recorded. All accounts settled!
            </p>
          ) : (
            <div className="divide-y">
              {pendingPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {p.member?.user
                        ? `${p.member.user.firstName} ${p.member.user.lastName}`
                        : "Member Due"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Phone: {p.member?.user?.phone || "N/A"} • Receipt:{" "}
                      <span className="font-mono">{p.receiptNo}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">
                      ₹{Number(p.total).toLocaleString("en-IN")}
                    </p>
                    <Badge variant="secondary" className="text-[10px]">
                      PENDING
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
