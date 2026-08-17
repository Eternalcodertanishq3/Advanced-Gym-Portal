import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ReceptionistReceiptsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  const receipts = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/receptionist/payments">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receipt History & Invoices</h1>
        <p className="text-sm text-muted-foreground">
          View, print, and download past GST-compliant payment receipts issued to members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-primary" />
            Completed Invoices ({receipts.length})
          </CardTitle>
          <CardDescription>
            Official transaction records with unique serial receipt numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {receipts.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-mono text-sm font-semibold">{r.receiptNo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Issued to {r.member.user.firstName} {r.member.user.lastName} on{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{Number(r.total).toLocaleString("en-IN")}</p>
                  <p className="text-xs font-medium text-emerald-600">PAID ({r.method})</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
