/**
 * @file cart.validator.ts
 * @description Zod validation schemas for cart endpoints.
 */

import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string({ required_error: 'Product ID is required' }),
  variantId: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
