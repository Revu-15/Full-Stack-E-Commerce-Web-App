/**
 * @file order.controller.ts
 * @description HTTP handlers for Order endpoints.
 */

import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import type { OrderQueryDto } from '../validators/order.validator';

/**
 * GET /api/v1/orders
 * @description Get the current user's orders.
 */
export async function listMyOrders(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as OrderQueryDto;
  const result = await orderService.listMyOrders(req.user!.userId, query);
  res.json({ status: 'success', data: result });
}

/**
 * GET /api/v1/orders/:id
 * @description Get a single order (user-scoped).
 */
export async function getMyOrder(req: Request, res: Response): Promise<void> {
  const order = await orderService.getMyOrder(req.user!.userId, req.params.id);
  res.json({ status: 'success', data: { order } });
}

/**
 * POST /api/v1/orders
 * @description Place a new order from the user's cart.
 */
export async function placeOrder(req: Request, res: Response): Promise<void> {
  const order = await orderService.placeOrder(req.user!.userId, req.body);
  res.status(201).json({ status: 'success', data: { order } });
}
