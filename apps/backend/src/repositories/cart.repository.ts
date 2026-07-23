/**
 * @file cart.repository.ts
 * @description Data access layer for Cart and CartItem entities.
 */

import { prisma } from '../config/database';

// ── Cart include shape ───────────────────────────────────────────────────────

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          images: true,
          stock: true,
          isActive: true,
        },
      },
      variant: {
        select: { id: true, size: true, color: true, price: true, stock: true },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

// ── Cart Repository ──────────────────────────────────────────────────────────

export const cartRepository = {
  /**
   * Get the cart for a user (creates one if it doesn't exist).
   */
  async getOrCreate(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: cartInclude,
    });
  },

  /**
   * Get cart with all items for a user.
   */
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  },

  /**
   * Find a specific cart item by cartId + productId + variantId.
   */
  async findItem(cartId: string, productId: string, variantId?: string | null) {
    return prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId ?? null,
      },
    });
  },

  /**
   * Add or update a cart item. If the same product+variant already exists,
   * increment the quantity instead of creating a duplicate.
   */
  async upsertItem(
    cartId: string,
    productId: string,
    quantity: number,
    variantId?: string | null
  ) {
    const existing = await this.findItem(cartId, productId, variantId);

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        variantId: variantId ?? null,
      },
    });
  },

  /**
   * Update the quantity of a specific cart item.
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  /**
   * Remove a single cart item by ID.
   */
  async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  },

  /**
   * Clear all items from a cart (used after order placement).
   */
  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  },
};
