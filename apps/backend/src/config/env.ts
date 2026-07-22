/**
 * @file env.ts
 * @description Centralized, type-safe environment variable configuration.
 * All env vars are validated at startup — the app crashes fast if anything is missing.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the backend app root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validates that a required environment variable is set.
 * Throws immediately if missing — prevents silent failures at runtime.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const config = {
  // ── Server ────────────────────────────────────────────────────────────────
  env: optionalEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  port: parseInt(optionalEnv('PORT', '5000'), 10),
  clientUrl: optionalEnv('CLIENT_URL', 'http://localhost:3000'),
  apiUrl: optionalEnv('API_URL', 'http://localhost:5000'),

  // ── Database ──────────────────────────────────────────────────────────────
  databaseUrl: requireEnv('DATABASE_URL'),

  // ── JWT ───────────────────────────────────────────────────────────────────
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  // ── Google OAuth ──────────────────────────────────────────────────────────
  google: {
    clientId: optionalEnv('GOOGLE_CLIENT_ID'),
    clientSecret: optionalEnv('GOOGLE_CLIENT_SECRET'),
    callbackUrl: optionalEnv(
      'GOOGLE_CALLBACK_URL',
      'http://localhost:5000/api/v1/auth/google/callback'
    ),
  },

  // ── Email ─────────────────────────────────────────────────────────────────
  email: {
    host: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
    user: optionalEnv('SMTP_USER'),
    pass: optionalEnv('SMTP_PASS'),
    from: optionalEnv('EMAIL_FROM', 'LuxeCart <noreply@luxecart.com>'),
  },

  // ── Cloudinary ────────────────────────────────────────────────────────────
  cloudinary: {
    cloudName: optionalEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: optionalEnv('CLOUDINARY_API_KEY'),
    apiSecret: optionalEnv('CLOUDINARY_API_SECRET'),
  },

  // ── Stripe ────────────────────────────────────────────────────────────────
  stripe: {
    secretKey: optionalEnv('STRIPE_SECRET_KEY'),
    webhookSecret: optionalEnv('STRIPE_WEBHOOK_SECRET'),
  },

  // ── Razorpay ──────────────────────────────────────────────────────────────
  razorpay: {
    keyId: optionalEnv('RAZORPAY_KEY_ID'),
    keySecret: optionalEnv('RAZORPAY_KEY_SECRET'),
  },

  // ── Session ───────────────────────────────────────────────────────────────
  sessionSecret: optionalEnv('SESSION_SECRET', 'fallback-session-secret'),

  // ── Derived helpers ───────────────────────────────────────────────────────
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

export type Config = typeof config;
