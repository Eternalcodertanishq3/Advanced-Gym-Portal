"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Lock, ShieldCheck, Loader2, RefreshCw } from "lucide-react";
import { changePassword } from "@/actions/dashboard/profile-actions";
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

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Password Security Form (Themed)
// ═══════════════════════════════════════════════════════════════

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    setIsPending(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await changePassword(formData);
    setIsPending(false);

    if (result.success) {
      toast.success(result.message);
      form.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="glass-card p-6 shadow-lg sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
          <ShieldCheck className="h-5 w-5 text-brand-orange" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
            Security Settings
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Change your account password
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                    <Input
                      {...field}
                      type="password"
                      className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
                      placeholder="••••••••"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                      <Input
                        {...field}
                        type="password"
                        className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-orange" />
                      <Input
                        {...field}
                        type="password"
                        className="rounded-xl border-border bg-muted/50 pl-10 transition-all focus:border-brand-orange/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 rounded-xl bg-brand-orange px-8 font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange-hover"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
