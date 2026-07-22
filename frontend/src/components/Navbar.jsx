import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { ShoppingBag, Heart, Sun, Moon, Search, ShieldCheck, UserCheck, PackageCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    cart,
    wishlist,
    setIsCartOpen,
    setIsOrdersOpen,
    isAdmin,
    setIsAdmin,
    setIsAdminOpen,
    filters,
    setFilters
  } = useShop();

  const [searchInput, setSearchInput] = useState(filters.search || '');

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleCategorySelect = (cat) => {
    setFilters(prev => ({ ...prev, category: cat }));
  };

  return (
    <header className="sticky-navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1.5rem',
      transition: 'all var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.4rem',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em'
              }}>
                AuraLuxe
              </span>
              <span style={{
                display: 'block',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}>
                Luxury Market
              </span>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          flex: 1,
          maxWidth: '480px',
          position: 'relative',
          minWidth: '240px'
        }}>
          <input
            type="text"
            placeholder="Search products, brands, luxury items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          <Search size={18} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
        </form>

        {/* Actions & Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Orders Tracking Button */}
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="btn-secondary"
            title="Track My Orders"
            style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
          >
            <PackageCheck size={18} />
            <span>My Orders</span>
          </button>

          {/* Admin Toggle & Dashboard Switch */}
          <button
            onClick={() => {
              if (!isAdmin) {
                setIsAdmin(true);
              }
              setIsAdminOpen(true);
            }}
            className="btn-secondary"
            style={{
              padding: '0.55rem 0.9rem',
              fontSize: '0.85rem',
              background: isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
              borderColor: isAdmin ? 'var(--accent-primary)' : 'var(--border-color)',
              color: isAdmin ? 'var(--accent-primary)' : 'var(--text-primary)'
            }}
            title="Admin Suite"
          >
            <ShieldCheck size={18} />
            <span>Admin</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-primary"
            style={{ padding: '0.6rem 1.1rem', position: 'relative' }}
          >
            <ShoppingBag size={20} />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.5)'
              }}>
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div style={{
        maxWidth: '1300px',
        margin: '0.5rem auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        {['all', 'Electronics', 'Fashion', 'Home & Living', 'Accessories'].map(cat => {
          const isActive = filters.category.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat === 'all' ? '✨ All Products' : cat}
            </button>
          );
        })}
      </div>
    </header>
  );
}
