/**
 * @file index.ts
 * @description Shared TypeScript types and constants used by both
 * the frontend (Next.js) and backend (Express) applications.
 * Importing from this package ensures API contract consistency.
 */

// ── Enums ────────────────────────────────────────────────────────────────────

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentGateway {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
  COD = 'COD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

// ── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── User Types ────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: string;
}

// ── Product Types ─────────────────────────────────────────────────────────────

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string };
  brand?: { id: string; name: string } | null;
}

// ── Order Types ───────────────────────────────────────────────────────────────

export interface OrderStatusLogEntry {
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

// ── Order Status Display Helpers ─────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'yellow',
  [OrderStatus.CONFIRMED]: 'blue',
  [OrderStatus.PROCESSING]: 'purple',
  [OrderStatus.SHIPPED]: 'indigo',
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.CANCELLED]: 'red',
  [OrderStatus.REFUNDED]: 'gray',
};
