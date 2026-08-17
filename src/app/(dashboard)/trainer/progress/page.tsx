import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, User, Scale } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrainerProgressPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Fetch assigned members with progress logs
  const members = await prisma.member.findMany({
    take: 20,
    orderBy: { joinDate: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, avatar: true, email: true } },
      progress: { take: 1, orderBy: { createdAt: "desc" } },
      subscription: { include: { plan: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Client Physical Progress & Metrics</h1>
        <p className="text-sm text-muted-foreground">
          Track weight changes, body fat percentage, measurements, and PR milestones for your
          assigned athletes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No assigned clients found.
          </p>
        ) : (
          members.map((m) => {
            const latestProgress = m.progress[0];
            return (
              <Card key={m.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {m.user.firstName?.[0]}
                      {m.user.lastName?.[0]}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {m.user.firstName} {m.user.lastName}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Plan: {m.subscription?.plan?.name || "Active"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 border-t pt-4 text-xs">
                  {latestProgress ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <span className="block text-[10px] text-muted-foreground">
                          CURRENT WEIGHT
                        </span>
                        <span className="text-sm font-bold">
                          {Number(latestProgress.weight) || "--"} kg
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <span className="block text-[10px] text-muted-foreground">BODY FAT</span>
                        <span className="text-sm font-bold">
                          {Number(latestProgress.bodyFat) || "--"}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="py-2 text-center italic text-muted-foreground">
                      No measurement logged yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
