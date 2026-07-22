/**
 * @file express.d.ts
 * @description Augments the Express Request type with our custom user payload.
 * This removes the need for type casts throughout the codebase whenever
 * `req.user` is accessed after authentication middleware has run.
 */

import { AccessTokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    /**
     * Augments Express.User (used by Passport.js).
     * Merges our JWT payload fields into the standard user shape.
     */
    interface User extends AccessTokenPayload {
      tokenVersion?: number;
    }

    /**
     * Augments Express.Request so `req.user` is fully typed
     * after `authMiddleware` or `passport.authenticate` has run.
     */
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
