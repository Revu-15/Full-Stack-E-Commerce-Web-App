'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 border-b border-white/10">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Copy */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>NexCart — Amazon-Scale Everything Store</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Order <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-8">Anything</span>, Delivered Fast to Your Doorstep.
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Shop millions of products with NexPrime 1-Day Free Shipping, instant checkout, verified reviews, and 24/7 buyer protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onShopNow}
              className="w-full sm:w-auto gradient-btn text-white font-semibold py-3.5 px-8 rounded-full flex items-center justify-center gap-3 text-sm shadow-xl shadow-purple-600/30 group"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#featured"
              className="w-full sm:w-auto glass-panel hover:bg-white/10 text-gray-200 font-semibold py-3.5 px-8 rounded-full text-center text-sm border border-white/10 transition-colors"
            >
              View Featured
            </a>
          </div>

          {/* Feature Badges */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Express Delivery</h4>
                <p className="text-[10px] text-gray-400">Free over $150</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Authentic Warranty</h4>
                <p className="text-[10px] text-gray-400">100% Certified</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Easy Returns</h4>
                <p className="text-[10px] text-gray-400">30-Day Money Back</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Instant Support</h4>
                <p className="text-[10px] text-gray-400">24/7 Live Assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Image Card */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden glass-card p-3 shadow-2xl border border-white/15">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
              alt="Apex ANC Studio Headphones"
              className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
            />
            {/* Floating Offer Badge */}
            <div className="absolute top-6 right-6 glass-panel px-4 py-2 rounded-2xl border border-purple-500/30 text-right shadow-lg">
              <span className="block text-xs font-semibold text-purple-300">Featured Highlight</span>
              <span className="text-lg font-extrabold text-white">₹24,999 <span className="text-xs text-gray-400 line-through">₹29,999</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
