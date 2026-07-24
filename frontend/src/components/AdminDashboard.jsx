import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  ShieldAlert, ShieldCheck, Users, ShoppingBag, DollarSign, Package, User, Mail, Phone, MapPin,
  Calendar, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, Edit3, Lock, Unlock, Trash2,
  FileText, ArrowRight, X, Bell, Filter, Award, ChevronRight, CreditCard, Heart, ExternalLink, Printer, Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAdminOpen, setIsAdminOpen, user, addToast, openInvoiceModal } = useShop();

  // ── Authentication & RBAC State ─────────────────────────────────────────────
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('nexcart_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminEmail, setAdminEmail] = useState('admin@nexcart.com');
  const [adminPassword, setAdminPassword] = useState('Admin123!');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ── Dashboard Tabs & Stats ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview'); // overview | customers | orders | products | coupons
  const [stats, setStats] = useState({
    totalCustomers: 142, onlineCustomers: 18, totalOrders: 68, pendingOrders: 12,
    deliveredOrders: 48, cancelledOrders: 8, totalProducts: 109, totalRevenue: 48920,
    recentRegistrations: [], latestOrders: [], notifications: []
  });

  // ── Customers CRM State ──────────────────────────────────────────────────────
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [customerModalTab, setCustomerModalTab] = useState('info'); // info | addresses | wishlist | cart | orders | payments | recentlyViewed
  const [editingUser, setEditingUser] = useState(null);

  // ── Orders State ─────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // ── Products CRUD State ──────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', brand: '', category: 'Mobiles', price: '', originalPrice: '', stock: 20, image: '', description: ''
  });

  // ── Coupons State ────────────────────────────────────────────────────────────
  const [coupons, setCoupons] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);

  // ── Notifications Drawer ─────────────────────────────────────────────────────
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isAuthenticatedAdmin = Boolean(adminToken || (user && (user.role === 'admin' || user.role === 'ADMIN' || user.email === 'admin@nexcart.com')));

  // ── Load Admin Data ─────────────────────────────────────────────────────────
  const loadAdminData = async () => {
    try {
      const dashboardData = await api.fetchAnalytics();
      if (dashboardData) {
        setStats(prev => ({
          ...prev,
          totalCustomers: dashboardData.totalCustomers || 142,
          onlineCustomers: dashboardData.onlineCustomers || 18,
          totalOrders: dashboardData.totalOrders || 68,
          pendingOrders: dashboardData.pendingOrders || 12,
          deliveredOrders: dashboardData.deliveredOrders || 48,
          cancelledOrders: dashboardData.cancelledOrders || 8,
          totalProducts: dashboardData.totalProducts || 109,
          totalRevenue: dashboardData.totalRevenue || 48920,
          recentRegistrations: dashboardData.recentRegistrations || [],
          latestOrders: dashboardData.latestOrders || [],
          notifications: dashboardData.notifications || []
        }));
      }

      const usersList = await api.fetchUsers();
      if (Array.isArray(usersList)) setCustomers(usersList);

      const ordersList = await api.fetchOrders();
      if (Array.isArray(ordersList)) setOrders(ordersList);

      const prodsRes = await api.fetchProducts({ limit: 150 });
      if (prodsRes && Array.isArray(prodsRes.products)) setProducts(prodsRes.products);

      const couponList = await api.fetchCoupons();
      if (Array.isArray(couponList)) setCoupons(couponList);
    } catch (err) {
      console.warn('Admin load warning:', err.message);
    }
  };

  useEffect(() => {
    if (isAdminOpen && isAuthenticatedAdmin) {
      loadAdminData();
      const interval = setInterval(loadAdminData, 8000); // Polling live updates
      return () => clearInterval(interval);
    }
  }, [isAdminOpen, isAuthenticatedAdmin]);

  if (!isAdminOpen) return null;

  // ── Admin Login Action ──────────────────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await api.adminLogin(adminEmail, adminPassword);
      if (res && (res.success || res.token)) {
        const token = res.token || 'admin-demo-jwt-token';
        const u = res.user || { id: 'admin-super', name: 'Super Admin', email: adminEmail, role: 'ADMIN' };
        
        setAdminToken(token);
        setAdminUser(u);
        localStorage.setItem('nexcart_admin_token', token);
        localStorage.setItem('nexcart_admin_user', JSON.stringify(u));
        addToast('Super Admin authenticated successfully', 'success');
        loadAdminData();
      } else {
        setAuthError('Invalid Admin credentials. Try admin@nexcart.com / Admin123!');
      }
    } catch (err) {
      setAuthError(err.message || 'Admin authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('nexcart_admin_token');
    localStorage.removeItem('nexcart_admin_user');
    addToast('Admin logged out safely', 'info');
  };

  // ── Customer Actions ─────────────────────────────────────────────────────────
  const handleViewCustomerProfile = async (cust) => {
    try {
      const detail = await api.fetchAdminUserProfile(cust.id);
      setSelectedCustomerProfile(detail || cust);
      setCustomerModalTab('info');
    } catch {
      setSelectedCustomerProfile(cust);
    }
  };

  const handleToggleBlockCustomer = async (cust) => {
    const newStatus = cust.status === 'Blocked' ? 'Active' : 'Blocked';
    try {
      await api.updateAdminUserStatus(cust.id, newStatus);
      setCustomers(prev => prev.map(u => u.id === cust.id ? { ...u, status: newStatus } : u));
      if (selectedCustomerProfile && selectedCustomerProfile.id === cust.id) {
        setSelectedCustomerProfile(prev => ({ ...prev, status: newStatus }));
      }
      addToast(`Customer ${cust.name} ${newStatus === 'Blocked' ? 'blocked' : 'unblocked'}`, newStatus === 'Blocked' ? 'error' : 'success');
    } catch (err) {
      addToast(err.message || 'Could not update user status', 'error');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer account?')) return;
    try {
      await api.deleteAdminUser(id);
      setCustomers(prev => prev.filter(u => u.id !== id));
      if (selectedCustomerProfile && selectedCustomerProfile.id === id) setSelectedCustomerProfile(null);
      addToast('Customer account deleted', 'info');
    } catch (err) {
      addToast(err.message || 'Could not delete user', 'error');
    }
  };

  // ── Order Status Actions ─────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
        setSelectedOrderDetail(prev => ({ ...prev, status: newStatus }));
      }
      addToast(`Order ${orderId} status set to ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // ── Render Admin Login View ─────────────────────────────────────────────────
  if (!isAuthenticatedAdmin) {
    return (
      <div style={{ fixed: 'inset-0', position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '440px', width: '100%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
          
          <button onClick={() => setIsAdminOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1rem', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}>
              <ShieldAlert size={26} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              NexCart Admin Portal
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Super Admin Authentication Required. Restricted Access.
            </p>
          </div>

          {authError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Admin Email Address</label>
              <div style={{ position: 'relative', marginTop: '0.2rem' }}>
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Admin Secret Password</label>
              <div style={{ position: 'relative', marginTop: '0.2rem' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.92rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <ShieldCheck size={18} />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Super Admin Dashboard'}</span>
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.8rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🔑 Default Super Admin Login: <strong>admin@nexcart.com</strong> / <strong>Admin123!</strong>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Full Super Admin Dashboard Interface ─────────────────────────────
  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.username || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.phone || '').toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      (o.id || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customer?.name || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customer?.email || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customer?.phone || '').toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = orderStatusFilter === 'all' || (o.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ fixed: 'inset-0', position: 'fixed', inset: 0, zIndex: 250, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Top Super Admin Header */}
      <header style={{ background: '#0f172a', color: '#ffffff', borderBottom: '1px solid #1e293b', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>NexCart Control Center</h2>
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '99px', textTransform: 'uppercase' }}>SUPER ADMIN</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live Customer CRM, Order Lifecycle & Store Analytics</p>
          </div>
        </div>

        {/* Global Admin Search & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Notifications Feed Button */}
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{ position: 'relative', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '0.55rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            <Bell size={18} color="#f59e0b" />
            <span>Feed</span>
            {stats.notifications && stats.notifications.length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '99px' }}>
                {stats.notifications.length}
              </span>
            )}
          </button>

          {/* Admin User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', background: '#1e293b', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
            <img src={adminUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'} alt="Admin" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <div style={{ fontSize: '0.78rem', textAlign: 'left' }}>
              <div style={{ fontWeight: 800, color: '#f8fafc' }}>{adminUser?.name || 'Super Admin'}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>admin@nexcart.com</div>
            </div>
          </div>

          <button onClick={handleAdminLogout} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 800 }}>
            Sign Out
          </button>

          <button onClick={() => setIsAdminOpen(false)} style={{ color: '#94a3b8', padding: '0.4rem' }}>
            <X size={22} />
          </button>
        </div>

      </header>

      {/* Admin Tab Navigation Bar */}
      <nav style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: ShoppingBag, badge: null },
          { id: 'customers', label: 'Customers CRM', icon: Users, badge: customers.length },
          { id: 'orders', label: 'Orders Stream', icon: Package, badge: orders.length },
          { id: 'products', label: 'Product Inventory', icon: Award, badge: products.length },
          { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: coupons.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 900 : 700,
                fontSize: '0.88rem',
                borderBottom: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span style={{ background: isActive ? '#38bdf8' : '#334155', color: isActive ? '#0f172a' : '#94a3b8', fontSize: '0.72rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '99px' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Admin Scrollable Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: 'var(--bg-primary)' }}>
        
        {/* ── TAB 1: OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyValue: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Customers</span>
                  <Users size={22} color="#2563eb" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.totalCustomers}</div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '0.2rem' }}>● {stats.onlineCustomers} Customers Currently Online</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
                  <DollarSign size={22} color="#16a34a" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>₹{stats.totalRevenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>From {stats.totalOrders} total orders</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Orders</span>
                  <Package size={22} color="#d97706" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.totalOrders}</div>
                <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, marginTop: '0.2rem' }}>{stats.pendingOrders} Orders Pending Processing</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivered Orders</span>
                  <CheckCircle size={22} color="#16a34a" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>{stats.deliveredOrders}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{stats.cancelledOrders} Cancelled / Refunded</div>
              </div>

            </div>

            {/* Recent Registrations & Latest Orders Feed */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
              
              {/* Recent Orders List */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Latest Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800 }}>View All Orders &rarr;</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {orders.slice(0, 5).map(ord => (
                    <div key={ord.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{ord.id} — {ord.customer?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.items?.length || 1} item(s) • {ord.paymentMethod}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>₹{ord.totalAmount}</div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '99px', background: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Pending' ? '#fef3c7' : '#e0f2fe', color: ord.status === 'Delivered' ? '#15803d' : ord.status === 'Pending' ? '#b45309' : '#0369a1' }}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Customers List */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Recently Registered Customers</h3>
                  <button onClick={() => setActiveTab('customers')} style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800 }}>Manage Customers &rarr;</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {customers.slice(0, 5).map(cust => (
                    <div key={cust.id} style={{ display: 'flex', alignItems: 'center', justifyValue: 'space-between', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={cust.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cust.name || 'User')}`} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.email}</div>
                        </div>
                      </div>

                      <button onClick={() => handleViewCustomerProfile(cust)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── TAB 2: CUSTOMERS CRM ────────────────────────────────────────────── */}
        {activeTab === 'customers' && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search Customers by Name, Username, Email, Phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                Showing {filteredCustomers.length} Registered Customers
              </div>
            </div>

            {/* Customers Table */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Customer Profile</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Contact Info</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Address</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Orders</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Total Spent</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                      
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={cust.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cust.name)}`} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{cust.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{cust.username || cust.email.split('@')[0]}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cust.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.phone || '+1 (555) 234-5678'}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cust.address || 'San Francisco, CA 94107'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 900,
                          background: cust.status === 'Blocked' ? '#fef2f2' : '#dcfce7',
                          color: cust.status === 'Blocked' ? '#dc2626' : '#16a34a'
                        }}>
                          {cust.status || 'Active'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {cust.orderCount || 0} Orders
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                        ₹{cust.totalSpent || 0}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          
                          <button
                            onClick={() => handleViewCustomerProfile(cust)}
                            title="View Full Profile"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleToggleBlockCustomer(cust)}
                            title={cust.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
                            style={{ background: cust.status === 'Blocked' ? '#dcfce7' : '#fef2f2', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: cust.status === 'Blocked' ? '#16a34a' : '#dc2626' }}
                          >
                            {cust.status === 'Blocked' ? <Unlock size={16} /> : <Lock size={16} />}
                          </button>

                          <button
                            onClick={() => handleDeleteCustomer(cust.id)}
                            title="Delete Customer Account"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ── TAB 3: ORDERS MANAGEMENT ────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              
              <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search Orders by Order ID, Customer Name, Email, Phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.88rem' }}
                />
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
                {['all', 'Pending', 'Accepted', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: orderStatusFilter === st ? 'var(--accent-primary)' : 'var(--bg-surface)',
                      color: orderStatusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

            </div>

            {/* Orders Table */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Order ID & Date</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Customer Details</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Items Ordered</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Payment Method</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Order Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Grand Total</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(ord => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 900, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{ord.id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.orderDate || ord.createdAt}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{ord.customer?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customer?.email}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ord.items?.length || 1} Item(s)</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ord.items && ord.items[0] ? ord.items[0].title : 'Products'}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ord.paymentMethod || 'Cash on Delivery'}</div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 900, color: ord.paymentStatus === 'Paid' ? '#16a34a' : '#d97706' }}>
                          ● {ord.paymentStatus || 'Pending'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 900,
                          background: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Pending' ? '#fef3c7' : ord.status === 'Shipped' ? '#e0f2fe' : '#fef2f2',
                          color: ord.status === 'Delivered' ? '#15803d' : ord.status === 'Pending' ? '#b45309' : ord.status === 'Shipped' ? '#0369a1' : '#dc2626'
                        }}>
                          {ord.status || 'Pending'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        ₹{ord.totalAmount}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', flexWrap: 'wrap' }}>
                          
                          <button
                            onClick={() => setSelectedOrderDetail(ord)}
                            style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}
                          >
                            View Order
                          </button>

                          {ord.status === 'Pending' && (
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'Accepted')} style={{ background: '#3b82f6', color: '#fff', padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 800 }}>
                              Accept
                            </button>
                          )}

                          {(ord.status === 'Pending' || ord.status === 'Accepted') && (
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'Packed')} style={{ background: '#8b5cf6', color: '#fff', padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 800 }}>
                              Pack
                            </button>
                          )}

                          {(ord.status === 'Packed' || ord.status === 'Accepted') && (
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')} style={{ background: '#0284c7', color: '#fff', padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 800 }}>
                              Ship
                            </button>
                          )}

                          {ord.status === 'Shipped' && (
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')} style={{ background: '#16a34a', color: '#fff', padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 800 }}>
                              Deliver
                            </button>
                          )}

                          {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && ord.status !== 'Refunded' && (
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'Cancelled')} style={{ background: '#ef4444', color: '#fff', padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 800 }}>
                              Cancel
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ── TAB 4: PRODUCTS INVENTORY ───────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Store Inventory ({products.length} Products)</h3>
              <button onClick={() => setIsAddProductOpen(true)} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} /> Add New Product
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {products.slice(0, 48).map(prod => (
                <div key={prod.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', gap: '0.85rem' }}>
                  <img src={prod.images?.[0]} alt={prod.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{prod.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.brand} • {prod.category}</div>
                    <div style={{ fontWeight: 900, color: 'var(--accent-primary)', marginTop: '0.3rem', fontSize: '0.9rem' }}>₹{prod.price} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock: {prod.stock}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── CUSTOMER PROFILE DETAIL MODAL ────────────────────────────────────── */}
      {selectedCustomerProfile && (
        <div style={{ fixed: 'inset-0', position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '850px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Customer Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={selectedCustomerProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedCustomerProfile.name)}`} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{selectedCustomerProfile.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedCustomerProfile.email} • Registered {selectedCustomerProfile.createdAt ? new Date(selectedCustomerProfile.createdAt).toLocaleDateString() : 'Recently'}</div>
                </div>
              </div>
              <button onClick={() => setSelectedCustomerProfile(null)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            {/* Customer Sub Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1.5rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
              {['info', 'orders', 'payments', 'addresses', 'wishlist', 'recentlyViewed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCustomerModalTab(tab)}
                  style={{
                    padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 800,
                    background: customerModalTab === tab ? 'var(--accent-primary)' : 'transparent',
                    color: customerModalTab === tab ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Customer Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {customerModalTab === 'info' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                  <div><strong>Full Name:</strong> {selectedCustomerProfile.name}</div>
                  <div><strong>Email:</strong> {selectedCustomerProfile.email}</div>
                  <div><strong>Phone:</strong> {selectedCustomerProfile.phone || '+1 (555) 234-5678'}</div>
                  <div><strong>Username:</strong> @{selectedCustomerProfile.username || selectedCustomerProfile.email.split('@')[0]}</div>
                  <div><strong>Status:</strong> {selectedCustomerProfile.status || 'Active'}</div>
                  <div><strong>Last Login:</strong> {new Date().toLocaleString()}</div>
                </div>
              )}

              {customerModalTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(selectedCustomerProfile.orderHistory || []).map(o => (
                    <div key={o.id} style={{ padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>{o.id} — ₹{o.totalAmount}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.orderDate || o.createdAt} • Status: {o.status}</div>
                      </div>
                      <button onClick={() => { setSelectedOrderDetail(o); openInvoiceModal(o); }} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>
                        View Invoice
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── ORDER DETAIL MODAL ────────────────────────────────────────────── */}
      {selectedOrderDetail && (
        <div style={{ fixed: 'inset-0', position: 'fixed', inset: 0, zIndex: 310, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '750px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>Order Details — {selectedOrderDetail.id}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracking: {selectedOrderDetail.trackingNumber || 'TRK-NEX-8940'}</div>
              </div>
              <button onClick={() => setSelectedOrderDetail(null)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
              
              {/* Customer Info */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.4rem' }}>Customer Information</h4>
                <div>Name: <strong>{selectedOrderDetail.customer?.name}</strong></div>
                <div>Email: {selectedOrderDetail.customer?.email}</div>
                <div>Phone: {selectedOrderDetail.customer?.phone || '+1 (555) 234-5678'}</div>
              </div>

              {/* Items List */}
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Items Ordered</h4>
                {(selectedOrderDetail.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <img src={item.images?.[0] || item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} • Price: ₹{item.price}</div>
                    </div>
                    <div style={{ fontWeight: 900, color: 'var(--accent-primary)' }}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span>₹{selectedOrderDetail.subtotal || selectedOrderDetail.totalAmount}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping Fee:</span><span>₹0 (Free Express)</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                  <span>Grand Total:</span><span style={{ color: 'var(--accent-primary)' }}>₹{selectedOrderDetail.totalAmount}</span>
                </div>
              </div>

              {/* Invoice Trigger Button */}
              <button
                onClick={() => {
                  openInvoiceModal(selectedOrderDetail);
                  setSelectedOrderDetail(null);
                }}
                style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Printer size={18} /> Open Printable Amazon Tax Invoice
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
