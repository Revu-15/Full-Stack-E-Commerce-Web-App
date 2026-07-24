'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, MapPin, CreditCard, Shield, Truck, ChevronRight,
  Plus, Edit2, Check, ArrowRight, Lock, Building2, Smartphone, QrCode
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Address, CartItem, PaymentMethod } from '@/types';
import { MOCK_PRODUCTS } from '@/services/api';

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    street: 'Flat 402, Sunshine Apartments, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560001',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Rahul Sharma (Work)',
    phone: '+91 98765 43210',
    street: 'Tech Park Tower B, 5th Floor, Outer Ring Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560103',
    country: 'India',
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [selectedAddrId, setSelectedAddrId] = useState(DEFAULT_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [netBank, setNetBank] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Sample items in checkout
  const items: CartItem[] = [
    { id: 'c1', product: MOCK_PRODUCTS[0], quantity: 1 },
    { id: 'c2', product: MOCK_PRODUCTS[4], quantity: 1 },
  ];

  const subtotal = items.reduce((s, i) => s + (i.product.discountPrice || i.product.price) * i.quantity, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    const id = `NEX-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderId(id);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans justify-center items-center p-6">
        <div className="glass-panel p-10 rounded-3xl border border-white/10 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Order Placed Successfully!</h1>
            <p className="text-gray-400 text-sm mt-1">Thank you for shopping with NexCart.</p>
          </div>

          <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-2 text-left text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Order ID:</span>
              <span className="font-mono text-amber-400 font-bold">{placedOrderId}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Total Amount:</span>
              <span className="text-white font-bold">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Payment Mode:</span>
              <span className="text-gray-200">{paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Expected Delivery:</span>
              <span className="text-green-400 font-semibold">3-5 Business Days</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link href={`/orders/${placedOrderId}`} className="w-full block nex-btn-gradient py-3 rounded-xl font-bold text-sm">
              Track Order & View Invoice
            </Link>
            <Link href="/" className="w-full block py-3 rounded-xl border border-white/15 text-gray-300 font-bold text-sm hover:bg-white/5 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedAddr = addresses.find((a) => a.id === selectedAddrId) || addresses[0];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      <header className="border-b border-white/10 bg-[#0d0e14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-black font-black text-xl">
              N
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Nex<span className="text-amber-400">Cart</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-4 h-4 text-green-400" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-center max-w-2xl mx-auto mb-10">
          {(['address', 'payment', 'review'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(s)}
                className={`flex items-center gap-2 text-sm font-bold capitalize transition-colors ${step === s ? 'text-amber-400' : 'text-gray-500'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${step === s ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/15 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span>{s}</span>
              </button>
              {i < 2 && <div className="w-16 sm:w-24 h-0.5 mx-2 bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === 'address' && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" /> Select Delivery Address
                </h2>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddrId(addr.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAddrId === addr.id ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-white text-sm">{addr.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Phone: {addr.phone}</div>
                        </div>
                        {selectedAddrId === addr.id && (
                          <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="nex-btn-gradient w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2"
                >
                  Deliver to This Address <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" /> Choose Payment Method
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: QrCode },
                    { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                    { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
                    { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
                    { id: 'COD', label: 'Cash on Delivery', icon: Truck },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id as PaymentMethod)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center text-xs font-bold transition-all ${paymentMethod === id ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Specific form inputs based on method */}
                {paymentMethod === 'UPI' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-gray-300">Enter UPI ID (e.g. name@okhdfcbank)</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                )}

                {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
                  <div className="space-y-3 pt-2">
                    <input
                      type="text"
                      placeholder="Card Number (16 digits)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={16}
                      className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                    ℹ️ Pay with Cash or UPI QR Code at the time of delivery.
                  </div>
                )}

                <button
                  onClick={() => setStep('review')}
                  className="nex-btn-gradient w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2"
                >
                  Continue to Order Review <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 'review' && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                <h2 className="text-lg font-bold text-white">Review Your Order</h2>

                {/* Selected Address Summary */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Delivering To</span>
                    <button onClick={() => setStep('address')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Change
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-white">{selectedAddr.name}</div>
                  <div className="text-xs text-gray-400">{selectedAddr.street}, {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.zip}</div>
                </div>

                {/* Selected Payment Summary */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Payment Mode</span>
                    <button onClick={() => setStep('payment')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Change
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-white">{paymentMethod.replace('_', ' ')}</div>
                </div>

                {/* Items Summary */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Items ({items.length})</span>
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover bg-white/5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white line-clamp-1">{item.product.name}</div>
                        <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="nex-btn-gradient w-full py-4 rounded-xl font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" /> Place Order & Pay ₹{grandTotal.toLocaleString('en-IN')}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24 space-y-4">
              <h3 className="font-bold text-white text-base">Order Details</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-green-400 font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-white text-base border-t border-white/10 pt-3 mt-2">
                  <span>Total Payable</span>
                  <span className="text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
