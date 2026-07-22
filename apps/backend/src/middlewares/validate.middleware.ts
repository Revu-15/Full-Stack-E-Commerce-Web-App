/**
 * @file validate.middleware.ts
 * @description Zod schema validation middleware factory.
 * Validates `req.body`, `req.query`, and `req.params` against a Zod schema.
 * Throws a normalized ZodError that the global error handler converts
 * into a 422 response with per-field error details.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { unprocessable } from '../utils/AppError';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Factory that returns a middleware validating the specified request part
 * against the provided Zod schema.
 *
 * @param schema - Zod schema to validate against.
 * @param target - Which part of the request to validate (default: 'body').
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      // Re-throw as ZodError for the global error handler to format
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      }));
      throw unprocessable('Request validation failed', errors);
    }

    // Replace the request data with the parsed (and possibly coerced/transformed) data
    req[target] = result.data;
    next();
  };
}
