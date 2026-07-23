/**
 * @file product.controller.ts
 * @description HTTP handlers for Product, Category, and Brand endpoints.
 * Controllers are thin — they delegate all logic to services.
 */

import { Request, Response } from 'express';
import { productService, categoryService, brandService } from '../services/product.service';
import type { ProductQueryDto } from '../validators/product.validator';

// ── Product Controllers ──────────────────────────────────────────────────────

/**
 * GET /api/v1/products
 * @description List products with filters, search, and pagination.
 */
export async function listProducts(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ProductQueryDto;
  const result = await productService.list(query);
  res.json({ status: 'success', data: result });
}

/**
 * GET /api/v1/products/:slug
 * @description Get a single product by its slug.
 */
export async function getProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.getBySlug(req.params.slug);
  res.json({ status: 'success', data: { product } });
}

/**
 * POST /api/v1/admin/products
 * @description Create a new product. Admin only.
 */
export async function createProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.create(req.body);
  res.status(201).json({ status: 'success', data: { product } });
}

/**
 * PATCH /api/v1/admin/products/:id
 * @description Update a product. Admin only.
 */
export async function updateProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.update(req.params.id, req.body);
  res.json({ status: 'success', data: { product } });
}

/**
 * DELETE /api/v1/admin/products/:id
 * @description Soft-delete a product. Admin only.
 */
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  await productService.delete(req.params.id);
  res.json({ status: 'success', message: 'Product deleted successfully.' });
}

// ── Category Controllers ─────────────────────────────────────────────────────

/**
 * GET /api/v1/categories
 * @description List all active categories.
 */
export async function listCategories(req: Request, res: Response): Promise<void> {
  const categories = await categoryService.list();
  res.json({ status: 'success', data: { categories } });
}

// ── Brand Controllers ────────────────────────────────────────────────────────

/**
 * GET /api/v1/brands
 * @description List all active brands.
 */
export async function listBrands(req: Request, res: Response): Promise<void> {
  const brands = await brandService.list();
  res.json({ status: 'success', data: { brands } });
}
