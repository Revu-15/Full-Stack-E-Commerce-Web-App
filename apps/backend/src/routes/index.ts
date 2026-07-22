/**
 * @file index.ts
 * @description Central API router — mounts all feature routers under /api/v1.
 * Adding a new feature requires only registering its router here.
 */

import { Router, IRouter } from 'express';
import authRoutes from './auth.routes';

const router: IRouter = Router();

// ── Feature Routers ─────────────────────────────────────────────────────────

router.use('/auth', authRoutes);

// Phase 2 — will add:
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/brands', brandRoutes);
// router.use('/users', userRoutes);
// router.use('/cart', cartRoutes);
// router.use('/wishlist', wishlistRoutes);
// router.use('/orders', orderRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/coupons', couponRoutes);
// router.use('/admin', adminRoutes);

export default router;
