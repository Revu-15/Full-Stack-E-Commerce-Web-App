import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../services/api.js';
import ProductCard from './ProductCard.jsx';
import {
  SlidersHorizontal, Flame, Star, Tag, RefreshCw, X, Search, ChevronRight, Zap, Trophy, History, Clock
} from 'lucide-react';

export default function ProductCatalog() {
  const {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    selectedBrand, setSelectedBrand,
    priceRange, setPriceRange,
    minRating, setMinRating,
    minDiscount, setMinDiscount,
    inStockOnly, setInStockOnly,
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize,
    sortBy, setSortBy,
    recentlyViewed
  } = useShop();

  const [products, setProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch products whenever search or filter state changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const queryFilters = {
          category: selectedCategory,
          search: searchQuery,
          brand: selectedBrand !== 'all' ? selectedBrand : '',
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          rating: minRating,
          minDiscount: minDiscount,
          inStock: inStockOnly,
          color: selectedColor !== 'all' ? selectedColor : '',
          size: selectedSize !== 'all' ? selectedSize : '',
          sort: sortBy,
          limit: 150
        };

        const res = await api.fetchProducts(queryFilters);

        if (isMounted) {
          setProducts(res.products || []);
          setTotalCount(res.total || 0);
          if (res.availableBrands) setAvailableBrands(res.availableBrands);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [
    selectedCategory, searchQuery, selectedBrand, priceRange,
    minRating, minDiscount, inStockOnly, selectedColor, selectedSize, sortBy
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedBrand('all');
    setPriceRange({ min: '', max: '' });
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSelectedColor('all');
    setSelectedSize('all');
    setSortBy('featured');
  };

  const isFilteringActive =
    selectedCategory !== 'All' ||
    searchQuery !== '' ||
    selectedBrand !== 'all' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    minRating > 0 ||
    minDiscount > 0 ||
    inStockOnly ||
    selectedColor !== 'all' ||
    selectedSize !== 'all';

  // Section collections
  const todaysDeals = products.filter(p => p.isDealOfDay || (p.discount && p.discount >= 15));
  const bestSellers = products.filter(p => p.isBestSeller || (p.reviewCount && p.reviewCount >= 2000));
  const trendingProducts = products.filter(p => p.isTrending || (p.rating && p.rating >= 4.8));

  return (
    <section id="product-catalog-section" style={{ maxWidth: '1440px', margin: '2rem auto', padding: '0 1.25rem' }}>
      
      {/* Category Header Title */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedCategory === 'All' ? 'All NexCart Products' : `${selectedCategory} Collection`}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              {totalCount} Items
            </span>
          </h2>
          {searchQuery && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Showing results matching "<strong>{searchQuery}</strong>"
            </p>
          )}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Featured / Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="best-selling">Best Selling / Popularity</option>
            <option value="highest-rated">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid Container with Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* FILTER SIDEBAR */}
        <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--accent-primary)' }} /> Filters
            </h3>
            {isFilteringActive && (
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* 1. Category Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto' }}>
              {['All', 'Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Shoes', 'Watches', 'Grocery', 'Home & Kitchen', 'Beauty', 'Books', 'Toys', 'Sports'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.83rem',
                    padding: '0.35rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: selectedCategory === cat ? 800 : 500,
                    color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    background: selectedCategory === cat ? 'var(--bg-secondary)' : 'transparent'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Brand Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Brand
            </h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.83rem' }}
            >
              <option value="all">All Brands</option>
              {availableBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* 3. Price Range */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Price Range (₹)
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* 4. Customer Rating */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Rating
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[4, 3, 2, 1].map(stars => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    padding: '0.3rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: minRating === stars ? 800 : 500,
                    background: minRating === stars ? '#fef3c7' : 'transparent',
                    color: minRating === stars ? '#b45309' : 'var(--text-secondary)'
                  }}
                >
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{stars} Stars & Above</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Discount Percentage */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Discount
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[50, 30, 20, 10].map(disc => (
                <button
                  key={disc}
                  onClick={() => setMinDiscount(minDiscount === disc ? 0 : disc)}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    padding: '0.3rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: minDiscount === disc ? 800 : 500,
                    background: minDiscount === disc ? 'var(--bg-secondary)' : 'transparent',
                    color: minDiscount === disc ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {disc}% Off or More
                </button>
              ))}
            </div>
          </div>

          {/* 6. Availability */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
              />
              In Stock Only
            </label>
          </div>

        </aside>

        {/* PRODUCTS MAIN DISPLAY */}
        <div>
          
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} style={{ height: '320px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* NO RESULTS PAGE */
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--text-muted)' }}>
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                We couldn't find any items matching your current search or filter combination. Try adjusting your filters or search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.88rem' }}
              >
                Clear All Filters & View All
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* SPECIAL FEATURE SECTIONS (When viewing All category) */}
              {selectedCategory === 'All' && !searchQuery && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  
                  {/* Today's Deals Section */}
                  {todaysDeals.length > 0 && (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Zap size={22} color="#dc2626" fill="#dc2626" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Today's Deals</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                        {todaysDeals.slice(0, 4).map(p => (
                          <ProductCard key={`deal-${p.id}`} product={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Best Sellers Section */}
                  {bestSellers.length > 0 && (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Trophy size={22} color="#f59e0b" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Best Sellers</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                        {bestSellers.slice(0, 4).map(p => (
                          <ProductCard key={`best-${p.id}`} product={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recently Viewed Section */}
                  {recentlyViewed.length > 0 && (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Clock size={22} color="var(--accent-primary)" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Recently Viewed</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                        {recentlyViewed.slice(0, 4).map(p => (
                          <ProductCard key={`recent-${p.id}`} product={p} />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          )}

        </div>

      </div>
    </section>
  );
}
