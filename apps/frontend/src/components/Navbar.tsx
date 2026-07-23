'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User, SlidersHorizontal, ShieldCheck, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  user: { name: string; email: string; role: 'CUSTOMER' | 'ADMIN' } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
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
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 text-xs text-purple-200 py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-purple-500/20">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        <span>Summer Sale Live! Get up to <strong>30% OFF</strong> luxury acoustics & smart wearables with code <strong>LUXE30</strong></span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-2" />
        <span className="hidden md:inline text-emerald-300">Verified Authentic</span>
      </div>

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
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">LuxeCart</span>
              <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-semibold -mt-1">Luxury E-Store</span>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-lg relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search luxury acoustic gear, smart watches, sneakers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
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
          {/* Wishlist Icon */}
          <button 
            className="relative p-2.5 rounded-full hover:bg-white/5 text-gray-300 hover:text-purple-400 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full hover:bg-white/5 text-gray-300 hover:text-purple-400 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md shadow-purple-500/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-3.5 text-xs text-purple-200 transition-colors"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span className="max-w-[100px] truncate font-medium">{user.name}</span>
              </button>
              {user.role === 'ADMIN' && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:inline-flex bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded-full py-1.5 px-3 text-xs font-semibold"
                >
                  Admin
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="gradient-btn text-white text-xs font-semibold py-2.5 px-5 rounded-full flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </header>
  );
};
