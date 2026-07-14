"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStaffById, updateStaff } from "@/actions/admin/staff-management-actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Edit Staff Details
// ═══════════════════════════════════════════════════════════════

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  department: z.string().min(2, "Department is required."),
  shiftStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  shiftEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  salary: z.coerce.number().min(0, "Salary must be 0 or more."),
  isActive: z.boolean().default(true),
});

const DEPARTMENTS = [
  "CLEANING",
  "MAINTENANCE",
  "SECURITY",
  "HOUSEKEEPING",
  "MANAGEMENT",
  "GENERAL",
];

export default function EditStaffPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "GENERAL",
      shiftStart: "06:00",
      shiftEnd: "22:00",
      salary: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await getStaffById(id as string);
        if (res.success && res.data) {
          const s = res.data;
          form.reset({
            firstName: s.user.firstName,
            lastName: s.user.lastName,
            email: s.user.email,
            phone: s.user.phone || "",
            department: s.department,
            shiftStart: s.shiftStart,
            shiftEnd: s.shiftEnd,
            salary: Number(s.salary),
            isActive: s.isActive,
          });
        } else {
          toast.error("Staff member not found");
          router.push("/admin/staff");
        }
      } catch (error) {
        toast.error("Failed to load staff details");
      } finally {
        setIsLoading(false);
      }
    }
    loadStaff();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const res = await updateStaff(id as string, values);
      if (res.success) {
        toast.success("Staff profile updated successfully!");
        router.push("/admin/staff");
      } else {
        toast.error(res.error || "Failed to update staff");
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
          href="/admin/staff"
          className="flex items-center text-sm text-obsidian-500 transition-colors hover:text-obsidian-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff Directory
        </Link>
      </div>

      <Card className="border-surface-sunken bg-surface-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-obsidian-950">
            Edit Staff Profile
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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-surface-sunken bg-surface-base focus:ring-brand-orange">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-surface-sunken bg-surface-card">
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shiftStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift Start</FormLabel>
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
                    name="shiftEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift End</FormLabel>
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
                </div>
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
