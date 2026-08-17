import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TrainerWorkoutsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  const workoutPlans = await prisma.workoutPlan.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workout Plan Builder & Library</h1>
          <p className="text-sm text-muted-foreground">
            Create customized training regimens, split routines, and exercise templates for your
            clients.
          </p>
        </div>
        <Link href="/trainer/workouts/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workout Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workoutPlans.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No workout plans created yet. Click "Create Workout Plan" above.
          </p>
        ) : (
          workoutPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={plan.isTemplate ? "outline" : "default"}>
                    {plan.isTemplate ? "TEMPLATE" : "CLIENT ASSIGNED"}
                  </Badge>
                  <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {plan.estimatedDuration ? `${plan.estimatedDuration} mins` : "Custom"}
                  </span>
                </div>
                <CardTitle className="mt-2 text-lg">{plan.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {plan.description || "Personalized workout routine"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {plan.member?.user
                      ? `${plan.member.user.firstName} ${plan.member.user.lastName}`
                      : "Global Template"}
                  </span>
                  <Link href={`/trainer/workouts/${plan.id}`}>
                    <Button variant="outline" size="sm">
                      View Routine
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
