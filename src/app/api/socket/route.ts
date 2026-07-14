import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Socket Endpoint Placeholder
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json({
    status: "active",
    message:
      "Socket.io event loops should be bound to a custom Node.js server entry point (server.ts) or Next.js custom server configuration for web-sockets to persist correctly in production.",
  });
}
