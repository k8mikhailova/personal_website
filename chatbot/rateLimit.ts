import { limits } from './limits.js'

/**
 * Simple in-memory sliding-window limiters, keyed by visitor IP.
 *
 * Serverless instances don't share memory, so this is best-effort: it stops a
 * single visitor hammering one warm instance, not a distributed attack. Pair it
 * with a Vercel Firewall rate-limit rule and an OpenAI spending limit (see README).
 */
const MINUTE = 60_000
const HOUR = 60 * MINUTE

type Result = { ok: true } | { ok: false; retryAfterSeconds: number }

const allLimiters: Map<string, number[]>[] = []

export function createRateLimiter(perMinute: number, perHour: number) {
  const hits = new Map<string, number[]>()
  allLimiters.push(hits)

  return (key: string, now = Date.now()): Result => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < HOUR)
    const lastMinute = recent.filter((t) => now - t < MINUTE)

    if (lastMinute.length >= perMinute) {
      return { ok: false, retryAfterSeconds: Math.ceil((lastMinute[0] + MINUTE - now) / 1000) }
    }
    if (recent.length >= perHour) {
      return { ok: false, retryAfterSeconds: Math.ceil((recent[0] + HOUR - now) / 1000) }
    }

    recent.push(now)
    hits.set(key, recent)

    // Keep memory bounded on long-lived instances.
    if (hits.size > 5000) {
      for (const [k, times] of hits) if (!times.some((t) => now - t < HOUR)) hits.delete(k)
    }
    return { ok: true }
  }
}

/** Limiter for chat messages. */
export const checkRateLimit = createRateLimiter(limits.perMinute, limits.perHour)

export function resetRateLimits() {
  for (const hits of allLimiters) hits.clear()
}
