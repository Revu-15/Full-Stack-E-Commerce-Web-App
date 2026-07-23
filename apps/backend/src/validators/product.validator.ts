/**
 * @file product.validator.ts
 * @description Zod validation schemas for product-related endpoints.
 */

import { z } from 'zod';

// ── Create Product ────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string({ required_error: 'Product name is required' }).min(2).max(200).trim(),
  description: z.string({ required_error: 'Description is required' }).min(10).trim(),
  price: z.number({ required_error: 'Price is required' }).positive('Price must be positive'),
  discountPrice: z.number().positive().optional(),
  sku: z.string({ required_error: 'SKU is required' }).trim().toUpperCase(),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url()).min(1, 'At least one product image is required'),
  categoryId: z.string({ required_error: 'Category is required' }),
  brandId: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        sku: z.string().trim().toUpperCase(),
        stock: z.number().int().nonnegative().default(0),
        price: z.number().positive().optional(),
      })
    )
    .optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

// ── Update Product ────────────────────────────────────────────────────────────

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;

// ── Product List Query ────────────────────────────────────────────────────────

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().trim().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  inStock: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sort: z
    .enum(['newest', 'price_asc', 'price_desc', 'rating', 'featured'])
    .default('newest'),
});

export type ProductQueryDto = z.infer<typeof productQuerySchema>;
