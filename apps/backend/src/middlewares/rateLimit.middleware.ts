/**
 * @file rateLimit.middleware.ts
 * @description Rate limiting configuration using express-rate-limit.
 * Different limits are applied to different route groups to balance
 * security with usability.
 *
 * Strategy:
 *   - Auth routes (login, register, forgot-password): Strict limits to prevent brute-force.
 *   - API routes: Moderate limits per IP.
 *   - All routes: Global safety net.
 */

import rateLimit from 'express-rate-limit';
import { tooManyRequests } from '../utils/AppError';

// ── Factory helper ──────────────────────────────────────────────────────────

function createLimiter(windowMs: number, max: number, message: string) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (_req, _res, next) => {
      next(tooManyRequests(message));
    },
  });
}

// ── Rate Limiters ───────────────────────────────────────────────────────────

/**
 * Global limiter — applies to all routes.
 * 500 requests per IP per 15 minutes.
 */
export const globalLimiter = createLimiter(
  15 * 60 * 1000,
  500,
  'Too many requests from this IP. Please slow down.'
);

/**
 * Auth limiter — applies to login, register, forgot-password routes.
 * 10 attempts per IP per 15 minutes to prevent brute-force attacks.
 */
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts. Please wait 15 minutes before trying again.'
);

/**
 * Strict limiter — applies to password reset and email verification resend.
 * 5 attempts per IP per hour.
 */
export const strictLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  'Too many requests for this action. Please wait 1 hour before trying again.'
);
