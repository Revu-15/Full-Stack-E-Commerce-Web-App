import React from 'react';
import { ShopProvider } from './context/ShopContext.jsx';
import Navbar from './components/Navbar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import UserOrdersModal from './components/UserOrdersModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AIChatWidget from './components/AIChatWidget.jsx';
import ToastNotification from './components/ToastNotification.jsx';
import { Sparkles, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';

function MainContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroBanner />
        <ProductCatalog />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1.5rem 1.5rem 1.5rem',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>
                AuraLuxe
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Curated luxury marketplace blending high precision craftsmanship with sustainable modern design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>Shopping & Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Express Worldwide Shipping</li>
              <li>30-Day Hassle-Free Returns</li>
              <li>Order Tracking & Concierge</li>
              <li>Gift Cards & E-Vouchers</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>Join the Luxe Club</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Subscribe to get exclusive early access to new drops and private promo codes.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email..."
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)'
                }}
              />
              <button className="btn-primary" style={{ padding: '0.55rem 1rem' }}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>© 2026 AuraLuxe Inc. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Modern E-Commerce
          </span>
        </div>
      </footer>

      {/* Global Modals & Overlay Components */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <UserOrdersModal />
      <AdminDashboard />
      <AIChatWidget />
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
