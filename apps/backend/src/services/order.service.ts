/**
 * @file order.service.ts
 * @description Business logic for Order placement and management.
 * Handles cart → order conversion, stock deduction, coupon usage, and payment record creation.
 */

import { prisma } from '../config/database';
import { cartRepository } from '../repositories/cart.repository';
import { orderRepository } from '../repositories/order.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { addressRepository } from '../repositories/address.repository';
import { notFound, badRequest } from '../utils/AppError';
import type { PlaceOrderDto, UpdateOrderStatusDto, OrderQueryDto } from '../validators/order.validator';
import { OrderStatus } from '@prisma/client';

// ── Order Service ────────────────────────────────────────────────────────────

export const orderService = {
  /**
   * Get paginated orders for the current user.
   */
  async listMyOrders(userId: string, query: OrderQueryDto) {
    return orderRepository.findByUserId(userId, query);
  },

  /**
   * Get a single order by ID (user-scoped — users can only see their own orders).
   */
  async getMyOrder(userId: string, orderId: string) {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw notFound('Order not found.');
    return order;
  },

  /**
   * Place an order from the user's current cart.
   *
   * Flow:
   *   1. Load cart → validate items + stock
   *   2. Validate address
   *   3. Apply coupon (optional)
   *   4. Calculate totals
   *   5. Create order + decrement stock (in a transaction)
   *   6. Clear cart
   */
  async placeOrder(userId: string, dto: PlaceOrderDto) {
    // 1. Load cart
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw badRequest('Your cart is empty. Add items before placing an order.');
    }

    // 2. Validate address
    const address = await addressRepository.findById(dto.addressId, userId);
    if (!address) throw notFound('Delivery address not found.');

    // 3. Validate items + compute subtotal
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      variantId?: string | null;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }> = [];

    for (const item of cart.items) {
      const product = item.product as {
        id: string;
        name: string;
        images: string[];
        price: unknown;
        discountPrice: unknown;
        isActive: boolean;
        stock: number;
      };

      if (!product.isActive) {
        throw badRequest(`"${product.name}" is no longer available.`);
      }

      let availableStock = product.stock;
      let effectivePrice = product.discountPrice
        ? Number(product.discountPrice)
        : Number(product.price);

      if (item.variantId) {
        const variant = item.variant as { price: unknown; stock: number } | null;
        if (variant?.price) effectivePrice = Number(variant.price);
        if (variant?.stock !== undefined) availableStock = variant.stock;
      }

      if (availableStock < item.quantity) {
        throw badRequest(
          `Insufficient stock for "${product.name}". Only ${availableStock} available.`
        );
      }

      subtotal += effectivePrice * item.quantity;

      orderItems.push({
        productId: product.id,
        variantId: item.variantId ?? null,
        name: product.name,
        image: product.images[0] ?? '',
        price: effectivePrice,
        quantity: item.quantity,
      });
    }

    // 4. Apply coupon
    let discount = 0;
    let couponId: string | null = null;

    if (dto.couponCode) {
      const coupon = await couponRepository.findByCode(dto.couponCode);
      if (!coupon || !coupon.isActive) throw badRequest('Invalid or inactive coupon code.');
      if (coupon.expiresAt && coupon.expiresAt < new Date()) throw badRequest('Coupon has expired.');
      if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        throw badRequest('Coupon has reached its maximum uses.');
      }
      if (coupon.minAmount !== null && subtotal < Number(coupon.minAmount)) {
        throw badRequest(`Coupon requires a minimum order of ₹${Number(coupon.minAmount)}.`);
      }

      discount =
        coupon.type === 'PERCENTAGE'
          ? Math.min((subtotal * Number(coupon.value)) / 100, Number(coupon.maxDiscount ?? Infinity))
          : Math.min(Number(coupon.value), subtotal);

      discount = Math.round(discount * 100) / 100;
      couponId = coupon.id;
    }

    const shippingFee = subtotal > 1000 ? 0 : 99;
    const taxableAmount = subtotal - discount;
    const tax = Math.round(taxableAmount * 0.18 * 100) / 100;
    const totalPrice = taxableAmount + shippingFee + tax;

    // 5. Create order + decrement stock (atomic transaction)
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId: dto.addressId,
          couponId,
          subtotal,
          discount,
          shippingFee,
          tax,
          totalPrice,
          notes: dto.notes ?? null,
          items: {
            create: orderItems,
          },
          statusHistory: {
            create: { status: OrderStatus.PENDING, note: 'Order placed successfully.' },
          },
        },
        include: {
          items: true,
          address: true,
          statusHistory: true,
        },
      });

      // Decrement stock for each product/variant
      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  },

  /**
   * Admin: List all orders.
   */
  async listAll(query: OrderQueryDto) {
    return orderRepository.findAll(query);
  },

  /**
   * Admin: Get any order by ID.
   */
  async getById(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw notFound('Order not found.');
    return order;
  },

  /**
   * Admin: Update order status.
   */
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw notFound('Order not found.');

    return orderRepository.updateStatus(orderId, dto.status as OrderStatus, dto.note);
  },

  /**
   * Get admin analytics summary.
   */
  async getAnalytics() {
    return orderRepository.getAnalytics();
  },
};
