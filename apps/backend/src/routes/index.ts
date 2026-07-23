/**
 * @file index.ts
 * @description Central API router — mounts all feature routers under /api/v1.
 * Adding a new feature requires only registering its router here.
 */

import { Router, IRouter } from 'express';
import authRoutes from './auth.routes';
import productRoutes, { categoryRouter, brandRouter } from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import addressRoutes from './address.routes';
import couponRoutes from './coupon.routes';
import adminRoutes from './admin.routes';

const router: IRouter = Router();

// ── Feature Routers ─────────────────────────────────────────────────────────

router.use('/auth', authRoutes);

// ── Phase 2 — Commerce APIs ─────────────────────────────────────────────────

router.use('/products', productRoutes);
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);
router.use('/coupons', couponRoutes);

// ── Admin (requires ADMIN role) ──────────────────────────────────────────────

router.use('/admin', adminRoutes);

export default router;
