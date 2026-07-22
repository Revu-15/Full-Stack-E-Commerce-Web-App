import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

// Default Database State
const defaultData = {
  products: [],
  categories: [],
  orders: [],
  coupons: [
    { code: 'LUXE10', type: 'percent', value: 10, minSpend: 50, description: '10% off on orders over $50' },
    { code: 'LUXE20', type: 'percent', value: 20, minSpend: 150, description: '20% off on orders over $150' },
    { code: 'WELCOME50', type: 'fixed', value: 50, minSpend: 200, description: '$50 off on orders over $200' }
  ],
  reviews: []
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.saveData(defaultData);
    }
  }

  loadData() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.saveData(defaultData);
        return defaultData;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error loading DB:', err);
      return defaultData;
    }
  }

  saveData(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB:', err);
    }
  }

  // --- PRODUCTS ---
  getProducts({ category, search, minPrice, maxPrice, rating, inStock, tag, sort, page = 1, limit = 50 }) {
    const data = this.loadData();
    let result = [...(data.products || [])];

    if (category && category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (rating) {
      result = result.filter(p => p.rating >= Number(rating));
    }

    if (inStock === 'true' || inStock === true) {
      result = result.filter(p => p.stock > 0);
    }

    if (tag) {
      result = result.filter(p => p.tags && p.tags.includes(tag));
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else {
      // Default: newest / featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + Number(limit));

    return {
      products: paginated,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  getProductById(id) {
    const data = this.loadData();
    const product = data.products.find(p => p.id === id || String(p.id) === String(id));
    if (!product) return null;

    // Attach product reviews
    const reviews = (data.reviews || []).filter(r => String(r.productId) === String(id));
    
    // Attach related products
    const related = (data.products || [])
      .filter(p => p.category === product.category && String(p.id) !== String(id))
      .slice(0, 4);

    return { ...product, reviewsList: reviews, relatedProducts: related };
  }

  addProduct(productData) {
    const data = this.loadData();
    const newId = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const newProduct = {
      id: newId,
      title: productData.title || 'Untitled Product',
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      category: productData.category || 'General',
      image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      secondaryImages: productData.secondaryImages || [],
      rating: Number(productData.rating) || 5.0,
      reviewCount: 1,
      stock: Number(productData.stock) || 10,
      tags: productData.tags || ['New'],
      description: productData.description || '',
      specs: productData.specs || {},
      isFeatured: !!productData.isFeatured,
      isTrending: !!productData.isTrending,
      createdAt: new Date().toISOString()
    };

    data.products.unshift(newProduct);
    this.saveData(data);
    return newProduct;
  }

  updateProduct(id, updates) {
    const data = this.loadData();
    const index = data.products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    data.products[index] = {
      ...data.products[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : data.products[index].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : data.products[index].stock,
      updatedAt: new Date().toISOString()
    };

    this.saveData(data);
    return data.products[index];
  }

  deleteProduct(id) {
    const data = this.loadData();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => String(p.id) !== String(id));
    if (data.products.length < initialLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  getCategories() {
    const data = this.loadData();
    // Count items per category
    const counts = {};
    (data.products || []).forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return (data.categories || []).map(cat => ({
      ...cat,
      itemCount: counts[cat.name] || counts[cat.slug] || 0
    }));
  }

  // --- ORDERS ---
  createOrder(orderInput) {
    const data = this.loadData();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'TRK' + Math.floor(100000000 + Math.random() * 900000000);

    // Deduct stock
    (orderInput.items || []).forEach(item => {
      const prodIndex = data.products.findIndex(p => String(p.id) === String(item.id));
      if (prodIndex !== -1) {
        data.products[prodIndex].stock = Math.max(0, data.products[prodIndex].stock - (item.quantity || 1));
      }
    });

    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      trackingNumber,
      items: orderInput.items,
      subtotal: Number(orderInput.subtotal),
      discountAmount: Number(orderInput.discountAmount || 0),
      shippingFee: Number(orderInput.shippingFee || 0),
      tax: Number(orderInput.tax || 0),
      totalAmount: Number(orderInput.totalAmount),
      customer: orderInput.customer || { name: 'Guest User', email: 'guest@auraluxe.com' },
      shippingAddress: orderInput.shippingAddress,
      paymentMethod: orderInput.paymentMethod || 'Credit Card',
      status: 'Processing',
      statusHistory: [
        { status: 'Order Placed', timestamp: new Date().toISOString(), detail: 'Order confirmed and sent to fulfillment.' },
        { status: 'Processing', timestamp: new Date().toISOString(), detail: 'Warehouse team is packing your items.' }
      ],
      createdAt: new Date().toISOString()
    };

    data.orders.unshift(newOrder);
    this.saveData(data);
    return newOrder;
  }

  getOrders() {
    const data = this.loadData();
    return data.orders || [];
  }

  getOrderById(id) {
    const data = this.loadData();
    return (data.orders || []).find(o => String(o.id) === String(id) || String(o.orderNumber) === String(id) || String(o.trackingNumber) === String(id));
  }

  updateOrderStatus(id, status, note = '') {
    const data = this.loadData();
    const order = (data.orders || []).find(o => String(o.id) === String(id) || String(o.orderNumber) === String(id));
    if (!order) return null;

    order.status = status;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      detail: note || `Order status updated to ${status}.`
    });

    this.saveData(data);
    return order;
  }

  // --- REVIEWS ---
  addReview(productId, { user, rating, comment }) {
    const data = this.loadData();
    const newReview = {
      id: 'rev_' + Date.now(),
      productId,
      user: user || 'Verified Shopper',
      rating: Number(rating) || 5,
      comment: comment || '',
      date: new Date().toISOString().split('T')[0]
    };

    data.reviews = data.reviews || [];
    data.reviews.unshift(newReview);

    // Update product average rating
    const prodReviews = data.reviews.filter(r => String(r.productId) === String(productId));
    const avgRating = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;

    const prodIndex = data.products.findIndex(p => String(p.id) === String(productId));
    if (prodIndex !== -1) {
      data.products[prodIndex].rating = Number(avgRating.toFixed(1));
      data.products[prodIndex].reviewCount = prodReviews.length;
    }

    this.saveData(data);
    return newReview;
  }

  // --- COUPONS ---
  validateCoupon(code, subtotal) {
    const data = this.loadData();
    const coupon = (data.coupons || []).find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, message: 'Invalid promo code' };
    }

    if (subtotal < coupon.minSpend) {
      return { valid: false, message: `Minimum spend of $${coupon.minSpend} required for this code` };
    }

    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    return {
      valid: true,
      code: coupon.code,
      discount: Math.min(discount, subtotal),
      message: `Promo code applied! Saved $${discount.toFixed(2)}`
    };
  }

  // --- ANALYTICS ---
  getAnalytics() {
    const data = this.loadData();
    const orders = data.orders || [];
    const products = data.products || [];

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    // Revenue by category
    const categoryRevenue = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const cat = item.category || 'General';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + ((item.price || 0) * (item.quantity || 1));
      });
    });

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      totalProducts,
      lowStockCount,
      categoryRevenue,
      recentOrders
    };
  }
}

export const db = new Database();
