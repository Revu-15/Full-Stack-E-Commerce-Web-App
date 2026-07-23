'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User, ShieldCheck, Sparkles, Menu, X, Package } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/services/api';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (slug: string) => void;
  selectedCategory: string;
  onOpenCart: () => void;
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  user: { name: string; email: string; role: 'CUSTOMER' | 'ADMIN' } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  selectedCategory,
  onOpenCart,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  user,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 shadow-2xl transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-xs text-black font-extrabold py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-amber-500/20">
        <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
        <span><strong>NexPrime Sale Live!</strong> Get <strong>FREE 1-Day Delivery</strong> & Extra 30% OFF with code <strong>NEX30</strong></span>
        <ShieldCheck className="w-3.5 h-3.5 text-black ml-2" />
        <span className="hidden md:inline">100% Amazon-Grade Protection</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-black font-extrabold" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-amber-400">NexCart</span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-400 font-bold -mt-1">Everything You Need</span>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-lg relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Mobiles, Laptops, Fashion, Grocery..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (e.target.value.trim().length > 0) {
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-white/10 rounded-full px-2 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wishlist */}
          <button 
            onClick={onOpenDashboard}
            className="relative p-2.5 rounded-full hover:bg-white/5 text-gray-300 hover:text-amber-400 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Orders Link */}
          <button
            onClick={onOpenDashboard}
            className="hidden lg:flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-amber-400 p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Your Orders"
          >
            <Package className="w-4.5 h-4.5 text-amber-400" />
            <span>Orders</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full hover:bg-white/5 text-gray-300 hover:text-amber-400 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-md shadow-amber-500/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Controls: Login / Sign Up */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-3.5 text-xs text-amber-200 transition-colors"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="max-w-[100px] truncate font-medium">{user.name}</span>
              </button>
              {user.role === 'ADMIN' && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:inline-flex bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-full py-1.5 px-3 text-xs font-semibold"
                >
                  Admin
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('LOGIN')}
                className="text-xs font-bold text-gray-300 hover:text-white px-3 py-2 rounded-full border border-white/10 hover:border-amber-500/40 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('REGISTER')}
                className="nex-btn-gradient text-xs font-extrabold py-2 px-4 rounded-full shadow-lg shadow-amber-500/20"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 12 Categories Quick Nav Bar */}
      <div className="overflow-x-auto bg-black/40 border-t border-white/5 py-2 px-4 no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
              selectedCategory === 'all' ? 'bg-amber-500 text-black font-extrabold' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            All Items
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                selectedCategory === cat.slug ? 'bg-amber-500 text-black font-extrabold' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
