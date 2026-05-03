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
import { getTrainerById, updateTrainer } from "@/server/actions/trainer-actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Trainer Edit Form
// ═══════════════════════════════════════════════════════════════

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  specialization: z.string().min(2, "Specialization is required."),
  experience: z.coerce.number().min(0, "Experience must be 0 or more."),
  salary: z.coerce.number().min(0, "Salary must be 0 or more."),
});

export default function EditTrainerPage() {
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
      specialization: "",
      experience: 0,
      salary: 0,
    },
  });

  useEffect(() => {
    async function loadTrainer() {
      try {
        const res = await getTrainerById(id as string);
        if (res.success && res.data) {
          const t = res.data;
          form.reset({
            firstName: t.user.firstName,
            lastName: t.user.lastName,
            email: t.user.email,
            phone: t.user.phone || "",
            specialization: t.specialization.join(", "),
            experience: t.experience,
            salary: Number(t.salary),
          });
        } else {
          toast.error("Trainer not found");
          router.push("/admin/trainers");
        }
      } catch (error) {
        toast.error("Failed to load trainer details");
      } finally {
        setIsLoading(false);
      }
    }
    loadTrainer();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const res = await updateTrainer(id as string, values);
      if (res.success) {
        toast.success("Trainer profile updated successfully!");
        router.push(`/admin/trainers/${id}`);
      } else {
        toast.error(res.error || "Failed to update trainer");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto p-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link href={`/admin/trainers/${id}`} className="flex items-center text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>
      </div>

      <Card className="bg-surface-card border-surface-sunken shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-obsidian-950">Edit Trainer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input type="email" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input type="number" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
                      </FormControl>
                      <FormDescription>
                        Base salary before commissions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-surface-sunken">
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending} className="bg-surface-base border-surface-sunken">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="bg-brand-orange text-white hover:bg-brand-orange/90 min-w-[140px]">
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
