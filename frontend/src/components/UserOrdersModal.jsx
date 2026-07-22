import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { fetchOrders, fetchOrderById } from '../services/api.js';
import { X, Package, Clock, Truck, CheckCircle2, Search, ArrowRight, RefreshCw } from 'lucide-react';

export default function UserOrdersModal() {
  const { isOrdersOpen, setIsOrdersOpen } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isOrdersOpen) return;

    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data || []);
        if (data && data.length > 0) {
          setSelectedOrder(data[0]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isOrdersOpen]);

  if (!isOrdersOpen) return null;

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.customer && o.customer.email && o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('order placed') || s.includes('pending')) return 0;
    if (s.includes('processing')) return 1;
    if (s.includes('shipped') || s.includes('transit')) return 2;
    if (s.includes('delivered')) return 3;
    return 1;
  };

  return (
    <div className="modal-overlay" onClick={() => setIsOrdersOpen(false)}>
      <div
        className="glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Orders & Tracking</h3>
          </div>
          <button onClick={() => setIsOrdersOpen(false)} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Content Layout: Orders List Sidebar + Order Detail View */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>
          
          {/* Left Orders List */}
          <div style={{
            borderRight: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Search Input */}
            <div style={{ padding: '0.85rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Order or tracking #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.5rem 0.5rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)'
                  }}
                />
                <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.85rem 0.85rem 0.85rem' }}>
              {loading ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No orders found</p>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = selectedOrder && selectedOrder.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--bg-surface)' : 'transparent',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.orderNumber}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}</span>
                        <span className="badge badge-stock" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{order.status}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Selected Order Details & Tracking Stepper */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {selectedOrder ? (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Order #{selectedOrder.orderNumber}</h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Tracking Number: <strong style={{ color: 'var(--text-primary)' }}>{selectedOrder.trackingNumber}</strong>
                    </span>
                  </div>
                  <span className="badge badge-stock" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    Status: {selectedOrder.status}
                  </span>
                </div>

                {/* Tracking Progress Timeline */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Fulfillment Timeline</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', position: 'relative' }}>
                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((stepLabel, idx) => {
                      const activeIndex = getStatusStepIndex(selectedOrder.status);
                      const isComplete = idx <= activeIndex;
                      return (
                        <div key={stepLabel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isComplete ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            boxShadow: isComplete ? 'var(--shadow-glow)' : 'none'
                          }}>
                            {isComplete ? <CheckCircle2 size={18} /> : idx + 1}
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: isComplete ? 700 : 500, color: isComplete ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {stepLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items Breakdown */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Items in this Order</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.title}</h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontWeight: 600 }}>Total Paid:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <Package size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Select an order from the list to view tracking details.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
