export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  sku: string;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  keywords?: string[];
  specifications?: Record<string, string>;
  features?: string[];
  warranty?: string;
  returnPolicy?: string;
  seller?: string;
  emi?: { months: number; amount: number }[];
  colors?: string[];
  sizes?: string[];
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  isVerified: boolean;
  avatar?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  productId?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalPrice: number;
  items: OrderItem[];
  address: Address;
  paymentGateway: 'STRIPE' | 'RAZORPAY' | 'COD' | 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | string;
  couponCode?: string;
  trackingId?: string;
  estimatedDelivery?: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
  isVerified?: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
}

export interface FilterState {
  brand: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  discount: number;
  availability: 'all' | 'in-stock' | 'out-of-stock';
  colors: string[];
  sizes: string[];
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'best-selling' | 'highest-rated';
}

export type PaymentMethod = 'COD' | 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING';
