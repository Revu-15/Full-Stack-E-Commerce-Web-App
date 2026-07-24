import React from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { Star, Heart, ShoppingBag, Eye, ShieldCheck, Truck } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist, setActiveProductModal } = useShop();

  if (!product) return null;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <div
      className="nexcart-product-card"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'var(--shadow-sm)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Badges Overlay */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {product.discount > 0 && (
          <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)' }}>
            {product.discount}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '0.18rem 0.45rem', borderRadius: 'var(--radius-sm)' }}>
            BEST SELLER
          </span>
        )}
        {product.isDealOfDay && (
          <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '0.18rem 0.45rem', borderRadius: 'var(--radius-sm)' }}>
            TODAY'S DEAL
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isWishlisted ? '#fee2e2' : 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isWishlisted ? '#ef4444' : 'var(--text-muted)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
      </button>

      {/* Product Image & Quick View Trigger */}
      <div
        onClick={() => setActiveProductModal(product)}
        style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '0.75rem',
          background: '#f8fafc'
        }}
      >
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />

        {/* Quick View Hover Button */}
        <div className="quick-view-overlay" style={{
          position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
          <button style={{ background: '#ffffff', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-md)' }}>
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        
        {/* Brand & Category */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent-primary)' }}>{product.brand || 'NexCart'}</span>
          <span>{product.category}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => setActiveProductModal(product)}
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4rem'
          }}
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', background: '#fef3c7', color: '#d97706', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
            <span>{product.rating || 4.8}</span>
            <Star size={12} fill="#d97706" color="#d97706" />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({(product.reviewCount || 100).toLocaleString()})</span>
        </div>

        {/* Price Section */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Free Delivery Tag */}
        <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Truck size={12} />
          <span>{product.freeDelivery ? 'Free Express Delivery' : 'Standard Delivery'}</span>
        </div>

      </div>

      {/* Add To Cart Button */}
      <button
        onClick={() => addToCart(product, 1)}
        style={{
          width: '100%',
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: '#ffffff',
          padding: '0.6rem',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '0.83rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          transition: 'background 0.2s ease'
        }}
      >
        <ShoppingBag size={15} /> Add to Cart
      </button>

    </div>
  );
}
