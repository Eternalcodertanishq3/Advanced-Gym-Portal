import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, IndianRupee, TrendingUp, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminRevenueAnalyticsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });

  const totalRevenue = payments.reduce((acc, p) => acc + Number(p.total), 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/analytics">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue & Financial Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Gross revenue trends, subscription ARR, POS retail sales, and collection channels.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Realized Revenue
            </CardTitle>
            <div className="text-2xl font-bold text-emerald-500">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Invoices
            </CardTitle>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value (AOV)
            </CardTitle>
            <div className="text-2xl font-bold">
              ₹
              {payments.length > 0
                ? Math.round(totalRevenue / payments.length).toLocaleString("en-IN")
                : 0}
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Recent Revenue Streams
          </CardTitle>
          <CardDescription>
            Processed payments from membership renewals and retail sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">
                    {p.member?.user
                      ? `${p.member.user.firstName} ${p.member.user.lastName}`
                      : "Counter Sale"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()} • Method: {p.method} • Receipt:{" "}
                    <span className="font-mono">{p.receiptNo}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    ₹{Number(p.total).toLocaleString("en-IN")}
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    COMPLETED
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
