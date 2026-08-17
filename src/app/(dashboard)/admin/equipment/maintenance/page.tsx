import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminEquipmentMaintenancePage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  // Safe O(1) space bounded query on equipment
  const equipment = await prisma.equipment.findMany({
    take: 30,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/equipment">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Equipment
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Equipment Maintenance Logs</h1>
        <p className="text-sm text-muted-foreground">
          Track service intervals, warranty expiry, breakdown repairs, and safety inspections.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5 text-primary" />
            Machine Inspection Schedule ({equipment.length})
          </CardTitle>
          <CardDescription>
            Status of gym machines and free weights across all gym zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {equipment.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No equipment items found.
            </p>
          ) : (
            <div className="divide-y">
              {equipment.map((eq) => (
                <div key={eq.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">{eq.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Category: {eq.category} • Model: {eq.model || "Standard"}
                    </p>
                  </div>
                  <Badge variant={eq.status === "WORKING" ? "default" : "destructive"}>
                    {eq.status}
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
