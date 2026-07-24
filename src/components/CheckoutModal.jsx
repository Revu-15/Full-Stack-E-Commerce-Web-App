import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  X, MapPin, CreditCard, DollarSign, CheckCircle2, ArrowRight, ShieldCheck, Tag, Smartphone, Building2, Truck
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen, setIsCheckoutOpen,
    cart, clearCart,
    cartSubtotal, discountAmount, shippingFee, taxAmount, cartTotal,
    appliedCoupon, user, addToast, setIsOrdersOpen, openInvoiceModal
  } = useShop();

  const [step, setStep] = useState(1); // 1: Address | 2: Payment | 3: Review
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || 'Customer Name',
    email: user?.email || 'customer@nexcart.com',
    phone: user?.phone || '+1 (555) 0199',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // COD | UPI | Credit Card | Net Banking
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      // 1. Process simulated payment if digital
      if (paymentMethod !== 'Cash on Delivery') {
        await api.processPayment({
          paymentMethod,
          amount: cartTotal,
          details: paymentMethod === 'UPI' ? { upiId } : paymentMethod === 'Credit Card' ? { cardLast4: cardDetails.number.slice(-4) } : { bank: selectedBank }
        });
      }

      // 2. Submit order to backend REST API
      const orderPayload = {
        items: cart.map(i => ({
          id: i.id,
          title: i.title,
          category: i.category,
          price: i.price,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
          image: i.images?.[0]
        })),
        subtotal: cartSubtotal,
        discountAmount: discountAmount,
        shippingFee: shippingFee,
        tax: taxAmount,
        totalAmount: cartTotal,
        customer: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          phone: shippingAddress.phone
        },
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country
        },
        paymentMethod
      };

      const createdOrder = await api.submitOrder(orderPayload);

      clearCart();
      setIsCheckoutOpen(false);
      addToast(`Order placed successfully! Order ID: ${createdOrder.orderId}`, 'success');

      // Automatically open User Orders / Invoice view
      openInvoiceModal(createdOrder);
      setIsOrdersOpen(true);
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Steps Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>NexCart Checkout</h3>
          <button onClick={() => setIsCheckoutOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Checkout Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 1, title: '1. Shipping Address' },
            { id: 2, title: '2. Payment Method' },
            { id: 3, title: '3. Order Summary' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              style={{
                fontWeight: step === s.id ? 800 : 500,
                color: step === s.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.88rem'
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* STEP 1: SHIPPING ADDRESS */}
        {step === 1 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={18} style={{ color: 'var(--accent-primary)' }} /> Enter Shipping Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Email Address</label>
                <input
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Phone Number</label>
                <input
                  type="text"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>State & ZIP Code</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: 800, float: 'right', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Continue to Payment <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT METHODS */}
        {step === 2 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} /> Select Payment Option
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', desc: 'Pay with cash upon arrival at your doorstep', icon: DollarSign },
                { id: 'UPI', label: 'UPI / QR Payment', desc: 'Google Pay, PhonePe, Paytm, BHIM UPI', icon: Smartphone },
                { id: 'Credit Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, American Express', icon: CreditCard },
                { id: 'Net Banking', label: 'Net Banking', desc: 'Select from major supported banks', icon: Building2 }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input type="radio" checked={isSelected} onChange={() => setPaymentMethod(method.id)} />
                    <Icon size={22} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{method.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{method.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Sub-inputs for digital payment */}
            {paymentMethod === 'UPI' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Enter VPA / UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                />
              </div>
            )}

            {paymentMethod === 'Credit Card' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8910"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Review Order <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUMMARY & PLACE ORDER */}
        {step === 3 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} style={{ color: '#16a34a' }} /> Review & Confirm Order
            </h4>

            {/* Items Summary Table */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span>{item.title} (x{item.quantity})</span>
                  <span style={{ fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}><span>Discount</span><span>-${discountAmount.toFixed(2)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>${taxAmount.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <span>Total Payable</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(2)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  padding: '0.8rem 2.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                }}
              >
                {isPlacingOrder ? 'Processing Order...' : `Pay & Place Order ($${cartTotal.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
