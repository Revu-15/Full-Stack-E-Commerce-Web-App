'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart, Heart, Zap, Star, Shield, Truck, RefreshCw, Award,
  ChevronRight, Minus, Plus, Share2, Tag, CreditCard, Package,
  CheckCircle, Clock, AlertCircle, ChevronLeft, ZoomIn
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Product, CartItem, Review } from '@/types';
import {
  MOCK_PRODUCTS, MOCK_CATEGORIES, getProductBySlug, getRelatedProducts
} from '@/services/api';

// Mock reviews per product
function getMockReviews(productId: string): Review[] {
  const names = ['Rahul Sharma', 'Priya Mehta', 'Arjun Patel', 'Sneha Reddy', 'Vikram Singh'];
  return Array.from({ length: 5 }, (_, i) => ({
    id: `rev-${productId}-${i}`,
    userId: `user-${i}`,
    productId,
    rating: Math.max(3, Math.floor(Math.random() * 2) + 4),
    title: ['Amazing product!', 'Great value for money', 'Highly recommended', 'Exceeded expectations', 'Perfect quality'][i],
    body: [
      'Absolutely love this product. The quality is top-notch and delivery was super fast. Packaging was also excellent.',
      'Great value for money. Works exactly as described. Would definitely buy again from NexCart.',
      'Highly recommend this to anyone looking for quality. Build quality is premium and feels durable.',
      'Exceeded my expectations in every way. Customer service was helpful and product arrived on time.',
      'Perfect product. Exactly what I was looking for. The features are great and performance is excellent.',
    ][i],
    images: [],
    isVerified: i % 2 === 0,
    createdAt: new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: `user-${i}`, name: names[i], avatar: undefined },
  }));
}

// Delivery date helper
function getDeliveryDate(days = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Star Rating Component
function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
      <span className={`font-bold text-amber-400 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{rating.toFixed(1)}</span>
      {count != null && <span className="text-gray-400 text-xs">({count.toLocaleString()} reviews)</span>}
    </div>
  );
}

// Image Gallery Component
function ImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const allImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'];

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 w-16 shrink-0">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selected === i ? 'border-amber-400 shadow-amber-400/30 shadow-lg' : 'border-white/10 hover:border-white/30'}`}
          >
            <img src={img} alt={`${productName} ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="flex-1 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
        style={{ minHeight: '400px' }}
      >
        <img
          src={allImages[selected]}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
          style={{ minHeight: '400px', objectFit: 'cover' }}
        />
        <div className="absolute top-3 right-3 bg-black/50 text-white rounded-lg p-1.5">
          <ZoomIn className="w-4 h-4" />
        </div>
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === selected ? 'bg-amber-400 w-5' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// EMI Calculator Component
function EmiSection({ price }: { price: number }) {
  const plans = [
    { months: 3, rate: 0 },
    { months: 6, rate: 0.5 },
    { months: 9, rate: 0.7 },
    { months: 12, rate: 0.9 },
  ];
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-amber-400" /> No-Cost EMI Available
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {plans.map((p) => {
          const monthly = Math.ceil((price * (1 + p.rate / 100)) / p.months);
          return (
            <div key={p.months} className="bg-black/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-amber-400 font-bold text-sm">₹{monthly.toLocaleString('en-IN')}/mo</div>
              <div className="text-gray-400 text-xs">{p.months} months {p.rate === 0 ? '• No cost' : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);
  const fbtProducts = MOCK_PRODUCTS.filter(p => p.category.id === product.category.id && p.id !== product.id).slice(0, 3);

  useEffect(() => {
    setReviews(getMockReviews(product.id));
    // Track recently viewed
    try {
      const stored = JSON.parse(localStorage.getItem('nexcart_recently_viewed') || '[]') as string[];
      const updated = [product.id, ...stored.filter((id) => id !== product.id)].slice(0, 10);
      localStorage.setItem('nexcart_recently_viewed', JSON.stringify(updated));
    } catch { }
  }, [product.id]);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { id: `cart-${Date.now()}`, product, quantity, selectedColor, selectedSize }];
    });
    setAddedToCart(true);
    setIsCartOpen(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: `rev-new-${Date.now()}`,
      userId: 'current-user',
      productId: product.id,
      rating: reviewRating,
      title: reviewTitle,
      body: reviewBody,
      isVerified: false,
      createdAt: new Date().toISOString(),
      user: { id: 'current-user', name: user?.name || 'Anonymous' },
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewTitle('');
    setReviewBody('');
    setReviewRating(5);
  };

  const colors = product.colors || ['Black', 'Silver', 'White', 'Blue'];
  const sizes = product.sizes || [];

  const TABS = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: `Reviews (${reviews.length})` },
  ] as const;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

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
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/category/${product.category.slug}`} className="hover:text-amber-400 transition-colors capitalize">{product.category.name}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-5">
            {/* Brand */}
            {product.brand && (
              <div className="text-amber-400 text-sm font-bold uppercase tracking-wider">{product.brand.name}</div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.name}</h1>

            {/* Rating */}
            <StarRating rating={avgRating} count={product.reviewCount} size="sm" />

            {/* Price Block */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-extrabold text-white">
                  ₹{(finalPrice).toLocaleString('en-IN')}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="bg-green-500/20 text-green-400 text-sm font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>

              {/* Offers */}
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <Tag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300"><span className="text-white font-semibold">Bank Offer:</span> 10% off on HDFC Bank Credit Cards. T&C apply</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Tag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300"><span className="text-white font-semibold">No-cost EMI:</span> Starting ₹{Math.ceil(finalPrice / 12).toLocaleString('en-IN')}/month on select cards</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Tag className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300"><span className="text-white font-semibold">NexCart Coupon:</span> Use <strong className="text-amber-400">NEXSAVE10</strong> for extra ₹{Math.ceil(finalPrice * 0.1).toLocaleString('en-IN')} off</span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Color: <span className="text-white">{selectedColor || colors[0]}</span></p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${selectedColor === color || (!selectedColor && color === colors[0])
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                        : 'border-white/15 text-gray-400 hover:border-white/30'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Size: <span className="text-white">{selectedSize || 'Select size'}</span></p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg text-sm font-bold border transition-all ${selectedSize === size
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                        : 'border-white/15 text-gray-400 hover:border-white/30'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className={`text-sm ${product.stock > 10 ? 'text-green-400' : 'text-orange-400'}`}>
                  {product.stock > 0 ? (product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`) : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm transition-all border ${addedToCart
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
              >
                {addedToCart ? <CheckCircle className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 nex-btn-gradient flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm"
              >
                <Zap className="w-5 h-5" /> Buy Now
              </button>
              <button
                onClick={() => setWishlist((prev) => prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product])}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${wishlist.some((p) => p.id === product.id) ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-white/10 border-white/20 text-gray-400 hover:text-rose-400'}`}
              >
                <Heart className={`w-5 h-5 ${wishlist.some((p) => p.id === product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1.5">Check Delivery</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/, '').slice(0, 6))}
                    maxLength={6}
                    className="flex-1 bg-black/30 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    onClick={() => setPincodeChecked(true)}
                    disabled={pincode.length !== 6}
                    className="px-4 py-2 bg-amber-500/20 text-amber-400 font-bold text-sm rounded-lg border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-40 transition-all"
                  >
                    Check
                  </button>
                </div>
                {pincodeChecked && (
                  <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Delivery available by <strong>{getDeliveryDate(3)}</strong>
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span className="text-xs text-gray-300">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-gray-300">7-Day Return</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-xs text-gray-300">1 Year Warranty</span>
                </div>
              </div>
            </div>

            {/* EMI */}
            {finalPrice >= 5000 && <EmiSection price={finalPrice} />}

            {/* Seller Info */}
            <div className="flex items-center gap-3 text-sm border border-white/10 rounded-xl p-3 bg-white/5">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-gray-400">Sold by: </span>
                <span className="text-white font-semibold">{product.seller || 'NexCart Official Store'}</span>
                <span className="ml-2 text-xs text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">Trusted Seller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab.key ? 'border-amber-400 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-base mb-4">{product.description}</p>
              <h3 className="text-white font-bold text-lg mb-3">Key Features</h3>
              <ul className="space-y-2">
                {(product.features || [
                  'Premium build quality and materials',
                  'High performance across all use cases',
                  'Excellent battery life and efficiency',
                  'Industry-leading warranty coverage',
                  'NexCart certified authentic product',
                ]).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications || {
                    'Brand': product.brand?.name || 'N/A',
                    'Model': product.name,
                    'SKU': product.sku,
                    'Category': product.category.name,
                    'Stock': `${product.stock} units`,
                    'Rating': `${product.rating} / 5`,
                    'Reviews': `${product.reviewCount.toLocaleString()} ratings`,
                    'Warranty': product.warranty || '1 Year Manufacturer Warranty',
                    'Return Policy': product.returnPolicy || '7-Day Replacement Guarantee',
                  }).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-400 w-1/3 border-r border-white/10">{key}</td>
                      <td className="px-5 py-3 text-sm text-gray-200">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating Summary */}
              <div className="flex flex-col md:flex-row gap-8 bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex flex-col items-center justify-center md:w-40 shrink-0">
                  <div className="text-6xl font-extrabold text-amber-400">{avgRating.toFixed(1)}</div>
                  <StarRating rating={avgRating} size="sm" />
                  <div className="text-xs text-gray-400 mt-1">{reviews.length} reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingBreakdown.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-6 shrink-0">{star}★</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white/5 rounded-xl border border-white/10 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-sm shrink-0">
                          {review.user.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{review.user.name}</div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="sm" />
                            {review.isVerified && (
                              <span className="text-xs text-green-400 flex items-center gap-0.5">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {review.title && <h4 className="font-bold text-white mb-1">{review.title}</h4>}
                    <p className="text-gray-300 text-sm leading-relaxed">{review.body}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewRating(star)}>
                          <Star className={`w-7 h-7 transition-colors ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600 hover:text-amber-400'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                  />
                  <textarea
                    placeholder="Write your review here..."
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    rows={4}
                    required
                    className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!reviewBody.trim()}
                    className="nex-btn-gradient px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Frequently Bought Together */}
        {fbtProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              Frequently Bought Together
            </h2>
            <div className="flex items-center flex-wrap gap-4">
              {[product, ...fbtProducts.slice(0, 2)].map((p, i, arr) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="bg-white/5 rounded-xl border border-white/10 p-3 w-20 h-20 flex items-center justify-center overflow-hidden">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  {i < arr.length - 1 && <Plus className="w-5 h-5 text-gray-500" />}
                </div>
              ))}
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="text-sm text-gray-400 mb-1">Combined Price</div>
                <div className="text-xl font-extrabold text-white">
                  ₹{[product, ...fbtProducts.slice(0, 2)].reduce((sum, p) => sum + (p.discountPrice || p.price), 0).toLocaleString('en-IN')}
                </div>
                <button className="mt-2 nex-btn-gradient px-4 py-2 rounded-lg text-xs font-bold w-full">
                  Add All to Cart
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
              <ChevronRight className="w-6 h-6 text-amber-400" />
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlist.some((w) => w.id === p.id)}
                  onToggleWishlist={(prod) => setWishlist((prev) => prev.some((w) => w.id === prod.id) ? prev.filter((w) => w.id !== prod.id) : [...prev, prod])}
                  onAddToCart={(prod) => setCart((prev) => {
                    const existing = prev.find((item) => item.product.id === prod.id);
                    if (existing) return prev.map((item) => item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
                    return [...prev, { id: `cart-${Date.now()}`, product: prod, quantity: 1 }];
                  })}
                  onBuyNow={() => { }}
                  onQuickView={() => { }}
                  searchHighlight=""
                />
              ))}
            </div>
          </section>
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
        onProceedToCheckout={() => { setIsCartOpen(false); }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      <Footer />
    </div>
  );
}
