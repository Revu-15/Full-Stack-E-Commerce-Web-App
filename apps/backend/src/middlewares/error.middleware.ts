/**
 * @file error.middleware.ts
 * @description Global error handling middleware — the last middleware in the chain.
 * Distinguishes between operational AppErrors (safe to relay) and
 * programming bugs (suppress detail in production).
 *
 * Handles special Prisma, JWT, and Zod error shapes and normalizes them
 * into a consistent API response format.
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { config } from '../config/env';

// ── Utility: send structured error response ────────────────────────────────

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

function sendError(res: Response, statusCode: number, message: string, errors?: unknown): void {
  const body: ErrorResponse = { success: false, message };
  if (errors) body.errors = errors;
  if (config.isDevelopment) {
    // Include stack in dev for easier debugging
    body.stack = (errors as Error)?.stack ?? undefined;
  }
  res.status(statusCode).json(body);
}

// ── Main Error Handler ──────────────────────────────────────────────────────

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // ── 1. Known operational error (AppError) ──────────────────────────────
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} — ${err.message}`);
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // ── 2. Zod validation errors ───────────────────────────────────────────
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.warn('[ZodError] Validation failed', { errors });
    sendError(res, 422, 'Validation failed', errors);
    return;
  }

  // ── 3. Prisma errors ───────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = Unique constraint violation
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
      sendError(res, 409, `A record with this ${fields} already exists.`);
      return;
    }
    // P2025 = Record not found (e.g., update/delete non-existent record)
    if (err.code === 'P2025') {
      sendError(res, 404, 'The requested record was not found.');
      return;
    }
    logger.error('[PrismaKnownError]', { code: err.code, meta: err.meta });
    sendError(res, 500, 'A database error occurred.');
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error('[PrismaValidationError]', { message: err.message });
    sendError(res, 400, 'Invalid data provided to the database.');
    return;
  }

  // ── 4. JWT errors ──────────────────────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    sendError(res, 401, 'Your session has expired. Please log in again.');
    return;
  }
  if (err instanceof JsonWebTokenError) {
    sendError(res, 401, 'Invalid authentication token.');
    return;
  }

  // ── 5. Unknown / programming errors ───────────────────────────────────
  // Log full error detail for debugging
  logger.error('[UnhandledError]', err);

  // Never expose internal details in production
  const message = config.isProduction
    ? 'Something went wrong on our end. Please try again later.'
    : (err as Error)?.message ?? 'Internal server error';

  sendError(res, 500, message, config.isDevelopment ? err : undefined);
}

// ── 404 Not Found Handler ──────────────────────────────────────────────────

export function notFoundMiddleware(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `The route '${_req.method} ${_req.originalUrl}' does not exist on this server.`,
  });
}
