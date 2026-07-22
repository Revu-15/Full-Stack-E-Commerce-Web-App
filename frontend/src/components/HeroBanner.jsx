import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';

const SLIDES = [
  {
    id: 1,
    badge: 'NEW ARRIVALS 2026',
    title: 'Experience Unrivaled Precision & Acoustic Masterpieces',
    subtitle: 'Discover our flagship wireless noise-canceling audio series & handcrafted timepieces.',
    ctaText: 'Shop New Arrivals',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    discount: 'Save up to 20% with code LUXE20'
  },
  {
    id: 2,
    badge: 'ARTISAN FASHION',
    title: 'Merino Wool & Silk Cashmere Outerwear',
    subtitle: 'Tailored silhouettes designed in Milan, woven with sustainable organic merino fibers.',
    ctaText: 'Explore Apparel',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&auto=format&fit=crop&q=80',
    discount: 'Free Express Shipping Included'
  },
  {
    id: 3,
    badge: 'MODERN LIVING',
    title: 'Minimalist Architectural Home Accent Pieces',
    subtitle: 'Transform your space with warm ceramic lamps and barista-grade coffee stations.',
    ctaText: 'View Home Decor',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    discount: 'Limited Stock Available'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setFilters } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section style={{ maxWidth: '1300px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        background: '#090d16',
        color: '#ffffff',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Background HD Image with Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.45,
          transition: 'all 1s ease-in-out',
          transform: 'scale(1.02)'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(9,13,22,0.95) 0%, rgba(9,13,22,0.6) 60%, rgba(9,13,22,0.2) 100%)'
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '640px',
          padding: '3rem 2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'var(--accent-gradient)', color: '#fff' }}>
              <Zap size={14} /> {slide.badge}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
              {slide.discount}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {slide.title}
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            {slide.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => setFilters(prev => ({ ...prev, category: slide.category }))}
              style={{ fontSize: '0.95rem', padding: '0.85rem 1.8rem' }}
            >
              <span>{slide.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '2rem',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10
        }}>
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: idx === currentSlide ? '#6366f1' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Value Proposition Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginTop: '1.25rem'
      }}>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Truck size={24} color="#6366f1" />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Free Express Shipping</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On all orders over $100</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ShieldCheck size={24} color="#10b981" />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>100% Authentic Guarantee</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Curated from official brands</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <RotateCcw size={24} color="#f59e0b" />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>30-Day Easy Returns</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Complimentary return labels</p>
          </div>
        </div>
      </div>
    </section>
  );
}
