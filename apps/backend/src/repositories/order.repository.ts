/**
 * @file order.repository.ts
 * @description Data access layer for Order, OrderItem, and OrderStatusLog entities.
 */

import { Prisma, OrderStatus } from '@prisma/client';
import { prisma } from '../config/database';
import type { OrderQueryDto } from '../validators/order.validator';

// ── Order include shape ──────────────────────────────────────────────────────

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, slug: true } },
      variant: { select: { id: true, size: true, color: true } },
    },
  },
  address: true,
  payment: true,
  statusHistory: { orderBy: { createdAt: 'asc' as const } },
  coupon: { select: { id: true, code: true, type: true, value: true } },
};

// ── Order Repository ─────────────────────────────────────────────────────────

export const orderRepository = {
  /**
   * List orders for a specific user with pagination and status filter.
   */
  async findByUserId(userId: string, query: OrderQueryDto) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: orderInclude,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * List all orders (admin use) with pagination.
   */
  async findAll(query: OrderQueryDto) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          ...orderInclude,
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Find a single order by ID (user-scoped).
   */
  async findById(id: string, userId?: string) {
    return prisma.order.findFirst({
      where: { id, ...(userId && { userId }) },
      include: {
        ...orderInclude,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  /**
   * Create a new order with items and initial status log.
   */
  async create(data: {
    userId: string;
    addressId: string;
    couponId?: string | null;
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    totalPrice: number;
    notes?: string | null;
    items: Array<{
      productId: string;
      variantId?: string | null;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }>;
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        addressId: data.addressId,
        couponId: data.couponId ?? null,
        subtotal: data.subtotal,
        discount: data.discount,
        shippingFee: data.shippingFee,
        tax: data.tax,
        totalPrice: data.totalPrice,
        notes: data.notes ?? null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        },
        statusHistory: {
          create: { status: OrderStatus.PENDING, note: 'Order placed successfully' },
        },
      },
      include: orderInclude,
    });
  },

  /**
   * Update the status of an order and append a status log entry.
   */
  async updateStatus(id: string, status: OrderStatus, note?: string) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: { status, note },
        },
      },
      include: orderInclude,
    });
  },

  /**
   * Get admin dashboard analytics summary.
   */
  async getAnalytics() {
    const [totalOrders, totalRevenue, pendingOrders, deliveredOrders, totalUsers, totalProducts] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { totalPrice: true },
          where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'DELIVERED' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.product.count({ where: { isActive: true } }),
      ]);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalPrice ?? 0),
      pendingOrders,
      deliveredOrders,
      totalUsers,
      totalProducts,
    };
  },
};
