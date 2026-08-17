import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function TrainerSessionsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  const sessions = await prisma.pTSession.findMany({
    take: 30,
    orderBy: { date: "desc" },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Personal Coaching Sessions</h1>
        <p className="text-sm text-muted-foreground">
          Log completed workout sets, track PT session hours, and manage client appointments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Dumbbell className="h-5 w-5 text-primary" />
            All PT Coaching Sessions ({sessions.length})
          </CardTitle>
          <CardDescription>History of 1-on-1 private coaching appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No coaching sessions recorded.
            </p>
          ) : (
            <div className="divide-y">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {s.member.user.firstName} {s.member.user.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(s.date).toLocaleDateString()} • {s.startTime} - {s.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={s.status === "COMPLETED" ? "default" : "secondary"}>
                      {s.status}
                    </Badge>
                    <Link href={`/trainer/sessions/${s.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
