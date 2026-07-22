/**
 * @file auth.controller.ts
 * @description Authentication route handlers (thin controllers).
 * Each method delegates to authService and returns a consistent API response.
 * Cookie management (setting/clearing) is handled here as it's HTTP-layer concern.
 */

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { config } from '../config/env';
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../validators/auth.validator';
import { userRepository } from '../repositories/user.repository';
import { unauthorized } from '../utils/AppError';

// ── Cookie configuration ────────────────────────────────────────────────────

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth/refresh', // Restrict refresh cookie to refresh endpoint only
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
}

function clearTokenCookies(res: Response): void {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
}

// ── Controller ──────────────────────────────────────────────────────────────

export const authController = {
  /**
   * POST /api/v1/auth/register
   * Create a new user account and send verification email.
   */
  async register(req: Request, res: Response): Promise<void> {
    const dto = req.body as RegisterDto;
    const result = await authService.register(dto);
    res.status(201).json({ success: true, ...result });
  },

  /**
   * GET /api/v1/auth/verify-email/:token
   * Verify user's email address using one-time token.
   */
  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.status(200).json({ success: true, ...result });
  },

  /**
   * POST /api/v1/auth/login
   * Authenticate user and issue access + refresh tokens.
   * Tokens are set as HTTP-only cookies AND returned in the response body
   * (body tokens support mobile clients that can't use cookies).
   */
  async login(req: Request, res: Response): Promise<void> {
    const dto = req.body as LoginDto;
    const { user, tokens } = await authService.login(dto);

    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user,
        accessToken: tokens.accessToken,
        // Do NOT return refreshToken in body — only in httpOnly cookie
      },
    });
  },

  /**
   * POST /api/v1/auth/refresh
   * Issue new access token using the refresh token cookie.
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    // Prefer cookie, fallback to body
    const refreshToken =
      (req.cookies?.refreshToken as string | undefined) ||
      (req.body?.refreshToken as string | undefined);

    if (!refreshToken) {
      throw unauthorized('No refresh token provided.');
    }

    const tokens = await authService.refreshTokens(refreshToken);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  },

  /**
   * POST /api/v1/auth/logout
   * Clear auth cookies. Client should also discard stored tokens.
   */
  async logout(_req: Request, res: Response): Promise<void> {
    clearTokenCookies(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  },

  /**
   * GET /api/v1/auth/me
   * Return the currently authenticated user's profile.
   */
  async getMe(req: Request, res: Response): Promise<void> {
    const user = await userRepository.findByIdSafe(req.user!.userId);
    if (!user) throw unauthorized('User not found.');
    res.status(200).json({ success: true, data: { user } });
  },

  /**
   * POST /api/v1/auth/forgot-password
   * Initiate password reset — sends email with reset link.
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const dto = req.body as ForgotPasswordDto;
    const result = await authService.forgotPassword(dto);
    res.status(200).json({ success: true, ...result });
  },

  /**
   * POST /api/v1/auth/reset-password/:token
   * Complete the password reset flow.
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const dto = req.body as ResetPasswordDto;
    const result = await authService.resetPassword(token, dto);
    // Clear any existing auth cookies after password reset
    clearTokenCookies(res);
    res.status(200).json({ success: true, ...result });
  },

  /**
   * GET /api/v1/auth/google/callback
   * Google OAuth callback — called by Passport after successful OAuth flow.
   * Issues tokens and redirects to frontend dashboard.
   */
  async googleCallback(req: Request, res: Response): Promise<void> {
    // Passport attaches the user profile to req.user after strategy runs
    const profile = req.user as unknown as {
      id: string;
      email: string;
      name: string;
      avatar?: string;
    };

    const { tokens } = await authService.googleOAuth(profile);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    // Redirect to frontend with success indicator
    res.redirect(`${config.clientUrl}/auth/oauth-success`);
  },
};
