import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckInScanner } from "@/components/receptionist/check-in-scanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ReceptionistCheckInPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Fetch recent check-ins for the reception live feed
  const recentAttendances = await prisma.attendance.findMany({
    take: 10,
    orderBy: { checkIn: "desc" },
    include: {
      member: {
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true, email: true } },
          subscription: { include: { plan: true } },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Turnstile & QR Check-In</h1>
          <p className="text-sm text-muted-foreground">
            Scan member QR cards or manually record desk check-ins in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/receptionist/check-in/kiosk">
            <Button variant="outline" className="gap-2">
              <QrCode className="h-4 w-4" />
              Open Kiosk Mode
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live QR Camera Scanner / Search Component */}
        <div className="space-y-6 lg:col-span-2">
          <CheckInScanner />
        </div>

        {/* Live Attendance Activity Stream */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Live Desk Feed
            </CardTitle>
            <CardDescription>Latest 10 check-ins processed today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAttendances.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No check-ins recorded yet today.
              </p>
            ) : (
              recentAttendances.map((att) => {
                const userName = att.member?.user
                  ? `${att.member.user.firstName} ${att.member.user.lastName}`
                  : "Desk Check-In";
                const initials = att.member?.user
                  ? `${att.member.user.firstName?.[0] || ""}${att.member.user.lastName?.[0] || ""}`
                  : "M";

                return (
                  <div
                    key={att.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(att.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={att.status === "PRESENT" ? "default" : "secondary"}>
                      {att.status}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
