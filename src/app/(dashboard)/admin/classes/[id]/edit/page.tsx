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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClassById, updateClass } from "@/actions/admin/class-actions";
import { getTrainers } from "@/actions/admin/trainer-actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Edit Class
// ═══════════════════════════════════════════════════════════════

const formSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters."),
  description: z.string().optional(),
  category: z.enum(["YOGA", "ZUMBA", "CROSSFIT", "PILATES", "SPINNING", "HIIT", "BOXING", "DANCE", "MEDITATION", "AEROBICS"]),
  trainerId: z.string().min(1, "Please select a trainer."),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes."),
  isActive: z.boolean().default(true),
});

export default function EditClassPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "CROSSFIT",
      trainerId: "",
      capacity: 20,
      duration: 60,
      isActive: true,
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [classRes, trainersRes] = await Promise.all([
          getClassById(id as string),
          getTrainers()
        ]);

        if (trainersRes.success) {
          setTrainers(trainersRes.data || []);
        }

        if (classRes.success && classRes.data) {
          const cls = classRes.data;
          form.reset({
            name: cls.name,
            description: cls.description || "",
            category: cls.category,
            trainerId: cls.trainerId,
            capacity: cls.maxCapacity,
            duration: cls.duration,
            isActive: cls.isActive,
          });
        } else {
          toast.error("Class not found");
          router.push("/admin/classes");
        }
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const res = await updateClass(id as string, values);
      if (res.success) {
        toast.success("Class updated successfully!");
        router.push("/admin/classes");
      } else {
        toast.error(res.error || "Failed to update class");
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
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link href="/admin/classes" className="flex items-center text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schedule
        </Link>
      </div>

      <Card className="bg-surface-card border-surface-sunken shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-obsidian-950">Edit Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        disabled={isPending} 
                        className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectTrigger className="bg-surface-base border-surface-sunken focus:ring-brand-orange">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-surface-card border-surface-sunken">
                          {["YOGA", "ZUMBA", "CROSSFIT", "PILATES", "SPINNING", "HIIT", "BOXING", "DANCE", "MEDITATION", "AEROBICS"].map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trainerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Trainer</FormLabel>
                      <Select 
                        disabled={isPending} 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-surface-base border-surface-sunken focus:ring-brand-orange">
                            <SelectValue placeholder="Select trainer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-surface-card border-surface-sunken">
                          {trainers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.user.firstName} {t.user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isPending} className="bg-surface-base border-surface-sunken focus-visible:ring-brand-orange" />
                      </FormControl>
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
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
