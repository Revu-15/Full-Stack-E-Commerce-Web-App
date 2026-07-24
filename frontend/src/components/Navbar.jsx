import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import {
  ShoppingBag, Heart, Search, User, MapPin, Sparkles, ChevronDown,
  X, History, TrendingUp, ShieldAlert, LogOut, Package, Settings, Sun, Moon
} from 'lucide-react';

const CATEGORIES_LIST = [
  { id: 'All', name: 'All Categories' },
  { id: 'Mobiles', name: 'Mobiles' },
  { id: 'Laptops', name: 'Laptops' },
  { id: 'Electronics', name: 'Electronics' },
  { id: 'Fashion', name: 'Fashion' },
  { id: 'Shoes', name: 'Shoes' },
  { id: 'Watches', name: 'Watches' },
  { id: 'Grocery', name: 'Grocery' },
  { id: 'Home & Kitchen', name: 'Home & Kitchen' },
  { id: 'Beauty', name: 'Beauty' },
  { id: 'Books', name: 'Books' },
  { id: 'Toys', name: 'Toys' },
  { id: 'Sports', name: 'Sports' }
];

const TRENDING_SEARCHES = [
  'iPhone 15 Pro', 'MacBook Pro M3', 'Nike Jordan 1', 'Sony Headphones', 'Dyson Airwrap', 'Rolex Submariner'
];

export default function Navbar() {
  const {
    theme, toggleTheme,
    user, isAdmin, logoutUser, setIsAuthOpen,
    cart, wishlist,
    setIsCartOpen, setIsWishlistOpen, setIsOrdersOpen, setIsAdminOpen,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    searchHistory, addSearchHistory, clearSearchHistory
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationZip, setLocationZip] = useState('94107');

  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim());
      setIsSearchFocused(false);
      // Scroll to catalog smoothly
      const catalogEl = document.getElementById('product-catalog-section');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSearchQuery = (query) => {
    setSearchQuery(query);
    addSearchHistory(query);
    setIsSearchFocused(false);
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{part}</strong>
      ) : part
    );
  };

  return (
    <header className="nexcart-navbar" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Top Header Strip */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #4f46e5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Sparkles size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NexCart
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px', letterSpacing: '0.05em' }}>
                PRIME SHOPPING
              </span>
            </div>
          </button>

          {/* Location Picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}
            >
              <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Deliver to</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>San Francisco {locationZip}</div>
              </div>
            </button>

            {isLocationOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', width: '240px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-lg)', zIndex: 110 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Update Delivery Pincode</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={locationZip}
                    onChange={(e) => setLocationZip(e.target.value)}
                    placeholder="Enter ZIP code"
                    style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => setIsLocationOpen(false)}
                    style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amazon-Style Search Bar */}
        <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '680px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: isSearchFocused ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', boxShadow: isSearchFocused ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none', transition: 'all 0.2s ease' }}>
            
            {/* Category Select Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ background: 'var(--bg-secondary)', border: 'none', borderRight: '1px solid var(--border-color)', padding: '0 0.75rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
            >
              {CATEGORIES_LIST.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search NexCart by Product, Brand, Category, Keywords..."
              style={{ flex: 1, padding: '0.65rem 0.85rem', background: 'var(--bg-surface)', border: 'none', fontSize: '0.88rem', color: 'var(--text-primary)' }}
            />

            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} style={{ padding: '0 0.5rem', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}

            {/* Search Button */}
            <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} />
            </button>
          </form>

          {/* Autocomplete & History Overlay */}
          {isSearchFocused && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 120, padding: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              
              {/* Recent Searches */}
              {searchHistory.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><History size={12} /> Recent Searches</span>
                    <button onClick={clearSearchHistory} style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Clear</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchQuery(item)}
                        style={{ padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <TrendingUp size={12} /> Trending Searches
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {TRENDING_SEARCHES.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchQuery(query)}
                      style={{ textAlign: 'left', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Search size={14} style={{ color: 'var(--text-muted)' }} />
                      {highlightMatch(query, searchQuery)}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
            style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-primary)' }}
          >
            <Heart size={22} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '2px' }}>Wishlist</span>
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '4px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} />
              {totalCartCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalCartCount}
                </span>
              )}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cart</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </div>
            </div>
          </button>

          {/* User Account Menu */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                {user ? user.name.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user ? 'Hello,' : 'Sign In'}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user ? user.name.split(' ')[0] : 'Account'}
                </div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {isUserMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '220px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem', boxShadow: 'var(--shadow-lg)', zIndex: 130 }}>
                {user ? (
                  <>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.3rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => { setIsOrdersOpen(true); setIsUserMenuOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}
                    >
                      <Package size={16} /> My Orders & Tracking
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setIsAdminOpen(true); setIsUserMenuOpen(false); }}
                        style={{ width: '100%', textAlign: 'left', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontWeight: 700 }}
                      >
                        <Settings size={16} /> Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => { logoutUser(); setIsUserMenuOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderTop: '1px solid var(--border-color)', marginTop: '0.3rem' }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '0.5rem' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Sign in to manage orders, wishlist, and recommendations.</p>
                    <button
                      onClick={() => { setIsAuthOpen(true); setIsUserMenuOpen(false); }}
                      style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Categories Navigation Ribbon (12 Categories) */}
      <nav style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
          {CATEGORIES_LIST.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const catalogEl = document.getElementById('product-catalog-section');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '0.65rem 0.95rem',
                  fontSize: '0.83rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: isActive ? 'var(--bg-surface)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
