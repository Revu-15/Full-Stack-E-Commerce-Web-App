/**
 * @file review.validator.ts
 * @description Zod validation schemas for product review endpoints.
 */

import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string({ required_error: 'Product ID is required' }),
  orderItemId: z.string().optional(),
  rating: z
    .number({ required_error: 'Rating is required' })
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  title: z.string().max(200).trim().optional(),
  body: z
    .string({ required_error: 'Review body is required' })
    .min(10, 'Review must be at least 10 characters')
    .max(2000)
    .trim(),
  images: z.array(z.string().url()).max(5).optional().default([]),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
