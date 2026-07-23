/**
 * @file coupon.repository.ts
 * @description Data access layer for Coupon entity.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export const couponRepository = {
  async findByCode(code: string) {
    return prisma.coupon.findUnique({ where: { code } });
  },

  async findAll() {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({ data });
  },

  async update(id: string, data: Prisma.CouponUpdateInput) {
    return prisma.coupon.update({ where: { id }, data });
  },

  async incrementUsage(id: string) {
    return prisma.coupon.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  },

  async delete(id: string) {
    return prisma.coupon.delete({ where: { id } });
  },
};
