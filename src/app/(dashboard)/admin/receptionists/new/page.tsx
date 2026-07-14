"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReceptionist } from "@/actions/admin/receptionist-actions";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Onboard New Receptionist
// ═══════════════════════════════════════════════════════════════

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  shiftStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  shiftEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  salary: z.coerce.number().min(0, "Salary must be 0 or more."),
});

export default function NewReceptionistPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      shiftStart: "06:00",
      shiftEnd: "22:00",
      salary: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const res = await createReceptionist(values);
      if (res.success) {
        toast.success("Receptionist onboarded successfully!");
        router.push("/admin/receptionists");
      } else {
        toast.error(res.error || "Failed to onboard staff");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/receptionists"
          className="flex items-center text-sm text-obsidian-500 transition-colors hover:text-obsidian-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receptionists
        </Link>
      </div>

      <Card className="border-surface-sunken bg-surface-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-obsidian-950">
            Onboard New Receptionist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="reception@eaglegym.com"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 9876543210"
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
                  name="shiftStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift Start (HH:MM)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="06:00"
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
                  name="shiftEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift End (HH:MM)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="22:00"
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
                  name="salary"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Monthly Salary (₹)</FormLabel>
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
                  {isPending ? "Onboarding..." : "Onboard Staff"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
