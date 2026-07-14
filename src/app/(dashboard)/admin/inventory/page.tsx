"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PackageSearch,
  Plus,
  Search,
  Filter,
  ShoppingCart,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Package,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useInventory } from "@/hooks/use-inventory";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InventoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, updateQuantity } = useInventory(page, limit, debouncedSearch);
  const items = data?.items || [];
  const meta = data?.pagination;

  const handleAdjustStock = (id: string, current: number, delta: number) => {
    const newQty = Math.max(0, current + delta);
    updateQuantity.mutate(
      { id, quantity: newQty },
      {
        onSuccess: () => toast.success("Stock updated successfully"),
        onError: (err) => toast.error(err.message || "Failed to update stock"),
      },
    );
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", badge: "bg-red-100 text-red-800 border-red-200" };
    if (quantity < 10)
      return { label: "Low Stock", badge: "bg-orange-100 text-orange-800 border-orange-200" };
    return { label: "In Stock", badge: "bg-green-100 text-green-800 border-green-200" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Inventory <span className="text-brand-orange">Control</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage merchandise, supplements, and Point of Sale.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-surface-sunken bg-surface-card"
            onClick={() => router.push("/admin/inventory/pos")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            POS Terminal
          </Button>
          <Button
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={() => router.push("/admin/inventory/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm sm:flex-row">
        <div className="max-md relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-base">
              <TableRow>
                <TableHead className="w-16 font-semibold text-obsidian-900">Icon</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Product Name</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Category</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Price</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Stock Status</TableHead>
                <TableHead className="text-right font-semibold text-obsidian-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-24 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-obsidian-500">
                    <PackageSearch className="mx-auto mb-2 h-8 w-8 text-obsidian-300" />
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: any) => {
                  const status = getStockStatus(item.stock);
                  return (
                    <TableRow key={item.id} className="transition-colors hover:bg-surface-base/50">
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-sunken bg-surface-base">
                          <Package className="h-5 w-5 text-obsidian-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obsidian-950">{item.name}</p>
                        <p className="mt-0.5 text-xs text-obsidian-500">SKU: {item.sku || "N/A"}</p>
                      </TableCell>
                      <TableCell className="text-obsidian-700">
                        {item.category || "Merchandise"}
                      </TableCell>
                      <TableCell className="font-semibold text-obsidian-900">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={cn("border-0 font-medium shadow-none", status.badge)}
                          >
                            {status.label}
                          </Badge>
                          <span className="text-sm font-semibold text-obsidian-700">
                            {item.stock} left
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-surface-sunken bg-surface-base text-obsidian-700"
                            onClick={() => handleAdjustStock(item.id, item.stock, -1)}
                            disabled={item.stock === 0 || updateQuantity.isPending}
                          >
                            -
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-surface-sunken bg-surface-base text-obsidian-700"
                            onClick={() => handleAdjustStock(item.id, item.stock, 1)}
                            disabled={updateQuantity.isPending}
                          >
                            +
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-obsidian-500"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border-surface-sunken bg-surface-card"
                            >
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/inventory/${item.id}/edit`)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {meta && meta.pages > 1 && (
          <div className="flex items-center justify-between border-t border-surface-sunken bg-surface-base/30 p-4">
            <span className="text-sm text-obsidian-500">
              Showing page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-surface-card"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page === meta.pages}
                className="bg-surface-card"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
