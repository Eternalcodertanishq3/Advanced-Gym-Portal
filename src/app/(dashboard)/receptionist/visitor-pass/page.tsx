import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Phone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VisitorPassPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  // Fetch recent visitor passes with safe O(1) memory bound
  const passes = await prisma.visitorPass.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visitor & Guest Passes</h1>
        <p className="text-sm text-muted-foreground">
          Manage day-pass visitors, prospective member trials, and guest wristbands.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Today
            </CardTitle>
            <div className="text-2xl font-bold text-emerald-500">
              {passes.filter((p) => !p.isUsed && new Date(p.validUntil) >= new Date()).length}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Issued
            </CardTitle>
            <div className="text-2xl font-bold">{passes.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Redeemed Passes
            </CardTitle>
            <div className="text-2xl font-bold text-primary">
              {passes.filter((p) => p.isUsed).length}
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ticket className="h-5 w-5 text-primary" />
            Recent Visitor Log
          </CardTitle>
          <CardDescription>
            All trial passes and guest entries recorded at the front desk
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passes.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Ticket className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="font-medium">No visitor passes issued yet.</p>
              <p className="mt-1 text-xs">
                New guest entries from the desk scanner will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {passes.map((pass) => (
                <div key={pass.id} className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {pass.name}{" "}
                      <span className="font-mono text-xs text-muted-foreground">
                        ({pass.passCode})
                      </span>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {pass.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Valid Until:{" "}
                        {new Date(pass.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={pass.isUsed ? "secondary" : "default"}>
                    {pass.isUsed ? "REDEEMED" : "ACTIVE"}
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
