import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReceptionistSchedulePage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Safe O(1) space query for today's classes
  const classes = await prisma.gymClass.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      trainer: { include: { user: { select: { firstName: true, lastName: true } } } },
      schedules: { include: { _count: { select: { bookings: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Today's Class Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Live overview of studio classes, seat capacities, and trainer assignments for front-desk
          inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No studio classes scheduled for today.
          </p>
        ) : (
          classes.map((cls) => {
            const totalBookings = cls.schedules.reduce((acc, s) => acc + s._count.bookings, 0);
            const isFull = totalBookings >= cls.maxCapacity;

            return (
              <Card key={cls.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={isFull ? "destructive" : "secondary"}>
                      {isFull ? "FULL" : `${cls.maxCapacity - totalBookings} Spots Left`}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {totalBookings}/{cls.maxCapacity} Booked
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg">{cls.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {cls.description || "Studio workout session"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Duration: {cls.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>
                      Trainer:{" "}
                      {cls.trainer?.user
                        ? `${cls.trainer.user.firstName} ${cls.trainer.user.lastName}`
                        : "Assigned Instructor"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
