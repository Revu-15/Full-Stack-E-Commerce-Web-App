import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  X, Trash2, Plus, Minus, Heart, Bookmark, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen, setIsCartOpen,
    cart, updateCartQuantity, removeFromCart, saveForLater,
    savedForLater, moveToCartFromSaved, removeSavedItem,
    cartSubtotal, discountAmount, shippingFee, taxAmount, cartTotal,
    appliedCoupon, setAppliedCoupon,
    setIsCheckoutOpen, toggleWishlist, addToast
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);

    try {
      const res = await api.validateCoupon(couponCode, cartSubtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        addToast(`Coupon "${res.code}" applied! Discount: $${res.discountAmount}`, 'success');
        setCouponCode('');
      } else {
        addToast(res.message || 'Invalid coupon code.', 'error');
      }
    } catch (err) {
      addToast('Error validating coupon.', 'error');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed.', 'info');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 210,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: '#f0fdf4', padding: '0.65rem 1.5rem', borderBottom: '1px solid #bbf7d0', fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
          {cartSubtotal >= 50 ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Check size={14} color="#16a34a" /> 🎉 You qualify for <strong>FREE Express Shipping</strong>!
            </span>
          ) : (
            <span>Add <strong>${(50 - cartSubtotal).toFixed(2)}</strong> more to unlock FREE Express Shipping!</span>
          )}
        </div>

        {/* Scrollable Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--text-muted)' }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our catalog and add your favorite items!</p>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.85rem' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                  
                  {/* Thumbnail */}
                  <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#fff', flexShrink: 0 }}>
                    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.25rem' }}>{item.title}</h4>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                        {item.selectedSize && <span>| Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>${(item.price * item.quantity).toFixed(2)}</span>

                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} style={{ padding: '0.2rem 0.5rem' }}><Minus size={12} /></button>
                        <span style={{ padding: '0 0.5rem', fontWeight: 800, fontSize: '0.8rem' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} style={{ padding: '0.2rem 0.5rem' }}><Plus size={12} /></button>
                      </div>
                    </div>

                    {/* Secondary Actions: Save For Later & Wishlist */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.72rem' }}>
                      <button onClick={() => saveForLater(item)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Bookmark size={12} /> Save for later
                      </button>
                      <button onClick={() => toggleWishlist(item)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Heart size={12} /> Wishlist
                      </button>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: 'auto' }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* SAVE FOR LATER SECTION */}
          {savedForLater.length > 0 && (
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Bookmark size={15} style={{ color: 'var(--accent-primary)' }} /> Saved for Later ({savedForLater.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {savedForLater.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => moveToCartFromSaved(item)} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Move to Cart</button>
                      <button onClick={() => removeSavedItem(item.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Promo / Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem', textTransform: 'uppercase' }}
              />
              <button
                type="submit"
                disabled={isValidatingCoupon || !couponCode.trim()}
                style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.8rem' }}
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#166534', fontWeight: 700, marginBottom: '1rem' }}>
                <span>Applied Code: {appliedCoupon.code} (-${appliedCoupon.discountAmount})</span>
                <button type="button" onClick={handleRemoveCoupon} style={{ color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}>
                  <span>Coupon Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Charges</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Tax (5%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                <span>Grand Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Trigger */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                padding: '0.8rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
