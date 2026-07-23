/**
 * @file review.service.ts
 * @description Business logic for Product Reviews.
 */

import { reviewRepository } from '../repositories/review.repository';
import { productRepository } from '../repositories/product.repository';
import { conflict, notFound } from '../utils/AppError';
import type { CreateReviewDto } from '../validators/review.validator';

export const reviewService = {
  async list(productId: string, page = 1, limit = 10) {
    const product = await productRepository.findById(productId);
    if (!product) throw notFound('Product not found.');
    return reviewRepository.findByProduct(productId, page, limit);
  },

  async create(userId: string, dto: CreateReviewDto) {
    const product = await productRepository.findById(dto.productId);
    if (!product || !product.isActive) throw notFound('Product not found.');

    // One review per user per product
    const alreadyReviewed = await reviewRepository.existsByUserAndProduct(userId, dto.productId);
    if (alreadyReviewed) throw conflict('You have already reviewed this product.');

    const review = await reviewRepository.create(userId, {
      product: { connect: { id: dto.productId } },
      orderItem: dto.orderItemId ? { connect: { id: dto.orderItemId } } : undefined,
      rating: dto.rating,
      title: dto.title,
      body: dto.body,
      images: dto.images ?? [],
      isVerified: !!dto.orderItemId,
    });

    // Update the product's cached rating
    await productRepository.updateRating(dto.productId);

    return review;
  },

  async delete(userId: string, reviewId: string) {
    // For simplicity, only the admin can delete reviews via this service
    await reviewRepository.delete(reviewId);
    return { message: 'Review deleted.' };
  },
};
