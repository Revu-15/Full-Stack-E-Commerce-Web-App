/**
 * @file jwt.ts
 * @description JWT utility helpers for access and refresh token lifecycle.
 * Uses an asymmetric signing approach with separate secrets per token type
 * to limit the blast radius of a compromised secret.
 */

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { unauthorized } from './AppError';

// ── Token payload interfaces ────────────────────────────────────────────────

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number; // Increment to invalidate all existing refresh tokens for a user
}

// ── Access Token ────────────────────────────────────────────────────────────

/**
 * Signs a short-lived access token (default 15m).
 * Contains user identity + role for authorization without DB lookup.
 */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as SignOptions['expiresIn'],
    issuer: 'luxecart-api',
    audience: 'luxecart-client',
  });
}

/**
 * Verifies and decodes an access token.
 * Throws 401 AppError if invalid or expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload & JwtPayload {
  try {
    return jwt.verify(token, config.jwt.accessSecret, {
      issuer: 'luxecart-api',
      audience: 'luxecart-client',
    }) as AccessTokenPayload & JwtPayload;
  } catch {
    throw unauthorized('Access token is invalid or expired. Please log in again.');
  }
}

// ── Refresh Token ───────────────────────────────────────────────────────────

/**
 * Signs a longer-lived refresh token (default 7d).
 * Contains minimal payload — only used to issue new access tokens.
 */
export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    issuer: 'luxecart-api',
  });
}

/**
 * Verifies and decodes a refresh token.
 * Throws 401 AppError if invalid or expired.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload & JwtPayload {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'luxecart-api',
    }) as RefreshTokenPayload & JwtPayload;
  } catch {
    throw unauthorized('Refresh token is invalid or expired. Please log in again.');
  }
}

// ── One-Time Tokens (email verify / password reset) ─────────────────────────

/**
 * Signs a short-lived one-time token for email verification or password reset.
 * Uses the access secret + a purpose prefix to prevent token reuse across flows.
 */
export function signOneTimeToken(userId: string, purpose: 'verify' | 'reset', expiresIn = '1h'): string {
  return jwt.sign(
    { userId, purpose },
    config.jwt.accessSecret + purpose,
    { expiresIn: expiresIn as SignOptions['expiresIn'] }
  );
}

/**
 * Verifies a one-time token and returns the userId.
 * Throws 400 AppError if invalid, expired, or wrong purpose.
 */
export function verifyOneTimeToken(token: string, purpose: 'verify' | 'reset'): string {
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret + purpose) as {
      userId: string;
      purpose: string;
    };
    if (decoded.purpose !== purpose) {
      throw new Error('Token purpose mismatch');
    }
    return decoded.userId;
  } catch {
    const label = purpose === 'verify' ? 'Email verification' : 'Password reset';
    throw unauthorized(`${label} link is invalid or has expired. Please request a new one.`);
  }
}
