import React from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistModal() {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, moveToCartFromWishlist } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 205,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '1.75rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={24} fill="#ef4444" color="#ef4444" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>My Wishlist ({wishlist.length})</h3>
          </div>
          <button onClick={() => setIsWishlistOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Empty</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Click the heart icon on any product to save it to your wishlist.</p>
            <button
              onClick={() => setIsWishlistOpen(false)}
              style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.85rem' }}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {wishlist.map(product => (
              <div key={product.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: '100%', height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#fff', marginBottom: '0.6rem' }}>
                  <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', lineHeight: 1.3 }}>{product.title}</h4>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>${product.price}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => moveToCartFromWishlist(product)}
                    style={{ flex: 1, background: 'var(--accent-primary)', color: '#fff', padding: '0.45rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{ background: '#fee2e2', color: '#ef4444', padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
