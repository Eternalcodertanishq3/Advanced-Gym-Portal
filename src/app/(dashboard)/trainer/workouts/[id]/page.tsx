import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutPlanDetailPage({ params }: PageProps) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const plan = await prisma.workoutPlan.findUnique({
    where: { id },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true } } } },
      exercises: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6 p-6">
      <div>
        <Link href="/trainer/workouts">
          <Button variant="ghost" size="sm" className="mb-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Workouts
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{plan.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={plan.isTemplate ? "outline" : "default"}>
              {plan.isTemplate ? "GLOBAL TEMPLATE" : "ASSIGNED TO CLIENT"}
            </Badge>
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {plan.estimatedDuration ? `${plan.estimatedDuration} mins` : "Standard Duration"}
            </span>
          </div>
          <CardTitle className="mt-2 text-lg">Routine Details</CardTitle>
          <CardDescription>
            Assigned to:{" "}
            {plan.member?.user
              ? `${plan.member.user.firstName} ${plan.member.user.lastName}`
              : "Global Template"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 border-t pt-4">
          <div className="rounded-xl bg-muted/40 p-4">
            <h4 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
              Workout Instructions & Split
            </h4>
            <p className="text-sm leading-relaxed">
              {plan.description || "Custom strength & hypertrophy split."}
            </p>
          </div>

          {plan.exercises.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                Exercise Movements ({plan.exercises.length})
              </h4>
              <div className="divide-y overflow-hidden rounded-xl border">
                {plan.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between bg-card p-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ex.muscleGroup || "Compound"}
                      </p>
                    </div>
                    <span className="rounded bg-muted px-2 py-1 font-mono text-xs font-medium">
                      {ex.sets} sets × {ex.reps} reps
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
