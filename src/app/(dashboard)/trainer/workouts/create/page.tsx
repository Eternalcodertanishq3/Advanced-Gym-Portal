import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TrainerCreateWorkoutPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
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
        <h1 className="text-2xl font-bold tracking-tight">Create Custom Workout Plan</h1>
        <p className="text-sm text-muted-foreground">
          Build structured multi-day splits (e.g. Push/Pull/Legs) with target sets and reps.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Dumbbell className="h-5 w-5 text-primary" />
            Workout Plan Metadata
          </CardTitle>
          <CardDescription>Enter plan details and target training frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Workout Routine Title</Label>
              <Input
                id="planName"
                placeholder="e.g. 12-Week Hypertrophy Strength Phase 1"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="daysPerWeek">Training Days Per Week</Label>
                <Input id="daysPerWeek" type="number" min="1" max="7" defaultValue="4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <Input id="level" placeholder="Intermediate / Advanced" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Routine Overview & Guidelines</Label>
              <Textarea
                id="description"
                placeholder="Instructions for warm-up, progressive overload, and rest periods..."
                rows={4}
              />
            </div>

            <div className="pt-2">
              <Button type="button" className="w-full gap-2 sm:w-auto">
                <Plus className="h-4 w-4" />
                Save & Assign to Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
