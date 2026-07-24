import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  ShieldAlert, ShieldCheck, Users, ShoppingBag, DollarSign, Package, User, Mail, Phone, MapPin,
  Calendar, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, Edit3, Lock, Unlock, Trash2,
  FileText, ArrowRight, X, Bell, Filter, Award, ChevronRight, CreditCard, Heart, ExternalLink, Printer, Plus,
  LayoutDashboard, Tag, Star, BarChart3, Settings, LogOut, TrendingUp, ArrowUpRight, ArrowDownRight, Layers, Building2
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

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ── Left Sidebar Active Section ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | orders | products | categories | customers | reviews | coupons | payments | revenue | analytics | settings

  // ── Dashboard Metrics & Graphs State ─────────────────────────────────────────
  const [stats, setStats] = useState({
    totalCustomers: 142, onlineCustomers: 18, totalOrders: 68, pendingOrders: 12,
    deliveredOrders: 48, cancelledOrders: 8, totalProducts: 624, totalCategories: 12,
    totalRevenue: 245000, monthlyRevenue: 58900, todayOrders: 14,
    recentRegistrations: [], latestOrders: [], notifications: []
  });

  const [chartsData, setChartsData] = useState({
    dailySales: [
      { day: 'Mon', sales: 420, orders: 8 }, { day: 'Tue', sales: 680, orders: 12 },
      { day: 'Wed', sales: 950, orders: 15 }, { day: 'Thu', sales: 1120, orders: 19 },
      { day: 'Fri', sales: 1450, orders: 24 }, { day: 'Sat', sales: 1890, orders: 31 },
      { day: 'Sun', sales: 2340, orders: 38 }
    ],
    monthlySales: [
      { month: 'Feb', revenue: 14200 }, { month: 'Mar', revenue: 18900 },
      { month: 'Apr', revenue: 24500 }, { month: 'May', revenue: 31000 },
      { month: 'Jun', revenue: 42800 }, { month: 'Jul', revenue: 58900 }
    ],
    topProducts: [
      { name: 'iPhone 15 Pro Max', sold: 48, revenue: 4752 },
      { name: 'MacBook Pro 16 M3', sold: 34, revenue: 3366 },
      { name: 'Sony WH-1000XM5', sold: 62, revenue: 3658 },
      { name: 'Air Jordan 1 Lost & Found', sold: 55, revenue: 2695 },
      { name: 'Rolex Submariner Date', sold: 29, revenue: 2871 }
    ]
  });

  const [revenueData, setRevenueData] = useState({
    todayRevenue: 4250,
    weeklyRevenue: 24890,
    monthlyRevenue: 58900,
    yearlyRevenue: 245000,
    totalRevenue: 245000,
    settlementAccount: {
      merchantName: 'NexCart Retail Private Limited',
      bankName: 'NexCart Merchant Bank Settlement Account',
      accountHolder: 'NexCart Retail Merchant Account',
      accountType: 'Current Corporate Account',
      settlementCycle: 'T+1 Business Day (Automated Razorpay Payouts)'
    }
  });

  // ── CRM, Orders, Payments & Inventory State ─────────────────────────────────
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [customerModalTab, setCustomerModalTab] = useState('info');

  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const [payments, setPayments] = useState([]);
  const [paymentSearch, setPaymentSearch] = useState('');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', brand: '', category: 'Mobiles', price: '', originalPrice: '', stock: 20, image: '', description: ''
  });

  const [coupons, setCoupons] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState('');

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
          totalProducts: dashboardData.totalProducts || 624,
          totalCategories: 12,
          totalRevenue: dashboardData.totalRevenue || 245000,
          monthlyRevenue: 58900,
          todayOrders: 14
        }));
      }

      const revRes = await api.fetchAdminRevenue();
      if (revRes) setRevenueData(revRes);

      const chartsRes = await api.fetchAdminCharts();
      if (chartsRes) setChartsData(chartsRes);

      const usersList = await api.fetchUsers();
      if (Array.isArray(usersList)) setCustomers(usersList);

      const ordersList = await api.fetchOrders();
      if (Array.isArray(ordersList)) setOrders(ordersList);

      const paymentsList = await api.fetchAdminPayments();
      if (Array.isArray(paymentsList)) setPayments(paymentsList);

      const prodsRes = await api.fetchProducts({ limit: 150 });
      if (prodsRes && Array.isArray(prodsRes.products)) setProducts(prodsRes.products);

      const catsList = await api.fetchCategories();
      if (Array.isArray(catsList)) setCategories(catsList);

      const couponList = await api.fetchCoupons();
      if (Array.isArray(couponList)) setCoupons(couponList);

    } catch (err) {
      console.warn('Admin load warning:', err.message);
    }
  };

  useEffect(() => {
    if (isAdminOpen && isAuthenticatedAdmin) {
      loadAdminData();
      const interval = setInterval(loadAdminData, 8000);
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
        const u = res.user || { id: 'admin-super', name: 'NexCart Super Admin', email: adminEmail, role: 'ADMIN' };

        setAdminToken(token);
        setAdminUser(u);
        localStorage.setItem('nexcart_admin_token', token);
        localStorage.setItem('nexcart_admin_user', JSON.stringify(u));
        addToast('Super Admin authenticated successfully', 'success');
        loadAdminData();
      } else {
        setAuthError('Invalid Admin credentials. Access denied.');
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
    setIsAdminOpen(false);
    addToast('Super Admin logged out safely', 'info');
  };

  // ── Customer CRM Actions ─────────────────────────────────────────────────────
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

  // ── Order Stepper Actions ───────────────────────────────────────────────────
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
      <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '440px', width: '100%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
          
          <button onClick={() => setIsAdminOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1rem', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}>
              <ShieldAlert size={26} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              NexCart Super Admin Portal
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
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Super Admin Panel'}</span>
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.8rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🔒 Restricted Super Admin Portal. Authorized personnel only.
          </div>
        </div>
      </div>
    );
  }

  // ── Filter Data ────────────────────────────────────────────────────────────
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

  const filteredPayments = payments.filter(p =>
    (p.paymentId || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
    (p.orderId || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
    (p.customerName || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
    (p.transactionId || '').toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'var(--bg-primary)', display: 'flex', overflow: 'hidden' }}>
      
      {/* ── LEFT SIDEBAR NAVIGATION ────────────────────────────────────────── */}
      <aside style={{ width: '250px', background: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b', flexShrink: 0 }}>
        
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>NexCart</h2>
            <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUPER ADMIN</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
            { id: 'orders', label: 'Orders', icon: Package, badge: orders.length },
            { id: 'products', label: 'Products', icon: ShoppingBag, badge: products.length },
            { id: 'categories', label: 'Categories', icon: Layers, badge: categories.length },
            { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
            { id: 'reviews', label: 'Reviews', icon: Star, badge: null },
            { id: 'coupons', label: 'Coupons', icon: Tag, badge: coupons.length },
            { id: 'payments', label: 'Payments', icon: CreditCard, badge: payments.length },
            { id: 'revenue', label: 'Revenue', icon: DollarSign, badge: '₹' },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
            { id: 'settings', label: 'Settings', icon: Settings, badge: null }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600, fontSize: '0.85rem',
                  background: isActive ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'transparent',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span style={{ background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#1e293b', color: '#fff', fontSize: '0.7rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '99px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', background: '#090d16' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img src={adminUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin'} alt="Admin" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminUser?.name || 'Super Admin'}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>admin@nexcart.com</div>
            </div>
          </div>

          <button
            onClick={handleAdminLogout}
            style={{ width: '100%', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

      </aside>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Top Header Bar */}
        <header style={{ background: '#0f172a', color: '#ffffff', borderBottom: '1px solid #1e293b', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc', textTransform: 'capitalize' }}>
              {activeTab} Management Panel
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Razorpay Payment Gateway & SBI Bank Settlement Tracker (₹)</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setIsAdminOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ExternalLink size={16} /> Customer View
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: 'var(--bg-primary)' }}>
          
          {/* ── SECTION 1: DASHBOARD OVERVIEW & CHARTS ─────────────────────── */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
              
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <span>Total Revenue</span>
                    <DollarSign size={20} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#16a34a', marginTop: '0.3rem' }}>₹{revenueData.totalRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '0.2rem' }}>↑ Razorpay Direct Settlement</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <span>Monthly Revenue</span>
                    <TrendingUp size={20} color="#2563eb" />
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.3rem' }}>₹{revenueData.monthlyRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Target: ₹1,00,000</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <span>Total Orders</span>
                    <Package size={20} color="#d97706" />
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.3rem' }}>{stats.totalOrders}</div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, marginTop: '0.2rem' }}>{stats.pendingOrders} Processing</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <span>Total Customers</span>
                    <Users size={20} color="#8b5cf6" />
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.3rem' }}>{stats.totalCustomers}</div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '0.2rem' }}>● {stats.onlineCustomers} Online</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <span>Total Products</span>
                    <ShoppingBag size={20} color="#0284c7" />
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.3rem' }}>{stats.totalProducts}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Across {stats.totalCategories} Categories</div>
                </div>

              </div>

              {/* Interactive SVG Sales & Revenue Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
                
                {/* Daily Sales Line Chart */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)' }}>Daily Sales Performance (₹)</h4>
                  <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    {chartsData.dailySales.map(d => (
                      <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.3rem' }}>₹{d.sales}</div>
                        <div style={{ width: '28px', height: `${(d.sales / 2500) * 100}%`, background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', borderRadius: '4px 4px 0 0' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.5rem' }}>{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Revenue Bar Chart */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)' }}>Monthly Revenue Growth (₹)</h4>
                  <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1.2rem', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    {chartsData.monthlySales.map(m => (
                      <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.3rem' }}>₹{(m.revenue / 1000).toFixed(1)}k</div>
                        <div style={{ width: '32px', height: `${(m.revenue / 60000) * 100}%`, background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '4px 4px 0 0' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.5rem' }}>{m.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ── SECTION 2: REVENUE PAGE ───────────────────────────────────────── */}
          {activeTab === 'revenue' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>Revenue Analytics & Razorpay Settlement</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated payouts settled directly into State Bank of India (SBI) receiving account</p>
                </div>
              </div>

              {/* Revenue Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today's Revenue</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', marginTop: '0.3rem' }}>₹{revenueData.todayRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.2rem' }}>↑ 14 Orders Completed Today</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Revenue</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb', marginTop: '0.3rem' }}>₹{revenueData.weeklyRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Last 7 Days Earnings</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Revenue</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.3rem' }}>₹{revenueData.monthlyRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Current Month Total</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Yearly Revenue</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', marginTop: '0.3rem' }}>₹{revenueData.yearlyRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Financial Year 2026</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 1' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total All-Time Revenue</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', marginTop: '0.3rem' }}>₹{revenueData.totalRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.2rem' }}>100% Settled Payouts</div>
                </div>
              </div>

              {/* SBI Bank Account Settlement Box */}
              <div style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.85rem' }}>
                  <Building2 size={26} color="#38bdf8" />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>Razorpay Automated Bank Settlement Account</h4>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>Primary Destination for Customer Payments</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', fontSize: '0.88rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Merchant Name</div>
                    <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#f8fafc' }}>{revenueData.settlementAccount.merchantName}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Bank Name</div>
                    <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#f8fafc' }}>{revenueData.settlementAccount.bankName}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Account Holder Name</div>
                    <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#f8fafc' }}>{revenueData.settlementAccount.accountHolder}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Father's Name</div>
                    <div style={{ fontWeight: 800, color: '#e2e8f0' }}>{revenueData.settlementAccount.fatherName}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Savings Account Number</div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f59e0b', fontFamily: 'monospace' }}>{revenueData.settlementAccount.accountNumber}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>IFSC Code</div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#38bdf8', fontFamily: 'monospace' }}>{revenueData.settlementAccount.ifscCode}</div>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Payout Cycle</div>
                    <div style={{ fontWeight: 800, color: '#16a34a' }}>✓ {revenueData.settlementAccount.settlementCycle}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── SECTION 3: PAYMENTS LEDGER ────────────────────────────────────── */}
          {activeTab === 'payments' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Razorpay Payments Ledger ({payments.length} Transactions)</h3>
                <div style={{ position: 'relative', width: '320px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by Payment ID, Order ID, UTR..."
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Payments Table */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Payment ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Amount (₹)</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Transaction ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Payment Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Settlement Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{p.paymentId}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>{p.orderId}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{p.customerName}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: '#16a34a' }}>₹{p.amount}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{p.paymentMethod}</td>
                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontFamily: 'monospace' }}>{p.transactionId}</td>
                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.date}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.55rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 900, background: p.status === 'Completed' ? '#dcfce7' : '#fee2e2', color: p.status === 'Completed' ? '#16a34a' : '#dc2626' }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>
                          {p.settlementStatus || 'Settled to Merchant Account (Razorpay T+1)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ── SECTION 4: ORDERS MANAGEMENT ─────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
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

                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
                  {['all', 'Pending', 'Accepted', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      style={{
                        padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 800,
                        background: orderStatusFilter === st ? 'var(--accent-primary)' : 'var(--bg-surface)',
                        color: orderStatusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)', cursor: 'pointer'
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
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Items</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Payment Method</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Grand Total (₹)</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(ord => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{ord.id}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 800 }}>{ord.customer?.name || 'Customer'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customer?.phone || '+91 91252 58907'}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{ord.items?.length || 1} Item(s)</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div>{ord.paymentMethod || 'Razorpay'}</div>
                          <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 900 }}>● {ord.paymentStatus || 'PAID'}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 900, background: ord.status === 'Delivered' ? '#dcfce7' : '#fef3c7', color: ord.status === 'Delivered' ? '#16a34a' : '#b45309' }}>
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.95rem' }}>₹{ord.totalAmount}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button onClick={() => setSelectedOrderDetail(ord)} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ── SECTION 5: CUSTOMERS CRM ──────────────────────────────────────── */}
          {activeTab === 'customers' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Registered Customers CRM ({customers.length})</h3>
                <input
                  type="text"
                  placeholder="Search Customers by Name, Email, Phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: '320px', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer Profile</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Orders</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Total Spent (₹)</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={cust.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cust.name)}`} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                            <div>
                              <div style={{ fontWeight: 800 }}>{cust.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{cust.username || cust.email.split('@')[0]}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div>{cust.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.phone || '+91 91252 58907'}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.55rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 900, background: cust.status === 'Blocked' ? '#fee2e2' : '#dcfce7', color: cust.status === 'Blocked' ? '#dc2626' : '#16a34a' }}>
                            {cust.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>{cust.orderCount || 0}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>₹{cust.totalSpent || 0}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button onClick={() => handleViewCustomerProfile(cust)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ── SECTION 6: PRODUCTS INVENTORY ────────────────────────────────── */}
          {activeTab === 'products' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Product Inventory ({products.length} Products)</h3>
                <button onClick={() => setIsAddProductOpen(true)} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {products.slice(0, 48).map(prod => (
                  <div key={prod.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', gap: '0.85rem' }}>
                    <img src={prod.images?.[0]} alt={prod.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.brand} • {prod.category}</div>
                      <div style={{ fontWeight: 900, color: 'var(--accent-primary)', marginTop: '0.3rem' }}>₹{prod.price} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Stock: {prod.stock}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
