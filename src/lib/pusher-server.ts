import PusherServer from "pusher";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — Pusher Server SDK Initialization
 * ═══════════════════════════════════════════════════════════════
 */
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
  useTLS: true,
});
