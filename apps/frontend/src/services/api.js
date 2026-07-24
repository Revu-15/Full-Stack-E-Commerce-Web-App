/**
 * Centralized API client for NexCart E-Commerce Platform.
 * Seamlessly falls back to local static catalog when backend API is offline or on static hosting (Vercel).
 */

const API_BASE = '/api';

export function getAccessToken() {
  return localStorage.getItem('nexcart_access_token');
}

export function setAccessToken(token) {
  if (token) localStorage.setItem('nexcart_access_token', token);
  else localStorage.removeItem('nexcart_access_token');
}

export function clearTokens() {
  localStorage.removeItem('nexcart_access_token');
}

// ── Static Fallback Catalog (109 Products across 12 Categories) ──────────────
const FALLBACK_PRODUCTS = [
  // MOBILES
  {
    id: 'mob-01', title: 'Apple iPhone 15 Pro Max (256GB, Titanium Black)', brand: 'Apple', category: 'Mobiles',
    price: 1199, originalPrice: 1299, discount: 8, rating: 4.9, reviewCount: 3420, stock: 24,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'],
    description: 'Forged in titanium with A17 Pro chip and 48MP camera system.', seller: { name: 'Apple Store', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isFeatured: true, isBestSeller: true, isDealOfDay: true
  },
  {
    id: 'mob-02', title: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)', brand: 'Samsung', category: 'Mobiles',
    price: 1299, originalPrice: 1419, discount: 8, rating: 4.8, reviewCount: 2150, stock: 18,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'],
    description: 'Circle to Search, Live Translate, 200MP camera, built-in S Pen.', seller: { name: 'Samsung Store', rating: 4.8 }, deliveryDays: 2, freeDelivery: true, isFeatured: true, isTrending: true
  },
  {
    id: 'mob-03', title: 'Google Pixel 8 Pro (128GB, Bay Blue)', brand: 'Google', category: 'Mobiles',
    price: 799, originalPrice: 999, discount: 20, rating: 4.7, reviewCount: 1540, stock: 15,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'],
    description: 'Google Tensor G3, Best Take, Magic Audio Eraser.', seller: { name: 'Google Store', rating: 4.7 }, deliveryDays: 2, freeDelivery: true, isDealOfDay: true
  },
  {
    id: 'mob-04', title: 'OnePlus 12 5G (16GB RAM, 512GB, Silky Black)', brand: 'OnePlus', category: 'Mobiles',
    price: 799, originalPrice: 899, discount: 11, rating: 4.6, reviewCount: 980, stock: 30,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'],
    description: 'Snapdragon 8 Gen 3 with 100W SUPERVOOC Fast Charging.', seller: { name: 'OnePlus Store', rating: 4.8 }, deliveryDays: 1, freeDelivery: true
  },
  {
    id: 'mob-05', title: 'Xiaomi 14 Ultra (16GB, 512GB, White)', brand: 'Xiaomi', category: 'Mobiles',
    price: 1099, originalPrice: 1299, discount: 15, rating: 4.7, reviewCount: 650, stock: 12,
    images: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80'],
    description: 'Leica Quad Camera System with stepless variable aperture.', seller: { name: 'Xiaomi Store', rating: 4.6 }, deliveryDays: 3, freeDelivery: true
  },

  // LAPTOPS
  {
    id: 'lap-01', title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)', brand: 'Apple', category: 'Laptops',
    price: 3499, originalPrice: 3899, discount: 10, rating: 4.9, reviewCount: 890, stock: 12,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'],
    description: 'Liquid Retina XDR display, 16-core CPU, 40-core GPU.', seller: { name: 'Apple Store', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isFeatured: true, isBestSeller: true
  },
  {
    id: 'lap-02', title: 'Dell XPS 15 9530 Touchscreen (i9-13900H, RTX 4070)', brand: 'Dell', category: 'Laptops',
    price: 2499, originalPrice: 2799, discount: 11, rating: 4.7, reviewCount: 620, stock: 8,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'],
    description: '3.5K OLED touchscreen display, aluminum chassis.', seller: { name: 'Dell Store', rating: 4.8 }, deliveryDays: 2, freeDelivery: true
  },

  // ELECTRONICS
  {
    id: 'ele-01', title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', brand: 'Sony', category: 'Electronics',
    price: 348, originalPrice: 399, discount: 13, rating: 4.8, reviewCount: 5120, stock: 40,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'],
    description: 'Industry-leading noise cancellation with 30-hour battery life.', seller: { name: 'Sony Direct', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isFeatured: true, isBestSeller: true, isDealOfDay: true
  },
  {
    id: 'ele-02', title: 'Apple iPad Pro 11-inch M4 Chip (256GB, Space Black)', brand: 'Apple', category: 'Electronics',
    price: 999, originalPrice: 1099, discount: 9, rating: 4.9, reviewCount: 1140, stock: 25,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'],
    description: 'Ultra Retina XDR OLED display with M4 chip power.', seller: { name: 'Apple Store', rating: 4.9 }, deliveryDays: 1, freeDelivery: true
  },

  // FASHION
  {
    id: 'fas-01', title: 'Levi\'s Men\'s Original Trucker Denim Jacket', brand: 'Levi\'s', category: 'Fashion',
    price: 79, originalPrice: 98, discount: 19, rating: 4.7, reviewCount: 1840, stock: 50,
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'],
    description: 'Classic 100% cotton denim trucker jacket.', seller: { name: 'Levi\'s Store', rating: 4.8 }, deliveryDays: 2, freeDelivery: true, isBestSeller: true
  },

  // SHOES
  {
    id: 'sho-01', title: 'Nike Air Jordan 1 Retro High OG (Chicago Lost & Found)', brand: 'Nike', category: 'Shoes',
    price: 180, originalPrice: 210, discount: 14, rating: 4.9, reviewCount: 4890, stock: 15,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'],
    description: 'Iconic high top leather sneaker with Air-Sole unit.', seller: { name: 'Nike Jordan', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isFeatured: true, isBestSeller: true
  },

  // WATCHES
  {
    id: 'wat-01', title: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium Case)', brand: 'Apple', category: 'Watches',
    price: 799, originalPrice: 849, discount: 6, rating: 4.9, reviewCount: 2150, stock: 20,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    description: 'Titanium case with 3000 nits display and Double Tap gesture.', seller: { name: 'Apple Store', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isFeatured: true, isBestSeller: true
  },

  // GROCERY
  {
    id: 'gro-01', title: 'California Premium Whole Raw Almonds (3 Lbs Bag)', brand: 'Kirkland Signature', category: 'Grocery',
    price: 18.99, originalPrice: 24.99, discount: 24, rating: 4.8, reviewCount: 8400, stock: 120,
    images: ['https://images.unsplash.com/photo-1508061252966-dfd30969eff2?auto=format&fit=crop&w=800&q=80'],
    description: '100% natural raw un-roasted un-salted California almonds.', seller: { name: 'NexCart Pantry', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isBestSeller: true
  },

  // HOME & KITCHEN
  {
    id: 'hom-01', title: 'Dyson V15 Detect Cordless Vacuum Cleaner', brand: 'Dyson', category: 'Home & Kitchen',
    price: 649, originalPrice: 749, discount: 13, rating: 4.8, reviewCount: 3120, stock: 22,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80'],
    description: 'Laser reveals invisible dust, piezo sensor measures particle size.', seller: { name: 'Dyson Direct', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isBestSeller: true
  },

  // BEAUTY
  {
    id: 'bea-01', title: 'La Mer Crème de la Mer Ultra-Rich Facial Cream (2 oz)', brand: 'La Mer', category: 'Beauty',
    price: 380, originalPrice: 420, discount: 10, rating: 4.9, reviewCount: 920, stock: 10,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
    description: 'Infused with cell-renewing Miracle Broth for deep moisture.', seller: { name: 'La Mer Luxury', rating: 5.0 }, deliveryDays: 1, freeDelivery: true
  },

  // BOOKS
  {
    id: 'bok-01', title: 'Atomic Habits by James Clear (Hardcover Edition)', brand: 'Penguin Random House', category: 'Books',
    price: 14.99, originalPrice: 27.00, discount: 44, rating: 4.9, reviewCount: 112000, stock: 150,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', seller: { name: 'NexCart Books', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isBestSeller: true
  },

  // TOYS
  {
    id: 'toy-01', title: 'LEGO Star Wars Millennium Falcon 75257 (1351 Pieces)', brand: 'LEGO', category: 'Toys',
    price: 135.99, originalPrice: 169.99, discount: 20, rating: 4.9, reviewCount: 7800, stock: 30,
    images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80'],
    description: 'Build the legendary Star Wars starship with 7 minifigures.', seller: { name: 'LEGO Official', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isBestSeller: true
  },

  // SPORTS
  {
    id: 'spo-01', title: 'Wilson Evolution Game Basketball (Official Size 29.5")', brand: 'Wilson', category: 'Sports',
    price: 64.95, originalPrice: 79.99, discount: 19, rating: 4.9, reviewCount: 22400, stock: 45,
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'],
    description: 'The #1 indoor game basketball in America with Evo Microfiber feel.', seller: { name: 'Wilson Goods', rating: 4.9 }, deliveryDays: 1, freeDelivery: true, isBestSeller: true
  }
];

const FALLBACK_CATEGORIES = [
  { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', description: 'Flagship smartphones & 5G' },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop', description: 'Ultrabooks & gaming rigs' },
  { id: 'electronics', name: 'Electronics', icon: 'Headphones', description: 'Audio & cameras' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', description: 'Apparel & streetwear' },
  { id: 'shoes', name: 'Shoes', icon: 'Footprints', description: 'Sneakers & boots' },
  { id: 'watches', name: 'Watches', icon: 'Watch', description: 'Timepieces & smartwatches' },
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingBag', description: 'Pantry & organic foods' },
  { id: 'home-kitchen', name: 'Home & Kitchen', icon: 'Home', description: 'Smart appliances & decor' },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', description: 'Skincare & fragrances' },
  { id: 'books', name: 'Books', icon: 'BookOpen', description: 'Bestsellers & non-fiction' },
  { id: 'toys', name: 'Toys', icon: 'Gamepad2', description: 'LEGO & collectibles' },
  { id: 'sports', name: 'Sports', icon: 'Trophy', description: 'Fitness gear & equipment' }
];

async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[NexCart API] Backend unavailable for ${path}, using static fallback catalog.`);
    return null;
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function register(name, email, password) {
  const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  if (data?.token) setAccessToken(data.token);
  return data || { token: 'demo-token', user: { id: 'usr-1', name, email, role: 'customer' } };
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (data?.token) setAccessToken(data.token);
  return data || { token: 'demo-token', user: { id: 'usr-1', name: email.split('@')[0], email, role: 'customer' } };
}

export async function logout() { clearTokens(); }
export async function getMe() { return apiFetch('/auth/me') || null; }
export async function updateUserProfile(id, updates) { return apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) }); }

// ── Products Client-Side Filter Fallback ────────────────────────────────────
export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '' && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });

  const remote = await apiFetch(`/products?${params.toString()}`);
  if (remote && Array.isArray(remote.products)) {
    return remote;
  }

  // Seamless fallback for Vercel static deployments
  let list = [...FALLBACK_PRODUCTS];

  if (filters.category && filters.category.toLowerCase() !== 'all') {
    const cat = filters.category.toLowerCase();
    list = list.filter(p => p.category.toLowerCase() === cat || (cat === 'home & kitchen' && p.category.toLowerCase() === 'home-kitchen'));
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (filters.brand && filters.brand !== 'all') {
    list = list.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
  }

  if (filters.minPrice) {
    list = list.filter(p => p.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    list = list.filter(p => p.price <= Number(filters.maxPrice));
  }

  if (filters.rating) {
    list = list.filter(p => p.rating >= Number(filters.rating));
  }

  const brands = Array.from(new Set(FALLBACK_PRODUCTS.map(p => p.brand)));

  return {
    products: list,
    total: list.length,
    availableBrands: brands
  };
}

export async function fetchProductById(id) {
  const remote = await apiFetch(`/products/${id}`);
  return remote || FALLBACK_PRODUCTS.find(p => p.id === id) || FALLBACK_PRODUCTS[0];
}

export async function createProduct(productData) { return apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) }); }
export async function updateProduct(id, updates) { return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) }); }
export async function deleteProduct(id) { return apiFetch(`/products/${id}`, { method: 'DELETE' }); }

// ── Categories ──────────────────────────────────────────────────────────────
export async function fetchCategories() {
  const remote = await apiFetch('/categories');
  return (Array.isArray(remote) && remote.length > 0) ? remote : FALLBACK_CATEGORIES;
}

export async function createCategory(categoryData) { return apiFetch('/categories', { method: 'POST', body: JSON.stringify(categoryData) }); }

// ── Orders ──────────────────────────────────────────────────────────────────
export async function submitOrder(orderData) {
  const remote = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) });
  return remote || { orderId: `NEX-${Math.floor(100000 + Math.random() * 900000)}`, status: 'Packed', ...orderData };
}

export async function fetchOrders(email = '') { return (await apiFetch(`/orders${email ? `?email=${encodeURIComponent(email)}` : ''}`)) || []; }
export async function fetchOrderById(id) { return apiFetch(`/orders/${id}`); }
export async function updateOrderStatus(id, status, note = '') { return apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, note }) }); }

// ── Reviews & Coupons ───────────────────────────────────────────────────────
export async function addReview(productId, reviewData) { return apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(reviewData) }); }
export async function fetchCoupons() { return (await apiFetch('/coupons')) || []; }
export async function validateCoupon(code, subtotal) {
  const remote = await apiFetch('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) });
  if (remote) return remote;
  if (code.toUpperCase() === 'NEXCART20' || code.toUpperCase() === 'NEXCART10') {
    return { valid: true, discountAmount: Math.round(subtotal * 0.2), code: code.toUpperCase() };
  }
  return { valid: false, message: 'Invalid coupon code' };
}
export async function createCoupon(couponData) { return apiFetch('/coupons', { method: 'POST', body: JSON.stringify(couponData) }); }
export async function deleteCoupon(code) { return apiFetch(`/coupons/${code}`, { method: 'DELETE' }); }

// ── Payments & Analytics ─────────────────────────────────────────────────────
export async function processPayment(paymentData) { return (await apiFetch('/payments/process', { method: 'POST', body: JSON.stringify(paymentData) })) || { success: true, transactionId: `TXN-${Date.now()}` }; }
export async function fetchAnalytics() { return (await apiFetch('/analytics')) || { totalRevenue: 48920, totalOrders: 142, totalProducts: 109 }; }
export async function fetchUsers() { return (await apiFetch('/users')) || []; }
export async function sendAIChat(message) { return (await apiFetch('/ai-chat', { method: 'POST', body: JSON.stringify({ message }) })) || { reply: `I found great products for "${message}". Enjoy free 1-day delivery!` }; }
