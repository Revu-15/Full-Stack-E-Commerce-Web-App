/**
 * @file cart.service.ts
 * @description Business logic for Cart operations.
 * Enforces stock checks and merges duplicate items.
 */

import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { notFound, badRequest } from '../utils/AppError';
import type { AddToCartDto, UpdateCartItemDto } from '../validators/cart.validator';

// ── Cart price calculation helper ────────────────────────────────────────────

function calculateCartTotals(items: Array<{
  quantity: number;
  product: { price: unknown; discountPrice: unknown; isActive: boolean };
  variant: { price: unknown } | null;
}>) {
  let subtotal = 0;

  for (const item of items) {
    if (!item.product.isActive) continue;

    // Use variant price if available, otherwise product effective price
    const basePrice = item.variant?.price
      ? Number(item.variant.price)
      : item.product.discountPrice
      ? Number(item.product.discountPrice)
      : Number(item.product.price);

    subtotal += basePrice * item.quantity;
  }

  const shippingFee = subtotal > 0 && subtotal < 1000 ? 99 : 0; // Free shipping above ₹1000
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + shippingFee + tax;

  return { subtotal, shippingFee, tax, total, itemCount: items.length };
}

// ── Cart Service ─────────────────────────────────────────────────────────────

export const cartService = {
  /**
   * Get or create a cart for the user.
   */
  async getCart(userId: string) {
    const cart = await cartRepository.getOrCreate(userId);
    const totals = calculateCartTotals(cart.items as Parameters<typeof calculateCartTotals>[0]);
    return { ...cart, ...totals };
  },

  /**
   * Add an item to the cart after validating stock.
   */
  async addItem(userId: string, dto: AddToCartDto) {
    const product = await productRepository.findById(dto.productId);
    if (!product || !product.isActive) throw notFound('Product not found or is unavailable.');

    // Stock check: use variant stock if applicable
    let availableStock = product.stock;
    if (dto.variantId) {
      const variant = product.variants.find((v) => v.id === dto.variantId);
      if (!variant) throw notFound('Product variant not found.');
      availableStock = variant.stock;
    }

    if (availableStock < dto.quantity) {
      throw badRequest(`Only ${availableStock} unit(s) available in stock.`);
    }

    const cart = await cartRepository.getOrCreate(userId);
    await cartRepository.upsertItem(cart.id, dto.productId, dto.quantity, dto.variantId);

    return this.getCart(userId);
  },

  /**
   * Update the quantity of a cart item.
   */
  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) throw notFound('Cart not found.');

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw notFound('Cart item not found.');

    // Re-check stock
    const product = await productRepository.findById(item.productId);
    if (!product) throw notFound('Product no longer exists.');

    let availableStock = product.stock;
    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (variant) availableStock = variant.stock;
    }

    if (dto.quantity > availableStock) {
      throw badRequest(`Only ${availableStock} unit(s) available in stock.`);
    }

    await cartRepository.updateItemQuantity(itemId, dto.quantity);
    return this.getCart(userId);
  },

  /**
   * Remove an item from the cart.
   */
  async removeItem(userId: string, itemId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) throw notFound('Cart not found.');

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw notFound('Cart item not found.');

    await cartRepository.removeItem(itemId);
    return this.getCart(userId);
  },

  /**
   * Clear the entire cart.
   */
  async clearCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (cart) await cartRepository.clearCart(cart.id);
    return { message: 'Cart cleared successfully.' };
  },
};
