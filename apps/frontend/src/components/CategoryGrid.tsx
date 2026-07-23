'use client';

import React from 'react';
import { Category } from '@/types';
import { ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-12 border-b border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore <span className="text-amber-400">Featured Categories</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">12 major departments for everything you need</p>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
            selectedCategory === 'all'
              ? 'nex-btn-gradient border-transparent'
              : 'glass-panel text-gray-300 border-white/10 hover:border-amber-500/50'
          }`}
        >
          View All Departments
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 glass-card p-2 ${
                isSelected ? 'ring-2 ring-amber-500 border-amber-500' : ''
              }`}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">Shop Now →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
