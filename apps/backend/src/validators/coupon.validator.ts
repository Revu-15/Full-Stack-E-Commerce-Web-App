/**
 * @file coupon.validator.ts
 * @description Zod validation schemas for coupon endpoints.
 */

import { z } from 'zod';

export const validateCouponSchema = z.object({
  code: z.string({ required_error: 'Coupon code is required' }).trim().toUpperCase(),
  subtotal: z
    .number({ required_error: 'Subtotal is required' })
    .nonnegative('Subtotal cannot be negative'),
});

export type ValidateCouponDto = z.infer<typeof validateCouponSchema>;

export const createCouponSchema = z.object({
  code: z.string({ required_error: 'Coupon code is required' }).trim().toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateCouponDto = z.infer<typeof createCouponSchema>;
