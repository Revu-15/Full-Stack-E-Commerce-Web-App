'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, Clock, TrendingUp, Package, ArrowLeft, Mic } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Product, CartItem } from '@/types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/services/api';

const TRENDING_SEARCHES = [
  'iPhone 15 Pro', 'Laptop under 50000', 'Wireless Headphones', 'Nike Shoes',
  'Smart Watch', 'Air Fryer', 'Yoga Mat', 'Lego Star Wars',
];

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-400/30 text-amber-300 rounded px-0.5">{part}</mark>
    ) : part
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('nexcart_search_history') || '[]');
      setRecentSearches(stored);
    } catch { }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    try {
      const stored = JSON.parse(localStorage.getItem('nexcart_search_history') || '[]') as string[];
      const updated = [q, ...stored.filter((s) => s !== q)].slice(0, 8);
      localStorage.setItem('nexcart_search_history', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch { }
  };

  const clearHistory = () => {
    localStorage.removeItem('nexcart_search_history');
    setRecentSearches([]);
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    setDebouncedQuery(q);
    setShowSuggestions(false);
    if (q.trim()) addToHistory(q.trim());
  };

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const matches = new Set<string>();
    MOCK_PRODUCTS.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) matches.add(p.name);
      if (p.brand?.name.toLowerCase().includes(q)) matches.add(p.brand.name);
      p.keywords?.forEach((k) => { if (k.toLowerCase().includes(q)) matches.add(k); });
    });
    return [...matches].slice(0, 7);
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    let results = MOCK_PRODUCTS.filter((p) => {
      const catMatch = selectedCategory === 'all' || p.category.slug === selectedCategory;
      const textMatch =
        p.name.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords?.some((k) => k.toLowerCase().includes(q));
      return catMatch && textMatch;
    });

    switch (sortBy) {
      case 'price-asc': results.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break;
      case 'price-desc': results.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
    }

    return results;
  }, [debouncedQuery, selectedCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: `cart-${Date.now()}`, product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={query}
        onSearchChange={setQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(mode = 'LOGIN') => { setAuthMode(mode); setIsAuthOpen(true); }}
        onOpenDashboard={() => {}}
        onOpenAdmin={() => {}}
        onSelectProduct={() => {}}
        user={user}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Box */}
        <div className="relative mb-8">
          <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus-within:border-amber-500/50 transition-all">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(query); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search for products, brands, categories..."
              autoFocus
              className="flex-1 bg-transparent text-white text-base outline-none placeholder-gray-500"
            />
            {query && (
              <button onClick={() => { setQuery(''); setDebouncedQuery(''); }} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => handleSearch(query)} className="nex-btn-gradient px-5 py-2 rounded-xl text-sm font-bold">
              Search
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSearch(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left"
                >
                  <Search className="w-4 h-4 text-gray-600 shrink-0" />
                  <span>{highlightText(s, query)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === 'all' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}
          >
            All
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.slug ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* No query — show recent & trending */}
        {!debouncedQuery.trim() ? (
          <div className="space-y-10">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" /> Recent Searches
                  </h2>
                  <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear all</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:border-amber-500/40 transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {s}
                      <span
                        onClick={(e) => { e.stopPropagation(); setRecentSearches((prev) => { const updated = prev.filter((_, idx) => idx !== i); localStorage.setItem('nexcart_search_history', JSON.stringify(updated)); return updated; }); }}
                        className="text-gray-600 hover:text-red-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="font-bold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" /> Trending Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(s)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* No Results */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-amber-400/60" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">No results for <span className="text-amber-400">"{debouncedQuery}"</span></h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md">
              We couldn't find anything matching your search. Try different keywords, check spelling, or browse categories.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <button onClick={() => { setQuery(''); setDebouncedQuery(''); }} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" /> Clear Search
              </button>
              <Link href="/" className="nex-btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold">
                Browse All Products
              </Link>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-3">Try these popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {TRENDING_SEARCHES.slice(0, 5).map((s, i) => (
                  <button key={i} onClick={() => handleSearch(s)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-amber-400 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  <span className="text-amber-400">{filteredProducts.length} results</span> for "<span className="text-amber-400">{debouncedQuery}</span>"
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedCategory !== 'all' && `in ${MOCK_CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory} • `}
                  Showing all matching products
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                <option value="relevance" className="bg-[#1a1a2e]">Relevance</option>
                <option value="price-asc" className="bg-[#1a1a2e]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#1a1a2e]">Price: High to Low</option>
                <option value="rating" className="bg-[#1a1a2e]">Highest Rated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={(p) => setWishlist((prev) => prev.some((w) => w.id === p.id) ? prev.filter((w) => w.id !== p.id) : [...prev, p])}
                  onAddToCart={handleAddToCart}
                  onBuyNow={() => {}}
                  onQuickView={() => {}}
                  searchHighlight={debouncedQuery}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={(id, delta) => setCart((prev) =>
          prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0)
        )}
        onRemoveItem={(id) => setCart((prev) => prev.filter((item) => item.id !== id))}
        onProceedToCheckout={() => setIsCartOpen(false)}
      />
      <AuthModal isOpen={isAuthOpen} initialTab={authMode} onClose={() => setIsAuthOpen(false)} onLoginSuccess={(u) => setUser(u)} />
      <Footer />
    </div>
  );
}
