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
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. Get Products (Filtered, Searched, Sorted)
app.get('/api/products', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, inStock, tag, sort, page, limit } = req.query;
    const result = db.getProducts({ category, search, minPrice, maxPrice, rating, inStock, tag, sort, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Single Product by ID
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

// 4. Admin: Create Product
app.post('/api/products', (req, res) => {
  try {
    const newProd = db.addProduct(req.body);
    res.status(201).json(newProd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin: Update Product
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

// 6. Admin: Delete Product
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

// 7. Get Categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Place Order
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

// 9. Get All Orders (Admin / User history)
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Get Order by Order Number / ID / Tracking Number
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

// 11. Admin: Update Order Status
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

// 12. Add Review to Product
app.post('/api/products/:id/reviews', (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const review = db.addReview(req.params.id, { user, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Validate Coupon Code
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Admin Analytics Stats
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. AI Assistant Intelligent Query Endpoint
app.post('/api/ai-chat', (req, res) => {
  try {
    const { message } = req.body;
    const q = (message || '').toLowerCase();
    const allProducts = db.getProducts({ limit: 100 }).products;

    let responseText = "";
    let recommendedProducts = [];

    if (q.includes('gift') || q.includes('under') || q.includes('budget') || q.includes('$')) {
      const matchPrice = q.match(/\$?(\d+)/);
      const budget = matchPrice ? Number(matchPrice[1]) : 150;
      recommendedProducts = allProducts.filter(p => p.price <= budget).slice(0, 3);
      responseText = `Here are our top recommended luxury items under $${budget}:`;
    } else if (q.includes('headphone') || q.includes('audio') || q.includes('music') || q.includes('electronics')) {
      recommendedProducts = allProducts.filter(p => p.category.toLowerCase() === 'electronics').slice(0, 3);
      responseText = `Check out these premium audio & tech devices currently in stock:`;
    } else if (q.includes('watch') || q.includes('accessories') || q.includes('bag') || q.includes('leather')) {
      recommendedProducts = allProducts.filter(p => p.category.toLowerCase() === 'accessories').slice(0, 3);
      responseText = `Here are our artisan accessories crafted for longevity:`;
    } else if (q.includes('coupon') || q.includes('discount') || q.includes('code') || q.includes('promo')) {
      responseText = `🎉 You can use promo code **LUXE10** for 10% off orders over $50, **LUXE20** for 20% off over $150, or **WELCOME50** for $50 off over $200!`;
    } else if (q.includes('shipping') || q.includes('delivery') || q.includes('track')) {
      responseText = `🚚 We offer **Free Express Shipping** on orders over $100! All orders include real-time tracking numbers accessible in your account drawer.`;
    } else if (q.includes('return') || q.includes('refund') || q.includes('policy')) {
      responseText = `🛡️ AuraLuxe offers a 30-day hassle-free return guarantee with complimentary prepaid shipping labels.`;
    } else {
      recommendedProducts = allProducts.filter(p => p.isFeatured || p.isTrending).slice(0, 3);
      responseText = `I'm Luxe AI, your personal concierge! I can help you find products, apply discounts, or answer shipping questions. Here are some trending picks:`;
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
  console.log(`🚀 AuraLuxe Backend REST API running on http://localhost:${PORT}`);
});
