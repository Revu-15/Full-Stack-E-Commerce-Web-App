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
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

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
  const [user, setUser] = useState<{ name: string; email: string; role: 'CUSTOMER' | 'ADMIN' } | null>({
    name: 'John Doe',
    email: 'customer@luxecart.com',
    role: 'CUSTOMER',
  });
  const [orders, setOrders] = useState([
    { id: 'ORD-849201', date: 'Jul 22, 2026', status: 'SHIPPED', total: 299.99, itemsCount: 1 }
  ]);

  // Modal Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory).then((data) => {
      setProducts(data);
    });
  }, [searchQuery, selectedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const price = p.discountPrice || p.price;
      const matchesPrice = price <= priceRange;
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category.slug === selectedCategory;
      return matchesPrice && matchesSearch && matchesCat;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

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
      {/* Navigation Bar */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        user={user}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner onShopNow={() => setSelectedCategory('all')} />

        {/* Featured Category Section */}
        <CategoryGrid
          categories={MOCK_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Main Product Catalog Section */}
        <section id="catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Catalog Controls Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Product <span className="gradient-text">Catalog</span></span>
                <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {filteredProducts.length} Items
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Explore luxury items with instant filtering and search</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Max Price Slider */}
              <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-xs text-gray-400">Max Price:</span>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-24 accent-purple-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-purple-300">${priceRange}</span>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl border border-white/10">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-gray-900 text-gray-200">Featured</option>
                  <option value="price-low" className="bg-gray-900 text-gray-200">Price: Low to High</option>
                  <option value="price-high" className="bg-gray-900 text-gray-200">Price: High to Low</option>
                  <option value="rating" className="bg-gray-900 text-gray-200">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl p-8 border border-white/10">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-white">No products found matching filters</h3>
              <p className="text-xs text-gray-400 mt-1">Try resetting your search query or price slider threshold.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange(1000);
                }}
                className="mt-4 gradient-btn text-white text-xs font-bold py-2.5 px-6 rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Slide-over Cart Drawer */}
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

      {/* Quick View Product Modal */}
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

      {/* Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* User Dashboard */}
      <UserDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
