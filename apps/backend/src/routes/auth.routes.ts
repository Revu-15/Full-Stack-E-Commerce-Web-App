/**
 * @file auth.routes.ts
 * @description Express router for all authentication endpoints.
 * Applies rate limiting and Zod validation middleware before each handler.
 *
 * Route prefix: /api/v1/auth
 */

import { Router, IRouter } from 'express';
import { authController } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { authLimiter, strictLimiter } from '../middlewares/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router: IRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alexandra Wright"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alex@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass1"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Account created, verification email sent
 *       409:
 *         description: Email already registered
 *       422:
 *         description: Validation failed
 */
router.post('/register', authLimiter, validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 */
router.post('/login', authLimiter, validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out and clear auth cookies
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', protect, authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token using refresh token cookie
 *     tags: [Auth]
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify email address using one-time token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 */
router.post(
  '/forgot-password',
  strictLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using the token from the email
 *     tags: [Auth]
 */
router.post(
  '/reset-password/:token',
  strictLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ── Google OAuth Routes ─────────────────────────────────────────────────────

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth flow
 *     tags: [Auth]
 */
router.get('/google', (_req, res) => {
  // Redirect to Google — Passport handles this in app.ts
  res.redirect('/api/v1/auth/google/init');
});

router.get('/google/callback', authController.googleCallback);

export default router;
