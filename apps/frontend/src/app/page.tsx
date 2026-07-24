'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { UserDashboard } from '@/components/UserDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Footer } from '@/components/Footer';

import { Product, CartItem } from '@/types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, fetchProducts } from '@/services/api';
import { Search, Sparkles, Zap, Flame, Award, Clock, Star, TrendingUp, RefreshCw, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<number>(200000);

  // Restore last search from localStorage on mount
  useEffect(() => {
    try {
      const lastSearch = localStorage.getItem('nexcart_last_search');
      if (lastSearch) setSearchQuery(lastSearch);
    } catch (e) {}
  }, []);

  // Save last search to localStorage
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    try {
      if (query.trim()) {
        localStorage.setItem('nexcart_last_search', query);
      } else {
        localStorage.removeItem('nexcart_last_search');
      }
    } catch (e) {}
  }, []);

  // Interactive States
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'cart-1', product: MOCK_PRODUCTS[0], quantity: 1, selectedColor: 'Obsidian Black', selectedSize: 'M' }
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([MOCK_PRODUCTS[1]]);
  const [user, setUser] = useState<{ name: string; email: string; role: 'CUSTOMER' | 'ADMIN' } | null>(null);
  const [orders, setOrders] = useState([
    { id: 'ORD-849201', date: 'Jul 23, 2026', status: 'SHIPPED', total: 2999, itemsCount: 1 }
  ]);

  // Modal Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  // Exact Filtering Logic according to Requirements 2 & 12
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Price filter
      const price = product.discountPrice || product.price;
      const matchesPrice = price <= priceRange;

      // 2. Category filter
      const catSlug = typeof product.category === 'string' ? product.category : product.category?.slug;
      const matchesCategory = selectedCategory === 'all' || catSlug === selectedCategory;

      // 3. Global multi-field search filter
      const q = searchQuery.trim().toLowerCase().replace(/\s+/g, ' ');

      const matchesSearch =
        q === '' ||
        product.name.toLowerCase().includes(q) ||
        (product.brand?.name && product.brand.name.toLowerCase().includes(q)) ||
        (product.category?.name && product.category.name.toLowerCase().includes(q)) ||
        (catSlug && catSlug.toLowerCase().includes(q)) ||
        product.description.toLowerCase().includes(q) ||
        (product.keywords && product.keywords.some((keyword) => keyword.toLowerCase().includes(q)));

      return matchesPrice && matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  // Deal & Seller Sections (Use filteredProducts if searching or category is active)
  const baseList = (searchQuery || selectedCategory !== 'all') ? filteredProducts : MOCK_PRODUCTS;
  const todaysDeals = useMemo(() => baseList.filter((p) => p.discountPrice != null).slice(0, 8), [baseList]);
  const bestSellers = useMemo(() => [...baseList].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8), [baseList]);
  const trendingProducts = useMemo(() => [...baseList].sort((a, b) => b.rating - a.rating).slice(0, 8), [baseList]);

  // Actions
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          product,
          quantity: 1,
          selectedSize: size || 'M',
          selectedColor: color || 'Standard',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleOrderSuccess = (orderId: string) => {
    const totalAmount = cart.reduce((sum, i) => sum + (i.product.discountPrice || i.product.price) * i.quantity, 0);
    setOrders((prev) => [
      { id: orderId, date: 'Just now', status: 'CONFIRMED', total: totalAmount, itemsCount: cart.length },
      ...prev,
    ]);
    setCart([]);
  };

  const currentCategoryObj = MOCK_CATEGORIES.find(c => c.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      {/* Step 1: Navbar */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(mode = 'LOGIN') => { setAuthMode(mode); setIsAuthOpen(true); }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        user={user}
      />

      <main className="flex-1">
        {/* Step 1: Hero Banner */}
        <HeroBanner onShopNow={() => setSelectedCategory('all')} />

        {/* Step 1: Featured Categories (12 Categories) */}
        <CategoryGrid
          categories={MOCK_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* SEARCH & CATEGORY RESULTS HEADER */}
        {(searchQuery || selectedCategory !== 'all') && (
          <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-amber-500/10 border-y border-amber-500/20 my-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Showing <span className="text-amber-400">{filteredProducts.length} results</span>
                    {searchQuery && <span> for <span className="text-amber-400">"{searchQuery}"</span></span>}
                    {selectedCategory !== 'all' && <span> in <span className="text-amber-400">{currentCategoryObj?.name || selectedCategory}</span></span>}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time filtered items with NexPrime fast delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-1.5 rounded-full font-semibold border border-white/10 transition-all"
                  >
                    View All Categories
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="text-xs bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-1.5 rounded-full font-extrabold transition-all"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* NO PRODUCTS FOUND EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <section className="py-16 max-w-3xl mx-auto px-4 text-center">
            <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">No matching products found</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                We couldn't find any items matching <strong className="text-amber-300">"{searchQuery}"</strong>
                {selectedCategory !== 'all' && <span> inside the <strong className="text-amber-300">{currentCategoryObj?.name}</strong> category</span>}.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-5 rounded-full border border-white/10 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Search in All Departments</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleSearchChange('');
                    setSelectedCategory('all');
                  }}
                  className="nex-btn-gradient text-xs font-extrabold py-2.5 px-6 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>Clear Filter & View All 100 Products</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 4 Section 1: Today's Deals */}
        {todaysDeals.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
                  <span>Today's <span className="text-amber-400 font-extrabold">Lightning Deals</span></span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Limited-time discounts up to 40% OFF with NexPrime Delivery</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Ends in 05h 42m
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {todaysDeals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onBuyNow={(p) => handleBuyNow(p)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  searchHighlight={searchQuery}
                />
              ))}
            </div>
          </section>
        )}

        {/* Step 4 Section 2: Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span>Best <span className="text-amber-400 font-extrabold">Sellers</span></span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Most ordered products across selected departments</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onBuyNow={(p) => handleBuyNow(p)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  searchHighlight={searchQuery}
                />
              ))}
            </div>
          </section>
        )}

        {/* Step 4 Section 3: Trending Products */}
        {trendingProducts.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  <span>Trending <span className="text-amber-400 font-extrabold">Right Now</span></span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Products trending in customer searches today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onBuyNow={(p) => handleBuyNow(p)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  searchHighlight={searchQuery}
                />
              ))}
            </div>
          </section>
        )}

        {/* Full Product Catalog Grid */}
        {filteredProducts.length > 0 && (
          <section id="catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>NexCart <span className="text-amber-400 font-extrabold">Product Inventory ({filteredProducts.length} Items)</span></span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Explore our complete catalog with instant search & filter</p>
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 glass-panel px-3.5 py-2 rounded-xl border border-white/10">
                  <span className="text-xs text-gray-400">Max Price:</span>
                  <input
                    type="range"
                    min="1000"
                    max="200000"
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-300">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onBuyNow={(p) => handleBuyNow(p)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  searchHighlight={searchQuery}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, s, c) => {
          handleAddToCart(p, s, c);
          setQuickViewProduct(null);
        }}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.some((p) => p.id === quickViewProduct.id) : false}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Step 2 & Step 3 Auth Modal (Sign Up & Login) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* User Dashboard & Order History */}
      <UserDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user || { name: 'Guest User', email: 'guest@nexcart.com', role: 'CUSTOMER' }}
        onLogout={() => setUser(null)}
        wishlist={wishlist}
        orders={orders}
      />

      {/* Admin Panel */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
      />

      {/* Step 1 Footer */}
      <Footer />
    </div>
  );
}
