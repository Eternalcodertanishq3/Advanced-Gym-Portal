"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { updateProfile } from "@/actions/dashboard/profile-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Profile Form (Themed)
// ═══════════════════════════════════════════════════════════════

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: ProfileFormValues;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsPending(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const result = await updateProfile(formData);
    setIsPending(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="glass-card p-6 sm:p-8 shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
          <User className="w-5 h-5 text-brand-orange" />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Personal Information</h3>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Update your public profile details</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">First Name</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                      <Input 
                        {...field} 
                        className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
                        placeholder="First Name"
                      />
                    </div>
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
                  <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Name</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                      <Input 
                        {...field} 
                        className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
                        placeholder="Last Name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                    <Input 
                      {...field} 
                      className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
                      placeholder="email@example.com"
                    />
                  </div>
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
                <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                    <Input 
                      {...field} 
                      value={field.value || ""}
                      className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white px-8 h-11 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
