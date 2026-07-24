'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Trash2, Heart, ArrowRight, ShoppingBag, Tag, Truck, Shield,
  Minus, Plus, AlertCircle, ChevronRight, BookmarkMinus, X
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { CartItem, Product } from '@/types';
import { MOCK_PRODUCTS } from '@/services/api';

const INITIAL_CART: CartItem[] = [
  { id: 'cart-1', product: MOCK_PRODUCTS[0], quantity: 1, selectedColor: 'Black', selectedSize: '' },
  { id: 'cart-2', product: MOCK_PRODUCTS[4], quantity: 2, selectedColor: '', selectedSize: 'M' },
];

const COUPONS: Record<string, { type: 'pct' | 'flat'; value: number; min: number }> = {
  'NEXSAVE10': { type: 'pct', value: 10, min: 1000 },
  'FLAT500': { type: 'flat', value: 500, min: 2000 },
  'WELCOME20': { type: 'pct', value: 20, min: 5000 },
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [savedLater, setSavedLater] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([MOCK_PRODUCTS[1]]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);

  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
    [cart]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = COUPONS[appliedCoupon];
    if (!c) return 0;
    if (subtotal < c.min) return 0;
    if (c.type === 'pct') return Math.round(subtotal * c.value / 100);
    return c.value;
  }, [appliedCoupon, subtotal]);

  const shippingFee = subtotal >= 499 ? 0 : 49;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const grandTotal = subtotal - couponDiscount + shippingFee + tax;

  const applyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    const c = COUPONS[code];
    if (!c) {
      setCouponError('Invalid coupon code');
      setCouponSuccess('');
      return;
    }
    if (subtotal < c.min) {
      setCouponError(`Minimum order of ₹${c.min.toLocaleString('en-IN')} required`);
      setCouponSuccess('');
      return;
    }
    setAppliedCoupon(code);
    setCouponError('');
    const disc = c.type === 'pct' ? `${c.value}% off` : `₹${c.value} off`;
    setCouponSuccess(`Coupon applied! You save ${disc}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const saveForLater = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      setSavedLater((prev) => [...prev, item.product]);
      removeItem(id);
    }
  };

  const moveToWishlist = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      setWishlist((prev) => prev.some((p) => p.id === item.product.id) ? prev : [...prev, item.product]);
      removeItem(id);
    }
  };

  const moveSavedToCart = (product: Product) => {
    setCart((prev) => [...prev, { id: `cart-${Date.now()}`, product, quantity: 1 }]);
    setSavedLater((prev) => prev.filter((p) => p.id !== product.id));
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
        onOpenCart={() => {}}
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
          <span className="text-white font-semibold">Shopping Cart</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-amber-400" />
          Shopping Cart
          <span className="text-base font-normal text-gray-400">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
        </h1>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-amber-400/60" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/" className="nex-btn-gradient px-8 py-3 rounded-xl font-bold">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                const discount = item.product.discountPrice
                  ? Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)
                  : 0;
                return (
                  <div key={item.id} className="glass-card rounded-2xl border border-white/10 p-5 flex gap-5">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.slug}`} className="shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-white/5">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          {item.product.brand && (
                            <div className="text-amber-400 text-xs font-bold uppercase tracking-wide mb-0.5">{item.product.brand.name}</div>
                          )}
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="text-white font-semibold text-sm leading-tight hover:text-amber-400 transition-colors line-clamp-2">{item.product.name}</h3>
                          </Link>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {item.selectedColor && <span className="text-xs text-gray-500">Color: <span className="text-gray-300">{item.selectedColor}</span></span>}
                            {item.selectedSize && <span className="text-xs text-gray-500">Size: <span className="text-gray-300">{item.selectedSize}</span></span>}
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="font-extrabold text-white">₹{price.toLocaleString('en-IN')}</span>
                        {discount > 0 && (
                          <>
                            <span className="text-xs text-gray-500 line-through">₹{item.product.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-green-400 font-bold">{discount}% OFF</span>
                          </>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center border border-white/15 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => saveForLater(item.id)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                          <BookmarkMinus className="w-3.5 h-3.5" /> Save for Later
                        </button>
                        <button onClick={() => moveToWishlist(item.id)} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
                          <Heart className="w-3.5 h-3.5" /> Move to Wishlist
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-green-400" />
                        {item.product.stock > 0 ? 'Free delivery available' : 'Out of stock'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Saved for Later */}
              {savedLater.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-bold text-white mb-4 text-lg">Saved for Later ({savedLater.length})</h2>
                  <div className="space-y-3">
                    {savedLater.map((product) => (
                      <div key={product.id} className="glass-card rounded-xl border border-white/10 p-4 flex gap-4 items-center">
                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h4>
                          <div className="text-amber-400 font-bold text-sm mt-0.5">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</div>
                        </div>
                        <button
                          onClick={() => moveSavedToCart(product)}
                          className="shrink-0 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-500/30 transition-all"
                        >
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24 space-y-5">
                <h2 className="font-bold text-white text-lg">Order Summary</h2>

                {/* Coupon */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" /> Apply Coupon
                  </p>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                      <div>
                        <div className="text-green-400 font-bold text-sm">{appliedCoupon}</div>
                        <div className="text-green-400 text-xs">{couponSuccess}</div>
                      </div>
                      <button onClick={removeCoupon} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                          placeholder="Enter coupon code"
                          className="flex-1 bg-black/30 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                        />
                        <button onClick={applyCoupon} className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold rounded-xl hover:bg-amber-500/30 transition-all">
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {couponError}</p>}
                      <p className="text-xs text-gray-500 mt-1.5">Try: NEXSAVE10 · FLAT500 · WELCOME20</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? 'text-green-400 font-semibold' : 'text-white'}>
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>GST (18%)</span>
                    <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-white text-lg border-t border-white/10 pt-3 mt-3">
                    <span>Grand Total</span>
                    <span className="text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="text-xs text-green-400 font-semibold text-center">
                      You save ₹{(couponDiscount + (subtotal >= 499 ? 0 : 0)).toLocaleString('en-IN')} on this order! 🎉
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full nex-btn-gradient py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Badges */}
                <div className="flex justify-around pt-2 border-t border-white/10">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-gray-400">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-gray-400">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Tag className="w-5 h-5 text-amber-400" />
                    <span className="text-xs text-gray-400">Best Price</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={(orderId) => {
          setOrders((prev) => [{ id: orderId, date: 'Just now', status: 'CONFIRMED', total: grandTotal, itemsCount: cart.length }, ...prev]);
          setCart([]);
          setIsCheckoutOpen(false);
        }}
      />
      <AuthModal isOpen={isAuthOpen} initialTab={authMode} onClose={() => setIsAuthOpen(false)} onLoginSuccess={(u) => setUser(u)} />
      <Footer />
    </div>
  );
}
