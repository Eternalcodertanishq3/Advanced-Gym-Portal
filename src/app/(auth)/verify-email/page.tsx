"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmailWithToken } from "@/actions/auth/reset-token-actions";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setErrorMessage("Missing email verification token.");
        return;
      }

      try {
        const res = await verifyEmailWithToken(token);
        if (res.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(res.error || "Verification failed");
        }
      } catch {
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
      }
    }

    verify();
  }, [token]);

  return (
    <motion.div
      className="surface-card p-8 text-center sm:p-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {status === "loading" && (
        <div className="space-y-6 py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Verifying email...</h1>
          <p className="text-xs text-txt-tertiary">
            Please hold on while we verify your credentials.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/20 bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
          <p className="text-sm leading-relaxed text-txt-secondary">
            Thank you! Your email address has been successfully verified. You can now log into your
            performance workspace.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="btn-primary inline-flex h-12 w-full items-center justify-center gap-2 text-base font-bold shadow-brand-glow"
            >
              Go to Sign In
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
          <p className="text-sm leading-relaxed text-txt-secondary">
            {errorMessage || "The verification link is invalid, expired, or has already been used."}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="btn-secondary inline-flex h-12 w-full items-center justify-center gap-2 border border-border text-sm font-bold text-txt-secondary hover:bg-surface-elevated/40"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * 🦅 GymFlow SaaS — Email Verification Landing Page
 */
export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="bg-mesh-gradient absolute inset-0 opacity-30 dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <Suspense
          fallback={
            <div className="surface-card flex flex-col items-center justify-center space-y-4 p-8 text-center sm:p-10">
              <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
              <p className="text-xs text-txt-tertiary">Loading secure validation context...</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
