import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import ProductCard from './ProductCard.jsx';
import {
  X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Tag, RefreshCw, CheckCircle2,
  Share2, AlertCircle, Sparkles, MessageSquare, CreditCard, ChevronRight, Layers
} from 'lucide-react';

export default function ProductDetailModal() {
  const {
    activeProductModal, setActiveProductModal,
    addToCart, wishlist, toggleWishlist, addToast, setAppliedCoupon
  } = useShop();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [fullProduct, setFullProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description'); // description | specs | reviews

  // New Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (activeProductModal && activeProductModal.id) {
      setSelectedImage(0);
      setQuantity(1);
      if (activeProductModal.colors) setSelectedColor(activeProductModal.colors[0]);
      if (activeProductModal.sizes) setSelectedSize(activeProductModal.sizes[0]);

      // Fetch full details including related & frequently bought together
      api.fetchProductById(activeProductModal.id)
        .then(res => setFullProduct(res))
        .catch(err => console.warn('Could not fetch product details:', err));
    } else {
      setFullProduct(null);
    }
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const product = fullProduct || activeProductModal;
  const isWishlisted = wishlist.some(i => i.id === product.id);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'];

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);

    try {
      const added = await api.addReview(product.id, {
        user: 'Verified Shopper',
        rating: newRating,
        comment: newComment
      });

      setFullProduct(prev => {
        if (!prev) return prev;
        const updatedReviews = [added, ...(prev.reviews || [])];
        return {
          ...prev,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length
        };
      });

      setNewComment('');
      addToast('Thank you! Your review has been published.', 'success');
    } catch (err) {
      addToast('Could not submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleApplyCouponFromProduct = (code) => {
    api.validateCoupon(code, product.price)
      .then(res => {
        if (res.valid) {
          setAppliedCoupon(res);
          addToast(`Coupon "${code}" applied! Saved $${res.discountAmount}`, 'success');
        } else {
          addToast(res.message, 'error');
        }
      });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={() => setActiveProductModal(null)}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Main Grid: Images + Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Left Column: Multi-Image Gallery */}
          <div>
            {/* Main Preview with Zoom effect */}
            <div style={{
              width: '100%',
              height: '380px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#f8fafc',
              marginBottom: '1rem',
              position: 'relative',
              border: '1px solid var(--border-color)'
            }}>
              <img
                src={images[selectedImage] || images[0]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {product.discount > 0 && (
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#dc2626', color: '#fff', fontSize: '0.78rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails list */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      opacity: selectedImage === idx ? 1 : 0.6,
                      background: '#f8fafc'
                    }}
                  >
                    <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Core Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                  {product.brand || 'NexCart Brand'}
                </span>
                <span>Category: {product.category}</span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.3rem', lineHeight: 1.3 }}>
                {product.title}
              </h2>
            </div>

            {/* Rating & Review Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                <span>{product.rating || 4.8}</span>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
              </div>
              <span style={{ color: 'var(--text-muted)' }}>({(product.reviewCount || 100).toLocaleString()} Verified Ratings)</span>
            </div>

            {/* Price Breakdown */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice}
                </span>
              )}
              {product.discount > 0 && (
                <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 800 }}>
                  Save ${(product.originalPrice - product.price).toFixed(2)} ({product.discount}%)
                </span>
              )}
            </div>

            {/* Bank Offers & Available Coupons */}
            {product.coupons && product.coupons.length > 0 && (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-primary)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                  <Tag size={14} /> Available Coupons & Bank Offers
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.coupons.map(code => (
                    <button
                      key={code}
                      onClick={() => handleApplyCouponFromProduct(code)}
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Use <strong>{code}</strong> (Click to Apply)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* EMI & Warranty Highlights */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CreditCard size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>EMI starts at <strong>${Math.round(product.price / 12)}/mo</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={15} style={{ color: '#16a34a' }} />
                <span>{product.seller?.warranty || '1 Year Brand Warranty'}</span>
              </div>
            </div>

            {/* Stock Status & Seller Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', background: 'var(--bg-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Seller: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{product.seller?.name || 'NexCart Retail'}</strong>
              </div>
              <div>
                <span style={{ color: product.stock > 0 ? '#16a34a' : '#ef4444', fontWeight: 800 }}>
                  {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.5rem 0.85rem', background: 'var(--bg-secondary)', fontWeight: 800 }}
                >
                  -
                </button>
                <span style={{ padding: '0.5rem 1rem', fontWeight: 800, fontSize: '0.9rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.5rem 0.85rem', background: 'var(--bg-secondary)', fontWeight: 800 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity, selectedColor, selectedSize);
                  setActiveProductModal(null);
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: isWishlisted ? '#fee2e2' : 'var(--bg-secondary)',
                  color: isWishlisted ? '#ef4444' : 'var(--text-primary)'
                }}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>

          </div>

        </div>

        {/* Tabs: Description | Specifications | Reviews */}
        <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem' }}>
          {['description', 'specifications', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 0.5rem',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab ? 800 : 600,
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '3px solid var(--accent-primary)' : '3px solid transparent',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'reviews' ? `Customer Reviews (${product.reviewCount || 0})` : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ marginBottom: '2.5rem' }}>
          
          {/* 1. Description */}
          {activeTab === 'description' && (
            <div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>Key Features:</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {product.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 2. Specifications Table */}
          {activeTab === 'specifications' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{key}:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* 3. Reviews & Submission Form */}
          {activeTab === 'reviews' && (
            <div>
              {/* Add Review Form */}
              <form onSubmit={handleAddReview} style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>Write a Review</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Star size={18} fill={star <= newRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    </button>
                  ))}
                </div>
                <textarea
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your honest review..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.85rem', marginBottom: '0.75rem' }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview || !newComment.trim()}
                  style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{rev.user}</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to write a review!</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Frequently Bought Together Bundle Section */}
        {product.frequentlyBoughtTogetherProducts && product.frequentlyBoughtTogetherProducts.length > 0 && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} style={{ color: 'var(--accent-primary)' }} /> Frequently Bought Together
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#fff', border: '1px solid var(--border-color)' }}>
                  <img src={images[0]} alt="main" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-muted)' }}>+</span>
                {product.frequentlyBoughtTogetherProducts.map(fbt => (
                  <div key={fbt.id} style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#fff', border: '1px solid var(--border-color)' }}>
                    <img src={fbt.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'} alt={fbt.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bundle Total Price:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  ${(product.price + product.frequentlyBoughtTogetherProducts.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}
                </div>
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    product.frequentlyBoughtTogetherProducts.forEach(fbt => addToCart(fbt, 1));
                    addToast('Added bundle to cart!', 'success');
                  }}
                  style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.45rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.8rem', marginTop: '0.4rem' }}
                >
                  Add Both to Cart
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
