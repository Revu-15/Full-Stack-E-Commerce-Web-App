/**
 * @file AppError.ts
 * @description Custom application error class following Clean Architecture.
 * Extends the native Error with an HTTP status code and operational flag,
 * allowing the global error handler to distinguish known business errors
 * from unexpected programming bugs.
 */

/**
 * Operational error — a known, expected error that can be safely relayed to clients.
 * Examples: validation failures, not found, unauthorized access.
 *
 * Programming errors (bugs) should be allowed to crash the process so they
 * are caught by crash-reporting tools and fixed.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';
  public readonly isOperational: boolean;
  public readonly errors?: unknown[];

  constructor(
    message: string,
    statusCode: number,
    errors?: unknown[]
  ) {
    super(message);
    this.statusCode = statusCode;
    // 4xx → 'fail' (client error),  5xx → 'error' (server error)
    this.status = statusCode >= 500 ? 'error' : 'fail';
    this.isOperational = true;
    this.errors = errors;

    // Capture proper stack trace in V8 (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── HTTP Status Code Factories ─────────────────────────────────────────────

/** 400 Bad Request — invalid client input */
export const badRequest = (msg: string, errors?: unknown[]): AppError =>
  new AppError(msg, 400, errors);

/** 401 Unauthorized — unauthenticated access */
export const unauthorized = (msg = 'Authentication required'): AppError =>
  new AppError(msg, 401);

/** 403 Forbidden — insufficient permissions */
export const forbidden = (msg = 'You do not have permission to perform this action'): AppError =>
  new AppError(msg, 403);

/** 404 Not Found */
export const notFound = (msg: string): AppError =>
  new AppError(msg, 404);

/** 409 Conflict — duplicate resource */
export const conflict = (msg: string): AppError =>
  new AppError(msg, 409);

/** 422 Unprocessable Entity — semantic validation failure */
export const unprocessable = (msg: string, errors?: unknown[]): AppError =>
  new AppError(msg, 422, errors);

/** 429 Too Many Requests — rate limit exceeded */
export const tooManyRequests = (msg = 'Too many requests, please try again later'): AppError =>
  new AppError(msg, 429);

/** 500 Internal Server Error */
export const internal = (msg = 'Something went wrong on our end'): AppError =>
  new AppError(msg, 500);
