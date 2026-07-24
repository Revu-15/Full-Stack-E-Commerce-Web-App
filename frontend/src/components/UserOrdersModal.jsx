import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import {
  X, Package, Truck, CheckCircle2, Clock, FileText, AlertTriangle, ArrowRight, ShieldCheck, MapPin, User, LogOut
} from 'lucide-react';

const ORDER_STEPS = ['Pending', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

export default function UserOrdersModal() {
  const { isOrdersOpen, setIsOrdersOpen, user, openInvoiceModal, addToast, logoutUser } = useShop();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isOrdersOpen) {
      setLoading(true);
      api.fetchOrders(user?.email || '')
        .then(res => {
          if (Array.isArray(res)) {
            setOrders(res);
            if (res.length > 0) setSelectedOrder(res[0]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.warn('Could not fetch user orders:', err);
          setLoading(false);
        });
    }
  }, [isOrdersOpen, user]);

  if (!isOrdersOpen) return null;

  const handleCancelOrder = async (orderId) => {
    try {
      const updated = await api.updateOrderStatus(orderId, 'Cancelled', 'Cancelled by customer');
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(updated);
      addToast('Order has been cancelled.', 'info');
    } catch (err) {
      addToast('Failed to cancel order.', 'error');
    }
  };

  const getStepIndex = (status) => {
    const idx = ORDER_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 215,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={() => setIsOrdersOpen(false)}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>My Orders & Account History</h3>
          </div>
          <button onClick={() => setIsOrdersOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.75rem' }}>
          
          {/* Orders List Sidebar */}
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Your Orders ({orders.length})
            </h4>

            {loading ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <Package size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No orders placed yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '480px', overflowY: 'auto' }}>
                {orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: selectedOrder?.id === order.id ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                      border: selectedOrder?.id === order.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.83rem' }}>
                      <span>{order.orderId}</span>
                      <span>${order.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {order.orderDate}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '0.4rem',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : '#e0e7ff',
                      color: order.status === 'Delivered' ? '#166534' : order.status === 'Cancelled' ? '#991b1b' : '#3730a3'
                    }}>
                      {order.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Order Track Details */}
          <div>
            {selectedOrder ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Order Summary Strip */}
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 900 }}>Order #{selectedOrder.orderId}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracking #: {selectedOrder.trackingNumber}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => openInvoiceModal(selectedOrder)}
                      style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <FileText size={14} /> View Invoice
                    </button>

                    {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        style={{ background: '#fee2e2', color: '#ef4444', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.78rem' }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Real-time Order Tracker Stepper */}
                {selectedOrder.status !== 'Cancelled' ? (
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                      Live Order Tracking Progress
                    </h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      {ORDER_STEPS.map((stepName, idx) => {
                        const currentIdx = getStepIndex(selectedOrder.status);
                        const isDone = idx <= currentIdx;
                        return (
                          <div key={stepName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isDone ? '#16a34a' : 'var(--bg-secondary)',
                              color: isDone ? '#fff' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              border: isDone ? 'none' : '1px solid var(--border-color)'
                            }}>
                              {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: isDone ? 800 : 500, color: isDone ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'center' }}>
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#991b1b', fontSize: '0.85rem', fontWeight: 700 }}>
                    ⚠️ This order was cancelled. Refund processed to original payment method.
                  </div>
                )}

                {/* Items in Order */}
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Items Purchased ({selectedOrder.items?.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Qty: {item.quantity} | Price: ${item.price.toFixed(2)}</span>
                        </div>
                        <span style={{ fontWeight: 900 }}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select an order from the list to view tracking information.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
