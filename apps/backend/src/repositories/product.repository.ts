/**
 * @file product.repository.ts
 * @description Data access layer for Product, ProductVariant, Category, and Brand entities.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type { ProductQueryDto } from '../validators/product.validator';

// ── Product Repository ───────────────────────────────────────────────────────

export const productRepository = {
  /**
   * List products with filtering, sorting, and pagination.
   */
  async findMany(query: ProductQueryDto) {
    const { page, limit, search, category, brand, minPrice, maxPrice, inStock, featured, sort } =
      query;

    const skip = (page - 1) * limit;

    // Build where clause dynamically
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category: { slug: category } }),
      ...(brand && { brand: { slug: brand } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(inStock === true && { stock: { gt: 0 } }),
      ...(featured === true && { isFeatured: true }),
    };

    // Build orderBy
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price_asc'
        ? { price: 'asc' }
        : sort === 'price_desc'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : sort === 'featured'
        ? { isFeatured: 'desc' }
        : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Find a single product by its slug (for product detail page).
   */
  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });
  },

  /**
   * Find a product by its ID (for internal use).
   */
  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
    });
  },

  /**
   * Create a new product with optional variants.
   */
  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
    });
  },

  /**
   * Update a product by ID.
   */
  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
    });
  },

  /**
   * Soft-delete a product (set isActive = false).
   */
  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  },

  /**
   * Recalculate and update a product's average rating and review count.
   */
  async updateRating(productId: string) {
    const result = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    return prisma.product.update({
      where: { id: productId },
      data: {
        rating: result._avg.rating ?? 0,
        reviewCount: result._count.id,
      },
    });
  },

  /**
   * Check if SKU is already in use.
   */
  async skuExists(sku: string, excludeId?: string) {
    const count = await prisma.product.count({
      where: { sku, ...(excludeId && { id: { not: excludeId } }) },
    });
    return count > 0;
  },
};

// ── Category Repository ──────────────────────────────────────────────────────

export const categoryRepository = {
  async findAll() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: { where: { isActive: true }, select: { id: true, name: true, slug: true, image: true } },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        parent: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },
};

// ── Brand Repository ─────────────────────────────────────────────────────────

export const brandRepository = {
  async findAll() {
    return prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  },

  async create(data: Prisma.BrandCreateInput) {
    return prisma.brand.create({ data });
  },
};
