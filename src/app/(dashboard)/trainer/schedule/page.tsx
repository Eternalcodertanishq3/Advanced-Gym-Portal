import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrainerSchedulePage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Fetch upcoming 1-on-1 PT sessions and studio classes
  const ptSessions = await prisma.pTSession.findMany({
    take: 20,
    orderBy: { date: "asc" },
    include: {
      member: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trainer Schedule & Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View your upcoming personal training client slots, studio classes, and coaching calendar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Personal Training (PT) Sessions
          </CardTitle>
          <CardDescription>Scheduled 1-on-1 appointments with your athletes</CardDescription>
        </CardHeader>
        <CardContent>
          {ptSessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No PT sessions scheduled.
            </p>
          ) : (
            <div className="divide-y">
              {ptSessions.map((pt) => (
                <div key={pt.id} className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      Client: {pt.member.user.firstName} {pt.member.user.lastName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(pt.date).toLocaleDateString()} at{" "}
                        {pt.startTime}
                      </span>
                      <span>•</span>
                      <span>Topic: {pt.notes || "General PT"}</span>
                    </div>
                  </div>
                  <Badge variant={pt.status === "COMPLETED" ? "default" : "secondary"}>
                    {pt.status}
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
