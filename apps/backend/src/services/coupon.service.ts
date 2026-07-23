/**
 * @file coupon.service.ts
 * @description Business logic for Coupon validation and management.
 */

import { couponRepository } from '../repositories/coupon.repository';
import { badRequest, notFound } from '../utils/AppError';
import type { ValidateCouponDto, CreateCouponDto } from '../validators/coupon.validator';

export const couponService = {
  /**
   * Validate a coupon code against a subtotal.
   * Returns the discount amount and coupon details.
   */
  async validate(dto: ValidateCouponDto) {
    const coupon = await couponRepository.findByCode(dto.code);

    if (!coupon) throw badRequest('Invalid coupon code.');
    if (!coupon.isActive) throw badRequest('This coupon is no longer active.');

    // Expiry check
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw badRequest('This coupon has expired.');
    }

    // Max uses check
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw badRequest('This coupon has reached its maximum number of uses.');
    }

    // Minimum order amount check
    if (coupon.minAmount !== null && dto.subtotal < Number(coupon.minAmount)) {
      throw badRequest(
        `This coupon requires a minimum order of ₹${Number(coupon.minAmount).toFixed(2)}.`
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (dto.subtotal * Number(coupon.value)) / 100;
      // Apply max discount cap if set
      if (coupon.maxDiscount !== null) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      // FIXED
      discount = Math.min(Number(coupon.value), dto.subtotal); // Can't discount more than order total
    }

    discount = Math.round(discount * 100) / 100;

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
      },
      discount,
      message: `Coupon applied! You save ₹${discount.toFixed(2)}.`,
    };
  },

  /**
   * List all coupons (admin).
   */
  async list() {
    return couponRepository.findAll();
  },

  /**
   * Create a coupon (admin).
   */
  async create(dto: CreateCouponDto) {
    const existing = await couponRepository.findByCode(dto.code);
    if (existing) throw badRequest(`Coupon code "${dto.code}" is already in use.`);

    return couponRepository.create({
      code: dto.code,
      type: dto.type,
      value: dto.value,
      minAmount: dto.minAmount,
      maxDiscount: dto.maxDiscount,
      maxUses: dto.maxUses,
      expiresAt: dto.expiresAt,
      isActive: dto.isActive ?? true,
    });
  },

  /**
   * Toggle coupon active status (admin).
   */
  async toggleActive(id: string) {
    const coupon = await couponRepository.findAll();
    const found = coupon.find((c) => c.id === id);
    if (!found) throw notFound('Coupon not found.');
    return couponRepository.update(id, { isActive: !found.isActive });
  },

  /**
   * Delete a coupon (admin).
   */
  async delete(id: string) {
    return couponRepository.delete(id);
  },
};
