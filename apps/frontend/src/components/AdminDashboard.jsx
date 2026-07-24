import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  X, DollarSign, Package, ShoppingBag, Users, Tag, AlertTriangle, Plus, Trash2, Edit3, Check, RefreshCw, BarChart2
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAdminOpen, setIsAdminOpen, addToast } = useShop();

  const [activeTab, setActiveTab] = useState('analytics'); // analytics | products | categories | orders | users | coupons
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '', brand: '', category: 'Mobiles', price: '', originalPrice: '', stock: 20, description: '', image: ''
  });

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percent', value: 10, minSpend: 50, description: '' });

  useEffect(() => {
    if (isAdminOpen) {
      loadAdminData();
    }
  }, [isAdminOpen, activeTab]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const data = await api.fetchAnalytics();
        setAnalytics(data);
      } else if (activeTab === 'products') {
        const data = await api.fetchProducts({ limit: 150 });
        setProducts(data.products || []);
      } else if (activeTab === 'categories') {
        const data = await api.fetchCategories();
        setCategories(data || []);
      } else if (activeTab === 'orders') {
        const data = await api.fetchOrders();
        setOrders(data || []);
      } else if (activeTab === 'users') {
        const data = await api.fetchUsers();
        setUsers(data || []);
      } else if (activeTab === 'coupons') {
        const data = await api.fetchCoupons();
        setCoupons(data || []);
      }
    } catch (err) {
      console.warn('Could not load admin section data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminOpen) return null;

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createProduct({
        ...newProd,
        price: Number(newProd.price),
        originalPrice: Number(newProd.originalPrice) || Number(newProd.price),
        images: newProd.image ? [newProd.image] : undefined
      });
      addToast(`Product "${created.title}" added successfully!`, 'success');
      setIsAddProductOpen(false);
      setNewProd({ title: '', brand: '', category: 'Mobiles', price: '', originalPrice: '', stock: 20, description: '', image: '' });
      loadAdminData();
    } catch (err) {
      addToast(err.message || 'Failed to create product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast('Product deleted.', 'info');
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, `Updated by admin`);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      addToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createCoupon(newCoupon);
      setCoupons(prev => [...prev, created]);
      setNewCoupon({ code: '', type: 'percent', value: 10, minSpend: 50, description: '' });
      addToast(`Coupon "${created.code}" created!`, 'success');
    } catch (err) {
      addToast('Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (code) => {
    try {
      await api.deleteCoupon(code);
      setCoupons(prev => prev.filter(c => c.code !== code));
      addToast('Coupon deleted.', 'info');
    } catch (err) {
      addToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '1150px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={24} /> NexCart Admin Control Center
          </h3>
          <button onClick={() => setIsAdminOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {[
            { id: 'analytics', label: 'Dashboard & Analytics' },
            { id: 'products', label: 'Manage Products' },
            { id: 'categories', label: 'Manage Categories' },
            { id: 'orders', label: 'Manage Orders' },
            { id: 'users', label: 'Manage Users' },
            { id: 'coupons', label: 'Manage Coupons' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                fontWeight: activeTab === t.id ? 800 : 600,
                color: activeTab === t.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === t.id ? '3px solid var(--accent-primary)' : '3px solid transparent'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div>
            {loading || !analytics ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Loading analytics metrics...</p>
            ) : (
              <div>
                {/* KPI Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL REVENUE</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', marginTop: '0.2rem' }}>${analytics.totalRevenue?.toFixed(2)}</div>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL ORDERS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb', marginTop: '0.2rem' }}>{analytics.totalOrders}</div>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL PRODUCTS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.2rem' }}>{analytics.totalProducts}</div>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOW STOCK ALERTS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626', marginTop: '0.2rem' }}>{analytics.lowStockCount}</div>
                  </div>
                </div>

                {/* Low Stock Items List */}
                {analytics.lowStockProducts && analytics.lowStockProducts.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertTriangle size={16} /> Low Stock Inventory Items:
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
                      {analytics.lowStockProducts.map(p => (
                        <span key={p.id} style={{ background: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f87171' }}>
                          {p.title} (Stock: <strong>{p.stock}</strong>)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Product Catalog ({products.length})</h4>
              <button
                onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Add Product Form Modal */}
            {isAddProductOpen && (
              <form onSubmit={handleCreateProduct} style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Title</label>
                  <input type="text" required value={newProd.title} onChange={e => setNewProd({ ...newProd, title: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Brand</label>
                  <input type="text" required value={newProd.brand} onChange={e => setNewProd({ ...newProd, brand: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Category</label>
                  <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    {['Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Shoes', 'Watches', 'Grocery', 'Home & Kitchen', 'Beauty', 'Books', 'Toys', 'Sports'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Price ($)</label>
                  <input type="number" required value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Stock Count</label>
                  <input type="number" required value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Image URL</label>
                  <input type="text" placeholder="https://images.unsplash.com/..." value={newProd.image} onChange={e => setNewProd({ ...newProd, image: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                    Save Product
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem' }}>Product</th>
                    <th style={{ padding: '0.65rem' }}>Category</th>
                    <th style={{ padding: '0.65rem' }}>Price</th>
                    <th style={{ padding: '0.65rem' }}>Stock</th>
                    <th style={{ padding: '0.65rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 30).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.65rem', fontWeight: 700 }}>{p.title}</td>
                      <td style={{ padding: '0.65rem' }}>{p.category}</td>
                      <td style={{ padding: '0.65rem', fontWeight: 800 }}>${p.price}</td>
                      <td style={{ padding: '0.65rem', color: p.stock > 5 ? '#16a34a' : '#dc2626', fontWeight: 800 }}>{p.stock}</td>
                      <td style={{ padding: '0.65rem' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Customer Orders ({orders.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>Order #{o.orderId} - ${o.totalAmount?.toFixed(2)}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customer: {o.customer?.name} ({o.customer?.email})</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: MANAGE COUPONS */}
        {activeTab === 'coupons' && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Promo Coupons</h4>
            <form onSubmit={handleCreateCoupon} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="text" placeholder="CODE" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              <input type="number" placeholder="Discount Value" value={newCoupon.value} onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })} style={{ width: '120px', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              <input type="number" placeholder="Min Spend ($)" value={newCoupon.minSpend} onChange={e => setNewCoupon({ ...newCoupon, minSpend: e.target.value })} style={{ width: '120px', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              <button type="submit" style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.45rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                Add Coupon
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {coupons.map(c => (
                <div key={c.code} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{c.code}</strong> - {c.description} (Min Spend: ${c.minSpend})
                  </div>
                  <button onClick={() => handleDeleteCoupon(c.code)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
