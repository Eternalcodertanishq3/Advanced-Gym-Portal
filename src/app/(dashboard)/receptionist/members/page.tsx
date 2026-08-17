import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ReceptionistMembersPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Safe O(1) space bound on receptionist member directory
  const members = await prisma.member.findMany({
    take: 50,
    orderBy: { joinDate: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true, avatar: true } },
      subscription: { include: { plan: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Front Desk Member Directory</h1>
          <p className="text-sm text-muted-foreground">
            Search active subscriptions, check membership expiry, and view member profiles.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Members ({members.length})</CardTitle>
          <CardDescription>
            Instant look-up for turnstile overrides and desk inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {members.map((m) => {
              const isSubActive = m.subscription?.status === "ACTIVE";
              return (
                <div key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {m.user.firstName?.[0]}
                      {m.user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-none">
                        {m.user.firstName} {m.user.lastName}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{m.user.phone || "No phone"}</span>
                        <span>•</span>
                        <span>Plan: {m.subscription?.plan?.name || "No Active Plan"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={isSubActive ? "default" : "destructive"}>
                      {isSubActive ? "ACTIVE" : "EXPIRED"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
