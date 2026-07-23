/**
 * @file coupon.controller.ts
 * @description HTTP handlers for Coupon endpoints.
 */

import { Request, Response } from 'express';
import { couponService } from '../services/coupon.service';

/**
 * POST /api/v1/coupons/validate
 * @description Validate a coupon code (authenticated users).
 */
export async function validateCoupon(req: Request, res: Response): Promise<void> {
  const result = await couponService.validate(req.body);
  res.json({ status: 'success', data: result });
}
