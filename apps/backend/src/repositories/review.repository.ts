/**
 * @file review.repository.ts
 * @description Data access layer for Review entity.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export const reviewRepository = {
  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    return {
      reviews,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  async create(userId: string, data: Omit<Prisma.ReviewCreateInput, 'user'>) {
    return prisma.review.create({
      data: { ...data, user: { connect: { id: userId } } },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  },

  async existsByUserAndProduct(userId: string, productId: string) {
    const count = await prisma.review.count({ where: { userId, productId } });
    return count > 0;
  },

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  },
};
