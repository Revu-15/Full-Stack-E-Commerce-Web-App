/**
 * @file auth.service.ts
 * @description Authentication business logic layer.
 * All auth operations live here — controllers stay thin,
 * only delegating to this service and returning HTTP responses.
 *
 * Responsibilities:
 *   - Registration + email verification dispatch
 *   - Login with credential comparison
 *   - Token issuance and rotation
 *   - Password reset lifecycle
 *   - Google OAuth upsert
 */

import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { userRepository, SafeUser } from '../repositories/user.repository';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  signOneTimeToken,
  verifyOneTimeToken,
} from '../utils/jwt';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../utils/email';
import {
  conflict,
  unauthorized,
  badRequest,
  notFound,
} from '../utils/AppError';
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../validators/auth.validator';

// ── Token response shape ────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: SafeUser;
  tokens: AuthTokens;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const BCRYPT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

function generateTokens(user: SafeUser, tokenVersion: number): AuthTokens {
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion,
  });
  return { accessToken, refreshToken };
}

// ── Auth Service ────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user with email + password.
   * Sends a verification email after successful creation.
   */
  async register(dto: RegisterDto): Promise<{ message: string }> {
    // Check for duplicate email
    const exists = await userRepository.emailExists(dto.email);
    if (exists) {
      throw conflict('An account with this email address already exists.');
    }

    // Hash password before persisting
    const hashedPassword = await hashPassword(dto.password);

    // Create user record
    const user = await userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    // Generate verification token and send email
    const verifyToken = signOneTimeToken(user.id, 'verify', '24h');
    const verifyUrl = `${config.clientUrl}/auth/verify-email?token=${verifyToken}`;

    await sendVerificationEmail(user.email, user.name, verifyUrl);

    return {
      message: 'Account created successfully. Please check your email to verify your account.',
    };
  },

  /**
   * Verify an email address using the one-time token from the email link.
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const userId = verifyOneTimeToken(token, 'verify');
    const user = await userRepository.findById(userId);

    if (!user) throw notFound('User not found.');
    if (user.isVerified) return { message: 'Email is already verified.' };

    await userRepository.verifyEmail(userId);
    return { message: 'Email verified successfully. You can now log in.' };
  },

  /**
   * Authenticate a user with email + password.
   * Returns access + refresh token pair.
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    // Find user (including password hash)
    const user = await userRepository.findByEmail(dto.email);

    if (!user || !user.password) {
      // Generic message — do not reveal whether email exists
      throw unauthorized('Invalid email or password.');
    }

    // Verify password
    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) {
      throw unauthorized('Invalid email or password.');
    }

    // Require email verification for LOCAL accounts
    if (!user.isVerified && user.provider === 'LOCAL') {
      throw unauthorized(
        'Please verify your email address before logging in. Check your inbox for the verification link.'
      );
    }

    const { password: _pw, ...safeUser } = user;
    const tokens = generateTokens(safeUser as SafeUser, user.tokenVersion);

    return { user: safeUser as SafeUser, tokens };
  },

  /**
   * Issue new access + refresh tokens using a valid refresh token.
   * Validates the token version to support "logout all devices".
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(decoded.userId);

    if (!user) throw unauthorized('User no longer exists.');

    // Token version check — if incremented (e.g., on password change), token is invalid
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw unauthorized('Session has been invalidated. Please log in again.');
    }

    const { password: _pw, ...safeUser } = user;
    return generateTokens(safeUser as SafeUser, user.tokenVersion);
  },

  /**
   * Initiate the forgot-password flow.
   * Sends a reset link to the user's email.
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await userRepository.findByEmail(dto.email);

    // Always return the same message regardless of whether email exists
    // to prevent user enumeration attacks
    const genericMessage =
      'If an account with that email exists, a password reset link has been sent.';

    if (!user || user.provider !== 'LOCAL') {
      return { message: genericMessage };
    }

    const resetToken = signOneTimeToken(user.id, 'reset', '1h');
    const resetUrl = `${config.clientUrl}/auth/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, user.name, resetUrl);
    return { message: genericMessage };
  },

  /**
   * Complete the password reset using the token from the email link.
   */
  async resetPassword(token: string, dto: ResetPasswordDto): Promise<{ message: string }> {
    const userId = verifyOneTimeToken(token, 'reset');
    const user = await userRepository.findById(userId);

    if (!user) throw badRequest('Invalid or expired password reset link.');

    const hashedPassword = await hashPassword(dto.password);
    await userRepository.updatePassword(userId, hashedPassword);
    // Invalidate all existing refresh tokens by incrementing token version
    await userRepository.incrementTokenVersion(userId);

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  },

  /**
   * Google OAuth upsert — create account if new, return tokens.
   * Called by the Passport Google callback.
   */
  async googleOAuth(profile: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<AuthResult> {
    let user = await userRepository.findByEmail(profile.email);

    if (!user) {
      // Create new account — auto-verified since email is confirmed by Google
      const safeUser = await userRepository.create({
        name: profile.name,
        email: profile.email,
        provider: 'GOOGLE',
        isVerified: true,
        avatar: profile.avatar,
      });
      // Re-fetch with tokenVersion
      const fullUser = await userRepository.findById(safeUser.id);
      user = fullUser!;
    }

    const { password: _pw, ...safeUser } = user;
    const tokens = generateTokens(safeUser as SafeUser, user.tokenVersion);
    return { user: safeUser as SafeUser, tokens };
  },
};
