/**
 * @file admin.routes.ts
 * @description Admin-only routes for product, order, user, coupon management and analytics.
 * All routes require both `protect` (JWT) and `requireAdmin` (ADMIN role) middleware.
 *
 *   GET    /admin/analytics             — Dashboard summary
 *   GET    /admin/orders                — All orders
 *   GET    /admin/orders/:id            — Single order
 *   PATCH  /admin/orders/:id/status     — Update order status
 *   GET    /admin/users                 — All users
 *   GET    /admin/products              — All products (including inactive)
 *   POST   /admin/products              — Create product
 *   PATCH  /admin/products/:id          — Update product
 *   DELETE /admin/products/:id          — Delete product
 *   GET    /admin/coupons               — All coupons
 *   POST   /admin/coupons               — Create coupon
 *   DELETE /admin/coupons/:id           — Delete coupon
 */

import { Router, IRouter } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  getAnalytics,
  adminListUsers,
  adminListCoupons,
  adminCreateCoupon,
  adminDeleteCoupon,
} from '../controllers/admin.controller';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validators/product.validator';
import { updateOrderStatusSchema, orderQuerySchema } from '../validators/order.validator';
import { createCouponSchema } from '../validators/coupon.validator';

const router: IRouter = Router();

// Apply auth + admin guard to ALL admin routes
router.use(protect, requireAdmin);

// ── Analytics ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get dashboard analytics (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics', getAnalytics);

// ── Order Management ─────────────────────────────────────────────────────────

router.get('/orders', validate(orderQuerySchema, 'query'), adminListOrders);
router.get('/orders/:id', adminGetOrder);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), adminUpdateOrderStatus);

// ── User Management ──────────────────────────────────────────────────────────

router.get('/users', adminListUsers);

// ── Product Management ───────────────────────────────────────────────────────

router.get('/products', validate(productQuerySchema, 'query'), listProducts);
router.post('/products', validate(createProductSchema), createProduct);
router.patch('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// ── Coupon Management ────────────────────────────────────────────────────────

router.get('/coupons', adminListCoupons);
router.post('/coupons', validate(createCouponSchema), adminCreateCoupon);
router.delete('/coupons/:id', adminDeleteCoupon);

export default router;
