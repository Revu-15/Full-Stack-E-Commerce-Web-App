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

// --- ROOT & HEALTH API ENDPOINTS ---

// 0. Root Welcome & API Status Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>NexCart REST API Server</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 3rem 1.5rem; }
        .container { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 2.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.4); border: 1px solid #334155; }
        h1 { font-size: 2rem; color: #38bdf8; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; }
        .badge { background: #16a34a; color: #fff; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 99px; font-weight: 800; text-transform: uppercase; }
        p { color: #94a3b8; line-height: 1.6; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
        .card { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 1rem; text-decoration: none; color: #f8fafc; transition: all 0.2s; }
        .card:hover { border-color: #38bdf8; transform: translateY(-2px); }
        .card h3 { margin: 0 0 0.4rem 0; font-size: 1rem; color: #38bdf8; }
        .card p { margin: 0; font-size: 0.8rem; color: #64748b; }
        .btn { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 700; margin-top: 1.5rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>NexCart REST API <span class="badge">ONLINE</span></h1>
        <p>Welcome to the official <strong>NexCart Full-Stack E-Commerce Backend Server</strong>. The server is actively running on Port 5000 and serving 109+ products across 12 categories, user authentication, orders tracking, invoices, and analytics.</p>
        
        <h2>Quick API Endpoints</h2>
        <div class="grid">
          <a href="/api/health" class="card">
            <h3>GET /api/health</h3>
            <p>Check server health & time</p>
          </a>
          <a href="/api/products?limit=10" class="card">
            <h3>GET /api/products</h3>
            <p>List sample catalog items</p>
          </a>
          <a href="/api/categories" class="card">
            <h3>GET /api/categories</h3>
            <p>12 Product categories</p>
          </a>
          <a href="/api/coupons" class="card">
            <h3>GET /api/coupons</h3>
            <p>Active promo discount codes</p>
          </a>
        </div>

        <div style="margin-top: 2rem; border-top: 1px solid #334155; padding-top: 1.5rem;">
          <p style="margin:0;">To interact with the full web UI interface, launch the frontend at:</p>
          <a href="http://localhost:3000" class="btn">Open NexCart Web App (localhost:3000) &rarr;</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

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
