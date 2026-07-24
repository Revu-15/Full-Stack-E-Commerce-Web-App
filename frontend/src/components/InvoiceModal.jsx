import React from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { X, Printer, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function InvoiceModal() {
  const { isInvoiceOpen, setIsInvoiceOpen, activeInvoiceOrder } = useShop();

  if (!isInvoiceOpen || !activeInvoiceOrder) return null;

  const order = activeInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 230,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={() => setIsInvoiceOpen(false)}
    >
      <div
        style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Buttons Header */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={handlePrint}
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
          >
            <Printer size={16} /> Print / Save PDF Invoice
          </button>
          <button onClick={() => setIsInvoiceOpen(false)} style={{ color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* INVOICE DOCUMENT BODY */}
        <div id="printable-invoice">
          
          {/* Header Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} />
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.4rem', color: '#1e293b' }}>
                  NexCart Retail
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                NexCart E-Commerce Platform Inc.<br />
                742 Evergreen Terrace, San Francisco, CA 94107<br />
                GSTIN / Tax ID: 27AABCN8941N1ZB
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TAX INVOICE</h2>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.3rem' }}>Invoice #: INV-{order.orderId}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date: {order.orderDate}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Status: <strong style={{ color: '#16a34a' }}>{order.paymentStatus || 'Paid'}</strong></div>
            </div>
          </div>

          {/* Customer & Order Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
            <div>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Billed To / Shipping Address</h4>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{order.customer?.name}</div>
              <div style={{ color: '#475569', marginTop: '0.2rem' }}>{order.shippingAddress?.street}</div>
              <div style={{ color: '#475569' }}>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</div>
              <div style={{ color: '#475569' }}>Phone: {order.customer?.phone}</div>
              <div style={{ color: '#475569' }}>Email: {order.customer?.email}</div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Order Details</h4>
              <div><strong>Order ID:</strong> {order.orderId}</div>
              <div><strong>Tracking Number:</strong> {order.trackingNumber}</div>
              <div><strong>Expected Delivery:</strong> {order.expectedDelivery}</div>
              <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', fontWeight: 800 }}>#</th>
                <th style={{ padding: '0.75rem', fontWeight: 800 }}>Item Description</th>
                <th style={{ padding: '0.75rem', fontWeight: 800, textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.75rem', fontWeight: 800, textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '0.75rem', fontWeight: 800, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                    {item.title}
                    {item.selectedColor && <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Color: {item.selectedColor}</span>}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}>
                  <span>Discount:</span>
                  <span>-${order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Shipping:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee?.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Estimated Tax:</span>
                <span>${order.tax?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, borderTop: '2px solid #0f172a', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                <span>Grand Total:</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
            Thank you for shopping with <strong>NexCart</strong>! For support or returns, visit https://nexcart.com/support or call 1-800-NEXCART.
          </div>

        </div>

      </div>
    </div>
  );
}
