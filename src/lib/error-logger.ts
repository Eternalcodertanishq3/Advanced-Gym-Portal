import * as Sentry from "@sentry/nextjs";

/**
 * 🦅 GymFlow SaaS — Unified Error Logging Client
 * Routes server-side exceptions to Pino, client-side exceptions to API logging,
 * and conditionally forwards active errors to Sentry if a DSN is configured.
 */
export function captureException(error: any, context?: Record<string, any>) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorName = error instanceof Error ? error.name : "Error";

  // 1. Forward to Sentry if initialized (DSN configured in environment)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    try {
      Sentry.captureException(error, { extra: context });
    } catch (e) {
      console.warn("Failed to report exception to Sentry:", e);
    }
  }

  // 2. Log locally based on execution context
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Dynamic import to prevent bundler issues in browser context
    import("@/lib/logger")
      .then(({ logger }) => {
        logger.error(
          {
            err: {
              name: errorName,
              message: errorMessage,
              stack: errorStack,
            },
            ...context,
          },
          "Server captured exception",
        );
      })
      .catch((logErr) => {
        console.error("[Fallback Server Error Logging]:", error, context, logErr);
      });
  } else {
    // Client-side console logging
    console.error("[Captured Client Error]:", error, context);

    // Forward to client log collector API endpoint (non-blocking)
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        errorName,
        errorMessage,
        stack: errorStack,
        context,
      }),
    }).catch((fetchErr) => {
      console.warn("Failed to transmit client logs to server console:", fetchErr);
    });
  }
}
