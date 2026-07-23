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
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Browse through our curated premium collections</p>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
            selectedCategory === 'all'
              ? 'gradient-btn text-white border-transparent'
              : 'glass-panel text-gray-300 border-white/10 hover:border-purple-500/50'
          }`}
        >
          View All Items
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 glass-card p-2 ${
                isSelected ? 'ring-2 ring-purple-500 border-purple-500' : ''
              }`}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-300 line-clamp-1">{cat.description}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-purple-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
