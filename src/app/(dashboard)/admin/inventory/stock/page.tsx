import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminInventoryStockPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  const products = await prisma.product.findMany({
    take: 50,
    orderBy: { stock: "asc" },
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
        <h1 className="text-2xl font-bold tracking-tight">
          Inventory Stock Levels & Reorder Alerts
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time product stock counts, wholesale costs, and low-stock reorder indicators.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            Product Catalog & Stock Status ({products.length})
          </CardTitle>
          <CardDescription>Track inventory units available for POS sales</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No products in inventory.
            </p>
          ) : (
            <div className="divide-y">
              {products.map((p) => {
                const isLowStock = p.stock <= p.minStock;
                return (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Category: {p.category} • Barcode: {p.barcode || "N/A"} • Price: ₹
                        {Number(p.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold">{p.stock} in stock</span>
                      <Badge variant={isLowStock ? "destructive" : "default"}>
                        {isLowStock ? "LOW STOCK" : "IN STOCK"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
