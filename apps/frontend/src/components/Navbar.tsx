'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Heart, Search, User, ShieldCheck, Sparkles, Menu, X, Package, Clock, Tag } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/services/api';
import { Product } from '@/types';

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
  onSelectProduct?: (product: Product) => void;
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
  onSelectProduct,
  user,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexcart_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Sync external searchQuery state with internal input value
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // 300ms Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, onSearchChange]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('nexcart_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleExecuteSearch = (term: string) => {
    setInputValue(term);
    onSearchChange(term);
    saveRecentSearch(term);
    setIsDropdownOpen(false);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch(inputValue);
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    onSearchChange('');
    setIsDropdownOpen(false);
    try {
      localStorage.removeItem('nexcart_last_search');
    } catch (e) {}
  };

  // Filter Autocomplete Suggestions
  const q = inputValue.trim().toLowerCase();
  const suggestedProducts = q
    ? MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        (p.brand?.name && p.brand.name.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q)))
      ).slice(0, 5)
    : [];

  const suggestedCategories = q
    ? MOCK_CATEGORIES.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
    : [];

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

        {/* Global Search Bar with Amazon/Flipkart Autocomplete */}
        <div ref={dropdownRef} className="hidden sm:flex flex-1 max-w-xl relative">
          <div className="relative w-full">
            <Search 
              onClick={() => handleExecuteSearch(inputValue)}
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-amber-400 transition-colors" 
            />
            <input
              type="text"
              placeholder="Search Mobiles, Laptops, Water Bottles, Shoes, Fashion..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-16 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
            {inputValue && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-white/10 hover:bg-white/20 rounded-full px-2 py-0.5 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Suggestions Dropdown */}
          {isDropdownOpen && (q || recentSearches.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#12141a] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5 backdrop-blur-xl">
              {/* Product Suggestions */}
              {suggestedProducts.length > 0 && (
                <div className="p-3">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-2 px-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Matching Products
                  </span>
                  <div className="space-y-1">
                    {suggestedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(p);
                          handleExecuteSearch(p.name);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-500/10 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded-lg border border-white/10" />
                          <div>
                            <span className="text-xs font-semibold text-gray-200 group-hover:text-amber-300 block">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.category.name}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-400">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Suggestions */}
              {suggestedCategories.length > 0 && (
                <div className="p-3">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-2 px-2">Matching Departments</span>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {suggestedCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCategory(c.slug);
                          handleExecuteSearch('');
                        }}
                        className="text-xs bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 rounded-full px-3 py-1 text-gray-300 font-semibold transition-all"
                      >
                        In {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {!q && recentSearches.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('nexcart_recent_searches');
                      }}
                      className="text-[10px] text-gray-500 hover:text-amber-400 underline"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleExecuteSearch(term)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 text-xs text-gray-300 hover:text-amber-300 text-left transition-colors"
                      >
                        <Search className="w-3.5 h-3.5 text-gray-500" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
