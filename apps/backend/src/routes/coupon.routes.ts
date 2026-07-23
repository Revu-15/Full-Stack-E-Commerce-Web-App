/**
 * @file coupon.routes.ts
 * @description Routes for Coupon endpoints.
 *
 *   POST /coupons/validate  — Validate a coupon (authenticated)
 */

import { Router, IRouter } from 'express';
import { validateCoupon } from '../controllers/coupon.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateCouponSchema } from '../validators/coupon.validator';

const router: IRouter = Router();

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: Validate a coupon code and get discount amount
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 */
router.post('/validate', protect, validate(validateCouponSchema), validateCoupon);

export default router;
