'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/10 text-gray-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShoppingBag className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-yellow-400 -webkit-background-clip-text text-transparent">NexCart</span>
          </div>
          <p className="text-xs leading-relaxed font-light">
            Production-grade full-stack Amazon-like e-commerce platform built with Next.js 15, TypeScript, Express & PostgreSQL.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit SSL Encrypted & Stripe / Razorpay Secured</span>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-purple-300 transition-colors">Audio & Acoustics</a></li>
            <li><a href="#" className="hover:text-purple-300 transition-colors">Smart Devices & Wearables</a></li>
            <li><a href="#" className="hover:text-purple-300 transition-colors">Luxury Timepieces</a></li>
            <li><a href="#" className="hover:text-purple-300 transition-colors">Performance Footwear</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-purple-300 transition-colors">Order Status & Tracking</a></li>
            <li><a href="#" className="hover:text-purple-300 transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-purple-300 transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-purple-300 transition-colors">Swagger API Documentation</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Join VIP Newsletter</h4>
          <p className="text-xs font-light">Subscribe to receive exclusive access to limited product drops & discounts.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="gradient-btn text-white p-2.5 rounded-xl shadow-lg shadow-purple-600/30">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>© 2026 LuxeCart Platform. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-current inline" /> for production e-commerce.
        </p>
      </div>
    </footer>
  );
};
