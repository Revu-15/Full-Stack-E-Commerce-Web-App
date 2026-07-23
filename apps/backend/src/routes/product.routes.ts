/**
 * @file product.routes.ts
 * @description Routes for Product, Category, and Brand endpoints.
 *
 * Public routes:
 *   GET  /products                 — List with filters
 *   GET  /products/:slug           — Product detail
 *   GET  /categories               — All categories
 *   GET  /brands                   — All brands
 *   GET  /products/:id/reviews     — Product reviews
 *
 * Authenticated routes:
 *   POST /products/:id/reviews     — Submit review
 *
 * Admin routes (mounted separately via admin.routes.ts):
 *   POST   /admin/products         — Create product
 *   PATCH  /admin/products/:id     — Update product
 *   DELETE /admin/products/:id     — Delete product
 */

import { Router, IRouter } from 'express';
import {
  listProducts,
  getProduct,
  listCategories,
  listBrands,
} from '../controllers/product.controller';
import { listReviews, createReview } from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { productQuerySchema, } from '../validators/product.validator';
import { createReviewSchema } from '../validators/review.validator';

const router: IRouter = Router();

// ── Public Routes ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products with filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, price_asc, price_desc, rating, featured]
 */
router.get('/', validate(productQuerySchema, 'query'), listProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get a product by its slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 */
router.get('/:slug', getProduct);

/**
 * @swagger
 * /products/{id}/reviews:
 *   get:
 *     summary: List reviews for a product
 *     tags: [Reviews]
 */
router.get('/:productId/reviews', listReviews);

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     summary: Submit a review for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/:productId/reviews',
  protect,
  validate(createReviewSchema),
  createReview
);

export default router;

// ── Category Router (exported separately) ─────────────────────────────────

export const categoryRouter: IRouter = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all active categories
 *     tags: [Categories]
 */
categoryRouter.get('/', listCategories);

// ── Brand Router (exported separately) ────────────────────────────────────

export const brandRouter: IRouter = Router();

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: List all active brands
 *     tags: [Brands]
 */
brandRouter.get('/', listBrands);
