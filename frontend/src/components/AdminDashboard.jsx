import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { fetchAnalytics, fetchProducts, createProduct, updateProduct, deleteProduct, fetchOrders, updateOrderStatus } from '../services/api.js';
import { X, LayoutDashboard, PackagePlus, ShoppingBag, DollarSign, AlertTriangle, TrendingUp, Edit3, Trash2, CheckCircle, RefreshCw, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdminOpen, setIsAdminOpen, addToast } = useShop();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders'
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form State
  const [isNewProdOpen, setIsNewProdOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    stock: 20,
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    isFeatured: false
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsData, prodData, orderData] = await Promise.all([
        fetchAnalytics(),
        fetchProducts({ limit: 100 }),
        fetchOrders()
      ]);
      setAnalytics(analyticsData);
      setProducts(prodData.products || []);
      setOrders(orderData || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOpen) {
      loadAdminData();
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price) return;

    try {
      await createProduct(newProd);
      addToast(`Product "${newProd.title}" created successfully!`, 'success');
      setIsNewProdOpen(false);
      setNewProd({ title: '', price: '', originalPrice: '', category: 'Electronics', stock: 20, description: '', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', isFeatured: false });
      loadAdminData();
    } catch (err) {
      addToast('Error creating product', 'error');
    }
  };

  const handleDeleteProd = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProduct(id);
      addToast(`Deleted "${title}"`, 'info');
      loadAdminData();
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, `Status updated by Admin to ${newStatus}`);
      addToast(`Order #${orderId} status set to ${newStatus}`, 'success');
      loadAdminData();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdminOpen(false)}>
      <div
        className="glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1050px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-gradient)', color: '#fff' }}>
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Admin Management Console</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Operations & Live Inventory Control</span>
            </div>
          </div>
          <button onClick={() => setIsAdminOpen(false)} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)'
        }}>
          {[
            { id: 'overview', label: '📊 Sales & KPIs' },
            { id: 'products', label: '📦 Product Inventory (CRUD)' },
            { id: 'orders', label: '🚚 Orders Management' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 700,
                background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>Loading Admin Console...</p>
          ) : activeTab === 'overview' && analytics ? (
            <div>
              {/* KPI Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REVENUE</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                    ${analytics.totalRevenue.toFixed(2)}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>
                    {analytics.totalOrders}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG ORDER VALUE</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
                    ${analytics.avgOrderValue.toFixed(2)}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOW STOCK ALERTS</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: analytics.lowStockCount > 0 ? '#f59e0b' : 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {analytics.lowStockCount} Items
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Revenue Breakdown by Category</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {Object.entries(analytics.categoryRevenue || {}).map(([cat, rev]) => (
                  <div key={cat} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{cat}</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                      ${rev.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'products' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Catalog Inventory ({products.length} Products)</h4>
                <button onClick={() => setIsNewProdOpen(true)} className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {/* Products Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Product</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Price</th>
                      <th style={{ padding: '0.75rem' }}>Stock</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={prod.image} alt={prod.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontWeight: 700 }}>{prod.title}</span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{prod.category}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>${prod.price.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={prod.stock <= 5 ? "badge badge-low-stock" : "badge badge-stock"}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteProd(prod.id, prod.title)}
                            style={{ color: '#ef4444', padding: '0.4rem' }}
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Customer Orders ({orders.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => (
                  <div key={order.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-primary)' }}>{order.orderNumber}</span>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer: {order.customer?.name} ({order.customer?.email})</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Total: ${order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Popup for Add Product Form */}
        {isNewProdOpen && (
          <div className="modal-overlay">
            <div className="glass-modal" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create New Product</h3>
                <button onClick={() => setIsNewProdOpen(false)} className="btn-icon"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProd.title}
                    onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Initial Stock</label>
                    <input
                      type="number"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
                  <textarea
                    rows="3"
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setIsNewProdOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
