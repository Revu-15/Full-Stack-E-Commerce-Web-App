/**
 * @file cart.controller.ts
 * @description HTTP handlers for Cart endpoints.
 */

import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';

/**
 * GET /api/v1/cart
 * @description Get the current user's cart.
 */
export async function getCart(req: Request, res: Response): Promise<void> {
  const cart = await cartService.getCart(req.user!.userId);
  res.json({ status: 'success', data: { cart } });
}

/**
 * POST /api/v1/cart
 * @description Add an item to the cart.
 */
export async function addToCart(req: Request, res: Response): Promise<void> {
  const cart = await cartService.addItem(req.user!.userId, req.body);
  res.status(201).json({ status: 'success', data: { cart } });
}

/**
 * PATCH /api/v1/cart/:itemId
 * @description Update the quantity of a cart item.
 */
export async function updateCartItem(req: Request, res: Response): Promise<void> {
  const cart = await cartService.updateItem(req.user!.userId, req.params.itemId, req.body);
  res.json({ status: 'success', data: { cart } });
}

/**
 * DELETE /api/v1/cart/:itemId
 * @description Remove a specific item from the cart.
 */
export async function removeCartItem(req: Request, res: Response): Promise<void> {
  const cart = await cartService.removeItem(req.user!.userId, req.params.itemId);
  res.json({ status: 'success', data: { cart } });
}

/**
 * DELETE /api/v1/cart
 * @description Clear the entire cart.
 */
export async function clearCart(req: Request, res: Response): Promise<void> {
  const result = await cartService.clearCart(req.user!.userId);
  res.json({ status: 'success', ...result });
}
