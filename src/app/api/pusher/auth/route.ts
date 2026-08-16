import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher-server";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — Pusher Private & Presence Channel Authorization
 * ═══════════════════════════════════════════════════════════════
 * Strictly validates that users can only subscribe to their own
 * private-user-{userId} channel and their active tenant's
 * private-tenant-{tenantId} channel.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let socketId: string | null = null;
    let channelName: string | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      socketId = body.socket_id;
      channelName = body.channel_name;
    } else {
      // Standard Pusher JS client sends x-www-form-urlencoded
      const formData = await req.formData();
      socketId = formData.get("socket_id") as string;
      channelName = formData.get("channel_name") as string;
    }

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name parameter" },
        { status: 400 },
      );
    }

    const currentUserId = session.user.id;
    const currentUserRole = session.user.role;
    const currentTenantId = (session.user as any).tenantId;

    // 1. Authorize Private User Channel: private-user-{userId}
    if (channelName.startsWith("private-user-")) {
      const targetUserId = channelName.replace("private-user-", "");
      if (targetUserId !== currentUserId && currentUserRole !== "SUPER_ADMIN") {
        console.warn(
          `Security Alert: User ${currentUserId} attempted cross-user subscription to ${channelName}`,
        );
        return NextResponse.json({ error: "Forbidden channel access" }, { status: 403 });
      }
    }
    // 2. Authorize Private Tenant Channel: private-tenant-{tenantId}
    else if (channelName.startsWith("private-tenant-")) {
      const targetTenantId = channelName.replace("private-tenant-", "");
      if (
        currentTenantId &&
        targetTenantId !== currentTenantId &&
        currentUserRole !== "SUPER_ADMIN"
      ) {
        console.warn(
          `Security Alert: User ${currentUserId} attempted cross-tenant subscription to ${channelName}`,
        );
        return NextResponse.json({ error: "Forbidden tenant channel access" }, { status: 403 });
      }
    }
    // 3. Reject any unauthorized or unrecognized private/presence channels
    else if (channelName.startsWith("private-") || channelName.startsWith("presence-")) {
      if (currentUserRole !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized channel access" }, { status: 403 });
      }
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch (error: unknown) {
    console.error("Pusher channel auth failure:", error);
    return NextResponse.json(
      {
        error:
          (error instanceof Error ? error.message : String(error)) ||
          "Channel authorization failed",
      },
      { status: 500 },
    );
  }
}
