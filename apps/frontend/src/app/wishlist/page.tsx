'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ShoppingCart, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Product, CartItem } from '@/types';
import { MOCK_PRODUCTS } from '@/services/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([MOCK_PRODUCTS[1], MOCK_PRODUCTS[3], MOCK_PRODUCTS[5]]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const moveToCart = (product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: `cart-${Date.now()}`, product, quantity: 1 }];
    });
    removeFromWishlist(product.id);
    setIsCartOpen(true);
  };

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
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-semibold">My Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            My Wishlist
            <span className="text-base font-normal text-gray-400">({wishlist.length} items)</span>
          </h1>
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                wishlist.forEach(p => moveToCart(p));
              }}
              className="nex-btn-gradient px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Move All to Cart
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-rose-400/60" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-400 text-sm mb-8">Explore our catalog and save your favorite items for later.</p>
            <Link href="/" className="nex-btn-gradient px-8 py-3 rounded-xl font-bold">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const price = product.discountPrice || product.price;
              const discount = product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;

              return (
                <div key={product.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-amber-500/40 transition-all">
                  <div className="relative h-52 overflow-hidden bg-white/5">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-black px-2.5 py-1 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {product.brand && (
                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">{product.brand.name}</div>
                      )}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-amber-400 transition-colors">{product.name}</h3>
                      </Link>

                      <div className="flex items-center gap-1.5 mt-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-extrabold text-white">₹{price.toLocaleString('en-IN')}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-gray-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      <button
                        onClick={() => moveToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full nex-btn-gradient py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        <ShoppingCart className="w-4 h-4" /> Move to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
