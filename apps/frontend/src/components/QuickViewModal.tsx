'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');

  if (!product) return null;

  const price = product.discountPrice || product.price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white z-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-amber-500 scale-105' : 'border-white/10 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                {product.category.name}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{product.name}</h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs font-bold text-gray-200">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
              <span className="text-xs text-emerald-400 ml-2 font-medium">• In Stock ({product.stock} units)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-white">₹{price.toLocaleString('en-IN')}</span>
              {product.discountPrice && (
                <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-light">{product.description}</p>

            {/* Variant Selector */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Select Color</label>
                <div className="flex gap-2">
                  {['Obsidian Black', 'Gold Yellow', 'Titanium Silver'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        selectedColor === color
                          ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Select Size / Spec</label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-amber-500 text-black font-extrabold border-transparent'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                className="flex-1 nex-btn-gradient text-black font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4 text-black font-bold" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-400" /> Free Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 1-Year Warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
