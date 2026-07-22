/**
 * @file auth.middleware.ts
 * @description JWT authentication guard middleware.
 * Extracts the Bearer access token from the Authorization header or
 * the `accessToken` HTTP-only cookie, verifies it, and attaches the
 * decoded payload to `req.user` for downstream handlers.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { unauthorized } from '../utils/AppError';

/**
 * `protect` — Requires a valid access token.
 * Attach to any route that should only be accessible to authenticated users.
 *
 * Token lookup order:
 *   1. `Authorization: Bearer <token>` header
 *   2. `accessToken` cookie (set by login endpoint)
 */
export function protect(req: Request, _res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // 2. Fallback to HTTP-only cookie
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken as string;
  }

  if (!token) {
    throw unauthorized('You are not logged in. Please authenticate to access this resource.');
  }

  // Verify token and attach payload to request
  const decoded = verifyAccessToken(token);
  req.user = decoded;

  next();
}

/**
 * `optionalAuth` — Attaches user if a valid token is present, but does NOT
 * reject the request if no token is provided.
 * Useful for routes like product listings that show extra data for logged-in users.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken as string;
    }

    if (token) {
      req.user = verifyAccessToken(token);
    }
  } catch {
    // Silently ignore — optional auth does not reject
  }

  next();
}
