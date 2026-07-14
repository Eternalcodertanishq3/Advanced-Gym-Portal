import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowSeconds: number = 60,
): Promise<{ success: boolean; remaining: number }> {
  if (!redis) {
    // If Redis is not configured, fall back to allowing requests (fail-open for local dev)
    return { success: true, remaining: limit };
  }

  try {
    const key = `ratelimit:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;

    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    pipeline.zcard(key);
    pipeline.expire(key, windowSeconds);

    const [_delCount, _addCount, card] = await pipeline.exec<[number, number, number]>();

    const success = card <= limit;
    const remaining = Math.max(0, limit - card);

    return { success, remaining };
  } catch (error) {
    console.error("Rate limiter error:", error);
    // Fail-open to prevent rate limiter outages from bringing down the site
    return { success: true, remaining: limit };
  }
}
