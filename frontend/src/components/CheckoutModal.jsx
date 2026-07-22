import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { submitOrder } from '../services/api.js';
import { X, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Truck, Lock, Sparkles, PackageCheck } from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    cartTotal,
    setIsOrdersOpen,
    addToast
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Alexandra Wright',
    email: 'alexandra@example.com',
    phone: '+1 (555) 234-5678',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    paymentMethod: 'Credit Card',
    cardNumber: '4532 •••• •••• 8892',
    cardExpiry: '08/28',
    cardCvv: '392'
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      const orderPayload = {
        items: cart,
        subtotal: cartSubtotal,
        discountAmount,
        shippingFee,
        tax: taxAmount,
        totalAmount: cartTotal,
        customer: { name: formData.name, email: formData.email, phone: formData.phone },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await submitOrder(orderPayload);
      setConfirmedOrder(response);
      clearCart();
      setStep(3);
      addToast('Order placed successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div
        className="glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          padding: '2rem',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={20} />
        </button>

        {/* Step Indicator */}
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 1 ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}>
                1
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: step === 1 ? 700 : 500 }}>Shipping</span>
            </div>

            <div style={{ width: '40px', height: '2px', background: 'var(--border-color)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 2 ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}>
                2
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: step === 2 ? 700 : 500 }}>Payment</span>
            </div>
          </div>
        )}

        {/* STEP 1: Shipping Address Form */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={22} color="var(--accent-primary)" /> Shipping & Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(2)} className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                <span>Continue to Payment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Simulation Form */}
        {step === 2 && (
          <form onSubmit={handlePlaceOrder}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={22} color="var(--accent-primary)" /> Select Payment Gateway
            </h3>

            {/* Payment Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['Credit Card', 'Apple Pay', 'PayPal'].map(method => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: formData.paymentMethod === method ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: formData.paymentMethod === method ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    color: formData.paymentMethod === method ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Credit Card Fields */}
            {formData.paymentMethod === 'Credit Card' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                    />
                    <CreditCard size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>CVV Code</label>
                    <input
                      type="password"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total Summary */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Total Amount to Pay</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock size={14} /> 256-Bit SSL Encrypted
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <ShieldCheck size={18} />
                <span>{submitting ? 'Processing Payment...' : `Complete Order — $${cartTotal.toFixed(2)}`}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && confirmedOrder && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Confirmed!</h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Thank you for shopping with AuraLuxe. We have sent a confirmation email to <strong>{confirmedOrder.customer?.email}</strong>.
            </p>

            {/* Tracking Receipt Box */}
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order Number:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{confirmedOrder.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tracking Number:</span>
                <span style={{ fontWeight: 700 }}>{confirmedOrder.trackingNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>2-3 Business Days</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsOrdersOpen(true);
                }}
                className="btn-primary"
              >
                <PackageCheck size={18} /> Track Order Progress
              </button>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="btn-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
