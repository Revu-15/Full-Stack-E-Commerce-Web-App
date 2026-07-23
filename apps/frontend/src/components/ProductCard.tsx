'use client';

import React from 'react';
import { Product } from '@/types';
import { Heart, ShoppingBag, Eye, Star, Zap, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="group relative glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Image & Action Overlay */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> NexPrime
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist(product)}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
              isWishlisted
                ? 'bg-pink-500 text-white'
                : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/70'
            }`}
            title="Add to Wishlist"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onQuickView(product)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 transition-transform scale-95 group-hover:scale-100"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Brand & Stock Status */}
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-amber-400 font-bold">{product.brand?.name || 'NexCart Brand'}</span>
          <span className={`font-semibold ${product.stock > 10 ? 'text-emerald-400' : 'text-pink-400'}`}>
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onQuickView(product)}
          className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer mb-1.5"
        >
          {product.name}
        </h3>

        {/* Rating Stars & Review Count */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold ml-1 text-gray-200">{product.rating}</span>
          </div>
          <span className="text-[11px] text-gray-400">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Pricing & Buttons */}
      <div className="space-y-2 pt-2 border-t border-white/10 mt-1">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-extrabold text-white">${currentPrice.toFixed(2)}</span>
            {product.discountPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">${product.price.toFixed(2)}</span>
            )}
          </div>
          <span className="text-[10px] text-gray-400">Free Delivery</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add Cart</span>
          </button>

          <button
            onClick={() => onBuyNow(product)}
            className="nex-btn-gradient text-xs font-extrabold py-2 rounded-xl transition-transform active:scale-95 shadow-md shadow-amber-500/20"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
