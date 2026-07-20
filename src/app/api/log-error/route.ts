import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * 🦅 GymFlow SaaS — Client Error Logger API
 * Receives client-side exception logs and sends them to the structured Pino server log stream.
 */
export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Prevent Client Spamming)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = await rateLimit(`api:log-error:${ip}`, 15, 60);
    if (!limiter.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // 2. Parse payload
    const body = await req.json().catch(() => ({}));
    const { errorName, errorMessage, stack, context } = body;

    // 3. Log via Pino
    logger.error(
      {
        clientErr: {
          name: errorName || "ClientError",
          message: errorMessage || "Unknown client error",
          stack: stack || undefined,
        },
        context,
        ip,
      },
      "Client-side captured exception",
    );

    return NextResponse.json({ logged: true });
  } catch (err: unknown) {
    console.error("Failed to log client error on server:", err);
    return NextResponse.json({ error: "Internal server logging error" }, { status: 500 });
  }
}
