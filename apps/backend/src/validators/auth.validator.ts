/**
 * @file auth.validator.ts
 * @description Zod validation schemas for all authentication endpoints.
 * Centralized validation keeps controller logic clean and ensures
 * consistent, descriptive error messages across the API.
 */

import { z } from 'zod';

// ── Shared field definitions ────────────────────────────────────────────────

const emailField = z
  .string({ required_error: 'Email is required' })
  .email('Please provide a valid email address')
  .toLowerCase()
  .trim();

const passwordField = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// ── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: emailField,
  password: passwordField,
  confirmPassword: z.string({ required_error: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterDto = z.infer<typeof registerSchema>;

// ── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailField,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginDto = z.infer<typeof loginSchema>;

// ── Forgot Password ─────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

// ── Reset Password ──────────────────────────────────────────────────────────

export const resetPasswordSchema = z.object({
  password: passwordField,
  confirmPassword: z.string({ required_error: 'Please confirm your new password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

// ── Change Password ─────────────────────────────────────────────────────────

export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }).min(1),
  newPassword: passwordField,
  confirmPassword: z.string({ required_error: 'Please confirm your new password' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from your current password',
  path: ['newPassword'],
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

// ── Refresh Token ───────────────────────────────────────────────────────────

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(), // Also accepted from cookie
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
