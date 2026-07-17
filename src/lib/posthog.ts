import posthog from "posthog-js";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — Dynamic Client-Side Telemetry Wrapper (PostHog)
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Tracks a custom event in PostHog.
 * Resolves gracefully if analytics are loaded on CLI or server bundles.
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined") {
    try {
      posthog.capture(eventName, properties);
    } catch (err) {
      console.warn("PostHog Event Capture Failed:", err);
    }
  }
}

/**
 * Associates an identified user session with a unique userId and profile metadata.
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined") {
    try {
      posthog.identify(userId, properties);
    } catch (err) {
      console.warn("PostHog User Identification Failed:", err);
    }
  }
}

/**
 * Resets user session identity to prevent session bleeding on logouts.
 */
export function resetUser() {
  if (typeof window !== "undefined") {
    try {
      posthog.reset();
    } catch (err) {
      console.warn("PostHog Session Reset Failed:", err);
    }
  }
}
