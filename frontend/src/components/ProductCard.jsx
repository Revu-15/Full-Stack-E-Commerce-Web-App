import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart, setActiveProductModal } = useShop();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const secondaryImage = product.secondaryImages && product.secondaryImages.length > 0 
    ? product.secondaryImages[0] 
    : product.image;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="glass-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Product Image Area */}
      <div style={{
        position: 'relative',
        paddingTop: '80%', // aspect ratio
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        cursor: 'pointer'
      }} onClick={() => setActiveProductModal(product)}>
        
        <img
          src={isHovered ? secondaryImage : product.image}
          alt={product.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease, opacity 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 5
        }}>
          {product.isFeatured && (
            <span className="badge badge-featured">
              <Zap size={12} /> Featured
            </span>
          )}
          {discountPercent && (
            <span className="badge badge-sale">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            zIndex: 5,
            background: isWishlisted ? '#ef4444' : 'rgba(255, 255, 255, 0.85)',
            color: isWishlisted ? '#ffffff' : '#0f172a',
            border: 'none'
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#ffffff' : 'none'} />
        </button>

        {/* Quick Action Overlay on Hover */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.75rem',
          right: '0.75rem',
          display: 'flex',
          gap: '0.5rem',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.25s ease',
          zIndex: 5
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductModal(product);
            }}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.8rem',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#0f172a'
            }}
          >
            <Eye size={16} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Category & Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600 }}>
              <Star size={14} fill="#f59e0b" />
              <span>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setActiveProductModal(product)}
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              lineHeight: 1.35,
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Price & Add to Cart Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="btn-primary"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
            title="Add to Cart"
          >
            <ShoppingBag size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
