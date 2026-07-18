"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Mail, Phone, Save, Loader2, ShieldCheck } from "lucide-react";
import { updateProfile } from "@/actions/dashboard/profile-actions";
import { toggleUser2FA } from "@/actions/auth/two-factor-actions";
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
  twoFactorEnabled?: boolean;
}

export function ProfileForm({ initialData, twoFactorEnabled = false }: ProfileFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [mfaEnabled, setMfaEnabled] = React.useState(twoFactorEnabled);
  const [is2FAPending, setIs2FAPending] = React.useState(false);

  const handle2FAToggle = async () => {
    setIs2FAPending(true);
    try {
      const nextState = !mfaEnabled;
      const res = await toggleUser2FA(nextState);
      if (res.success) {
        setMfaEnabled(nextState);
        toast.success(`Multi-Factor Authentication ${nextState ? "enabled" : "disabled"}`);
      } else {
        toast.error(res.error || "Failed to update 2FA status");
      }
    } catch {
      toast.error("Failed to update 2FA settings");
    } finally {
      setIs2FAPending(false);
    }
  };

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
    <div className="glass-card p-6 shadow-md sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
          <User className="h-5 w-5 text-brand-orange" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
            Personal Information
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Update your public profile details
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                      <Input
                        {...field}
                        className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
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
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                      <Input
                        {...field}
                        className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
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
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                    <Input
                      {...field}
                      className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
                      placeholder="Official Email Address"
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
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                    <Input
                      {...field}
                      value={field.value || ""}
                      className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
                      placeholder="Secure Phone Number"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 rounded-xl bg-brand-orange px-8 font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange-hover"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* 2FA Security Segment */}
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between rounded-xl border border-brand-orange/10 bg-brand-orange/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Multi-Factor Authentication (2FA)
              </h4>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                Enhance your performance workspace security by requesting a secure 6-digit
                verification code delivered to your email address on every sign-in attempt.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={is2FAPending}
            onClick={handle2FAToggle}
            className={cn(
              "flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full px-1 transition-colors duration-200",
              mfaEnabled
                ? "justify-end bg-brand-orange"
                : "justify-start border border-border bg-muted",
            )}
          >
            <div className="h-3.5 w-3.5 rounded-full bg-white shadow-sm"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
