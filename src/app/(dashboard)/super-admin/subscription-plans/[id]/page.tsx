import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SuperAdminPlanDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/auth/login");
  }

  const { id } = await params;
  const plan = await prisma.saaSPlan.findUnique({
    where: { id },
    include: {
      _count: { select: { tenants: true } },
    },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <Link href="/super-admin/subscription-plans">
          <Button variant="ghost" size="sm" className="mb-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to SaaS Plans
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{plan.name} Tier</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={plan.isActive ? "default" : "secondary"}>
              {plan.isActive ? "ACTIVE TIER" : "DEPRECATED"}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {plan._count.tenants} Active Gym Tenants
            </span>
          </div>
          <CardTitle className="mt-2 text-3xl font-bold">
            ₹{Number(plan.price).toLocaleString("en-IN")}
            <span className="text-sm font-normal text-muted-foreground">
              /{plan.interval.toLowerCase()}
            </span>
          </CardTitle>
          <CardDescription>
            Allows up to {plan.maxBranches} branches and {plan.maxMembers} members per gym.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 border-t pt-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">
            Included SaaS Features
          </h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {plan.features.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
