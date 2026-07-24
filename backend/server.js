import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// --- API ENDPOINTS ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'NexCart E-Commerce Platform',
    version: '1.0.0',
    serverTime: new Date().toISOString()
  });
});

// 2. Authentication API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const result = await db.registerUser({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = await db.loginUser({ email, password });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    // Simple decoding or mock verify
    res.json({ message: 'Authenticated user profile endpoint' });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const updatedUser = db.updateUserProfile(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Products API (Filtered, Searched, Sorted)
app.get('/api/products', (req, res) => {
  try {
    const {
      category, search, brand, minPrice, maxPrice, rating, minDiscount,
      inStock, color, size, tag, sort, page, limit
    } = req.query;

    const result = db.getProducts({
      category, search, brand, minPrice, maxPrice, rating, minDiscount,
      inStock, color, size, tag, sort, page, limit
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Single Product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin: Create Product
app.post('/api/products', (req, res) => {
  try {
    const newProd = db.addProduct(req.body);
    res.status(201).json(newProd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Admin: Update Product
app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Admin: Delete Product
app.delete('/api/products/:id', (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Categories API
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const category = db.addCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Orders API
app.post('/api/orders', (req, res) => {
  try {
    const { items, subtotal, discountAmount, shippingFee, tax, totalAmount, customer, shippingAddress, paymentMethod } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least 1 item' });
    }

    const newOrder = db.createOrder({
      items, subtotal, discountAmount, shippingFee, tax, totalAmount, customer, shippingAddress, paymentMethod
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const { email } = req.query;
    const orders = db.getOrders(email);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status, note } = req.body;
    const order = db.updateOrderStatus(req.params.id, status, note);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Reviews API
app.post('/api/products/:id/reviews', (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const review = db.addReview(req.params.id, { user, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Coupons API
app.get('/api/coupons', (req, res) => {
  try {
    res.json(db.getCoupons());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons', (req, res) => {
  try {
    const coupon = db.addCoupon(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/coupons/:code', (req, res) => {
  try {
    db.deleteCoupon(req.params.code);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Payment Processing Gateway Simulation (Stripe / Razorpay compatible)
app.post('/api/payments/process', (req, res) => {
  try {
    const { paymentMethod, amount, currency = 'USD', details } = req.body;
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    res.json({
      success: true,
      transactionId,
      status: 'PAID',
      amount,
      currency,
      paymentMethod,
      timestamp: new Date().toISOString(),
      message: 'Payment processed successfully via NexCart secure gateway'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Admin Analytics Stats
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. NexCart AI Shopping Assistant
app.post('/api/ai-chat', (req, res) => {
  try {
    const { message } = req.body;
    const q = (message || '').toLowerCase();
    const allProducts = db.getProducts({ limit: 150 }).products;

    let responseText = "";
    let recommendedProducts = [];

    if (q.includes('gift') || q.includes('under') || q.includes('budget') || q.includes('$')) {
      const matchPrice = q.match(/\$?(\d+)/);
      const budget = matchPrice ? Number(matchPrice[1]) : 150;
      recommendedProducts = allProducts.filter(p => p.price <= budget).slice(0, 3);
      responseText = `Here are our top recommended NexCart items under $${budget}:`;
    } else if (q.includes('mobile') || q.includes('phone') || q.includes('iphone') || q.includes('samsung')) {
      recommendedProducts = allProducts.filter(p => p.category.toLowerCase() === 'mobiles').slice(0, 3);
      responseText = `Check out our latest 5G smartphones and flagship mobile deals:`;
    } else if (q.includes('laptop') || q.includes('macbook') || q.includes('dell')) {
      recommendedProducts = allProducts.filter(p => p.category.toLowerCase() === 'laptops').slice(0, 3);
      responseText = `Here are our top rated laptops for work, gaming, and creative projects:`;
    } else if (q.includes('coupon') || q.includes('discount') || q.includes('code') || q.includes('promo')) {
      responseText = `🎉 Active NexCart promo codes: **NEXCART10** (10% off over $50), **NEXCART20** (20% off over $150), **WELCOME50** ($50 off over $200), and **FLASH30** (30% off over $300)!`;
    } else if (q.includes('shipping') || q.includes('delivery') || q.includes('track')) {
      responseText = `🚚 NexCart offers **Free Express Shipping** on orders over $50! Track your real-time order status directly in your Account dashboard.`;
    } else if (q.includes('return') || q.includes('refund') || q.includes('policy')) {
      responseText = `🛡️ NexCart provides a 30-day hassle-free return and replacement policy with free return pickups.`;
    } else {
      recommendedProducts = allProducts.filter(p => p.isFeatured || p.isTrending).slice(0, 3);
      responseText = `I'm NexCart Assistant! I can help you find products, apply coupons, or track orders. Here are some trending items right now:`;
    }

    res.json({
      reply: responseText,
      products: recommendedProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NexCart Backend REST API running on http://localhost:${PORT}`);
});
