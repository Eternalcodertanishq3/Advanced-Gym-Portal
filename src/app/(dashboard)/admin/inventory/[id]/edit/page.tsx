"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductById, updateProduct } from "@/actions/admin/inventory-actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Edit Product
// ═══════════════════════════════════════════════════════════════

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  description: z.string().optional(),
  category: z.enum(["SUPPLEMENT", "MERCHANDISE", "BEVERAGE", "EQUIPMENT", "OTHER"]),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  stock: z.coerce.number().min(0, "Stock must be 0 or more."),
  sku: z.string().min(3, "SKU is required."),
  image: z.string().optional(),
});

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "SUPPLEMENT",
      price: 0,
      stock: 0,
      sku: "",
      image: "",
    },
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProductById(id as string);
        if (res.success && res.data) {
          const p = res.data;
          form.reset({
            name: p.name,
            description: p.description || "",
            category: p.category as any,
            price: Number(p.price),
            stock: p.stock,
            sku: p.barcode || "",
            image: p.image || "",
          });
        } else {
          toast.error("Product not found");
          router.push("/admin/inventory");
        }
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const res = await updateProduct(id as string, values);
      if (res.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/inventory");
      } else {
        toast.error(res.error || "Failed to update product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-4">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/inventory"
          className="flex items-center text-sm text-obsidian-500 transition-colors hover:text-obsidian-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Link>
      </div>

      <Card className="border-surface-sunken bg-surface-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center font-display text-2xl text-obsidian-950">
            <Package className="mr-3 h-6 w-6 text-brand-orange" />
            Edit Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          className="border-surface-sunken bg-surface-base focus-visible:ring-brand-orange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU / Barcode</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          className="border-surface-sunken bg-surface-base focus-visible:ring-brand-orange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-surface-sunken bg-surface-base focus:ring-brand-orange">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-surface-sunken bg-surface-card">
                          {["SUPPLEMENT", "MERCHANDISE", "BEVERAGE", "EQUIPMENT", "OTHER"].map(
                            (cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isPending}
                          className="border-surface-sunken bg-surface-base focus-visible:ring-brand-orange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isPending}
                          className="border-surface-sunken bg-surface-base focus-visible:ring-brand-orange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isPending}
                          className="min-h-[100px] border-surface-sunken bg-surface-base focus-visible:ring-brand-orange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 border-t border-surface-sunken pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="border-surface-sunken bg-surface-base"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="min-w-[140px] bg-brand-orange text-white hover:bg-brand-orange/90"
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
