import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { validateCoupon } from '../services/api.js';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    cartTotal,
    appliedCoupon,
    setAppliedCoupon,
    setIsCheckoutOpen,
    addToast
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  if (!isCartOpen) return null;

  // Free shipping threshold ($100)
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setIsValidating(true);
      const res = await validateCoupon(couponCode, cartSubtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        addToast(res.message, 'success');
        setCouponCode('');
      } else {
        addToast(res.message, 'error');
      }
    } catch (err) {
      addToast('Error validating coupon', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Your Shopping Cart</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({cart.length} items)</span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600 }}>
            <Truck size={16} color={remainingForFreeShipping === 0 ? '#10b981' : '#6366f1'} />
            {remainingForFreeShipping === 0 ? (
              <span style={{ color: '#10b981' }}>🎉 Congratulations! You unlocked Free Express Shipping!</span>
            ) : (
              <span>Add <strong style={{ color: 'var(--accent-primary)' }}>${remainingForFreeShipping.toFixed(2)}</strong> more for Free Shipping</span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${freeShippingProgress}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <ShoppingBag size={50} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Explore our catalog to add luxury items to your cart.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                Browse Collections
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '72px',
                      height: '72px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}
                  />

                  {/* Item Details */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.25rem' }}>
                      {item.title}
                    </h4>
                    {item.selectedColor && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Color: {item.selectedColor}
                      </span>
                    )}
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.35rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: '#ef4444', opacity: 0.8 }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden'
                    }}>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 0.5rem', fontSize: '0.82rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Breakdown */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)'
          }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Promo Code (e.g. LUXE20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase'
                  }}
                />
                <Tag size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <button type="submit" disabled={isValidating} className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                {isValidating ? 'Checking...' : 'Apply'}
              </button>
            </form>

            {/* Applied Coupon Pill */}
            {appliedCoupon && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} /> Coupon Code "{appliedCoupon.code}" Applied
                </span>
                <button onClick={() => setAppliedCoupon(null)} style={{ color: '#10b981', fontWeight: 700 }}>×</button>
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                paddingTop: '0.5rem',
                borderTop: '1px dashed var(--border-color)',
                marginTop: '0.25rem'
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-primary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
