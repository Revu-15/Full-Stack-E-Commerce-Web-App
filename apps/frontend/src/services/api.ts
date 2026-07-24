import { Product, Category } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ── Axios-style fetch wrapper ──────────────────────────────────────────────
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nexcart_token') : null;
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'API request failed');
  return data;
}

// ── Auth API ───────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiRequest<{ data: { user: any; accessToken: string } }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getMe: () => apiRequest<{ data: { user: any } }>('/auth/me'),
  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    apiRequest(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password, confirmPassword: password }) }),
};

// ── Product API ────────────────────────────────────────────────────────────
export const productApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<{ data: { products: any[]; pagination: any } }>(`/products${qs}`);
  },
  getBySlug: (slug: string) =>
    apiRequest<{ data: { product: any } }>(`/products/${slug}`),
  search: (q: string) =>
    apiRequest<{ data: { products: any[] } }>(`/products?search=${encodeURIComponent(q)}`),
};

// ── Cart API ───────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => apiRequest<{ data: { cart: any } }>('/cart'),
  add: (productId: string, quantity: number, variantId?: string) =>
    apiRequest('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity, variantId }) }),
  update: (itemId: string, quantity: number) =>
    apiRequest(`/cart/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  remove: (itemId: string) =>
    apiRequest(`/cart/${itemId}`, { method: 'DELETE' }),
  clear: () => apiRequest('/cart', { method: 'DELETE' }),
};

// ── Wishlist API ───────────────────────────────────────────────────────────
export const wishlistApi = {
  get: () => apiRequest<{ data: { wishlist: any[] } }>('/wishlist'),
  add: (productId: string) =>
    apiRequest('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
  remove: (productId: string) =>
    apiRequest(`/wishlist/${productId}`, { method: 'DELETE' }),
};

// ── Order API ──────────────────────────────────────────────────────────────
export const orderApi = {
  list: () => apiRequest<{ data: { orders: any[] } }>('/orders'),
  getById: (id: string) => apiRequest<{ data: { order: any } }>(`/orders/${id}`),
  place: (body: any) =>
    apiRequest('/orders', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id: string) =>
    apiRequest(`/orders/${id}/cancel`, { method: 'PATCH' }),
};

// ── Review API ─────────────────────────────────────────────────────────────
export const reviewApi = {
  getForProduct: (productId: string, page = 1) =>
    apiRequest<{ data: { reviews: any[]; pagination: any } }>(`/products/${productId}/reviews?page=${page}`),
  create: (productId: string, body: { rating: number; title: string; body: string }) =>
    apiRequest(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
};

// ── Coupon API ─────────────────────────────────────────────────────────────
export const couponApi = {
  validate: (code: string, amount: number) =>
    apiRequest('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, amount }) }),
};

// ── Address API ────────────────────────────────────────────────────────────
export const addressApi = {
  list: () => apiRequest<{ data: { addresses: any[] } }>('/addresses'),
  create: (body: any) =>
    apiRequest('/addresses', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    apiRequest(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) =>
    apiRequest(`/addresses/${id}`, { method: 'DELETE' }),
  setDefault: (id: string) =>
    apiRequest(`/addresses/${id}/default`, { method: 'PATCH' }),
};

// ── Mock Data ──────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles', description: 'Flagship smartphones, 5G devices & accessories', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
  { id: 'cat-laptops', name: 'Laptops', slug: 'laptops', description: 'Ultra-thin ultrabooks, gaming laptops & workstations', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
  { id: 'cat-electronics', name: 'Electronics', slug: 'electronics', description: '4K Smart TVs, wireless audio, cameras & drones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: 'cat-fashion', name: 'Fashion', slug: 'fashion', description: 'Designer denim, jackets, streetwear & apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80' },
  { id: 'cat-shoes', name: 'Shoes', slug: 'shoes', description: 'Performance running kicks, sneakers & boots', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 'cat-watches', name: 'Watches', slug: 'watches', description: 'Automatic timepieces & retina smartwatches', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80' },
  { id: 'cat-grocery', name: 'Grocery', slug: 'grocery', description: 'Organic produce, gourmet coffee & pantry items', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80' },
  { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Smart appliances, cookware, bottles & minimalist decor', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80' },
  { id: 'cat-beauty', name: 'Beauty', slug: 'beauty', description: 'Luxury skincare, fragrances & cosmetics', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { id: 'cat-books', name: 'Books', slug: 'books', description: 'Bestselling novels, tech guides & biographies', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' },
  { id: 'cat-toys', name: 'Toys', slug: 'toys', description: 'STEM kits, RC drones, action figures & games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', description: 'Fitness gear, yoga mats, dumbbells & cycles', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80' },
];

export const MOCK_PRODUCTS: Product[] = [
  // ── 1. MOBILES (10 products) ───────────────────────────────────────────────
  {
    id: 'mob-1', name: 'Apple iPhone 15 Pro Max 256GB', slug: 'apple-iphone-15-pro-max-256gb',
    description: 'Titanium design, A17 Pro chip, 48MP camera system with 5x Telephoto zoom. The most powerful iPhone ever made.',
    price: 149900, discountPrice: 134900, sku: 'SKU-MOB-01', stock: 25,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
    rating: 4.9, reviewCount: 342, isFeatured: true,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-apple', name: 'Apple', slug: 'apple' },
    keywords: ['iphone', 'apple', 'mobile', 'phone', '5g', 'smartphone', 'ios', 'camera', 'titanium'],
  },
  {
    id: 'mob-2', name: 'Samsung Galaxy S24 Ultra 5G 512GB', slug: 'samsung-galaxy-s24-ultra-5g',
    description: 'Galaxy AI, Titanium Armor, Built-in S Pen, 200MP Quad Telephoto Camera. Redefining mobile intelligence.',
    price: 139999, discountPrice: 129999, sku: 'SKU-MOB-02', stock: 18,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'],
    rating: 4.8, reviewCount: 280, isFeatured: true,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-samsung', name: 'Samsung', slug: 'samsung' },
    keywords: ['samsung', 'galaxy', 's24', 'ultra', 'mobile', 'phone', 'android', 'spen', '5g'],
  },
  {
    id: 'mob-3', name: 'OnePlus 12 5G Silky Black 16GB RAM', slug: 'oneplus-12-5g-silky-black',
    description: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera, 100W SUPERVOOC charging. Pure speed, no compromise.',
    price: 69999, discountPrice: 64999, sku: 'SKU-MOB-03', stock: 40,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
    rating: 4.7, reviewCount: 195, isFeatured: false,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-oneplus', name: 'OnePlus', slug: 'oneplus' },
    keywords: ['oneplus', 'mobile', 'phone', '5g', 'android', 'hasselblad', 'fastcharge'],
  },
  {
    id: 'mob-4', name: 'Google Pixel 8 Pro 128GB Bay Blue', slug: 'google-pixel-8-pro-128gb',
    description: 'Google Tensor G3 chip, AI Magic Eraser, Best Take, Pro Controls. The ultimate Google camera experience.',
    price: 93999, discountPrice: 84999, sku: 'SKU-MOB-04', stock: 15,
    images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'],
    rating: 4.6, reviewCount: 142, isFeatured: false,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-google', name: 'Google', slug: 'google' },
    keywords: ['pixel', 'google', 'mobile', 'phone', 'android', 'tensor', 'camera'],
  },
  {
    id: 'mob-5', name: 'Xiaomi 14 Ultra 512GB Leica Camera', slug: 'xiaomi-14-ultra-512gb-leica',
    description: 'Leica VARIO-SUMMILUX professional optics, Snapdragon 8 Gen 3, 5000mAh battery.',
    price: 99999, discountPrice: 94999, sku: 'SKU-MOB-05', stock: 20,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'],
    rating: 4.7, reviewCount: 165, isFeatured: true,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-xiaomi', name: 'Xiaomi', slug: 'xiaomi' },
    keywords: ['xiaomi', 'leica', 'mobile', 'phone', 'android', '5g', 'camera'],
  },
  {
    id: 'mob-6', name: 'Realme GT 6 5G Fluid Silver 12GB', slug: 'realme-gt-6-5g-fluid-silver',
    description: 'Snapdragon 8s Gen 3, 120W charging, 6000mAh battery. Fastest charging smartphone.',
    price: 42999, discountPrice: 39999, sku: 'SKU-MOB-06', stock: 55,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
    rating: 4.5, reviewCount: 98, isFeatured: false,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-realme', name: 'Realme', slug: 'realme' },
    keywords: ['realme', 'gt6', 'mobile', '5g', 'android', 'fastcharge'],
  },
  {
    id: 'mob-7', name: 'Vivo X100 Pro 5G 256GB Asteroid Black', slug: 'vivo-x100-pro-5g-256gb',
    description: 'ZEISS APO Telephoto Camera, Dimensity 9300 chip, 100W FlashCharge.',
    price: 89999, discountPrice: 84999, sku: 'SKU-MOB-07', stock: 22,
    images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'],
    rating: 4.6, reviewCount: 120, isFeatured: false,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-vivo', name: 'Vivo', slug: 'vivo' },
    keywords: ['vivo', 'zeiss', 'mobile', 'phone', '5g', 'camera'],
  },
  {
    id: 'mob-8', name: 'Motorola Edge 50 Ultra 5G 256GB', slug: 'motorola-edge-50-ultra-5g',
    description: 'pOLED Endless Edge display, 50MP Sony camera, Ready For Desktop mode.',
    price: 59999, discountPrice: 54999, sku: 'SKU-MOB-08', stock: 30,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'],
    rating: 4.4, reviewCount: 88, isFeatured: false,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-motorola', name: 'Motorola', slug: 'motorola' },
    keywords: ['motorola', 'edge', 'mobile', 'phone', '5g'],
  },
  {
    id: 'mob-9', name: 'iQOO 12 5G Monster Orange 256GB', slug: 'iqoo-12-5g-monster-orange',
    description: 'Snapdragon 8 Gen 3, 144Hz AMOLED, 120W FlashCharge. Built for gamers.',
    price: 52999, discountPrice: 49999, sku: 'SKU-MOB-09', stock: 35,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
    rating: 4.6, reviewCount: 130, isFeatured: false,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-iqoo', name: 'iQOO', slug: 'iqoo' },
    keywords: ['iqoo', 'gaming', 'mobile', 'phone', '5g', 'snapdragon'],
  },
  {
    id: 'mob-10', name: 'Samsung Galaxy Z Fold 6 512GB', slug: 'samsung-galaxy-z-fold-6-512gb',
    description: 'Foldable smartphone with 7.6" main display, S Pen slot, Galaxy AI multitasking.',
    price: 164999, discountPrice: 154999, sku: 'SKU-MOB-10', stock: 10,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'],
    rating: 4.7, reviewCount: 95, isFeatured: true,
    category: { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles' },
    brand: { id: 'b-samsung', name: 'Samsung', slug: 'samsung' },
    keywords: ['samsung', 'galaxy', 'fold', 'foldable', '5g', 'android'],
  },

  // ── 2. LAPTOPS (10 products) ───────────────────────────────────────────────
  {
    id: 'lap-1', name: 'Apple MacBook Pro 14" M3 Pro 18GB/512GB', slug: 'apple-macbook-pro-14-m3-pro',
    description: 'Liquid Retina XDR display, 18-core GPU, up to 18 hours battery life. The most powerful Mac laptop.',
    price: 199900, discountPrice: 184900, sku: 'SKU-LAP-01', stock: 12,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
    rating: 4.9, reviewCount: 210, isFeatured: true,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-apple', name: 'Apple', slug: 'apple' },
    keywords: ['macbook', 'apple', 'laptop', 'computer', 'm3', 'pro', 'macos'],
  },
  {
    id: 'lap-2', name: 'Dell XPS 15 OLED Touch Intel i9 32GB', slug: 'dell-xps-15-oled-touch-i9',
    description: '3.5K OLED display, RTX 4060 GPU, CNC machined aluminum chassis. Professional powerhouse.',
    price: 199990, discountPrice: 184990, sku: 'SKU-LAP-02', stock: 8,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
    rating: 4.8, reviewCount: 175, isFeatured: true,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-dell', name: 'Dell', slug: 'dell' },
    keywords: ['dell', 'xps', 'laptop', 'computer', 'windows', 'oled', 'intel'],
  },
  {
    id: 'lap-3', name: 'Asus ROG Zephyrus G16 Gaming Laptop', slug: 'asus-rog-zephyrus-g16-gaming',
    description: 'Intel Core Ultra 9, RTX 4070 8GB, 240Hz Nebula Display. Engineered for domination.',
    price: 179990, discountPrice: 169990, sku: 'SKU-LAP-03', stock: 15,
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'],
    rating: 4.7, reviewCount: 160, isFeatured: false,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-asus', name: 'Asus', slug: 'asus' },
    keywords: ['asus', 'rog', 'zephyrus', 'gaming', 'laptop', 'rtx4070'],
  },
  {
    id: 'lap-4', name: 'Lenovo ThinkPad X1 Carbon Gen 12', slug: 'lenovo-thinkpad-x1-carbon-gen-12',
    description: 'Intel Core Ultra 7, 1.12kg ultra-light, military-grade durability, 4G LTE connectivity.',
    price: 159990, discountPrice: 149990, sku: 'SKU-LAP-04', stock: 10,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
    rating: 4.8, reviewCount: 145, isFeatured: false,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-lenovo', name: 'Lenovo', slug: 'lenovo' },
    keywords: ['lenovo', 'thinkpad', 'x1', 'carbon', 'laptop', 'business', 'ultrabook'],
  },
  {
    id: 'lap-5', name: 'HP Spectre x360 14 2-in-1 Laptop', slug: 'hp-spectre-x360-14-2in1',
    description: 'OLED touch display, 360° rotation, Intel Core Ultra 7, HP Tilt Pen included.',
    price: 169990, discountPrice: 154990, sku: 'SKU-LAP-05', stock: 12,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
    rating: 4.6, reviewCount: 130, isFeatured: false,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-hp', name: 'HP', slug: 'hp' },
    keywords: ['hp', 'spectre', '2in1', 'laptop', 'convertible', 'touch'],
  },
  {
    id: 'lap-6', name: 'MSI Raider GE78 HX Gaming Laptop', slug: 'msi-raider-ge78-hx-gaming',
    description: 'Intel Core i9-14900HX, RTX 4090 16GB, 240Hz QHD+ display. Unrivalled gaming muscle.',
    price: 299990, discountPrice: 279990, sku: 'SKU-LAP-06', stock: 6,
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'],
    rating: 4.8, reviewCount: 85, isFeatured: true,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-msi', name: 'MSI', slug: 'msi' },
    keywords: ['msi', 'raider', 'gaming', 'laptop', 'rtx4090', 'i9'],
  },
  {
    id: 'lap-7', name: 'Samsung Galaxy Book 4 Pro 360', slug: 'samsung-galaxy-book-4-pro-360',
    description: 'Intel Core Ultra 7, Dynamic AMOLED 2X touch display, 2-in-1 design with S Pen.',
    price: 159990, discountPrice: 144990, sku: 'SKU-LAP-07', stock: 14,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
    rating: 4.5, reviewCount: 95, isFeatured: false,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-samsung', name: 'Samsung', slug: 'samsung' },
    keywords: ['samsung', 'galaxy book', 'laptop', '2in1', 'amoled', 'touch'],
  },
  {
    id: 'lap-8', name: 'Acer Swift X 14 OLED 2024 Edition', slug: 'acer-swift-x-14-oled-2024',
    description: 'Intel Core Ultra 5, RTX 4050, 2.8K OLED display, 72Wh battery, 1.4kg.',
    price: 89990, discountPrice: 79990, sku: 'SKU-LAP-08', stock: 18,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
    rating: 4.5, reviewCount: 110, isFeatured: false,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-acer', name: 'Acer', slug: 'acer' },
    keywords: ['acer', 'swift', 'laptop', 'oled', 'rtx', 'ultrabook'],
  },
  {
    id: 'lap-9', name: 'Apple MacBook Air 15" M3 8GB/256GB', slug: 'apple-macbook-air-15-m3',
    description: '15.3-inch Liquid Retina display, M3 chip, up to 18 hours battery, fanless design.',
    price: 134900, discountPrice: 124900, sku: 'SKU-LAP-09', stock: 20,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
    rating: 4.8, reviewCount: 185, isFeatured: true,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-apple', name: 'Apple', slug: 'apple' },
    keywords: ['macbook', 'air', 'apple', 'm3', 'laptop', 'ultrabook'],
  },
  {
    id: 'lap-10', name: 'Razer Blade 16 Gaming Laptop 2024', slug: 'razer-blade-16-gaming-2024',
    description: 'Intel Core i9, RTX 4090, Dual Mode display 240Hz QHD+/120Hz UHD+, per-key RGB.',
    price: 399990, discountPrice: 374990, sku: 'SKU-LAP-10', stock: 5,
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'],
    rating: 4.9, reviewCount: 65, isFeatured: false,
    category: { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
    brand: { id: 'b-razer', name: 'Razer', slug: 'razer' },
    keywords: ['razer', 'blade', 'gaming', 'laptop', 'rtx4090', 'premium'],
  },

  // ── 3. ELECTRONICS (10 products) ──────────────────────────────────────────
  {
    id: 'elec-1', name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', slug: 'sony-wh-1000xm5-wireless-headphones',
    description: 'Industry leading noise cancelling, 30hr battery life, crystal clear hands-free calling.',
    price: 34990, discountPrice: 29990, sku: 'SKU-ELEC-01', stock: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
    rating: 4.9, reviewCount: 420, isFeatured: true,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-sony', name: 'Sony', slug: 'sony' },
    keywords: ['sony', 'headphones', 'audio', 'bluetooth', 'wireless', 'noise cancelling', 'earphones'],
  },
  {
    id: 'elec-2', name: 'Samsung 65" QLED 4K Smart TV QN90D', slug: 'samsung-65-qled-4k-smart-tv',
    description: 'Neo QLED Quantum Dot, 144Hz for gaming, Motion Xcelerator, SolarCell remote.',
    price: 124990, discountPrice: 109990, sku: 'SKU-ELEC-02', stock: 10,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4e5f1?w=800&q=80'],
    rating: 4.8, reviewCount: 190, isFeatured: true,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-samsung', name: 'Samsung', slug: 'samsung' },
    keywords: ['samsung', 'tv', 'television', 'qled', '4k', 'smart tv', 'display'],
  },
  {
    id: 'elec-3', name: 'Bose QuietComfort Ultra Headphones', slug: 'bose-quietcomfort-ultra-headphones',
    description: 'Immersive Audio with Spatial Sound, CustomTune technology, 24-hour battery.',
    price: 35990, discountPrice: 34990, sku: 'SKU-ELEC-03', stock: 30,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
    rating: 4.7, reviewCount: 230, isFeatured: false,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-bose', name: 'Bose', slug: 'bose' },
    keywords: ['bose', 'quietcomfort', 'headphones', 'audio', 'wireless'],
  },
  {
    id: 'elec-4', name: 'Apple AirPods Pro 2nd Generation', slug: 'apple-airpods-pro-2nd-gen',
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, H2 chip.',
    price: 24900, discountPrice: 22900, sku: 'SKU-ELEC-04', stock: 60,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    rating: 4.8, reviewCount: 560, isFeatured: true,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-apple', name: 'Apple', slug: 'apple' },
    keywords: ['airpods', 'apple', 'earbuds', 'wireless', 'earphones', 'noise cancelling'],
  },
  {
    id: 'elec-5', name: 'Sony A7 IV Full Frame Mirrorless Camera', slug: 'sony-a7-iv-mirrorless-camera',
    description: '33MP BSI-CMOS sensor, 4K 60fps video, 10fps burst shooting, real-time tracking AF.',
    price: 249990, discountPrice: 229990, sku: 'SKU-ELEC-05', stock: 8,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'],
    rating: 4.9, reviewCount: 148, isFeatured: false,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-sony', name: 'Sony', slug: 'sony' },
    keywords: ['sony', 'camera', 'mirrorless', 'dslr', 'photography', '4k'],
  },
  {
    id: 'elec-6', name: 'DJI Mini 4 Pro Drone with RC 2', slug: 'dji-mini-4-pro-drone-rc2',
    description: '4K/60fps video, Omnidirectional Obstacle Sensing, 34-min flight time, 249g.',
    price: 74900, discountPrice: 69900, sku: 'SKU-ELEC-06', stock: 15,
    images: ['https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80'],
    rating: 4.8, reviewCount: 175, isFeatured: false,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-dji', name: 'DJI', slug: 'dji' },
    keywords: ['dji', 'drone', 'quadcopter', 'camera drone', 'aerial photography'],
  },
  {
    id: 'elec-7', name: 'PlayStation 5 Console Digital Edition', slug: 'playstation-5-digital-edition',
    description: 'Ultra-high speed SSD, 4K gaming, up to 120fps, ray tracing, DualSense wireless controller.',
    price: 44990, discountPrice: 41990, sku: 'SKU-ELEC-07', stock: 25,
    images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80'],
    rating: 4.9, reviewCount: 890, isFeatured: true,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-sony', name: 'Sony', slug: 'sony' },
    keywords: ['ps5', 'playstation', 'gaming', 'console', 'sony', 'games'],
  },
  {
    id: 'elec-8', name: 'LG OLED C3 55" 4K Smart TV', slug: 'lg-oled-c3-55-4k-smart-tv',
    description: 'Self-lit OLED pixels, Dolby Vision IQ, 120Hz G-SYNC, evo panel for perfect blacks.',
    price: 119990, discountPrice: 104990, sku: 'SKU-ELEC-08', stock: 12,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4e5f1?w=800&q=80'],
    rating: 4.9, reviewCount: 210, isFeatured: false,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-lg', name: 'LG', slug: 'lg' },
    keywords: ['lg', 'oled', 'tv', 'television', '4k', 'smart tv'],
  },
  {
    id: 'elec-9', name: 'Sonos Era 300 Spatial Audio Speaker', slug: 'sonos-era-300-spatial-audio-speaker',
    description: 'Six-driver spatial audio architecture, Dolby Atmos music, Trueplay tuning.',
    price: 39999, discountPrice: 36999, sku: 'SKU-ELEC-09', stock: 20,
    images: ['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80'],
    rating: 4.7, reviewCount: 125, isFeatured: false,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-sonos', name: 'Sonos', slug: 'sonos' },
    keywords: ['sonos', 'speaker', 'audio', 'smart speaker', 'dolby atmos', 'spatial audio'],
  },
  {
    id: 'elec-10', name: 'iPad Pro 13" M4 Wi-Fi 256GB Space Black', slug: 'ipad-pro-13-m4-256gb',
    description: 'Ultra Retina XDR OLED display, M4 chip, Apple Pencil Pro, thinnest Apple product ever.',
    price: 119900, discountPrice: 109900, sku: 'SKU-ELEC-10', stock: 18,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
    rating: 4.9, reviewCount: 340, isFeatured: true,
    category: { id: 'cat-electronics', name: 'Electronics', slug: 'electronics' },
    brand: { id: 'b-apple', name: 'Apple', slug: 'apple' },
    keywords: ['ipad', 'apple', 'tablet', 'm4', 'oled', 'pro'],
  },

  // ── 4. FASHION (10 products) ───────────────────────────────────────────────
  {
    id: 'fash-1', name: "Levi's Original Denim Trucker Jacket", slug: 'levis-original-denim-trucker-jacket',
    description: "Classic fit premium 100% cotton denim jacket with branded metal shank buttons. Timeless American style.",
    price: 5499, discountPrice: 4499, sku: 'SKU-FASH-01', stock: 45,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
    rating: 4.6, reviewCount: 145, isFeatured: true,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-levis', name: "Levi's", slug: 'levis' },
    keywords: ['levis', 'denim', 'jacket', 'fashion', 'clothes', 'apparel', 'menswear'],
  },
  {
    id: 'fash-2', name: 'Zara Premium Slim-Fit Wool Blazer', slug: 'zara-premium-slim-fit-wool-blazer',
    description: 'Tailored notched lapel suit blazer crafted from fine Italian wool blend. Sharp professional look.',
    price: 8990, discountPrice: 7990, sku: 'SKU-FASH-02', stock: 20,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
    rating: 4.7, reviewCount: 110, isFeatured: true,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-zara', name: 'Zara', slug: 'zara' },
    keywords: ['zara', 'blazer', 'suit', 'formal', 'wool', 'fashion'],
  },
  {
    id: 'fash-3', name: 'Nike Sportswear Tech Fleece Hoodie', slug: 'nike-sportswear-tech-fleece-hoodie',
    description: 'Lightweight warmth Tech Fleece fabric with zippered sleeve pocket. Streetwear staple.',
    price: 7995, discountPrice: 6995, sku: 'SKU-FASH-03', stock: 35,
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'],
    rating: 4.8, reviewCount: 290, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-nike', name: 'Nike', slug: 'nike' },
    keywords: ['nike', 'hoodie', 'sweatshirt', 'fleece', 'streetwear', 'fashion'],
  },
  {
    id: 'fash-4', name: 'H&M Relaxed-Fit Linen Shirt Men', slug: 'hm-relaxed-fit-linen-shirt',
    description: 'Breathable 100% linen summer shirt with button placket. Perfect for casual occasions.',
    price: 2499, discountPrice: 1999, sku: 'SKU-FASH-04', stock: 60,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'],
    rating: 4.3, reviewCount: 88, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-hm', name: 'H&M', slug: 'hm' },
    keywords: ['hm', 'shirt', 'linen', 'fashion', 'casual', 'summer'],
  },
  {
    id: 'fash-5', name: 'Tommy Hilfiger Regular Polo T-Shirt', slug: 'tommy-hilfiger-regular-polo-tshirt',
    description: 'Signature embroidered flag logo, soft cotton piqué fabric. Preppy heritage style.',
    price: 3499, discountPrice: 2999, sku: 'SKU-FASH-05', stock: 80,
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'],
    rating: 4.5, reviewCount: 165, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-tommy', name: 'Tommy Hilfiger', slug: 'tommy-hilfiger' },
    keywords: ['tommy hilfiger', 'polo', 'tshirt', 'fashion', 'cotton'],
  },
  {
    id: 'fash-6', name: 'Adidas Originals 3-Stripe Track Pants', slug: 'adidas-originals-3-stripe-track-pants',
    description: 'Classic 3-Stripe design, recycled Tricot fabric, deep pockets, drawstring waist.',
    price: 4999, discountPrice: 4299, sku: 'SKU-FASH-06', stock: 50,
    images: ['https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'],
    rating: 4.6, reviewCount: 120, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-adidas', name: 'Adidas', slug: 'adidas' },
    keywords: ['adidas', 'track pants', 'sportswear', 'fashion', 'casual'],
  },
  {
    id: 'fash-7', name: "Levi's 511 Slim Fit Jeans Dark Blue", slug: 'levis-511-slim-fit-jeans-dark-blue',
    description: 'Premium stretch denim, slim through hip and thigh, sits below the waist.',
    price: 3999, discountPrice: 3499, sku: 'SKU-FASH-07', stock: 70,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'],
    rating: 4.7, reviewCount: 210, isFeatured: true,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-levis', name: "Levi's", slug: 'levis' },
    keywords: ['levis', 'jeans', 'denim', 'fashion', 'slim fit'],
  },
  {
    id: 'fash-8', name: 'Puma Graphic Oversized Tee Black', slug: 'puma-graphic-oversized-tee-black',
    description: 'Bold graphic print, relaxed oversized fit, soft jersey fabric. Urban streetwear.',
    price: 1999, discountPrice: 1499, sku: 'SKU-FASH-08', stock: 100,
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'],
    rating: 4.4, reviewCount: 75, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-puma', name: 'Puma', slug: 'puma' },
    keywords: ['puma', 'tshirt', 'oversized', 'streetwear', 'fashion'],
  },
  {
    id: 'fash-9', name: 'Jack & Jones Men\'s Premium Leather Belt', slug: 'jack-jones-premium-leather-belt',
    description: 'Full-grain leather with classic buckle, adjustable holes, versatile formal/casual.',
    price: 1799, discountPrice: 1499, sku: 'SKU-FASH-09', stock: 90,
    images: ['https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'],
    rating: 4.3, reviewCount: 55, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-jackjones', name: 'Jack & Jones', slug: 'jack-jones' },
    keywords: ['belt', 'leather', 'fashion', 'accessories', 'formal'],
  },
  {
    id: 'fash-10', name: 'Uniqlo Ultra Light Down Jacket 2024', slug: 'uniqlo-ultra-light-down-jacket',
    description: '90% down fill, packable into included pouch, windproof, 8 colour options.',
    price: 6990, discountPrice: 5990, sku: 'SKU-FASH-10', stock: 40,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
    rating: 4.8, reviewCount: 195, isFeatured: false,
    category: { id: 'cat-fashion', name: 'Fashion', slug: 'fashion' },
    brand: { id: 'b-uniqlo', name: 'Uniqlo', slug: 'uniqlo' },
    keywords: ['uniqlo', 'jacket', 'down jacket', 'winter', 'fashion'],
  },

  // ── 5. SHOES (8 products) ─────────────────────────────────────────────────
  {
    id: 'shoe-1', name: 'Nike Air Jordan 1 Retro High OG Chicago', slug: 'nike-air-jordan-1-retro-high-og',
    description: 'Iconic high-top sneaker with premium full-grain leather and Air-Sole cushioning. A timeless classic.',
    price: 18995, discountPrice: 16995, sku: 'SKU-SHOE-01', stock: 30,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'],
    rating: 4.9, reviewCount: 512, isFeatured: true,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-nike', name: 'Nike', slug: 'nike' },
    keywords: ['nike', 'jordan', 'shoes', 'sneakers', 'kicks', 'footwear', 'air jordan'],
  },
  {
    id: 'shoe-2', name: 'Adidas Ultraboost Light Running Shoes', slug: 'adidas-ultraboost-light-running-shoes',
    description: 'Lightest Boost midsole technology for maximum energy return on long runs.',
    price: 19999, discountPrice: 18999, sku: 'SKU-SHOE-02', stock: 25,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'],
    rating: 4.8, reviewCount: 380, isFeatured: true,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-adidas', name: 'Adidas', slug: 'adidas' },
    keywords: ['adidas', 'ultraboost', 'running', 'shoes', 'sneakers', 'footwear'],
  },
  {
    id: 'shoe-3', name: 'Puma Velocity Nitro 3 Running Kicks', slug: 'puma-velocity-nitro-3-running-kicks',
    description: 'NITROFOAM cushioning with PUMAGRIP durable rubber outsole traction.',
    price: 12999, discountPrice: 11999, sku: 'SKU-SHOE-03', stock: 40,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'],
    rating: 4.7, reviewCount: 220, isFeatured: false,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-puma', name: 'Puma', slug: 'puma' },
    keywords: ['puma', 'shoes', 'sneakers', 'running', 'footwear'],
  },
  {
    id: 'shoe-4', name: 'New Balance Fresh Foam X 1080v13', slug: 'new-balance-fresh-foam-1080v13',
    description: 'Ultra-plush Fresh Foam X cushioning, engineered mesh upper, data-driven design.',
    price: 16995, discountPrice: 15495, sku: 'SKU-SHOE-04', stock: 22,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    rating: 4.7, reviewCount: 165, isFeatured: false,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-newbalance', name: 'New Balance', slug: 'new-balance' },
    keywords: ['new balance', 'running', 'shoes', 'sneakers', 'fresh foam'],
  },
  {
    id: 'shoe-5', name: 'Nike Air Max 97 Silver Bullet OG', slug: 'nike-air-max-97-silver-bullet-og',
    description: 'Full-length visible Air unit, wavy line design inspired by Japanese bullet trains.',
    price: 17995, discountPrice: 15995, sku: 'SKU-SHOE-05', stock: 18,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'],
    rating: 4.8, reviewCount: 285, isFeatured: false,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-nike', name: 'Nike', slug: 'nike' },
    keywords: ['nike', 'air max', 'shoes', 'sneakers', 'og', 'classic'],
  },
  {
    id: 'shoe-6', name: 'Red Tape Men\'s Oxford Formal Shoes', slug: 'red-tape-oxford-formal-shoes',
    description: 'Genuine leather upper, cushioned insole, textured rubber outsole. Office-ready.',
    price: 3999, discountPrice: 2999, sku: 'SKU-SHOE-06', stock: 55,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    rating: 4.3, reviewCount: 130, isFeatured: false,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-redtape', name: 'Red Tape', slug: 'red-tape' },
    keywords: ['red tape', 'formal shoes', 'oxford', 'leather', 'office'],
  },
  {
    id: 'shoe-7', name: 'Skechers Go Walk 7 Slip-On Shoes', slug: 'skechers-go-walk-7-slip-on',
    description: '5Gen cushioning, Air-Cooled Goga Mat insole, machine washable comfort shoes.',
    price: 5999, discountPrice: 4999, sku: 'SKU-SHOE-07', stock: 70,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'],
    rating: 4.5, reviewCount: 245, isFeatured: false,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-skechers', name: 'Skechers', slug: 'skechers' },
    keywords: ['skechers', 'walking shoes', 'slip on', 'comfort', 'casual'],
  },
  {
    id: 'shoe-8', name: 'Converse Chuck Taylor All Star High Top', slug: 'converse-chuck-taylor-all-star-high-top',
    description: 'Canvas upper, rubber toe cap, iconic All Star ankle patch. Since 1917.',
    price: 5499, discountPrice: 4799, sku: 'SKU-SHOE-08', stock: 80,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    rating: 4.6, reviewCount: 420, isFeatured: false,
    category: { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
    brand: { id: 'b-converse', name: 'Converse', slug: 'converse' },
    keywords: ['converse', 'chuck taylor', 'canvas', 'sneakers', 'shoes', 'classic'],
  },

  // ── 6. WATCHES (8 products) ───────────────────────────────────────────────
  {
    id: 'wat-1', name: 'Seiko Presage Automatic Mechanical Watch', slug: 'seiko-presage-automatic-mechanical-watch',
    description: 'Japanese 4R35 automatic caliber, Sapphire crystal glass, stainless steel bracelet.',
    price: 42000, discountPrice: 38500, sku: 'SKU-WAT-01', stock: 14,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    rating: 4.9, reviewCount: 185, isFeatured: true,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-seiko', name: 'Seiko', slug: 'seiko' },
    keywords: ['seiko', 'watch', 'watches', 'automatic', 'wrist watch', 'luxury'],
  },
  {
    id: 'wat-2', name: 'Apple Watch Ultra 2 GPS + Cellular 49mm', slug: 'apple-watch-ultra-2-gps-cellular',
    description: 'Titanium case, 3000-nit display, Dual-frequency GPS, 36-hour battery life. For extreme adventurers.',
    price: 89900, discountPrice: 84900, sku: 'SKU-WAT-02', stock: 18,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    rating: 4.9, reviewCount: 410, isFeatured: true,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-apple', name: 'Apple', slug: 'apple' },
    keywords: ['apple watch', 'watch', 'smartwatch', 'ultra', 'fitness watch', 'apple'],
  },
  {
    id: 'wat-3', name: 'Fossil Gen 6 Wellness Edition Smartwatch', slug: 'fossil-gen-6-wellness-smartwatch',
    description: 'Wear OS by Google, SpO2 tracking, heart rate, GPS, 1.28" AMOLED display.',
    price: 22995, discountPrice: 19995, sku: 'SKU-WAT-03', stock: 25,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'],
    rating: 4.4, reviewCount: 140, isFeatured: false,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-fossil', name: 'Fossil', slug: 'fossil' },
    keywords: ['fossil', 'smartwatch', 'wearos', 'watch', 'fitness'],
  },
  {
    id: 'wat-4', name: 'Garmin Fenix 7X Solar Multisport GPS Watch', slug: 'garmin-fenix-7x-solar-gps-watch',
    description: 'Solar charging lens, 28-day battery, topographic maps, dive mode, triathlon tracking.',
    price: 84990, discountPrice: 79990, sku: 'SKU-WAT-04', stock: 10,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    rating: 4.8, reviewCount: 98, isFeatured: false,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-garmin', name: 'Garmin', slug: 'garmin' },
    keywords: ['garmin', 'fenix', 'gps watch', 'sport watch', 'fitness tracker'],
  },
  {
    id: 'wat-5', name: 'Samsung Galaxy Watch 6 Classic 47mm', slug: 'samsung-galaxy-watch-6-classic-47mm',
    description: 'Rotating bezel, sapphire crystal glass, advanced health monitoring, Wear OS 4.',
    price: 34999, discountPrice: 31999, sku: 'SKU-WAT-05', stock: 22,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'],
    rating: 4.6, reviewCount: 165, isFeatured: false,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-samsung', name: 'Samsung', slug: 'samsung' },
    keywords: ['samsung', 'galaxy watch', 'smartwatch', 'wear os', 'health'],
  },
  {
    id: 'wat-6', name: 'Casio G-Shock GA-2100 CasiOak Black', slug: 'casio-gshock-ga-2100-casioak',
    description: 'Carbon Core Guard structure, shock resistant, world time, 200m water resistant.',
    price: 9995, discountPrice: 8995, sku: 'SKU-WAT-06', stock: 50,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    rating: 4.7, reviewCount: 380, isFeatured: false,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-casio', name: 'Casio', slug: 'casio' },
    keywords: ['casio', 'gshock', 'watch', 'sport watch', 'rugged'],
  },
  {
    id: 'wat-7', name: 'Titan Raga Women\'s Rose Gold Watch', slug: 'titan-raga-rose-gold-womens-watch',
    description: 'Swarovski crystal studded dial, stainless steel rose gold case, leather strap.',
    price: 8995, discountPrice: 7995, sku: 'SKU-WAT-07', stock: 30,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'],
    rating: 4.5, reviewCount: 220, isFeatured: false,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-titan', name: 'Titan', slug: 'titan' },
    keywords: ['titan', 'raga', 'womens watch', 'rose gold', 'watch', 'ladies'],
  },
  {
    id: 'wat-8', name: 'Fitbit Charge 6 Fitness Tracker', slug: 'fitbit-charge-6-fitness-tracker',
    description: 'Built-in GPS, heart rate, ECG, sleep tracking, 7-day battery, Google apps.',
    price: 13999, discountPrice: 12499, sku: 'SKU-WAT-08', stock: 40,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    rating: 4.5, reviewCount: 195, isFeatured: false,
    category: { id: 'cat-watches', name: 'Watches', slug: 'watches' },
    brand: { id: 'b-fitbit', name: 'Fitbit', slug: 'fitbit' },
    keywords: ['fitbit', 'fitness tracker', 'smartwatch', 'health', 'gps'],
  },

  // ── 7. GROCERY (8 products) ───────────────────────────────────────────────
  {
    id: 'groc-1', name: 'Tata Tea Gold Premium Assam Blend 1kg', slug: 'tata-tea-gold-premium-assam-blend-1kg',
    description: '100% pure Assam tea leaves blended with long leaf teas for rich aroma & taste.',
    price: 699, discountPrice: 599, sku: 'SKU-GROC-01', stock: 100,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'],
    rating: 4.8, reviewCount: 620, isFeatured: true,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-tata', name: 'Tata', slug: 'tata' },
    keywords: ['tata', 'tea', 'chai', 'grocery', 'beverage', 'assam tea'],
  },
  {
    id: 'groc-2', name: 'Fortune Sunlite Refined Sunflower Oil 5L', slug: 'fortune-sunlite-sunflower-oil-5l',
    description: 'Rich in Vitamin E and MUFA, light texture perfect for daily cooking.',
    price: 899, discountPrice: 799, sku: 'SKU-GROC-02', stock: 80,
    images: ['https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&q=80'],
    rating: 4.6, reviewCount: 480, isFeatured: false,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-fortune', name: 'Fortune', slug: 'fortune' },
    keywords: ['oil', 'cooking oil', 'sunflower', 'grocery', 'edible oil'],
  },
  {
    id: 'groc-3', name: 'Amul Pure Ghee 1kg Jar', slug: 'amul-pure-ghee-1kg-jar',
    description: 'Made from fresh cow milk cream, rich in Vitamins A, D, E and K. Pure & Natural.',
    price: 659, discountPrice: 599, sku: 'SKU-GROC-03', stock: 120,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'],
    rating: 4.8, reviewCount: 890, isFeatured: false,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-amul', name: 'Amul', slug: 'amul' },
    keywords: ['amul', 'ghee', 'grocery', 'dairy', 'cooking'],
  },
  {
    id: 'groc-4', name: 'Nescafe Gold Blend Premium Coffee 200g', slug: 'nescafe-gold-blend-premium-coffee',
    description: 'Smooth, balanced taste with natural coffee aroma. Expertly crafted for every moment.',
    price: 799, discountPrice: 699, sku: 'SKU-GROC-04', stock: 90,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'],
    rating: 4.7, reviewCount: 540, isFeatured: false,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-nescafe', name: 'Nescafe', slug: 'nescafe' },
    keywords: ['nescafe', 'coffee', 'instant coffee', 'grocery', 'beverage'],
  },
  {
    id: 'groc-5', name: 'Organic India Tulsi Green Tea 25 Bags', slug: 'organic-india-tulsi-green-tea-25-bags',
    description: 'USDA certified organic, antioxidant rich, calming blend of Rama & Vana Tulsi.',
    price: 299, discountPrice: 249, sku: 'SKU-GROC-05', stock: 200,
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80'],
    rating: 4.5, reviewCount: 320, isFeatured: false,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-organic-india', name: 'Organic India', slug: 'organic-india' },
    keywords: ['organic', 'tulsi', 'green tea', 'herbal tea', 'grocery'],
  },
  {
    id: 'groc-6', name: 'Quaker Rolled Oats 2kg Pouch', slug: 'quaker-rolled-oats-2kg-pouch',
    description: '100% whole grain oats, rich in beta-glucan fiber, helps lower cholesterol.',
    price: 499, discountPrice: 429, sku: 'SKU-GROC-06', stock: 150,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'],
    rating: 4.7, reviewCount: 610, isFeatured: false,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-quaker', name: 'Quaker', slug: 'quaker' },
    keywords: ['quaker', 'oats', 'breakfast', 'fiber', 'healthy', 'grocery'],
  },
  {
    id: 'groc-7', name: 'Dabur Honey Squeezy 1kg Pack', slug: 'dabur-honey-squeezy-1kg',
    description: 'NMR tested pure honey, directly sourced from beekeepers, no added sugar.',
    price: 549, discountPrice: 479, sku: 'SKU-GROC-07', stock: 100,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'],
    rating: 4.6, reviewCount: 445, isFeatured: false,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-dabur', name: 'Dabur', slug: 'dabur' },
    keywords: ['dabur', 'honey', 'grocery', 'natural', 'sweetener'],
  },
  {
    id: 'groc-8', name: 'Aashirvaad Select Sharbati Atta 5kg', slug: 'aashirvaad-select-sharbati-atta-5kg',
    description: 'Made from finest sharbati wheat, rich in fiber, 100% natural, no additives.',
    price: 349, discountPrice: 299, sku: 'SKU-GROC-08', stock: 180,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'],
    rating: 4.8, reviewCount: 760, isFeatured: true,
    category: { id: 'cat-grocery', name: 'Grocery', slug: 'grocery' },
    brand: { id: 'b-aashirvaad', name: 'Aashirvaad', slug: 'aashirvaad' },
    keywords: ['atta', 'wheat flour', 'grocery', 'aashirvaad', 'flour'],
  },

  // ── 8. HOME & KITCHEN (8 products) ────────────────────────────────────────
  {
    id: 'hk-1', name: 'Milton Thermosteel Stainless Steel Water Bottle 1000ml', slug: 'milton-thermosteel-water-bottle-1000ml',
    description: 'Insulated 24-hour hot & cold vacuum flask water bottle, rust-free food-grade steel.',
    price: 1299, discountPrice: 999, sku: 'SKU-HK-01', stock: 75,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'],
    rating: 4.9, reviewCount: 840, isFeatured: true,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-milton', name: 'Milton', slug: 'milton' },
    keywords: ['bottle', 'water bottle', 'flask', 'vacuum flask', 'thermos', 'hydration', 'milton', 'steel bottle'],
  },
  {
    id: 'hk-2', name: 'Cello Stainless Steel Hydration Vacuum Flask 750ml', slug: 'cello-stainless-steel-hydration-flask-750ml',
    description: 'Double-walled thermal insulation water bottle for gym, office, sports, and travel.',
    price: 999, discountPrice: 799, sku: 'SKU-HK-02', stock: 60,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'],
    rating: 4.8, reviewCount: 520, isFeatured: true,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-cello', name: 'Cello', slug: 'cello' },
    keywords: ['bottle', 'water bottle', 'flask', 'thermos', 'cello', 'hydration'],
  },
  {
    id: 'hk-3', name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker', slug: 'instant-pot-duo-7-in-1-electric-cooker',
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer.',
    price: 11990, discountPrice: 9990, sku: 'SKU-HK-03', stock: 25,
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'],
    rating: 4.9, reviewCount: 380, isFeatured: false,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-instantpot', name: 'Instant Pot', slug: 'instantpot' },
    keywords: ['cooker', 'instant pot', 'kitchen', 'appliances', 'pressure cooker'],
  },
  {
    id: 'hk-4', name: 'Philips Digital Air Fryer XXL 1.4kg', slug: 'philips-digital-air-fryer-xxl',
    description: 'Rapid CombiAir technology, 90% less fat frying, NutriU app connected recipes.',
    price: 17990, discountPrice: 14990, sku: 'SKU-HK-04', stock: 18,
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80'],
    rating: 4.8, reviewCount: 290, isFeatured: false,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-philips', name: 'Philips', slug: 'philips' },
    keywords: ['air fryer', 'philips', 'fryer', 'kitchen', 'appliances'],
  },
  {
    id: 'hk-5', name: 'Prestige Svachh Pressure Cooker 5L', slug: 'prestige-svachh-pressure-cooker-5l',
    description: 'Spillage-free cooking, Vent Weight Release technology, ISI marked, 5 years warranty.',
    price: 2499, discountPrice: 1999, sku: 'SKU-HK-05', stock: 55,
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'],
    rating: 4.6, reviewCount: 680, isFeatured: false,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-prestige', name: 'Prestige', slug: 'prestige' },
    keywords: ['prestige', 'pressure cooker', 'kitchen', 'cookware', 'cooker'],
  },
  {
    id: 'hk-6', name: 'Wonderchef Granite Non-Stick Cookware Set 3-Piece', slug: 'wonderchef-granite-non-stick-cookware-set',
    description: 'Granite-coated, PFOA-free, induction compatible, easy-clean surface, tempered glass lid.',
    price: 3999, discountPrice: 2999, sku: 'SKU-HK-06', stock: 35,
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'],
    rating: 4.5, reviewCount: 210, isFeatured: false,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-wonderchef', name: 'Wonderchef', slug: 'wonderchef' },
    keywords: ['wonderchef', 'cookware', 'non-stick', 'kitchen', 'pan', 'set'],
  },
  {
    id: 'hk-7', name: 'IKEA KALLAX Shelving Unit White 2x4', slug: 'ikea-kallax-shelving-unit-white-2x4',
    description: '8 compartments for storage, room divider, wall-mounted or floor-standing versatility.',
    price: 7990, discountPrice: 7490, sku: 'SKU-HK-07', stock: 20,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    rating: 4.4, reviewCount: 340, isFeatured: false,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-ikea', name: 'IKEA', slug: 'ikea' },
    keywords: ['ikea', 'kallax', 'shelf', 'storage', 'furniture', 'home'],
  },
  {
    id: 'hk-8', name: 'Dyson V12 Detect Slim Cordless Vacuum', slug: 'dyson-v12-detect-slim-cordless-vacuum',
    description: 'Laser dust detection, LCD display, 60-min run time, hair screw tool included.',
    price: 52900, discountPrice: 47900, sku: 'SKU-HK-08', stock: 12,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    rating: 4.8, reviewCount: 175, isFeatured: true,
    category: { id: 'cat-home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: { id: 'b-dyson', name: 'Dyson', slug: 'dyson' },
    keywords: ['dyson', 'vacuum', 'cordless', 'cleaner', 'home appliances'],
  },

  // ── 9. BEAUTY (8 products) ────────────────────────────────────────────────
  {
    id: 'beau-1', name: 'Estée Lauder Advanced Night Repair Serum 50ml', slug: 'estee-lauder-advanced-night-repair-serum',
    description: 'Patented Chronolux Power Signal Technology for deep fast night renewal.',
    price: 9900, discountPrice: 8900, sku: 'SKU-BEAU-01', stock: 35,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80'],
    rating: 4.9, reviewCount: 480, isFeatured: true,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-esteelauder', name: 'Estée Lauder', slug: 'esteelauder' },
    keywords: ['serum', 'skincare', 'beauty', 'estee lauder', 'cosmetics', 'anti-aging'],
  },
  {
    id: 'beau-2', name: 'Cetaphil Moisturizing Cream 250g for Sensitive Skin', slug: 'cetaphil-moisturizing-cream-250g',
    description: 'Dermatologist recommended, non-comedogenic, fragrance-free intense moisturization.',
    price: 699, discountPrice: 599, sku: 'SKU-BEAU-02', stock: 100,
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80'],
    rating: 4.7, reviewCount: 1240, isFeatured: false,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-cetaphil', name: 'Cetaphil', slug: 'cetaphil' },
    keywords: ['cetaphil', 'moisturizer', 'skincare', 'cream', 'sensitive skin', 'beauty'],
  },
  {
    id: 'beau-3', name: 'L\'Oréal Paris Revitalift Triple Power Anti-Aging Serum', slug: 'loreal-revitalift-triple-power-serum',
    description: 'Pro-Retinol, Vitamin C, and Hyaluronic Acid trio for visibly youthful skin.',
    price: 1499, discountPrice: 1299, sku: 'SKU-BEAU-03', stock: 60,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'],
    rating: 4.5, reviewCount: 380, isFeatured: false,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-loreal', name: "L'Oréal", slug: 'loreal' },
    keywords: ['loreal', 'serum', 'beauty', 'skincare', 'anti-aging', 'retinol'],
  },
  {
    id: 'beau-4', name: 'Mamaearth Onion Hair Fall Control Oil 250ml', slug: 'mamaearth-onion-hair-fall-oil-250ml',
    description: 'Onion extract + Redensyl, reduces hair fall by 96%, DHT blocker technology.',
    price: 399, discountPrice: 349, sku: 'SKU-BEAU-04', stock: 150,
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80'],
    rating: 4.4, reviewCount: 920, isFeatured: false,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-mamaearth', name: 'Mamaearth', slug: 'mamaearth' },
    keywords: ['mamaearth', 'hair oil', 'hair care', 'onion', 'hair fall', 'beauty'],
  },
  {
    id: 'beau-5', name: 'Lakme Absolute Matte Revolution Lip Color', slug: 'lakme-absolute-matte-revolution-lip-color',
    description: 'Ultra matte finish, 10-hour stay, Vitamin E enriched, feather-light formula.',
    price: 599, discountPrice: 499, sku: 'SKU-BEAU-05', stock: 200,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'],
    rating: 4.4, reviewCount: 680, isFeatured: false,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-lakme', name: 'Lakme', slug: 'lakme' },
    keywords: ['lakme', 'lipstick', 'lip color', 'makeup', 'beauty', 'cosmetics'],
  },
  {
    id: 'beau-6', name: "Nivea Men Deep Impact Freshness Face Wash 100ml", slug: 'nivea-men-deep-impact-face-wash',
    description: 'Activated charcoal deep cleansing, 0% parabens, controls excess oil & dirt.',
    price: 249, discountPrice: 199, sku: 'SKU-BEAU-06', stock: 180,
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80'],
    rating: 4.3, reviewCount: 540, isFeatured: false,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-nivea', name: 'Nivea', slug: 'nivea' },
    keywords: ['nivea', 'face wash', 'skincare', 'beauty', 'men'],
  },
  {
    id: 'beau-7', name: "The Ordinary Niacinamide 10% + Zinc 1% 30ml", slug: 'the-ordinary-niacinamide-10-zinc-1',
    description: 'High strength vitamin B3 serum, reduces blemishes, controls sebum, minimizes pores.',
    price: 899, discountPrice: 799, sku: 'SKU-BEAU-07', stock: 80,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'],
    rating: 4.6, reviewCount: 490, isFeatured: false,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-theordinary', name: 'The Ordinary', slug: 'the-ordinary' },
    keywords: ['the ordinary', 'niacinamide', 'serum', 'skincare', 'beauty', 'pores'],
  },
  {
    id: 'beau-8', name: 'Chanel No. 5 Eau de Parfum 100ml', slug: 'chanel-no-5-eau-de-parfum-100ml',
    description: 'The world\'s most iconic fragrance. Aldehydic floral with rose, jasmine, sandalwood.',
    price: 22000, discountPrice: 20000, sku: 'SKU-BEAU-08', stock: 20,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80'],
    rating: 4.9, reviewCount: 280, isFeatured: true,
    category: { id: 'cat-beauty', name: 'Beauty', slug: 'beauty' },
    brand: { id: 'b-chanel', name: 'Chanel', slug: 'chanel' },
    keywords: ['chanel', 'perfume', 'fragrance', 'beauty', 'luxury', 'parfum'],
  },

  // ── 10. BOOKS (8 products) ────────────────────────────────────────────────
  {
    id: 'book-1', name: 'Atomic Habits by James Clear (Hardcover)', slug: 'atomic-habits-james-clear-hardcover',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 15 Million Copies Sold.',
    price: 699, discountPrice: 499, sku: 'SKU-BOOK-01', stock: 120,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'],
    rating: 4.9, reviewCount: 1420, isFeatured: true,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-penguin', name: 'Penguin', slug: 'penguin' },
    keywords: ['book', 'books', 'atomic habits', 'james clear', 'reading', 'bestseller', 'habits'],
  },
  {
    id: 'book-2', name: 'The Lean Startup by Eric Ries', slug: 'the-lean-startup-eric-ries',
    description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.',
    price: 599, discountPrice: 449, sku: 'SKU-BOOK-02', stock: 90,
    images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'],
    rating: 4.7, reviewCount: 850, isFeatured: false,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-currency', name: 'Currency Press', slug: 'currency-press' },
    keywords: ['lean startup', 'eric ries', 'startup', 'entrepreneurship', 'book', 'business'],
  },
  {
    id: 'book-3', name: 'Rich Dad Poor Dad by Robert Kiyosaki', slug: 'rich-dad-poor-dad-robert-kiyosaki',
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!',
    price: 399, discountPrice: 299, sku: 'SKU-BOOK-03', stock: 150,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'],
    rating: 4.6, reviewCount: 2100, isFeatured: false,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-plata', name: 'Plata Publishing', slug: 'plata' },
    keywords: ['rich dad poor dad', 'kiyosaki', 'finance', 'investing', 'money', 'book'],
  },
  {
    id: 'book-4', name: 'The Psychology of Money by Morgan Housel', slug: 'psychology-of-money-morgan-housel',
    description: 'Timeless lessons on wealth, greed, and happiness from 19 short stories.',
    price: 499, discountPrice: 379, sku: 'SKU-BOOK-04', stock: 100,
    images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'],
    rating: 4.8, reviewCount: 1180, isFeatured: false,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-harriman', name: 'Harriman House', slug: 'harriman-house' },
    keywords: ['psychology of money', 'morgan housel', 'finance', 'investing', 'wealth', 'book'],
  },
  {
    id: 'book-5', name: 'Sapiens: A Brief History of Humankind', slug: 'sapiens-brief-history-humankind',
    description: 'Yuval Noah Harari\'s landmark narrative of humanity\'s creation & evolution. 30M+ copies sold.',
    price: 599, discountPrice: 449, sku: 'SKU-BOOK-05', stock: 80,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'],
    rating: 4.7, reviewCount: 1560, isFeatured: true,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-vintage', name: 'Vintage Books', slug: 'vintage-books' },
    keywords: ['sapiens', 'harari', 'history', 'humanity', 'book', 'bestseller'],
  },
  {
    id: 'book-6', name: 'Clean Code by Robert C. Martin', slug: 'clean-code-robert-c-martin',
    description: 'A Handbook of Agile Software Craftsmanship. Essential reading for every developer.',
    price: 799, discountPrice: 699, sku: 'SKU-BOOK-06', stock: 60,
    images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'],
    rating: 4.8, reviewCount: 740, isFeatured: false,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-prentice-hall', name: 'Prentice Hall', slug: 'prentice-hall' },
    keywords: ['clean code', 'robert martin', 'programming', 'software', 'developer', 'book'],
  },
  {
    id: 'book-7', name: 'The Alchemist by Paulo Coelho (Paperback)', slug: 'the-alchemist-paulo-coelho',
    description: 'A magical novel about following your dreams and listening to your heart. Over 150M copies.',
    price: 299, discountPrice: 249, sku: 'SKU-BOOK-07', stock: 200,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'],
    rating: 4.8, reviewCount: 3200, isFeatured: false,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-harper', name: 'HarperCollins', slug: 'harpercollins' },
    keywords: ['alchemist', 'paulo coelho', 'fiction', 'novel', 'book', 'inspirational'],
  },
  {
    id: 'book-8', name: 'System Design Interview by Alex Xu (Vol 1)', slug: 'system-design-interview-alex-xu',
    description: 'An Insider\'s Guide to scalable system design with clear patterns and case studies.',
    price: 1899, discountPrice: 1599, sku: 'SKU-BOOK-08', stock: 45,
    images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'],
    rating: 4.9, reviewCount: 560, isFeatured: false,
    category: { id: 'cat-books', name: 'Books', slug: 'books' },
    brand: { id: 'b-bytebytegopress', name: 'ByteByteGo Press', slug: 'bytebytego' },
    keywords: ['system design', 'interview', 'alex xu', 'programming', 'tech', 'book'],
  },

  // ── 11. TOYS (8 products) ─────────────────────────────────────────────────
  {
    id: 'toy-1', name: 'LEGO Star Wars Millennium Falcon 75257', slug: 'lego-star-wars-millennium-falcon-75257',
    description: '1,351 pieces starship model with Finn, Chewbacca, Lando Calrissian minifigures.',
    price: 16999, discountPrice: 14999, sku: 'SKU-TOY-01', stock: 15,
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    rating: 4.9, reviewCount: 310, isFeatured: true,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-lego', name: 'LEGO', slug: 'lego' },
    keywords: ['toy', 'toys', 'lego', 'star wars', 'building kit', 'kids'],
  },
  {
    id: 'toy-2', name: 'Hot Wheels Ultimate Garage Playset', slug: 'hot-wheels-ultimate-garage-playset',
    description: '4-level garage with car wash, elevator, drag strip; fits 140+ cars.',
    price: 8999, discountPrice: 7499, sku: 'SKU-TOY-02', stock: 20,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    rating: 4.7, reviewCount: 185, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-hotwheels', name: 'Hot Wheels', slug: 'hot-wheels' },
    keywords: ['hot wheels', 'toy', 'garage', 'cars', 'kids', 'playset'],
  },
  {
    id: 'toy-3', name: 'Funskool Junior Doctor Set 20 Pieces', slug: 'funskool-junior-doctor-set',
    description: 'Stethoscope, syringe, thermometer, 20 realistic medical accessories for role play.',
    price: 799, discountPrice: 649, sku: 'SKU-TOY-03', stock: 50,
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80'],
    rating: 4.5, reviewCount: 240, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-funskool', name: 'Funskool', slug: 'funskool' },
    keywords: ['funskool', 'doctor set', 'toy', 'pretend play', 'kids'],
  },
  {
    id: 'toy-4', name: 'Rubik\'s Cube 3x3 Original Puzzle', slug: 'rubiks-cube-3x3-original-puzzle',
    description: 'Classic 3x3 brain teaser with smooth turning mechanism. The original speed cube.',
    price: 499, discountPrice: 399, sku: 'SKU-TOY-04', stock: 200,
    images: ['https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80'],
    rating: 4.6, reviewCount: 1560, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-rubiks', name: "Rubik's", slug: 'rubiks' },
    keywords: ['rubik', 'cube', 'puzzle', 'toy', 'brain teaser'],
  },
  {
    id: 'toy-5', name: 'Nerf N-Strike Elite Disruptor Blaster', slug: 'nerf-elite-disruptor-blaster',
    description: '6-dart rotating drum, fires darts up to 27m, includes 12 Official Nerf Elite darts.',
    price: 1299, discountPrice: 999, sku: 'SKU-TOY-05', stock: 40,
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80'],
    rating: 4.5, reviewCount: 310, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-nerf', name: 'Nerf', slug: 'nerf' },
    keywords: ['nerf', 'blaster', 'toy gun', 'outdoor', 'toy'],
  },
  {
    id: 'toy-6', name: 'Barbie Dreamhouse 2023 Edition', slug: 'barbie-dreamhouse-2023-edition',
    description: '75+ accessories, 3 stories, 8 rooms, working elevator, poolside slide, lights & sounds.',
    price: 15999, discountPrice: 12999, sku: 'SKU-TOY-06', stock: 12,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    rating: 4.7, reviewCount: 190, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-barbie', name: 'Barbie', slug: 'barbie' },
    keywords: ['barbie', 'dreamhouse', 'doll', 'girls toy', 'playset'],
  },
  {
    id: 'toy-7', name: 'Syma X20 Mini RC Drone for Kids', slug: 'syma-x20-mini-rc-drone',
    description: 'Auto hovering, 3D flip function, headless mode, one-key return, 6-axis gyro.',
    price: 2999, discountPrice: 2499, sku: 'SKU-TOY-07', stock: 30,
    images: ['https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80'],
    rating: 4.3, reviewCount: 180, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-syma', name: 'Syma', slug: 'syma' },
    keywords: ['drone', 'rc', 'kids', 'toy', 'quadcopter', 'flying'],
  },
  {
    id: 'toy-8', name: 'UNO Flip! Card Game Family Pack', slug: 'uno-flip-card-game-family-pack',
    description: '112 cards with Light and Dark sides, unique flip mechanic, 2-10 players.',
    price: 599, discountPrice: 499, sku: 'SKU-TOY-08', stock: 100,
    images: ['https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80'],
    rating: 4.6, reviewCount: 890, isFeatured: false,
    category: { id: 'cat-toys', name: 'Toys', slug: 'toys' },
    brand: { id: 'b-mattel', name: 'Mattel', slug: 'mattel' },
    keywords: ['uno', 'card game', 'family game', 'toy', 'board game'],
  },

  // ── 12. SPORTS (8 products) ───────────────────────────────────────────────
  {
    id: 'spt-1', name: 'Cosco Rubber Hex Dumbbells Set 20kg Pair', slug: 'cosco-rubber-hex-dumbbells-set-20kg',
    description: 'Heavy duty hex dumbbells with anti-roll design and ergonomic chrome steel grip.',
    price: 4999, discountPrice: 3999, sku: 'SKU-SPT-01', stock: 30,
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'],
    rating: 4.8, reviewCount: 240, isFeatured: true,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-cosco', name: 'Cosco', slug: 'cosco' },
    keywords: ['sports', 'dumbbells', 'weights', 'gym', 'fitness', 'workout'],
  },
  {
    id: 'spt-2', name: 'Yonex Arcsaber 7 Pro Badminton Racket', slug: 'yonex-arcsaber-7-pro-badminton-racket',
    description: 'Isometric head shape, speed & power, box frame, intermediate-advanced players.',
    price: 7999, discountPrice: 6999, sku: 'SKU-SPT-02', stock: 25,
    images: ['https://images.unsplash.com/photo-1569682768706-0e5e0d83a5cf?w=800&q=80'],
    rating: 4.7, reviewCount: 180, isFeatured: false,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-yonex', name: 'Yonex', slug: 'yonex' },
    keywords: ['yonex', 'badminton', 'racket', 'sports', 'indoor sport'],
  },
  {
    id: 'spt-3', name: 'Boldfit Yoga Mat 6mm Anti-Slip 183x61cm', slug: 'boldfit-yoga-mat-6mm-anti-slip',
    description: 'TPE eco-friendly, 6mm thick anti-slip surface, alignment lines, carry strap included.',
    price: 999, discountPrice: 799, sku: 'SKU-SPT-03', stock: 80,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'],
    rating: 4.5, reviewCount: 640, isFeatured: false,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-boldfit', name: 'Boldfit', slug: 'boldfit' },
    keywords: ['yoga mat', 'yoga', 'fitness', 'sports', 'exercise', 'mat'],
  },
  {
    id: 'spt-4', name: 'Decathlon Kiprun KD900 Running Shoes', slug: 'decathlon-kiprun-kd900-running-shoes',
    description: 'Carbon fiber plate, PEBAX foam midsole, race-ready for road marathons.',
    price: 9999, discountPrice: 8999, sku: 'SKU-SPT-04', stock: 35,
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'],
    rating: 4.6, reviewCount: 290, isFeatured: false,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-decathlon', name: 'Decathlon', slug: 'decathlon' },
    keywords: ['decathlon', 'running shoes', 'marathon', 'sports', 'footwear'],
  },
  {
    id: 'spt-5', name: 'Nike Pro Dri-FIT Tight Training Shorts', slug: 'nike-pro-dri-fit-tight-shorts',
    description: 'Sweat-wicking Dri-FIT fabric, 4-way stretch, 7" inseam, inner liner.',
    price: 2995, discountPrice: 2495, sku: 'SKU-SPT-05', stock: 60,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'],
    rating: 4.6, reviewCount: 150, isFeatured: false,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-nike', name: 'Nike', slug: 'nike' },
    keywords: ['nike', 'shorts', 'training', 'gym wear', 'sports'],
  },
  {
    id: 'spt-6', name: 'Strauss Cricket Bat Full Size Kashmir Willow', slug: 'strauss-cricket-bat-full-size',
    description: 'Grade A Kashmir willow, premium handle, power-hitting sweet spot, protective sticker.',
    price: 2499, discountPrice: 1999, sku: 'SKU-SPT-06', stock: 40,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80'],
    rating: 4.4, reviewCount: 195, isFeatured: false,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-strauss', name: 'Strauss', slug: 'strauss' },
    keywords: ['cricket', 'bat', 'sports', 'cricket bat', 'outdoor'],
  },
  {
    id: 'spt-7', name: 'PowerMax Fitness TDA-230 Treadmill', slug: 'powermax-fitness-tda-230-treadmill',
    description: '2.0HP peak motor, 16 preset programs, LCD display, 3-level incline, foldable.',
    price: 29990, discountPrice: 24990, sku: 'SKU-SPT-07', stock: 10,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'],
    rating: 4.5, reviewCount: 120, isFeatured: true,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-powermax', name: 'PowerMax', slug: 'powermax' },
    keywords: ['treadmill', 'gym', 'fitness', 'exercise', 'running machine'],
  },
  {
    id: 'spt-8', name: 'SG Cricket Helmet Pro Guard Men\'s', slug: 'sg-cricket-helmet-pro-guard',
    description: 'Mild steel grill, high density foam padding, sweat absorbent lining, ISI certified.',
    price: 3999, discountPrice: 3499, sku: 'SKU-SPT-08', stock: 30,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80'],
    rating: 4.5, reviewCount: 150, isFeatured: false,
    category: { id: 'cat-sports', name: 'Sports', slug: 'sports' },
    brand: { id: 'b-sg', name: 'SG', slug: 'sg' },
    keywords: ['sg', 'cricket', 'helmet', 'sports', 'protection', 'batting'],
  },
];

// ── Derived fetch functions (mock + optional real API) ─────────────────────

export async function fetchProducts(query?: string, categorySlug?: string): Promise<Product[]> {
  // In production: try real API first
  try {
    const params: Record<string, string> = {};
    if (query) params.search = query;
    if (categorySlug && categorySlug !== 'all') params.category = categorySlug;
    const result = await productApi.list(params);
    if (result?.data?.products?.length > 0) {
      return result.data.products;
    }
  } catch {
    // Fallback to mock data
  }

  let filtered = [...MOCK_PRODUCTS];
  if (categorySlug && categorySlug !== 'all') {
    filtered = filtered.filter((p) => p.category.slug === categorySlug);
  }
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim().replace(/\s+/g, ' ');
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.category.slug.toLowerCase().includes(q) ||
        (p.brand?.name && p.brand.name.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }
  return filtered;
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return MOCK_PRODUCTS.filter(
    (p) => p.category.id === product.category.id && p.id !== product.id
  ).slice(0, limit);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'all') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category.slug === categorySlug);
}

export function getTodaysDeals(products = MOCK_PRODUCTS, limit = 8): Product[] {
  return products.filter((p) => p.discountPrice != null).slice(0, limit);
}

export function getBestSellers(products = MOCK_PRODUCTS, limit = 8): Product[] {
  return [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit);
}

export function getTrendingProducts(products = MOCK_PRODUCTS, limit = 8): Product[] {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getNewArrivals(products = MOCK_PRODUCTS, limit = 8): Product[] {
  return [...products].reverse().slice(0, limit);
}

export function getTopRated(products = MOCK_PRODUCTS, limit = 8): Product[] {
  return [...products].filter((p) => p.rating >= 4.7).slice(0, limit);
}

export function getFeaturedProducts(products = MOCK_PRODUCTS, limit = 8): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit);
}
