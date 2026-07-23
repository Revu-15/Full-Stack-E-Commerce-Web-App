/**
 * @file product.service.ts
 * @description Business logic for Product, Category, and Brand endpoints.
 */

import slugify from 'slugify';
import { productRepository, categoryRepository, brandRepository } from '../repositories/product.repository';
import { notFound, conflict, badRequest } from '../utils/AppError';
import type { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../validators/product.validator';

// ── Product Service ──────────────────────────────────────────────────────────

export const productService = {
  /**
   * List products with filtering, search, and pagination.
   */
  async list(query: ProductQueryDto) {
    return productRepository.findMany(query);
  },

  /**
   * Get a single product by slug.
   */
  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw notFound(`Product not found.`);
    return product;
  },

  /**
   * Get a single product by ID.
   */
  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw notFound(`Product not found.`);
    return product;
  },

  /**
   * Create a new product (admin only).
   * Auto-generates slug from name, ensures uniqueness.
   */
  async create(dto: CreateProductDto) {
    // Check SKU uniqueness
    const skuTaken = await productRepository.skuExists(dto.sku);
    if (skuTaken) throw conflict(`SKU "${dto.sku}" is already in use.`);

    // Validate discount price
    if (dto.discountPrice && dto.discountPrice >= dto.price) {
      throw badRequest('Discount price must be less than the original price.');
    }

    const slug = slugify(dto.name, { lower: true, strict: true });

    const { variants, ...productData } = dto;

    return productRepository.create({
      name: productData.name,
      slug,
      description: productData.description,
      price: productData.price,
      discountPrice: productData.discountPrice,
      sku: productData.sku,
      stock: productData.stock ?? 0,
      images: productData.images,
      isFeatured: productData.isFeatured ?? false,
      category: { connect: { id: productData.categoryId } },
      ...(productData.brandId && { brand: { connect: { id: productData.brandId } } }),
      ...(variants && variants.length > 0 && {
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock ?? 0,
            price: v.price,
          })),
        },
      }),
    });
  },

  /**
   * Update an existing product (admin only).
   */
  async update(id: string, dto: UpdateProductDto) {
    const existing = await productRepository.findById(id);
    if (!existing) throw notFound('Product not found.');

    if (dto.sku && dto.sku !== existing.sku) {
      const skuTaken = await productRepository.skuExists(dto.sku, id);
      if (skuTaken) throw conflict(`SKU "${dto.sku}" is already in use.`);
    }

    if (dto.discountPrice !== undefined && dto.price !== undefined && dto.discountPrice >= dto.price) {
      throw badRequest('Discount price must be less than the original price.');
    }

    const slug = dto.name ? slugify(dto.name, { lower: true, strict: true }) : undefined;

    return productRepository.update(id, {
      ...(dto.name && { name: dto.name, slug }),
      ...(dto.description && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.discountPrice !== undefined && { discountPrice: dto.discountPrice }),
      ...(dto.sku && { sku: dto.sku }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.images && { images: dto.images }),
      ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
      ...(dto.brandId && { brand: { connect: { id: dto.brandId } } }),
    });
  },

  /**
   * Soft-delete a product (admin only).
   */
  async delete(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) throw notFound('Product not found.');
    return productRepository.softDelete(id);
  },
};

// ── Category Service ─────────────────────────────────────────────────────────

export const categoryService = {
  async list() {
    return categoryRepository.findAll();
  },

  async getBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) throw notFound('Category not found.');
    return category;
  },
};

// ── Brand Service ────────────────────────────────────────────────────────────

export const brandService = {
  async list() {
    return brandRepository.findAll();
  },
};
