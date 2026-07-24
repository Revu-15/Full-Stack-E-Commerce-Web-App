import React from 'react';
import { ShopProvider } from './context/ShopContext.jsx';
import Navbar from './components/Navbar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import WishlistModal from './components/WishlistModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import UserOrdersModal from './components/UserOrdersModal.jsx';
import InvoiceModal from './components/InvoiceModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AuthModal from './components/AuthModal.jsx';
import ToastNotification from './components/ToastNotification.jsx';
import { Sparkles, ShieldCheck, ArrowRight, Heart, Truck, RefreshCw, Lock } from 'lucide-react';

function MainContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroBanner />
        <ProductCatalog />
      </main>

      {/* Trust Badges Strip */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '2rem 1.5rem', marginTop: '3rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={28} style={{ color: 'var(--accent-primary)' }} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Free Express Delivery</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On all orders over $50 across the country</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={28} style={{ color: 'var(--accent-primary)' }} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>30-Day Easy Returns</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hassle-free replacement guarantee</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={28} style={{ color: 'var(--accent-primary)' }} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>100% Secure Payments</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Encrypted checkout with UPI, Cards & COD</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={28} style={{ color: 'var(--accent-primary)' }} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>108+ Authentic Products</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct from official brand stores</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', padding: '3rem 1.5rem 1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.3rem' }}>
                NexCart
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              NexCart is your premier full-stack e-commerce marketplace bringing authentic tech, fashion, sports, books, and lifestyle items with express shipping.
            </p>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>Top Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Mobiles & 5G Smartphones</li>
              <li>Laptops & Ultrabooks</li>
              <li>Electronics & Audio</li>
              <li>Fashion & Sneakers</li>
              <li>Home & Kitchen Appliances</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>Join NexCart Club</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Subscribe for private flash sale alerts and exclusive discount codes.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email..."
                style={{ flex: 1, padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
              <button style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.55rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>© 2026 NexCart Inc. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Modern E-Commerce
          </span>
        </div>
      </footer>

      {/* Global Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />
      <UserOrdersModal />
      <InvoiceModal />
      <AdminDashboard />
      <AuthModal />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
