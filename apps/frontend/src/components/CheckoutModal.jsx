import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  X, MapPin, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Tag, Smartphone, Building2, Truck, QrCode, ExternalLink
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
    name: user?.name || 'Revanth Polamreddy',
    email: user?.email || 'revanth@nexcart.com',
    phone: user?.phone || '+91 98765 43210',
    street: 'Plot No. 42, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500033',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | Cash on Delivery | Credit Card | Net Banking
  const [upiId, setUpiId] = useState('revanth@okaxis');
  const [utrNumber, setUtrNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!isCheckoutOpen) return null;

  // NexCart Retail Official Bank & UPI Details
  const NEXCART_RETAIL_ACCOUNT = {
    accountName: 'NexCart Retail Private Limited',
    upiId: 'nexcart.retail@upi',
    bankName: 'HDFC Bank',
    accountNumber: '50200084920194',
    ifscCode: 'HDFC0001234',
    branch: 'Jubilee Hills, Hyderabad'
  };

  // Generate UPI Deep Link
  const upiDeepLink = `upi://pay?pa=${NEXCART_RETAIL_ACCOUNT.upiId}&pn=${encodeURIComponent(NEXCART_RETAIL_ACCOUNT.accountName)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent('NexCart Order Payment')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiDeepLink)}`;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      // Process payment
      let paymentRes = null;
      if (paymentMethod !== 'Cash on Delivery') {
        paymentRes = await api.processPayment({
          paymentMethod,
          amount: cartTotal,
          upiId,
          utrNumber: utrNumber || `UTR${Date.now().toString().slice(-8)}`
        });
      }

      // Submit order
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
        discountAmount,
        shippingFee,
        tax: taxAmount,
        totalAmount: cartTotal,
        customer: { name: shippingAddress.name, email: shippingAddress.email, phone: shippingAddress.phone },
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        utrNumber: utrNumber || (paymentRes ? paymentRes.transactionId : null)
      };

      const newOrder = await api.submitOrder(orderPayload);

      addToast(`Order ${newOrder.id || 'NEX-849201'} placed successfully!`, 'success');
      clearCart();
      setIsCheckoutOpen(false);

      // Open Invoice
      setTimeout(() => {
        openInvoiceModal(newOrder);
      }, 500);

    } catch (err) {
      addToast(err.message || 'Order placement failed. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 210,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
      }}
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
          maxWidth: '850px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="#16a34a" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>NexCart Express Secure Checkout</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Encrypted UPI, Cards & Net Banking Payment</p>
            </div>
          </div>
          <button onClick={() => setIsCheckoutOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
          {[
            { id: 1, label: '1. Shipping Address' },
            { id: 2, label: '2. Payment Method (UPI / Bank)' },
            { id: 3, label: '3. Order Summary & Confirm' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              style={{
                flex: 1, padding: '0.75rem', fontSize: '0.82rem', fontWeight: 800,
                borderBottom: step === s.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                color: step === s.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                background: step === s.id ? 'var(--bg-secondary)' : 'transparent',
                textAlign: 'center'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Body Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Delivery Shipping Address</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" value={shippingAddress.name} onChange={e => setShippingAddress({ ...shippingAddress, name: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Mobile Number</label>
                  <input type="text" value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Street Address & Flat / House No.</label>
                  <input type="text" value={shippingAddress.street} onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>City</label>
                  <input type="text" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>State</label>
                  <input type="text" value={shippingAddress.state} onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>PIN / Zip Code</label>
                  <input type="text" value={shippingAddress.zip} onChange={e => setShippingAddress({ ...shippingAddress, zip: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Country</label>
                  <input type="text" value={shippingAddress.country} onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }} />
                </div>
              </div>

              <button onClick={() => setStep(2)} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 800, marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span>Proceed to Payment (₹{cartTotal})</span> <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD (UPI / BANK TRANSFER TO NEXCART RETAIL) */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Select Payment Method</h4>

              {/* Payment Method Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {[
                  { id: 'UPI', label: 'UPI / PhonePe / GPay', icon: Smartphone },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', icon: Truck },
                  { id: 'Credit Card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'Net Banking', label: 'Net Banking', icon: Building2 }
                ].map(m => {
                  const Icon = m.icon;
                  const isSel = paymentMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        padding: '1rem', borderRadius: 'var(--radius-md)', border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        background: isSel ? 'var(--bg-secondary)' : 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem'
                      }}
                    >
                      <Icon size={20} color={isSel ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isSel ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{m.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* UPI TRANSFER TO NEXCART RETAIL ACCOUNT */}
              {paymentMethod === 'UPI' && (
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Account Box */}
                  <div style={{ background: '#0f172a', color: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>Official NexCart Retail Receiving Account</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '0.2rem' }}>{NEXCART_RETAIL_ACCOUNT.accountName}</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.75rem', fontSize: '0.82rem', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
                      <div><span style={{ color: '#94a3b8' }}>UPI VPA ID:</span> <strong style={{ color: '#f59e0b' }}>{NEXCART_RETAIL_ACCOUNT.upiId}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Bank Name:</span> <strong>{NEXCART_RETAIL_ACCOUNT.bankName}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Account No:</span> <strong>{NEXCART_RETAIL_ACCOUNT.accountNumber}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>IFSC Code:</span> <strong>{NEXCART_RETAIL_ACCOUNT.ifscCode}</strong></div>
                    </div>
                  </div>

                  {/* QR Code & Deep Link */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '160px', height: '160px' }} />
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>Scan to Pay ₹{cartTotal}</div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <a
                        href={upiDeepLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)',
                          fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'
                        }}
                      >
                        <Smartphone size={18} /> Open PhonePe / GPay / Paytm (Pay ₹{cartTotal}) <ExternalLink size={14} />
                      </a>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Enter Your Customer UPI ID / VPA</label>
                        <input
                          type="text"
                          placeholder="e.g. yourname@okaxis, 9876543210@paytm"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Enter 12-Digit UTR / Payment Ref No. (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. 420918492019"
                          value={utrNumber}
                          onChange={e => setUtrNumber(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              <button onClick={() => setStep(3)} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span>Review & Confirm Order</span> <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 3: ORDER SUMMARY & CONFIRM */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Review Order Summary</h4>

              {/* Delivery info summary */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div><strong>Deliver To:</strong> {shippingAddress.name} ({shippingAddress.phone})</div>
                <div style={{ color: 'var(--text-muted)' }}>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}, {shippingAddress.country}</div>
                <div style={{ marginTop: '0.4rem' }}><strong>Payment:</strong> {paymentMethod} {paymentMethod === 'UPI' && `(NexCart Retail VPA: ${NEXCART_RETAIL_ACCOUNT.upiId})`}</div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '200px', overflowY: 'auto' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700 }}>{item.title} (x{item.quantity})</div>
                    <div style={{ fontWeight: 900, color: 'var(--accent-primary)' }}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              {/* Cost Table */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span>₹{cartSubtotal}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping:</span><span>₹0 (Free Express)</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.3rem' }}>
                  <span>Grand Total Amount:</span><span style={{ color: 'var(--accent-primary)' }}>₹{cartTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#ffffff', padding: '0.85rem',
                  borderRadius: 'var(--radius-md)', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={20} />
                <span>{isPlacingOrder ? 'Processing Payment & Creating Order...' : `Pay ₹${cartTotal} & Complete Order`}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
