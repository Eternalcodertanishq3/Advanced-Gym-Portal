import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function WorkerCleaningPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "WORKER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Fetch cleaning tasks
  const tasks = await prisma.task.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Facility Cleaning & Sanitization Checklist
        </h1>
        <p className="text-sm text-muted-foreground">
          Gym floor sanitation routines, locker room checklists, and hourly maintenance tasks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Active Maintenance & Cleaning Roster
          </CardTitle>
          <CardDescription>
            Daily checklist for hygiene compliance and facility inspection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="space-y-2 py-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="text-sm font-semibold">All facility zones sanitized and inspected!</p>
            </div>
          ) : (
            <div className="divide-y">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.description || "Facility hygiene task"}
                    </p>
                  </div>
                  <Badge variant={t.status === "COMPLETED" ? "default" : "secondary"}>
                    {t.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
