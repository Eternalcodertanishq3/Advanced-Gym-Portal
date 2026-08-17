import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, IndianRupee, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ReceptionistPaymentsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Safe O(1) space bound on desk transactions
  const payments = await prisma.payment.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: {
      member: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Front Desk Cash & POS Register</h1>
          <p className="text-sm text-muted-foreground">
            Collect counter dues, issue instant tax receipts, and view today's transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/receptionist/payments/receipts">
            <Button variant="outline" className="gap-2">
              <Receipt className="h-4 w-4" />
              Receipt History
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Recent Desk Collections
          </CardTitle>
          <CardDescription>All counter and digital payments processed</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No payments recorded today.
            </p>
          ) : (
            <div className="divide-y">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {p.member.user.firstName} {p.member.user.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Receipt: <span className="font-mono">{p.receiptNo}</span> • Method: {p.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{Number(p.total).toLocaleString("en-IN")}</p>
                    <Badge
                      variant={p.status === "COMPLETED" ? "default" : "secondary"}
                      className="mt-0.5 text-xs"
                    >
                      {p.status}
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
