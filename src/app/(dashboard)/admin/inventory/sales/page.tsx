import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminInventorySalesPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  const sales = await prisma.sale.findMany({
    take: 40,
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/inventory">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to POS
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Retail POS Sales History</h1>
        <p className="text-sm text-muted-foreground">
          Log of merchandise, supplements, and beverage sales processed through the counter
          register.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Completed Sales ({sales.length})
          </CardTitle>
          <CardDescription>Atomic stock-decremented counter transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No retail sales recorded.
            </p>
          ) : (
            <div className="divide-y">
              {sales.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">Sale #{s.id.slice(-6).toUpperCase()}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString()} • Method: {s.paymentMethod} •
                      Items: {s.items.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{Number(s.total).toLocaleString("en-IN")}</p>
                    <Badge variant="outline" className="text-[10px]">
                      PAID
                    </Badge>
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
