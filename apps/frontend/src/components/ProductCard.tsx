'use client';

import React from 'react';
import { Product } from '@/types';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Image & Action Overlay */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-bold uppercase tracking-wider">
                FEATURED
              </span>
            )}
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

        {/* Category & Brand */}
        <div className="flex items-center justify-between text-[11px] text-purple-400 font-semibold mb-1">
          <span>{product.category.name}</span>
          {product.brand && <span className="text-gray-400 font-normal">{product.brand.name}</span>}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onQuickView(product)}
          className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 cursor-pointer mb-2"
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold ml-1 text-gray-200">{product.rating}</span>
          </div>
          <span className="text-[11px] text-gray-400">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
        <div>
          <span className="text-lg font-extrabold text-white">
            ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
          </span>
          {product.discountPrice && (
            <span className="block text-xs text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="gradient-btn text-white p-2.5 rounded-xl shadow-lg shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all"
          title="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
