import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { fetchProductById, addReview } from '../services/api.js';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, Send } from 'lucide-react';

export default function ProductDetailModal() {
  const { activeProductModal, setActiveProductModal, addToCart, wishlist, toggleWishlist, addToast } = useShop();

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Midnight');
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTab, setActiveTab] = useState('specs');
  
  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!activeProductModal) return;
    
    async function loadDetail() {
      try {
        const fullData = await fetchProductById(activeProductModal.id);
        setProductData(fullData);
        setSelectedImage(fullData.image);
      } catch (err) {
        setProductData(activeProductModal);
        setSelectedImage(activeProductModal.image);
      }
    }

    loadDetail();
    setQuantity(1);
  }, [activeProductModal]);

  if (!activeProductModal) return null;
  const prod = productData || activeProductModal;

  const allImages = [prod.image, ...(prod.secondaryImages || [])];
  const isWishlisted = wishlist.some(i => i.id === prod.id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const newRev = await addReview(prod.id, {
        user: reviewerName || 'Verified Buyer',
        rating: reviewRating,
        comment: reviewComment
      });

      addToast('Thank you! Your review has been submitted.', 'success');
      setReviewComment('');
      
      // Reload product details to update reviews
      const updated = await fetchProductById(prod.id);
      setProductData(updated);
    } catch (err) {
      addToast('Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveProductModal(null)}>
      <div
        className="glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}
        >
          <X size={20} />
        </button>

        {/* Product Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>

          {/* Left Column: Image Gallery */}
          <div>
            <div style={{
              width: '100%',
              paddingTop: '80%',
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              marginBottom: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <img
                src={selectedImage || prod.image}
                alt={prod.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      padding: 0,
                      opacity: selectedImage === img ? 1 : 0.6
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Controls */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-featured">{prod.category}</span>
              {prod.stock > 0 ? (
                <span className="badge badge-stock">In Stock ({prod.stock} left)</span>
              ) : (
                <span className="badge badge-sale">Out of Stock</span>
              )}
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {prod.title}
            </h2>

            {/* Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill={star <= Math.round(prod.rating) ? '#f59e0b' : 'none'} />
                ))}
              </div>
              <span style={{ fontWeight: 700 }}>{prod.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ({prod.reviewCount} customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                ${prod.price.toFixed(2)}
              </span>
              {prod.originalPrice && (
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${prod.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {prod.description}
            </p>

            {/* Color Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Color: <span style={{ color: 'var(--accent-primary)' }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Midnight', 'Onyx Black', 'Titanium Silver', 'Emerald'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      border: selectedColor === color ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: selectedColor === color ? 'var(--accent-light)' : 'transparent',
                      color: selectedColor === color ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: 600
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Modifier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quantity:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '0.5rem 0.8rem', background: 'var(--bg-secondary)' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 1rem', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ padding: '0.5rem 0.8rem', background: 'var(--bg-secondary)' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => {
                  addToCart(prod, quantity, selectedColor, selectedSize);
                  setActiveProductModal(null);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
              >
                <ShoppingBag size={18} /> Add to Cart — ${(prod.price * quantity).toFixed(2)}
              </button>

              <button
                onClick={() => toggleWishlist(prod)}
                className="btn-icon"
                style={{
                  width: '48px',
                  height: '48px',
                  background: isWishlisted ? '#ef4444' : 'var(--bg-secondary)',
                  color: isWishlisted ? '#fff' : 'var(--text-primary)'
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#fff' : 'none'} />
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Tabs: Specs & Customer Reviews */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                paddingBottom: '0.4rem',
                borderBottom: activeTab === 'specs' ? '3px solid var(--accent-primary)' : 'none',
                color: activeTab === 'specs' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                paddingBottom: '0.4rem',
                borderBottom: activeTab === 'reviews' ? '3px solid var(--accent-primary)' : 'none',
                color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              Reviews ({prod.reviewsList ? prod.reviewsList.length : prod.reviewCount})
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {prod.specs && Object.keys(prod.specs).length > 0 ? (
                Object.entries(prod.specs).map(([key, val]) => (
                  <div key={key} style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{key}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{val}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No extra specifications listed.</p>
              )}
            </div>
          ) : (
            <div>
              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} style={{
                background: 'var(--bg-secondary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Write a Customer Review</h4>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Alex M.)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        style={{ color: star <= reviewRating ? '#f59e0b' : '#94a3b8' }}
                      >
                        <Star size={18} fill={star <= reviewRating ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share details of your experience with this product..."
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem'
                  }}
                />
                <button type="submit" disabled={submittingReview} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                  <Send size={14} /> {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {prod.reviewsList && prod.reviewsList.length > 0 ? (
                  prod.reviewsList.map((rev) => (
                    <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.user}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.4rem' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={14} fill={s <= rev.rating ? '#f59e0b' : 'none'} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
