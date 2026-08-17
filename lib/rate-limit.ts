/**
 * Simple in-memory rate limiter for API routes
 */

import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimiterOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function createRateLimiter(options: RateLimiterOptions) {
  return async function rateLimiter(request: NextRequest): Promise<RateLimitResult> {
    const ip = getClientIp(request);
    const now = Date.now();

    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      // First request or window expired
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + options.windowMs,
      };
      store.set(ip, newEntry);
      return {
        success: true,
        limit: options.limit,
        remaining: options.limit - 1,
        reset: newEntry.resetAt,
      };
    }

    if (entry.count >= options.limit) {
      return {
        success: false,
        limit: options.limit,
        remaining: 0,
        reset: entry.resetAt,
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - entry.count,
      reset: entry.resetAt,
    };
  };
}

// Pre-configured limiters
export const strictRateLimiter = createRateLimiter({
  limit: 3,
  windowMs: 60_000, // 3 requests per minute
});

export const standardRateLimiter = createRateLimiter({
  limit: 30,
  windowMs: 60_000, // 30 requests per minute
});

/**
 * Helper to apply rate limiting inside a route handler
 */
export async function withRateLimit(
  request: NextRequest,
  limiter: ReturnType<typeof createRateLimiter>
): Promise<RateLimitResult> {
  return limiter(request);
}
