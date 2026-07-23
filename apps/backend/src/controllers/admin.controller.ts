/**
 * @file admin.controller.ts
 * @description HTTP handlers for Admin-only endpoints.
 * Products, orders, users, coupons, and analytics management.
 */

import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { couponService } from '../services/coupon.service';
import { prisma } from '../config/database';
import type { OrderQueryDto } from '../validators/order.validator';

// ── Order Management ─────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/orders
 * @description Admin: list all orders with pagination.
 */
export async function adminListOrders(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as OrderQueryDto;
  const result = await orderService.listAll(query);
  res.json({ status: 'success', data: result });
}

/**
 * GET /api/v1/admin/orders/:id
 * @description Admin: get any order by ID.
 */
export async function adminGetOrder(req: Request, res: Response): Promise<void> {
  const order = await orderService.getById(req.params.id);
  res.json({ status: 'success', data: { order } });
}

/**
 * PATCH /api/v1/admin/orders/:id/status
 * @description Admin: update order status.
 */
export async function adminUpdateOrderStatus(req: Request, res: Response): Promise<void> {
  const order = await orderService.updateStatus(req.params.id, req.body);
  res.json({ status: 'success', data: { order } });
}

// ── Analytics ────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/analytics
 * @description Admin: get dashboard analytics summary.
 */
export async function getAnalytics(req: Request, res: Response): Promise<void> {
  const analytics = await orderService.getAnalytics();
  res.json({ status: 'success', data: { analytics } });
}

// ── User Management ──────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/users
 * @description Admin: list all users with pagination.
 */
export async function adminListUsers(req: Request, res: Response): Promise<void> {
  const page = parseInt(String(req.query.page ?? '1'));
  const limit = parseInt(String(req.query.limit ?? '20'));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isVerified: true,
        provider: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  res.json({
    status: 'success',
    data: {
      users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    },
  });
}

// ── Coupon Management ────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/coupons
 * @description Admin: list all coupons.
 */
export async function adminListCoupons(req: Request, res: Response): Promise<void> {
  const coupons = await couponService.list();
  res.json({ status: 'success', data: { coupons } });
}

/**
 * POST /api/v1/admin/coupons
 * @description Admin: create a coupon.
 */
export async function adminCreateCoupon(req: Request, res: Response): Promise<void> {
  const coupon = await couponService.create(req.body);
  res.status(201).json({ status: 'success', data: { coupon } });
}

/**
 * DELETE /api/v1/admin/coupons/:id
 * @description Admin: delete a coupon.
 */
export async function adminDeleteCoupon(req: Request, res: Response): Promise<void> {
  await couponService.delete(req.params.id);
  res.json({ status: 'success', message: 'Coupon deleted successfully.' });
}
