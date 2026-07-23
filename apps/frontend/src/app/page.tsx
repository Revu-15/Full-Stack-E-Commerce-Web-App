'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { SlidersHorizontal, Sparkles, Zap, Flame, Award, Clock, Star, TrendingUp } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Interactive States
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'cart-1', product: MOCK_PRODUCTS[0], quantity: 1, selectedColor: 'Obsidian Black', selectedSize: 'M' }
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([MOCK_PRODUCTS[1]]);
  const [user, setUser] = useState<{ name: string; email: string; role: 'CUSTOMER' | 'ADMIN' } | null>(null);
  const [orders, setOrders] = useState([
    { id: 'ORD-849201', date: 'Jul 23, 2026', status: 'SHIPPED', total: 299.99, itemsCount: 1 }
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
    fetchProducts(searchQuery, selectedCategory).then((data) => {
      setProducts(data);
    });
  }, [searchQuery, selectedCategory]);

  // Filter & Section Categorization for Step 4
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = p.discountPrice || p.price;
      const matchesPrice = price <= priceRange;
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category.slug === selectedCategory;
      return matchesPrice && matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  // Step 4 Sections
  const todaysDeals = useMemo(() => filteredProducts.filter((p) => p.discountPrice != null).slice(0, 8), [filteredProducts]);
  const bestSellers = useMemo(() => [...filteredProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8), [filteredProducts]);
  const trendingProducts = useMemo(() => [...filteredProducts].sort((a, b) => b.rating - a.rating).slice(0, 8), [filteredProducts]);
  const newArrivals = useMemo(() => filteredProducts.slice(10, 18), [filteredProducts]);

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

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      {/* Step 1: Navbar */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(mode = 'LOGIN') => { setAuthMode(mode); setIsAuthOpen(true); }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
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

        {/* Step 4 Section 1: Today's Deals */}
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
              />
            ))}
          </div>
        </section>

        {/* Step 4 Section 2: Best Sellers */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <span>Best <span className="text-amber-400 font-extrabold">Sellers</span></span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Most ordered products across all 12 categories</p>
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
              />
            ))}
          </div>
        </section>

        {/* Step 4 Section 3: Trending Products */}
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
              />
            ))}
          </div>
        </section>

        {/* Full 100 Products Catalog Grid */}
        <section id="catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>All NexCart <span className="text-amber-400 font-extrabold">Products (100 Items)</span></span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Explore our complete 100 demo product inventory</p>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-panel px-3.5 py-2 rounded-xl border border-white/10">
                <span className="text-xs text-gray-400">Max Price:</span>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-24 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-300">${priceRange}</span>
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
              />
            ))}
          </div>
        </section>
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
