'use client';

import React, { useState } from 'react';
import { X, Package, MapPin, Heart, LogOut, Clock, CheckCircle, Truck } from 'lucide-react';
import { Product } from '@/types';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  wishlist: Product[];
  orders: { id: string; date: string; status: string; total: number; itemsCount: number }[];
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  wishlist,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'WISHLIST' | 'ADDRESSES'>('ORDERS');

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white z-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center text-xl font-extrabold text-white shadow-lg shadow-purple-600/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
              <p className="text-xs text-purple-300">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                {user.role} ACCOUNT
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 my-6">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ORDERS' ? 'gradient-btn text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('WISHLIST')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'WISHLIST' ? 'gradient-btn text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ADDRESSES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ADDRESSES' ? 'gradient-btn text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Addresses</span>
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">No orders placed yet.</p>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-purple-300">{ord.id}</span>
                      <span className="text-[10px] text-gray-400">• {ord.date}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{ord.itemsCount} items — Total: <strong>${ord.total.toFixed(2)}</strong></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'WISHLIST' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
            {wishlist.length === 0 ? (
              <p className="col-span-2 text-center py-8 text-xs text-gray-400">Your wishlist is currently empty.</p>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-black/40" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-purple-300 font-extrabold">${(item.discountPrice || item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'ADDRESSES' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/40 relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-300 text-[10px] font-bold">DEFAULT</span>
              <h4 className="text-xs font-bold text-white">John Doe</h4>
              <p className="text-xs text-gray-300 mt-1">742 Evergreen Terrace, San Francisco, CA 94102</p>
              <p className="text-xs text-gray-400 mt-0.5">Phone: +1 234 567 8900</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
