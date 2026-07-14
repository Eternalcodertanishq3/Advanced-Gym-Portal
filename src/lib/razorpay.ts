import Razorpay from "razorpay";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Razorpay Client Initialization
// ═══════════════════════════════════════════════════════════════

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn(
    "WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in environment variables.",
  );
}

export const razorpay = new Razorpay({
  key_id: keyId || "mock_key_id",
  key_secret: keySecret || "mock_key_secret",
});

export default razorpay;
