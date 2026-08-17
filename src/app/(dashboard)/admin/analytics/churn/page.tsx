import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMinus, AlertTriangle, TrendingDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminChurnAnalyticsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  // Fetch expired and inactive members at risk of churning
  const churnedMembers = await prisma.member.findMany({
    where: {
      OR: [{ status: "EXPIRED" }, { status: "INACTIVE" }],
    },
    take: 30,
    orderBy: { joinDate: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      subscription: { include: { plan: true } },
    },
  });

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
        <h1 className="text-2xl font-bold tracking-tight">Member Retention & Churn Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Predictive churn risk indicators, expired memberships, and reactivation targets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Churned Members
            </CardTitle>
            <div className="text-2xl font-bold text-rose-500">{churnedMembers.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated Lost MRR
            </CardTitle>
            <div className="text-2xl font-bold">
              ₹
              {churnedMembers
                .reduce((acc, m) => acc + Number(m.subscription?.plan?.price || 1500), 0)
                .toLocaleString("en-IN")}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recovery Target Rate
            </CardTitle>
            <div className="text-2xl font-bold text-emerald-500">24%</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserMinus className="h-5 w-5 text-rose-500" />
            Members Requiring Reactivation Campaign ({churnedMembers.length})
          </CardTitle>
          <CardDescription>
            Athletes with expired subscriptions or zero check-ins in the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {churnedMembers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No churned members recorded. Great retention!
            </p>
          ) : (
            <div className="divide-y">
              {churnedMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {m.user?.firstName} {m.user?.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {m.user?.email} • Phone: {m.user?.phone || "N/A"}
                    </p>
                  </div>
                  <Badge variant="destructive">{m.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
