'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, MapPin, CreditCard, Bell, Shield, LogOut, ChevronRight, Edit, Plus, Trash2, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'cards' | 'notifications'>('profile');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
  });

  const [savedAddresses, setSavedAddresses] = useState([
    { id: '1', type: 'Home', street: 'Flat 402, Sunshine Apartments, MG Road', city: 'Bengaluru', zip: '560001', isDefault: true },
    { id: '2', type: 'Office', street: 'Tech Park Tower B, 5th Floor, Outer Ring Rd', city: 'Bengaluru', zip: '560103', isDefault: false },
  ]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      <Navbar
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => {}}
        onOpenDashboard={() => {}}
        onOpenAdmin={() => {}}
        onSelectProduct={() => {}}
        user={{ name: profile.name, email: profile.email, role: 'CUSTOMER' }}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-semibold">Account Settings</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Account Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0 space-y-2">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-lg border border-amber-500/30">
                {profile.name[0]}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{profile.name}</div>
                <div className="text-xs text-gray-400 truncate max-w-[150px]">{profile.email}</div>
              </div>
            </div>

            {[
              { id: 'profile', label: 'Profile Information', icon: User },
              { id: 'addresses', label: 'Address Book', icon: MapPin },
              { id: 'cards', label: 'Saved Cards & Wallet', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === id ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}

            <Link
              href="/orders"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <Shield className="w-4 h-4" />
              <span>Order History</span>
            </Link>
          </aside>

          {/* Account Content Area */}
          <div className="flex-1 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-white">Personal Profile</h2>
                <form className="space-y-4 max-w-lg" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button className="nex-btn-gradient px-6 py-2.5 rounded-xl font-bold text-sm">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-extrabold text-white">Address Book</h2>
                  <button className="nex-btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">{addr.type}</span>
                        {addr.isDefault && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">Default</span>}
                      </div>
                      <div className="text-sm font-semibold text-white">{profile.name}</div>
                      <div className="text-xs text-gray-400">{addr.street}, {addr.city} - {addr.zip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-white">Saved Payment Cards</h2>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                  <CreditCard className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white">HDFC Bank Credit Card (•••• 8920)</div>
                    <div className="text-xs text-gray-400">Expires 08/28 • Default Payment Method</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-white">Notification Preferences</h2>
                <div className="space-y-3">
                  {['Order updates via WhatsApp', 'Email notifications for Flash Sales', 'SMS Alerts for Out for Delivery'].map((pref, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-sm text-gray-300">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
