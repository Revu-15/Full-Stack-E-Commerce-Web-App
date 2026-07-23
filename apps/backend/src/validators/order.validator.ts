/**
 * @file order.validator.ts
 * @description Zod validation schemas for order endpoints.
 */

import { z } from 'zod';

export const placeOrderSchema = z.object({
  addressId: z.string({ required_error: 'Delivery address is required' }),
  couponCode: z.string().trim().toUpperCase().optional(),
  notes: z.string().max(500).optional(),
  paymentGateway: z.enum(['STRIPE', 'RAZORPAY', 'COD']).default('COD'),
});

export type PlaceOrderDto = z.infer<typeof placeOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
  note: z.string().max(500).optional(),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
    .optional(),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
