'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronRight, ChevronDown, X, Search, Star, Package } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Product, CartItem, FilterState } from '@/types';
import { MOCK_CATEGORIES, getProductsByCategory, MOCK_PRODUCTS } from '@/services/api';

const DEFAULT_FILTERS: FilterState = {
  brand: [],
  priceMin: 0,
  priceMax: 500000,
  rating: 0,
  discount: 0,
  availability: 'all',
  colors: [],
  sizes: [],
  sortBy: 'relevance',
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'highest-rated', label: 'Highest Rated' },
] as const;

function applyFilters(products: Product[], filters: FilterState): Product[] {
  let result = [...products];

  if (filters.brand.length > 0) {
    result = result.filter((p) => p.brand && filters.brand.includes(p.brand.name));
  }
  result = result.filter((p) => {
    const price = p.discountPrice || p.price;
    return price >= filters.priceMin && price <= filters.priceMax;
  });
  if (filters.rating > 0) {
    result = result.filter((p) => p.rating >= filters.rating);
  }
  if (filters.discount > 0) {
    result = result.filter((p) => {
      if (!p.discountPrice) return false;
      const disc = Math.round(((p.price - p.discountPrice) / p.price) * 100);
      return disc >= filters.discount;
    });
  }
  if (filters.availability !== 'all') {
    result = result.filter((p) => filters.availability === 'in-stock' ? p.stock > 0 : p.stock === 0);
  }

  switch (filters.sortBy) {
    case 'price-asc': result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break;
    case 'price-desc': result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break;
    case 'best-selling': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    case 'highest-rated': result.sort((a, b) => b.rating - a.rating); break;
    case 'newest': result.reverse(); break;
  }

  return result;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  const allCategoryProducts = getProductsByCategory(slug);
  const allBrands = [...new Set(allCategoryProducts.map((p) => p.brand?.name).filter(Boolean))] as string[];

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(slug);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const maxPrice = useMemo(() => Math.max(...allCategoryProducts.map((p) => p.price), 500000), [allCategoryProducts]);

  const filteredProducts = useMemo(() => {
    let products = allCategoryProducts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(q)) ||
          (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    }
    return applyFilters(products, filters);
  }, [allCategoryProducts, filters, searchQuery]);

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand.includes(brand) ? prev.brand.filter((b) => b !== brand) : [...prev.brand, brand],
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const activeFilterCount = filters.brand.length + (filters.rating > 0 ? 1 : 0) + (filters.discount > 0 ? 1 : 0) + (filters.availability !== 'all' ? 1 : 0);

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Sort - mobile */}
      <div className="lg:hidden">
        <h3 className="text-sm font-bold text-gray-300 mb-3">Sort By</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters((prev) => ({ ...prev, sortBy: opt.value as FilterState['sortBy'] }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.sortBy === opt.value ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={1000}
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: Number(e.target.value) }))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>₹0</span>
            <span className="text-amber-400 font-bold">₹{filters.priceMax.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      {allBrands.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-300 mb-3">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {allBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className={`text-sm transition-colors ${filters.brand.includes(brand) ? 'text-amber-400 font-semibold' : 'text-gray-400 group-hover:text-white'}`}>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 mb-3">Minimum Rating</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((prev) => ({ ...prev, rating: prev.rating === r ? 0 : r }))}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${filters.rating === r ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= r ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <span>& Above</span>
            </button>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 mb-3">Discount</h3>
        <div className="space-y-1">
          {[10, 20, 30, 40, 50].map((d) => (
            <button
              key={d}
              onClick={() => setFilters((prev) => ({ ...prev, discount: prev.discount === d ? 0 : d }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.discount === d ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {d}% or more
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 mb-3">Availability</h3>
        <div className="space-y-1">
          {(['all', 'in-stock', 'out-of-stock'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setFilters((prev) => ({ ...prev, availability: a }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize ${filters.availability === a ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {a.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={resetFilters} className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all">
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-semibold capitalize">{category?.name || slug}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {category?.name || slug}
            <span className="text-amber-400"> ({filteredProducts.length} products)</span>
          </h1>
          {category?.description && (
            <p className="text-gray-400 text-sm mt-1">{category.description}</p>
          )}
        </div>

        {/* Mobile Toolbar */}
        <div className="lg:hidden flex gap-3 mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            Filter {activeFilterCount > 0 && <span className="bg-amber-400 text-black w-5 h-5 rounded-full text-xs font-extrabold flex items-center justify-center">{activeFilterCount}</span>}
          </button>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            Sort
            <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Inline search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={`Search in ${category?.name || 'category'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Sort dropdown mobile */}
        {isSortOpen && (
          <div className="lg:hidden mb-4 bg-white/5 border border-white/10 rounded-xl p-3 grid grid-cols-2 gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setFilters((prev) => ({ ...prev, sortBy: opt.value as FilterState['sortBy'] })); setIsSortOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.sortBy === opt.value ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-400" /> Filters
                  {activeFilterCount > 0 && <span className="bg-amber-400 text-black w-5 h-5 rounded-full text-xs font-extrabold flex items-center justify-center">{activeFilterCount}</span>}
                </h2>
              </div>
              <Sidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Desktop Sort & Search bar */}
            <div className="hidden lg:flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder={`Search in ${category?.name || 'category'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">{opt.label}</option>
                ))}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={resetFilters} className="nex-btn-gradient px-6 py-2.5 rounded-xl font-bold text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.some((p) => p.id === product.id)}
                    onToggleWishlist={(p) => setWishlist((prev) => prev.some((w) => w.id === p.id) ? prev.filter((w) => w.id !== p.id) : [...prev, p])}
                    onAddToCart={(p) => {
                      setCart((prev) => {
                        const ex = prev.find((i) => i.product.id === p.id);
                        if (ex) return prev.map((i) => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
                        return [...prev, { id: `cart-${Date.now()}`, product: p, quantity: 1 }];
                      });
                      setIsCartOpen(true);
                    }}
                    onBuyNow={() => {}}
                    onQuickView={() => {}}
                    searchHighlight={searchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0f0f1a] border-l border-white/10 overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

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
