/**
 * @file admin.middleware.ts
 * @description Role-based authorization guard.
 * Must be used AFTER `protect` middleware — assumes `req.user` is already set.
 *
 * Usage:
 *   router.delete('/products/:id', protect, requireAdmin, deleteProduct);
 *   router.delete('/products/:id', protect, requireRole('ADMIN', 'STAFF'), deleteProduct);
 */

import { Request, Response, NextFunction } from 'express';
import { forbidden } from '../utils/AppError';

/**
 * `requireAdmin` — Restricts access to users with the ADMIN role.
 * Shorthand for the most common admin guard.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    throw forbidden('This action requires administrator privileges.');
  }
  next();
}

/**
 * `requireRole` — Restricts access to users with any of the specified roles.
 * More flexible factory for potential multi-role systems.
 *
 * @param roles - One or more roles that are permitted to proceed.
 */
export function requireRole(...roles: Array<'CUSTOMER' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw forbidden(
        `Access restricted. Required role(s): ${roles.join(', ')}. Your role: ${req.user?.role ?? 'none'}.`
      );
    }
    next();
  };
}
