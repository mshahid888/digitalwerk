// Lightweight in-memory sliding-window rate limiter for the Agent API.
//
// Deliberately simple: the Agent API is a single container on one host, so
// a per-process map is sufficient and needs no Redis. Limitation: it is
// per-instance and resets on restart. Behind Caddy the real client IP
// arrives in X-Forwarded-For (Caddy sets it); the Docker network is trusted.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

/** Returns true if the request is allowed, false if it should be 429'd. */
export function allow(key: string, perMinute: number): boolean {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (now - lastSweep > 60_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    lastSweep = now;
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= perMinute) return false;
  bucket.count += 1;
  return true;
}

/** Test helper. */
export function resetRateLimiter(): void {
  buckets.clear();
  lastSweep = 0;
}
