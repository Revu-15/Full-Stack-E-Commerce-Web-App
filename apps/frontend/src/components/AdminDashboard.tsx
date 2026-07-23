'use client';

import React from 'react';
import { X, DollarSign, ShoppingBag, Users, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white z-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Admin Dashboard</h2>
            <p className="text-xs text-purple-300">Live store revenue, product inventory & analytics overview</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-bold uppercase tracking-wider">
            ADMINISTRATOR MODE
          </span>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs font-bold text-gray-400">Total Revenue</span>
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-white">$48,290.50</span>
            <span className="block text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% this month
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-indigo-400 mb-2">
              <span className="text-xs font-bold text-gray-400">Total Orders</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-white">342</span>
            <span className="block text-[10px] text-emerald-400 mt-1">+28 today</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-pink-400 mb-2">
              <span className="text-xs font-bold text-gray-400">Total Products</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-white">{products.length}</span>
            <span className="block text-[10px] text-purple-400 mt-1">Across 4 categories</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold text-gray-400">Active Customers</span>
              <Users className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-white">1,280</span>
            <span className="block text-[10px] text-emerald-400 mt-1">+94 new users</span>
          </div>
        </div>

        {/* Product CRUD Table Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-white">Product Inventory ({products.length})</h3>
          <button className="gradient-btn text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-600/20">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/10 text-gray-300 uppercase tracking-wider sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/10 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-black/40" />
                    <span className="truncate max-w-xs">{p.name}</span>
                  </td>
                  <td className="p-3 text-purple-300 font-medium">{p.category.name}</td>
                  <td className="p-3 font-extrabold">${(p.discountPrice || p.price).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 10 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-pink-500/20 text-pink-300'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-purple-300 bg-white/5 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-pink-400 bg-white/5 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
