'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { X, ShieldCheck, CreditCard, CheckCircle, Truck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'ADDRESS' | 'PAYMENT' | 'CONFIRMATION'>('ADDRESS');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'customer@luxecart.com',
    phone: '+1 234 567 8900',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
  });
  const [paymentGateway, setPaymentGateway] = useState<'STRIPE' | 'RAZORPAY' | 'COD'>('STRIPE');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);
  const total = subtotal * 1.08; // subtotal + tax

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PAYMENT');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setStep('CONFIRMATION');
      onOrderSuccess(generatedOrderId);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white z-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Stepper */}
        <div className="flex items-center justify-center gap-4 mb-8 text-xs font-bold uppercase tracking-wider">
          <span className={`px-3 py-1 rounded-full ${step === 'ADDRESS' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
            1. Address
          </span>
          <span className="text-gray-600">—</span>
          <span className={`px-3 py-1 rounded-full ${step === 'PAYMENT' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
            2. Payment
          </span>
          <span className="text-gray-600">—</span>
          <span className={`px-3 py-1 rounded-full ${step === 'CONFIRMATION' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}>
            3. Order Placed
          </span>
        </div>

        {/* Step 1: Shipping Address Form */}
        {step === 'ADDRESS' && (
          <form onSubmit={handleSubmitAddress} className="space-y-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-400" />
              <span>Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full gradient-btn text-white font-bold py-3 rounded-xl mt-6 text-xs uppercase tracking-wider"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {/* Step 2: Payment Gateway Selection */}
        {step === 'PAYMENT' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              <span>Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setPaymentGateway('STRIPE')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentGateway === 'STRIPE' ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="font-extrabold text-sm text-purple-300">Stripe</span>
                <span className="text-[10px] text-gray-400">Credit / Debit Card</span>
              </div>

              <div
                onClick={() => setPaymentGateway('RAZORPAY')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentGateway === 'RAZORPAY' ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="font-extrabold text-sm text-indigo-300">Razorpay</span>
                <span className="text-[10px] text-gray-400">UPI / NetBanking / Wallet</span>
              </div>

              <div
                onClick={() => setPaymentGateway('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentGateway === 'COD' ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="font-extrabold text-sm text-emerald-300">Cash on Delivery</span>
                <span className="text-[10px] text-gray-400">Pay upon delivery</span>
              </div>
            </div>

            {/* Order Total Summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Items ({items.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping & Tax</span>
                <span>${(total - subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-white text-sm pt-2 border-t border-white/10">
                <span>Total Payable</span>
                <span className="text-purple-300">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('ADDRESS')}
                className="w-1/3 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl text-xs"
              >
                Back
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-2/3 gradient-btn text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 'CONFIRMATION' && (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Order Successfully Placed!</h2>
            <p className="text-xs text-gray-300 max-w-sm mx-auto">
              Thank you for shopping at LuxeCart! Confirmation email & tracking links have been sent to <strong>{formData.email}</strong>.
            </p>

            <button
              onClick={onClose}
              className="gradient-btn text-white font-bold py-3 px-8 rounded-full text-xs mt-4"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
