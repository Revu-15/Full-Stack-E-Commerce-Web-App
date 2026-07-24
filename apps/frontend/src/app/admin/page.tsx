'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, TrendingUp,
  DollarSign, AlertTriangle, Plus, Trash2, Edit2, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { Product } from '@/types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/services/api';

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'coupons'>('overview');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const totalRevenue = 1845900;
  const totalOrders = 142;
  const totalUsers = 428;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0e15] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-black text-xl">
              N
            </div>
            <div>
              <div className="font-extrabold text-white text-base">NexCart</div>
              <div className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full inline-block">
                Admin Panel
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Manage Products', icon: Package },
              { id: 'orders', label: 'Manage Orders', icon: ShoppingCart },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id as typeof tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${tab === id ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-amber-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {tab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-extrabold text-white">Admin Dashboard Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-gray-400 flex justify-between items-center">
                  <span>Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% from last month
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-gray-400 flex justify-between items-center">
                  <span>Total Orders</span>
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white">{totalOrders}</div>
                <div className="text-xs text-gray-400">12 pending fulfillment</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-gray-400 flex justify-between items-center">
                  <span>Registered Users</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{totalUsers}</div>
                <div className="text-xs text-purple-400 font-semibold">+24 this week</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-gray-400 flex justify-between items-center">
                  <span>Low Stock Alert</span>
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">{lowStockCount} items</div>
                <div className="text-xs text-gray-400">Stock ≤ 10 units</div>
              </div>
            </div>

            {/* Inventory table preview */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
              <h2 className="font-bold text-white text-base">Low Stock Alert Inventory</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.filter((p) => p.stock <= 10).slice(0, 5).map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 font-semibold text-white">{p.name}</td>
                        <td className="py-3 text-gray-400">{p.category.name}</td>
                        <td className="py-3 font-bold text-orange-400">{p.stock} remaining</td>
                        <td className="py-3 text-gray-200">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-extrabold text-white">Product Inventory Management ({products.length})</h1>
              <button className="nex-btn-gradient px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.slice(0, 15).map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-3 font-semibold text-white">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                          <span className="truncate max-w-xs">{p.name}</span>
                        </td>
                        <td className="p-4 text-gray-400">{p.category.name}</td>
                        <td className="p-4 font-bold text-white">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`font-bold ${p.stock <= 10 ? 'text-orange-400' : 'text-green-400'}`}>{p.stock}</span>
                        </td>
                        <td className="p-4 flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-amber-400 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setProducts((prev) => prev.filter((item) => item.id !== p.id))} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-white">Manage Orders</h1>
            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-gray-400 text-sm">
              Full Order Management Suite with Status Updates (Pending → Packed → Shipped → Delivered).
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-white">Manage Users ({totalUsers})</h1>
            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-gray-400 text-sm">
              User Accounts, Role Assignments (Customer / Admin), & Verification Status.
            </div>
          </div>
        )}

        {tab === 'coupons' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-white">Coupons & Offer Management</h1>
            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-gray-400 text-sm">
              Active Coupons: <strong className="text-amber-400">NEXSAVE10</strong> (10% OFF), <strong className="text-amber-400">FLAT500</strong> (₹500 OFF), <strong className="text-amber-400">WELCOME20</strong> (20% OFF).
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
