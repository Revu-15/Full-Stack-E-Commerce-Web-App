import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { fetchProducts } from '../services/api.js';
import ProductCard from './ProductCard.jsx';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, AlertCircle, Filter } from 'lucide-react';

export default function ProductCatalog() {
  const { filters, setFilters } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(filters);
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error(err);
        setError('Unable to fetch products from backend API.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'featured',
      inStock: false
    });
  };

  return (
    <section style={{ maxWidth: '1300px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Top Filter & Sort Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {filters.category === 'all' ? 'All Collections' : filters.category}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {products.length} of {totalCount} curated luxury items
          </p>
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
          <select
            value={filters.sort || 'featured'}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <option value="featured">Featured / Recommended</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Customer Rating</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Sidebar Filters */}
        <aside className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              Reset All
            </button>
          </div>

          {/* Search Active Indicator */}
          {filters.search && (
            <div style={{
              background: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Search: "{filters.search}"</span>
              <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>×</button>
            </div>
          )}

          {/* Price Range Filter */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Max Price: ${filters.maxPrice || '1000'}
            </label>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={filters.maxPrice || 1000}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>$20</span>
              <span>$1000+</span>
            </div>
          </div>

          {/* In-Stock Only Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
            />
            <span>In Stock Only</span>
          </label>

          {/* Popular Tag Filters */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Filter by Tag
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['Best Seller', 'Luxury', 'Wireless', 'Designer', 'Sustainable', 'ANC'].map(tag => {
                const isSelected = filters.tag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setFilters(prev => ({ ...prev, tag: isSelected ? '' : tag }))}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="glass-card" style={{ height: '340px', background: 'var(--bg-secondary)', opacity: 0.6 }} />
              ))}
            </div>
          ) : error ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
              <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
              <p>{error}</p>
              <button onClick={() => setFilters({ ...filters })} className="btn-secondary" style={{ marginTop: '1rem' }}>
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products match your criteria</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Try adjusting your search terms, price slider, or category filters.
              </p>
              <button onClick={handleResetFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}>
              {products.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
