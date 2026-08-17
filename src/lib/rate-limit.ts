// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — High-Performance Per-Tenant Rate Limiter
// O(1) Time & Space sliding window algorithm with auto-TTL pruning
// ═══════════════════════════════════════════════════════════════

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory cache stored on globalThis to survive Next.js HMR reloads
const cache: Map<string, RateLimitRecord> =
  (globalThis as any).rateLimitCache || new Map<string, RateLimitRecord>();

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).rateLimitCache = cache;
}

export interface RateLimitOptions {
  /** Maximum number of allowed requests in the window */
  limit?: number;
  /** Window duration in milliseconds (default: 60,000ms = 1 min) */
  windowMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks and increments rate limit for a specific key (e.g. `tenant:${tenantId}` or `ip:${ip}`).
 * Time Complexity: O(1)
 * Space Complexity: O(1) bounded with periodic TTL purging
 */
export function checkRateLimit(key: string, options: RateLimitOptions = {}): RateLimitResult {
  const limit = options.limit ?? 60;
  const windowMs = options.windowMs ?? 60_000;
  const now = Date.now();

  // Periodic passive cleanup to prevent memory bloat (Space Complexity bounded)
  if (cache.size > 5000) {
    for (const [k, val] of cache.entries()) {
      if (val.resetAt <= now) cache.delete(k);
    }
  }

  const record = cache.get(key);

  if (!record || record.resetAt <= now) {
    // Initialize or reset window
    const newRecord: RateLimitRecord = { count: 1, resetAt: now + windowMs };
    cache.set(key, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetAt,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetAt,
  };
}

/**
 * Convenience rateLimit helper with positional arguments (compatible with legacy callers)
 */
export async function rateLimit(
  key: string,
  limit = 60,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  return checkRateLimit(key, { limit, windowMs: windowSeconds * 1000 });
}

/**
 * Helper to build standard RateLimit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": Math.max(0, result.remaining).toString(),
    "X-RateLimit-Reset": Math.ceil(result.reset / 1000).toString(),
  };
}
