"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle size={48} />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
        Something went wrong!
      </h1>
      <p className="mb-8 max-w-md text-white/60">
        An unexpected error occurred. We've been notified and are looking into it.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={reset}
          variant="outline"
          className="border-white/10 bg-white/5 hover:bg-white/10"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button asChild className="bg-gold-500 text-black hover:bg-gold-600">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-8 font-mono text-xs text-white/30">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
