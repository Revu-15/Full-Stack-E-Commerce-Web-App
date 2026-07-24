'use client';

import React from 'react';
import { ArrowRight, Zap, Tag } from 'lucide-react';

interface HeroBannerProps {
  onShopNow?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white min-h-[380px] flex items-center shadow-xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 lg:p-12 w-full z-10">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-amber-300">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>TODAY'S MEGA DEAL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Flagship Mobiles & Laptops
            </h1>

            <p className="text-gray-200 text-sm sm:text-base max-w-lg leading-relaxed opacity-90">
              Get up to 30% instant cashback on iPhone 15 Pro, Samsung S24 Ultra & MacBook M3.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="bg-white text-slate-900 font-extrabold py-3 px-7 rounded-full text-sm flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-all"
              >
                <span>Explore Mobiles</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-dashed border-white/30 text-xs font-semibold">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Use Promo: <strong>NEXCART20</strong></span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform -rotate-2 hover:rotate-0 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80"
                alt="iPhone 15 Pro"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-lg">
                UP TO 30% OFF
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
