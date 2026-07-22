/**
 * @file app.ts
 * @description Express application entry point.
 *
 * Responsibilities:
 *   - Configure Express with all global middleware (security, CORS, parsing)
 *   - Register Swagger documentation at /api-docs
 *   - Mount the API v1 router
 *   - Register 404 and global error handlers
 *   - Start the HTTP server with graceful shutdown
 */

import 'express-async-errors'; // Patches async route handlers — eliminates try/catch boilerplate
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { config } from './config/env';
import { disconnectDatabase } from './config/database';
import { logger, morganStream } from './utils/logger';
import { globalLimiter } from './middlewares/rateLimit.middleware';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import apiRouter from './routes';
import { authService } from './services/auth.service';

// ── App instance ────────────────────────────────────────────────────────────

const app: Application = express();

// ── Security Middleware ─────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: config.isProduction, // Disable CSP in dev for Swagger UI
  })
);

app.use(
  cors({
    origin: [config.clientUrl],
    credentials: true, // Required for cookies cross-origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request Parsing ─────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ── HTTP Request Logging ────────────────────────────────────────────────────

app.use(
  morgan(config.isDevelopment ? 'dev' : 'combined', {
    stream: morganStream,
    skip: (_req, res) => config.isTest || res.statusCode < 400, // Only log errors in test
  })
);

// ── Rate Limiting ───────────────────────────────────────────────────────────

app.use(globalLimiter);

// ── Passport (Google OAuth) ─────────────────────────────────────────────────

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), undefined);

        const googleProfile = {
          id: profile.id,
          email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        };

        const { user } = await authService.googleOAuth(googleProfile);
        done(null, user as unknown as Express.User);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);

app.use(passport.initialize());

// Google OAuth routes (handled by Passport)
app.get(
  '/api/v1/auth/google/init',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

app.get(
  '/api/v1/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.clientUrl}/auth/login?error=oauth_failed` }),
  (_req, res) => {
    // On success, redirect to frontend — authController.googleCallback will run next
    res.redirect(`${config.clientUrl}/auth/oauth-success`);
  }
);

// ── Swagger API Documentation ───────────────────────────────────────────────

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LuxeCart API',
      version: '1.0.0',
      description: 'Production Full Stack E-Commerce REST API',
      contact: {
        name: 'LuxeCart Engineering',
        url: 'https://luxecart.com',
      },
    },
    servers: [
      { url: `http://localhost:${config.port}/api/v1`, description: 'Development' },
      { url: 'https://api.luxecart.com/api/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
});

if (!config.isProduction) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'LuxeCart API Docs',
      customCss: '.swagger-ui .topbar { background-color: #6366F1; }',
    })
  );
  logger.info(`[Swagger] Docs available at http://localhost:${config.port}/api-docs`);
}

// ── API Routes ──────────────────────────────────────────────────────────────

app.use('/api/v1', apiRouter);

// ── Health Check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ─────────────────────────────────────────────────────────────

app.use(notFoundMiddleware);

// ── Global Error Handler ────────────────────────────────────────────────────

app.use(errorMiddleware);

// ── Server Startup ──────────────────────────────────────────────────────────

const server = app.listen(config.port, () => {
  logger.info(`
  ╔══════════════════════════════════════════════════╗
  ║           🛒  LuxeCart API Server                ║
  ╠══════════════════════════════════════════════════╣
  ║  Environment : ${config.env.padEnd(32)}║
  ║  Port        : ${String(config.port).padEnd(32)}║
  ║  API Base    : http://localhost:${String(config.port).padEnd(18)}║
  ║  API Docs    : http://localhost:${config.port}/api-docs  ║
  ╚══════════════════════════════════════════════════╝
  `);
});

// ── Graceful Shutdown ───────────────────────────────────────────────────────

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`[Server] ${signal} received — shutting down gracefully...`);
  server.close(async () => {
    await disconnectDatabase();
    logger.info('[Server] HTTP server closed. Goodbye!');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections (programming bugs)
process.on('unhandledRejection', (reason) => {
  logger.error('[UnhandledRejection]', reason);
  // Give the server a chance to finish existing requests before crashing
  gracefulShutdown('UnhandledRejection');
});

export default app;
