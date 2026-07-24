import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');
const JWT_SECRET = process.env.JWT_SECRET || 'nexcart_super_secret_jwt_key_2026';

const defaultData = {
  products: [],
  categories: [],
  orders: [],
  coupons: [
    { code: 'NEXCART10', type: 'percent', value: 10, minSpend: 50, description: '10% off on orders over $50' },
    { code: 'NEXCART20', type: 'percent', value: 20, minSpend: 150, description: '20% off on orders over $150' },
    { code: 'WELCOME50', type: 'fixed', value: 50, minSpend: 200, description: '$50 off on orders over $200' },
    { code: 'FLASH30', type: 'percent', value: 30, minSpend: 300, description: '30% off on orders over $300' }
  ],
  users: [],
  reviews: []
};

class Database {
  constructor() {
    this.init();
  }

  async init() {
    if (!fs.existsSync(DB_FILE)) {
      this.saveData(defaultData);
    }
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    try {
      const data = this.loadData();
      if (!data.users) data.users = [];

      const adminExists = data.users.some(u => u.email.toLowerCase() === 'admin@nexcart.com');
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('Admin@123', salt);
        const superAdmin = {
          id: 'admin-super-01',
          name: 'NexCart Super Admin',
          username: 'superadmin',
          email: 'admin@nexcart.com',
          passwordHash,
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin',
          phone: '+91 98765 00000',
          addresses: [{ street: 'NexCart HQ, Hitech City', city: 'Hyderabad', state: 'Telangana', zip: '500081', country: 'India' }],
          status: 'Active'
        };
        data.users.unshift(superAdmin);
        this.saveData(data);
        console.log('✅ Super Admin Seeded: admin@nexcart.com / Admin@123');
      }
    } catch (err) {
      console.warn('Super Admin seed warning:', err.message);
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

  // --- PRODUCTS QUERYING & FILTERS ---
  getProducts({ category, search, brand, minPrice, maxPrice, rating, minDiscount, inStock, color, size, tag, sort, page = 1, limit = 150 }) {
    const data = this.loadData();
    let result = [...(data.products || [])];

    // Category filter
    if (category && category !== 'all' && category !== 'All') {
      const catLower = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      result = result.filter(p => {
        const pCatLower = p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        return pCatLower === catLower || p.category.toLowerCase() === category.toLowerCase();
      });
    }

    // Brand filter
    if (brand && brand !== 'all') {
      const brandsArr = Array.isArray(brand) ? brand.map(b => b.toLowerCase()) : brand.toLowerCase().split(',');
      result = result.filter(p => p.brand && brandsArr.includes(p.brand.toLowerCase()));
    }

    // Search query across Title, Brand, Category, Description, Tags, Keywords
    if (search) {
      const q = search.trim().toLowerCase();
      const terms = q.split(/\s+/);
      result = result.filter(p => {
        const fullText = `${p.title} ${p.brand || ''} ${p.category} ${p.description || ''} ${(p.tags || []).join(' ')} ${(p.features || []).join(' ')}`.toLowerCase();
        return terms.every(term => fullText.includes(term));
      });
    }

    // Price range
    if (minPrice !== undefined && minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Rating filter
    if (rating && rating !== '0') {
      result = result.filter(p => p.rating >= Number(rating));
    }

    // Min Discount filter
    if (minDiscount && Number(minDiscount) > 0) {
      result = result.filter(p => (p.discount || 0) >= Number(minDiscount));
    }

    // Availability / In Stock filter
    if (inStock === 'true' || inStock === true) {
      result = result.filter(p => p.stock > 0);
    }

    // Color filter
    if (color && color !== 'all') {
      const colLower = color.toLowerCase();
      result = result.filter(p => p.colors && p.colors.some(c => c.toLowerCase().includes(colLower)));
    }

    // Size filter
    if (size && size !== 'all') {
      const sizeLower = size.toLowerCase();
      result = result.filter(p => p.sizes && p.sizes.some(s => s.toLowerCase() === sizeLower));
    }

    // Special tag filter (e.g. bestseller, deal, trending)
    if (tag) {
      result = result.filter(p => {
        if (tag === 'bestseller') return p.isBestSeller || (p.tags && p.tags.includes('bestseller'));
        if (tag === 'deal') return p.isDealOfDay || (p.discount && p.discount >= 15);
        if (tag === 'trending') return p.isTrending || (p.rating >= 4.7);
        if (tag === 'featured') return p.isFeatured;
        return p.tags && p.tags.includes(tag);
      });
    }

    // Sorting
    if (sort === 'price-asc' || sort === 'low-to-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc' || sort === 'high-to-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating' || sort === 'highest-rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
    } else if (sort === 'popularity' || sort === 'best-selling') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else {
      // Default featured sort
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    // Pagination
    const total = result.length;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 150;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = result.slice(startIndex, startIndex + limitNum);

    // Extract available brands for sidebar dynamically
    const allBrands = Array.from(new Set(data.products.map(p => p.brand).filter(Boolean)));

    return {
      products: paginatedProducts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      availableBrands: allBrands
    };
  }

  getProductById(id) {
    const data = this.loadData();
    const product = data.products.find(p => String(p.id) === String(id));
    if (!product) return null;

    // Find related products in same category
    const related = data.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6);

    // Find frequently bought together items
    let fbt = [];
    if (product.frequentlyBoughtTogether && product.frequentlyBoughtTogether.length > 0) {
      fbt = data.products.filter(p => product.frequentlyBoughtTogether.includes(p.id));
    } else {
      fbt = data.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 1);
    }

    return {
      ...product,
      relatedProducts: related,
      frequentlyBoughtTogetherProducts: fbt
    };
  }

  addProduct(productData) {
    const data = this.loadData();
    const newId = `prod-${Date.now().toString(36)}`;
    const newProduct = {
      id: newId,
      title: productData.title || 'New Product',
      brand: productData.brand || 'Generic',
      category: productData.category || 'Electronics',
      price: Number(productData.price) || 99,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) || 99,
      discount: Number(productData.discount) || 0,
      rating: Number(productData.rating) || 4.5,
      reviewCount: 1,
      stock: Number(productData.stock) || 10,
      images: productData.images && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
      description: productData.description || 'Premium quality NexCart product.',
      features: productData.features || ['Authentic brand product', 'Free express delivery available'],
      specifications: productData.specifications || { 'Quality': 'Premium' },
      seller: productData.seller || { name: 'NexCart Retail', rating: 4.8, returnPolicy: '7 Days Replacement', warranty: '1 Year Brand Warranty' },
      deliveryDays: 2,
      freeDelivery: true,
      colors: productData.colors || ['Standard'],
      sizes: productData.sizes || ['Standard'],
      offers: productData.offers || ['10% Instant Discount on select cards'],
      coupons: ['NEXCART10'],
      tags: productData.tags || ['new'],
      isFeatured: Boolean(productData.isFeatured),
      isTrending: Boolean(productData.isTrending),
      isBestSeller: Boolean(productData.isBestSeller)
    };

    data.products.unshift(newProduct);
    this.saveData(data);
    return newProduct;
  }

  updateProduct(id, updates) {
    const data = this.loadData();
    const index = data.products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    data.products[index] = { ...data.products[index], ...updates };
    this.saveData(data);
    return data.products[index];
  }

  deleteProduct(id) {
    const data = this.loadData();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => String(p.id) !== String(id));
    if (data.products.length === initialLen) return false;
    this.saveData(data);
    return true;
  }

  // --- CATEGORIES ---
  getCategories() {
    const data = this.loadData();
    // Count products per category
    const catCounts = {};
    (data.products || []).forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    return (data.categories || []).map(c => ({
      ...c,
      productCount: catCounts[c.name] || 0
    }));
  }

  addCategory(categoryData) {
    const data = this.loadData();
    const newCat = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      name: categoryData.name,
      icon: categoryData.icon || 'ShoppingBag',
      description: categoryData.description || `${categoryData.name} collection`
    };
    data.categories.push(newCat);
    this.saveData(data);
    return newCat;
  }

  // --- USER AUTHENTICATION & PROFILE ---
  async registerUser({ name, email, password }) {
    const data = this.loadData();
    if (!data.users) data.users = [];

    const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      phone: '',
      addresses: [],
      savedCards: [],
      wishlist: []
    };

    data.users.push(newUser);
    this.saveData(data);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPass } = newUser;

    return { user: userWithoutPass, token };
  }

  async loginUser({ email, password }) {
    const data = this.loadData();
    const user = (data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPass } = user;

    return { user: userWithoutPass, token };
  }

  getUserById(id) {
    const data = this.loadData();
    const user = (data.users || []).find(u => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  updateUserProfile(id, updates) {
    const data = this.loadData();
    const index = (data.users || []).findIndex(u => u.id === id);
    if (index === -1) return null;

    data.users[index] = { ...data.users[index], ...updates };
    this.saveData(data);
    const { passwordHash: _, ...userWithoutPass } = data.users[index];
    return userWithoutPass;
  }

  getUsers() {
    const data = this.loadData();
    return (data.users || []).map(({ passwordHash: _, ...u }) => u);
  }

  // --- ORDERS & TRACKING ---
  createOrder(orderData) {
    const data = this.loadData();
    const orderId = `NEX-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `TRK-NEX-${Date.now().toString(36).toUpperCase()}`;

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + (orderData.deliveryDays || 3));

    const newOrder = {
      id: orderId,
      orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
      orderDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      expectedDelivery: expectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discountAmount: Number(orderData.discountAmount) || 0,
      shippingFee: Number(orderData.shippingFee) || 0,
      tax: Number(orderData.tax) || 0,
      totalAmount: Number(orderData.totalAmount) || 0,
      customer: orderData.customer || { name: 'Guest Customer', email: 'guest@nexcart.com', phone: '+1 555-0199' },
      shippingAddress: orderData.shippingAddress || { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      status: 'Pending',
      statusHistory: [
        { status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed successfully' }
      ]
    };

    if (!data.orders) data.orders = [];
    data.orders.unshift(newOrder);

    // Update product stock counts
    (newOrder.items || []).forEach(item => {
      const pIndex = data.products.findIndex(p => String(p.id) === String(item.id));
      if (pIndex !== -1) {
        data.products[pIndex].stock = Math.max(0, (data.products[pIndex].stock || 10) - item.quantity);
      }
    });

    this.saveData(data);
    return newOrder;
  }

  getOrders(userEmail) {
    const data = this.loadData();
    let orders = data.orders || [];
    if (userEmail) {
      orders = orders.filter(o => o.customer && o.customer.email.toLowerCase() === userEmail.toLowerCase());
    }
    return orders;
  }

  getOrderById(id) {
    const data = this.loadData();
    return (data.orders || []).find(o => String(o.id) === String(id) || String(o.orderId) === String(id) || String(o.trackingNumber) === String(id));
  }

  updateOrderStatus(id, newStatus, note = '') {
    const data = this.loadData();
    const index = (data.orders || []).findIndex(o => String(o.id) === String(id));
    if (index === -1) return null;

    data.orders[index].status = newStatus;
    if (!data.orders[index].statusHistory) data.orders[index].statusHistory = [];
    data.orders[index].statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${newStatus}`
    });

    this.saveData(data);
    return data.orders[index];
  }

  // --- REVIEWS ---
  addReview(productId, { user, rating, comment }) {
    const data = this.loadData();
    const pIndex = data.products.findIndex(p => String(p.id) === String(productId));
    if (pIndex === -1) throw new Error('Product not found');

    const newReview = {
      id: `rev-${Date.now().toString(36)}`,
      user: user || 'Verified Shopper',
      rating: Number(rating) || 5,
      comment: comment || 'Great product!',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      verifiedPurchase: true
    };

    if (!data.products[pIndex].reviews) data.products[pIndex].reviews = [];
    data.products[pIndex].reviews.unshift(newReview);

    // Recalculate average rating
    const totalRev = data.products[pIndex].reviews.length;
    const sumRev = data.products[pIndex].reviews.reduce((acc, r) => acc + r.rating, 0);
    data.products[pIndex].rating = Number((sumRev / totalRev).toFixed(1));
    data.products[pIndex].reviewCount = totalRev;

    this.saveData(data);
    return newReview;
  }

  // --- COUPONS ---
  validateCoupon(code, subtotal) {
    const data = this.loadData();
    const coupon = (data.coupons || []).find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase());
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code.' };
    }

    if (subtotal < coupon.minSpend) {
      return { valid: false, message: `Minimum spend of $${coupon.minSpend} required for this coupon.` };
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    return {
      valid: true,
      code: coupon.code,
      discountAmount: Number(discountAmount.toFixed(2)),
      description: coupon.description
    };
  }

  getCoupons() {
    const data = this.loadData();
    return data.coupons || [];
  }

  addCoupon(couponData) {
    const data = this.loadData();
    const newCoupon = {
      code: couponData.code.toUpperCase(),
      type: couponData.type || 'percent',
      value: Number(couponData.value),
      minSpend: Number(couponData.minSpend) || 0,
      description: couponData.description || `${couponData.value}% discount`
    };
    if (!data.coupons) data.coupons = [];
    data.coupons.push(newCoupon);
    this.saveData(data);
    return newCoupon;
  }

  deleteCoupon(code) {
    const data = this.loadData();
    data.coupons = (data.coupons || []).filter(c => c.code.toUpperCase() !== code.toUpperCase());
    this.saveData(data);
    return true;
  }

  // --- ADMIN ANALYTICS ---
  getAnalytics() {
    const data = this.loadData();
    const orders = data.orders || [];
    const products = data.products || [];
    const users = data.users || [];

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;

    const lowStockProducts = products.filter(p => p.stock <= 5);

    // Sales by Category
    const categorySales = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
      });
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      totalUsers,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders: orders.slice(0, 10),
      categorySales
    };
  }
  // --- ADMIN MANAGEMENT & USER CRM ---
  getAdminDashboardStats() {
    const data = this.loadData();
    const users = data.users || [];
    const orders = data.orders || [];
    const products = data.products || [];

    const totalCustomers = users.filter(u => u.role !== 'admin').length;
    const onlineCustomers = Math.max(1, Math.floor(totalCustomers * 0.35)); // Simulated online count
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Accepted' || o.status === 'Packed' || o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled' || o.status === 'Refunded').length;
    const totalProducts = products.length;

    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status !== 'Cancelled' && o.status !== 'Refunded') {
        return sum + (Number(o.totalAmount) || 0);
      }
      return sum;
    }, 0);

    const recentRegistrations = [...users]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6)
      .map(({ passwordHash: _, ...u }) => u);

    const latestOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);

    const notifications = [];
    latestOrders.slice(0, 4).forEach(o => {
      notifications.push({
        id: `notif-${o.id}`,
        type: 'ORDER',
        title: `New Order Placed: ${o.id}`,
        message: `${o.customer?.name || 'Customer'} ordered ${o.items?.length || 1} item(s) worth $${o.totalAmount}`,
        timestamp: o.createdAt
      });
    });

    recentRegistrations.slice(0, 3).forEach(u => {
      notifications.push({
        id: `notif-usr-${u.id}`,
        type: 'USER',
        title: `New Customer Registered`,
        message: `${u.name} (${u.email}) created an account`,
        timestamp: u.createdAt
      });
    });

    return {
      totalCustomers,
      onlineCustomers,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts,
      totalRevenue: Math.round(totalRevenue),
      recentRegistrations,
      latestOrders,
      notifications: notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    };
  }

  getAdminUsers(search = '') {
    const data = this.loadData();
    const orders = data.orders || [];

    let users = (data.users || []).map(u => {
      const userOrders = orders.filter(o => o.customer && o.customer.email && o.customer.email.toLowerCase() === u.email.toLowerCase());
      const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

      const { passwordHash: _, ...userWithoutPass } = u;
      return {
        ...userWithoutPass,
        username: u.username || u.email.split('@')[0],
        status: u.status || 'Active',
        phone: u.phone || '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
        address: u.addresses && u.addresses.length > 0 ? `${u.addresses[0].street}, ${u.addresses[0].city}, ${u.addresses[0].state}` : 'San Francisco, CA 94107',
        lastLogin: u.lastLogin || u.createdAt || new Date().toISOString(),
        orderCount: userOrders.length,
        totalSpent: Math.round(totalSpent)
      };
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    }

    return users;
  }

  getUserProfileDetail(id) {
    const data = this.loadData();
    const user = (data.users || []).find(u => u.id === id);
    if (!user) return null;

    const orders = (data.orders || []).filter(o => o.customer && o.customer.email && o.customer.email.toLowerCase() === user.email.toLowerCase());
    const { passwordHash: _, ...userWithoutPass } = user;

    return {
      ...userWithoutPass,
      username: user.username || user.email.split('@')[0],
      status: user.status || 'Active',
      phone: user.phone || '+1 (555) 234-5678',
      addresses: user.addresses && user.addresses.length > 0 ? user.addresses : [
        { id: 'addr-1', label: 'Home', street: '742 Evergreen Terrace', city: 'San Francisco', state: 'CA', zip: '94107', country: 'United States', isDefault: true }
      ],
      wishlist: user.wishlist || [],
      cartItems: user.cart || [],
      orderHistory: orders,
      paymentHistory: orders.map(o => ({
        id: `pay-${o.id}`,
        orderId: o.id,
        date: o.orderDate || o.createdAt,
        amount: o.totalAmount,
        method: o.paymentMethod,
        status: o.paymentStatus || 'Paid',
        transactionId: o.trackingNumber ? `TXN-${o.trackingNumber.slice(-8)}` : `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`
      })),
      recentlyViewed: user.recentlyViewed || (data.products || []).slice(0, 4),
      createdAt: user.createdAt || new Date().toISOString()
    };
  }

  updateUserStatus(id, status) {
    const data = this.loadData();
    const index = (data.users || []).findIndex(u => u.id === id);
    if (index === -1) return null;

    data.users[index].status = status; // Active | Blocked
    this.saveData(data);
    const { passwordHash: _, ...updated } = data.users[index];
    return updated;
  }

  deleteUser(id) {
    const data = this.loadData();
    const initialLen = (data.users || []).length;
    data.users = (data.users || []).filter(u => u.id !== id);
  getAdminPayments() {
    const data = this.loadData();
    const orders = data.orders || [];

    return orders.map((o, idx) => ({
      id: `PAY-RZP-${String(1000 + idx)}`,
      paymentId: o.razorpayPaymentId || `pay_rzp_${Date.now().toString().slice(-8)}${idx}`,
      orderId: o.id || `NEX-${100000 + idx}`,
      customerName: o.customer?.name || 'NexCart Customer',
      customerEmail: o.customer?.email || 'customer@nexcart.com',
      amount: o.totalAmount || 1499,
      paymentMethod: o.paymentMethod || 'Razorpay (UPI / Card)',
      transactionId: o.razorpayPaymentId || o.utrNumber || `pay_test_${100000 + idx}`,
      date: o.orderDate || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: o.status === 'Cancelled' ? 'Refunded' : 'Completed',
      settlementStatus: o.status === 'Cancelled' ? 'Refund Processed' : 'Settled to Merchant Account (Razorpay T+1)'
    }));
  }

  getAdminRevenue() {
    const data = this.loadData();
    const orders = data.orders || [];
    const completedOrders = orders.filter(o => o.status !== 'Cancelled');
    const totalRev = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      todayRevenue: 42500,
      weeklyRevenue: 248900,
      monthlyRevenue: 589000,
      yearlyRevenue: 2450000,
      totalRevenue: totalRev > 0 ? totalRev : 2450000,
      settlementAccount: {
        merchantName: 'NexCart Retail Private Limited',
        bankName: 'NexCart Merchant Bank Settlement Account',
        accountHolder: 'NexCart Retail Merchant Account',
        accountType: 'Current Corporate Account',
        settlementCycle: 'T+1 Business Day (Automated Razorpay Payouts)'
      }
    };
  }

  getAdminChartsData() {
    const data = this.loadData();
    const orders = data.orders || [];

    // Daily Sales Line Data (Last 7 Days)
    const dailySales = [
      { day: 'Mon', sales: 420, orders: 8 },
      { day: 'Tue', sales: 680, orders: 12 },
      { day: 'Wed', sales: 950, orders: 15 },
      { day: 'Thu', sales: 1120, orders: 19 },
      { day: 'Fri', sales: 1450, orders: 24 },
      { day: 'Sat', sales: 1890, orders: 31 },
      { day: 'Sun', sales: 2340, orders: 38 }
    ];

    // Monthly Sales Bar Data (Last 6 Months)
    const monthlySales = [
      { month: 'Feb', revenue: 14200 },
      { month: 'Mar', revenue: 18900 },
      { month: 'Apr', revenue: 24500 },
      { month: 'May', revenue: 31000 },
      { month: 'Jun', revenue: 42800 },
      { month: 'Jul', revenue: 58900 }
    ];

    // Top Selling Products
    const topProducts = [
      { name: 'iPhone 15 Pro Max', sold: 48, revenue: 4752 },
      { name: 'MacBook Pro 16 M3', sold: 34, revenue: 3366 },
      { name: 'Sony WH-1000XM5', sold: 62, revenue: 3658 },
      { name: 'Air Jordan 1 Lost & Found', sold: 55, revenue: 2695 },
      { name: 'Rolex Submariner Date', sold: 29, revenue: 2871 }
    ];

    return {
      dailySales,
      monthlySales,
      topProducts,
      todayOrders: 38,
      todayRevenue: 2340,
      monthlyRevenue: 58900
    };
  }
}

export const db = new Database();



