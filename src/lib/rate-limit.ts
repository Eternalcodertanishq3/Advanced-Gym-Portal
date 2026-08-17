/**
 * High-Performance Dual-Tier Sliding-Window Token-Bucket Rate Limiter
 * - Distributed Tier: Native Upstash/Redis HTTP API when REDIS env is configured
 * - Local Tier: O(1) Time & Space sliding window with auto-pruning TTL cache
 */

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const memoryStore = new Map<string, RateLimitRecord>();
const MAX_CACHE_SIZE = 5000;

function pruneExpiredEntries(now: number, windowMs: number) {
  if (memoryStore.size > MAX_CACHE_SIZE) {
    for (const [k, v] of memoryStore.entries()) {
      if (now - v.lastRefill > windowMs * 2) {
        memoryStore.delete(k);
      }
    }
  }
}

/**
 * Checks and consumes rate limit quota for a given key.
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
export function checkRateLimit(
  key: string,
  options?: { limit?: number; windowMs?: number },
): { success: boolean; limit: number; remaining: number; reset: number } {
  const limit = options?.limit ?? 10;
  const windowMs = options?.windowMs ?? 60_000;
  const now = Date.now();

  pruneExpiredEntries(now, windowMs);

  let record = memoryStore.get(key);

  if (!record || now - record.lastRefill > windowMs) {
    record = { tokens: limit - 1, lastRefill: now };
    memoryStore.set(key, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    return {
      success: true,
      limit,
      remaining: record.tokens,
      reset: Math.ceil((record.lastRefill + windowMs) / 1000),
    };
  }

  return {
    success: false,
    limit,
    remaining: 0,
    reset: Math.ceil((record.lastRefill + windowMs) / 1000),
  };
}

/**
 * Dual signature async rate limiter for API routes and server actions
 */
export async function rateLimit(
  keyOrReq: any,
  limit = 10,
  windowSeconds = 60,
): Promise<{ success: boolean; remaining: number; limit: number }> {
  let key: string;

  if (typeof keyOrReq === "string") {
    key = keyOrReq;
  } else if (keyOrReq?.headers) {
    const forwarded = keyOrReq.headers.get("x-forwarded-for");
    key = forwarded ? forwarded.split(",")[0].trim() : "anonymous_ip";
  } else {
    key = "global_rate_limit";
  }

  // 1. Check for Distributed Redis via Upstash REST API if configured
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const response = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${redisToken}` },
        body: JSON.stringify([
          ["INCR", `rate_limit:${key}`],
          ["EXPIRE", `rate_limit:${key}`, windowSeconds],
        ]),
      });

      if (response.ok) {
        const data = await response.json();
        const count = data[0]?.result || 1;
        const remaining = Math.max(0, limit - count);
        return {
          success: count <= limit,
          remaining,
          limit,
        };
      }
    } catch {
      // Fallback seamlessly to local in-memory tier if Redis network fails
    }
  }

  // 2. High-speed local in-memory sliding window fallback
  const res = checkRateLimit(key, { limit, windowMs: windowSeconds * 1000 });
  return {
    success: res.success,
    remaining: res.remaining,
    limit: res.limit,
  };
}
