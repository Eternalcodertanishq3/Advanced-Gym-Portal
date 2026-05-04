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

import { createTrainer } from "@/actions/admin/trainer-actions";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  specialization: z.string().min(2, "Specialization is required."),
  experience: z.coerce.number().min(0, "Experience must be 0 or more."),
  salary: z.coerce.number().min(0, "Salary must be 0 or more."),
});

export default function AddTrainerPage() {
  const router = useRouter();
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const res = await createTrainer(values);
      if (res.success) {
        toast.success("Trainer onboarded successfully!");
        router.push("/admin/trainers");
      } else {
        toast.error(res.error || "Failed to onboard trainer");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/admin/trainers" className="flex items-center text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trainers
        </Link>
      </div>

      <Card className="bg-surface-card border-surface-sunken shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-obsidian-950">Onboard New Trainer</CardTitle>
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
                        <Input placeholder="John" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input placeholder="Doe" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input placeholder="+91 9876543210" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                        <Input placeholder="e.g. Bodybuilding, Yoga" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
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
                  {isPending ? "Onboarding..." : "Onboard Trainer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

