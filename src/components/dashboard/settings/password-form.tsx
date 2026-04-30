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

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
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
    <div className="glass-card p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-brand-orange" />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Security Settings</h3>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Change your account password</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Password</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                    <Input 
                      {...field} 
                      type="password"
                      className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
                      placeholder="••••••••"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">New Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                      <Input 
                        {...field} 
                        type="password"
                        className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
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
                  <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
                      <Input 
                        {...field} 
                        type="password"
                        className="pl-10 bg-muted/50 border-border focus:border-brand-orange/50 transition-all rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white px-8 h-11 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
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
