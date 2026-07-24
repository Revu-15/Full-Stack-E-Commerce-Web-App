'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Order, CartItem } from '@/types';
import { MOCK_PRODUCTS } from '@/services/api';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-849201',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'SHIPPED',
    subtotal: 134900,
    discount: 0,
    shippingFee: 0,
    tax: 24282,
    totalPrice: 159182,
    trackingId: 'TRK-992019482',
    estimatedDelivery: 'Tomorrow, 5 PM',
    paymentGateway: 'UPI',
    items: [
      { id: 'item-1', name: MOCK_PRODUCTS[0].name, image: MOCK_PRODUCTS[0].images[0], price: MOCK_PRODUCTS[0].discountPrice || MOCK_PRODUCTS[0].price, quantity: 1, productId: MOCK_PRODUCTS[0].id }
    ],
    address: {
      id: 'a1', name: 'Rahul Sharma', phone: '+91 98765 43210', street: 'Flat 402, Sunshine Apartments', city: 'Bengaluru', state: 'Karnataka', zip: '560001', country: 'India', isDefault: true
    }
  },
  {
    id: 'ORD-719302',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'DELIVERED',
    subtotal: 29990,
    discount: 1000,
    shippingFee: 0,
    tax: 5218,
    totalPrice: 34208,
    trackingId: 'TRK-10928374',
    estimatedDelivery: 'Delivered on Jul 14, 2026',
    paymentGateway: 'STRIPE',
    items: [
      { id: 'item-2', name: MOCK_PRODUCTS[10].name, image: MOCK_PRODUCTS[10].images[0], price: MOCK_PRODUCTS[10].discountPrice || MOCK_PRODUCTS[10].price, quantity: 1, productId: MOCK_PRODUCTS[10].id }
    ],
    address: {
      id: 'a1', name: 'Rahul Sharma', phone: '+91 98765 43210', street: 'Flat 402, Sunshine Apartments', city: 'Bengaluru', state: 'Karnataka', zip: '560001', country: 'India', isDefault: true
    }
  }
];

const STATUS_COLOR_MAP: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PROCESSING: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  SHIPPED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  RETURNED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(mode = 'LOGIN') => { setAuthMode(mode); setIsAuthOpen(true); }}
        onOpenDashboard={() => {}}
        onOpenAdmin={() => {}}
        onSelectProduct={() => {}}
        user={user}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-semibold">My Orders</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 flex items-center gap-3">
          <Package className="w-7 h-7 text-amber-400" />
          My Orders & Order History
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-amber-400/60" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">No Orders Placed Yet</h2>
            <p className="text-gray-400 text-sm mb-8">When you place an order, it will appear here.</p>
            <Link href="/" className="nex-btn-gradient px-8 py-3 rounded-xl font-bold">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="glass-card rounded-2xl border border-white/10 p-6 space-y-5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-amber-400 font-bold text-base">{order.id}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLOR_MAP[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      Track Order & Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                        <div className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')} each</div>
                      </div>
                      <div className="text-sm font-extrabold text-white shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
                  <div className="text-gray-400">
                    Expected Delivery: <span className="text-green-400 font-bold">{order.estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="text-base font-extrabold text-white">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
        onProceedToCheckout={() => setIsCartOpen(false)}
      />
      <AuthModal isOpen={isAuthOpen} initialTab={authMode} onClose={() => setIsAuthOpen(false)} onLoginSuccess={(u) => setUser(u)} />
      <Footer />
    </div>
  );
}
