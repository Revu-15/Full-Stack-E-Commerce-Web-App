'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Search, Heart, ShoppingBag, User, ChevronDown, Moon, Sun } from 'lucide-react';
import { Product } from '@/types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenCart: () => void;
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onSelectProduct: (p: Product) => void;
  user: any;
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'mobiles', name: 'Mobiles' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'watches', name: 'Watches' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'home-kitchen', name: 'Home & Kitchen' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'books', name: 'Books' },
  { id: 'toys', name: 'Toys' },
  { id: 'sports', name: 'Sports' }
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenCart,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  user
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [zip, setZip] = useState('94107');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm text-slate-800">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => { onSelectCategory('all'); onSearchChange(''); }}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                NexCart
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider -mt-1">
                PRIME SHOPPING
              </span>
            </div>
          </button>

          {/* Location Deliver To */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <MapPin className="w-4 h-4 text-blue-600" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-slate-400">Deliver to</div>
              <div className="font-bold text-slate-800">San Francisco {zip}</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-slate-100 text-xs font-semibold px-3 border-r border-slate-200 outline-none cursor-pointer text-slate-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search NexCart by Product, Brand, Category, Keywords..."
              className="flex-1 px-3.5 py-2 text-sm bg-white outline-none text-slate-900"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 flex items-center justify-center transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          
          {/* Wishlist */}
          <button onClick={onOpenCart} className="relative flex flex-col items-center text-slate-700 hover:text-blue-600">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-[10px] text-slate-400">Cart</div>
              <div className="text-xs font-black text-slate-800">$0.00</div>
            </div>
          </button>

          {/* User Account */}
          <button
            onClick={() => onOpenAuth('LOGIN')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-[10px] text-slate-400">{user ? 'Hello,' : 'Sign In'}</div>
              <div className="font-bold text-slate-800">{user ? user.name.split(' ')[0] : 'Account'}</div>
            </div>
          </button>

        </div>

      </div>

      {/* Category Ribbon Bar */}
      <nav className="bg-slate-100 border-t border-slate-200 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 whitespace-nowrap text-xs">
          {CATEGORIES.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`py-2.5 px-3.5 font-semibold transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
