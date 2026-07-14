import { NextResponse } from "next/server";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Meta WhatsApp Cloud API Webhook Handler
// ═══════════════════════════════════════════════════════════════

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verification handler for Meta Webhook subscription validation.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!verifyToken) {
    if (process.env.NODE_ENV === "production") {
      console.error("CRITICAL: WHATSAPP_VERIFY_TOKEN is missing in production!");
      return new Response("Configuration error", { status: 500 });
    }
  }

  if (mode === "subscribe" && token === (verifyToken || "eagle_gym_verify_token")) {
    console.log("WhatsApp Webhook verified successfully.");
    return new Response(challenge, { status: 200 });
  }

  console.warn("WhatsApp Webhook verification failed. Invalid token.");
  return new Response("Forbidden", { status: 403 });
}

/**
 * Receives incoming WhatsApp event webhooks (message status updates, inbound chats).
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (signature) {
      if (!appSecret) {
        if (process.env.NODE_ENV === "production") {
          console.error("CRITICAL: WHATSAPP_APP_SECRET is missing in production!");
          return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }
      }

      const elements = signature.split("=");
      const signatureHash = elements[1];

      const expectedHash = crypto
        .createHmac("sha256", appSecret || "mock_secret")
        .update(rawBody)
        .digest("hex");

      if (!safeCompare(expectedHash, signatureHash)) {
        console.warn("Invalid Meta X-Hub-Signature-256 received.");
        return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
      }
    } else {
      // If signature is missing in production, deny the request
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Missing webhook signature header" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    
    // Log incoming event hook for debugging and tracking
    console.log("[WhatsApp Event Webhook Received]:", JSON.stringify(payload, null, 2));

    // Handle incoming messages or check-in notifications
    if (payload.object === "whatsapp_business_account") {
      const entry = payload.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        const message = value.messages[0];
        console.log(`Inbound WhatsApp message from ${message.from}: ${message.text?.body}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("WhatsApp webhook handler failed:", error);
    return NextResponse.json({ error: error.message || "Webhook processing error" }, { status: 500 });
  }
}
