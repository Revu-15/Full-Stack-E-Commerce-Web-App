'use client';

import React, { useState } from 'react';
import { CartItem } from '@/types';
import { X, Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (couponCode?: string, discountAmount?: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product.discountPrice || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shippingFee = subtotal > 1500 || items.length === 0 ? 0 : 99;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.18);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'NEX30') {
      setAppliedCoupon({ code: 'NEX30', discountPercent: 30 });
      setCouponError('');
    } else if (code === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discountPercent: 10 });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try NEX30 or WELCOME10.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl text-white">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                <ShoppingBag className="w-5 h-5 text-black font-bold" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">Your Cart</h2>
                <p className="text-xs text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-300">Your cart is empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mt-1">Explore our catalog and discover items with free NexPrime delivery.</p>
                <button
                  onClick={onClose}
                  className="mt-6 nex-btn-gradient text-black text-xs font-bold py-2.5 px-6 rounded-full"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-black/40 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-gray-200 truncate">{item.product.name}</h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-500 hover:text-pink-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-400 font-bold mt-0.5">₹{price.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/10">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-white">
                          ₹{(price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
              {/* Coupon Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon code (NEX30)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 text-xs font-semibold px-4 rounded-xl border border-white/10 transition-colors text-amber-300"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)
                  </span>
                  <button 
                    onClick={() => setAppliedCoupon(null)}
                    className="text-gray-400 hover:text-white text-[10px] underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p className="text-[11px] text-pink-400">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-base text-amber-300">₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onProceedToCheckout(appliedCoupon?.code, discountAmount)}
                className="w-full nex-btn-gradient text-black font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-amber-500/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-black font-bold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
