'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Package, ChevronRight, Truck, CheckCircle, Clock, MapPin, CreditCard,
  Printer, ArrowLeft, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Order, CartItem } from '@/types';
import { MOCK_PRODUCTS } from '@/services/api';

const ORDER_TIMELINE = [
  { status: 'PENDING', label: 'Order Placed', time: 'Jul 22, 10:30 AM', done: true },
  { status: 'CONFIRMED', label: 'Order Confirmed', time: 'Jul 22, 10:32 AM', done: true },
  { status: 'PROCESSING', label: 'Packed & Ready', time: 'Jul 23, 08:00 AM', done: true },
  { status: 'SHIPPED', label: 'In Transit / Shipped', time: 'Jul 23, 02:15 PM', done: true },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', time: 'Expected Jul 24, 09:00 AM', done: false },
  { status: 'DELIVERED', label: 'Delivered', time: 'Expected Jul 24, 05:00 PM', done: false },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockOrder: Order = {
    id: orderId || 'ORD-849201',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'SHIPPED',
    subtotal: 134900,
    discount: 10000,
    shippingFee: 0,
    tax: 22482,
    totalPrice: 147382,
    trackingId: 'TRK-NEX-992019482',
    estimatedDelivery: 'Tomorrow, by 5:00 PM',
    paymentGateway: 'UPI',
    couponCode: 'NEXSAVE10',
    items: [
      { id: 'i1', name: MOCK_PRODUCTS[0].name, image: MOCK_PRODUCTS[0].images[0], price: MOCK_PRODUCTS[0].discountPrice || MOCK_PRODUCTS[0].price, quantity: 1, productId: MOCK_PRODUCTS[0].id }
    ],
    address: {
      id: 'a1', name: 'Rahul Sharma', phone: '+91 98765 43210', street: 'Flat 402, Sunshine Apartments, MG Road', city: 'Bengaluru', state: 'Karnataka', zip: '560001', country: 'India', isDefault: true
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      <div className="print:hidden">
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
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 print:hidden">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/orders" className="hover:text-amber-400">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-semibold">{mockOrder.id}</span>
        </nav>

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              Order Details: <span className="font-mono text-amber-400">{mockOrder.id}</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Placed on {new Date(mockOrder.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="flex gap-3 print:hidden">
            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Download / Print Invoice
            </button>
          </div>
        </div>

        {/* Visual Tracking Timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" /> Live Tracking Timeline
          </h2>

          <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
            {ORDER_TIMELINE.map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border z-10 transition-all ${step.done ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-gray-500 border-white/15'}`}>
                  {step.done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <div className={`text-xs font-bold ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.label}</div>
                  <div className="text-[11px] text-gray-400">{step.time}</div>
                </div>
              </div>
            ))}
          </div>

          {mockOrder.trackingId && (
            <div className="p-3 bg-black/30 rounded-xl border border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span>Courier Tracking Code: <strong className="font-mono text-amber-400">{mockOrder.trackingId}</strong></span>
              <span className="text-green-400 font-semibold">NexPrime Express Delivery</span>
            </div>
          )}
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Items Purchased */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="font-bold text-white text-base">Items Purchased</h2>
            <div className="space-y-4">
              {mockOrder.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                    <div className="text-xs text-gray-400 mt-1">Quantity: {item.quantity} • Price: ₹{item.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Summary */}
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" /> Delivery Address
              </h3>
              <div className="text-xs text-gray-300 space-y-1">
                <div className="font-semibold text-white">{mockOrder.address.name}</div>
                <div>{mockOrder.address.street}</div>
                <div>{mockOrder.address.city}, {mockOrder.address.state} - {mockOrder.address.zip}</div>
                <div className="text-gray-500 mt-1">Phone: {mockOrder.address.phone}</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" /> Payment & Billing
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{mockOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {mockOrder.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({mockOrder.couponCode})</span>
                    <span>-₹{mockOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST (18%)</span>
                  <span className="text-white">₹{mockOrder.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-white text-sm border-t border-white/10 pt-2 mt-2">
                  <span>Total Paid</span>
                  <span className="text-amber-400">₹{mockOrder.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={() => {}} onRemoveItem={() => {}} onProceedToCheckout={() => {}} />
        <AuthModal isOpen={isAuthOpen} initialTab={authMode} onClose={() => setIsAuthOpen(false)} onLoginSuccess={(u) => setUser(u)} />
        <Footer />
      </div>
    </div>
  );
}
