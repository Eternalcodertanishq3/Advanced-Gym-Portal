import { NextResponse } from "next/server";
import { auth } from "@/auth";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Socket Endpoint Placeholder
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    status: "active",
    message:
      "Socket.io event loops should be bound to a custom Node.js server entry point (server.ts) or Next.js custom server configuration for web-sockets to persist correctly in production.",
  });
}
