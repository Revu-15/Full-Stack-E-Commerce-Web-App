import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { ArrowRight, Sparkles, Tag, ChevronLeft, ChevronRight, Zap, ShieldCheck } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    badge: 'TODAY\'S MEGA DEAL',
    title: 'Flagship Mobiles & Laptops',
    subtitle: 'Get up to 30% instant cashback on iPhone 15 Pro, Samsung S24 Ultra & MacBook M3.',
    coupon: 'NEXCART20',
    discount: 'UP TO 30% OFF',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    category: 'Mobiles'
  },
  {
    id: 2,
    badge: 'NEW ARRIVALS 2026',
    title: 'Luxury Watches & Premium Audio',
    subtitle: 'Immerse yourself in precision craftsmanship with Sony WH-1000XM5 & Apple Watch Ultra 2.',
    coupon: 'WELCOME50',
    discount: 'SPECIAL OFFER $50 OFF',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics'
  },
  {
    id: 3,
    badge: 'FASHION & SNEAKER DROP',
    title: 'Retro Jordan 1 & Designer Wear',
    subtitle: 'Step up your style game with authentic Jordans, Levi\'s denim, and Ralph Lauren classics.',
    coupon: 'FLASH30',
    discount: 'FLAT 20% OFF',
    bg: 'linear-gradient(135deg, #881337 0%, #9f1239 50%, #be123c 100%)',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    category: 'Shoes'
  }
];

export default function HeroBanner() {
  const { setSelectedCategory } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNERS[currentSlide];

  return (
    <section style={{ maxWidth: '1440px', margin: '1rem auto 0 auto', padding: '0 1.25rem' }}>
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: slide.bg,
        color: '#ffffff',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'var(--shadow-lg)',
        transition: 'all 0.5s ease-in-out'
      }}>
        
        {/* Decorative Grid Overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
          padding: '2.5rem 3rem',
          width: '100%'
        }}>
          
          {/* Left Text Column */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              <Zap size={14} color="#f59e0b" fill="#f59e0b" />
              {slide.badge}
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              {slide.title}
            </h1>

            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '520px', marginBottom: '1.5rem' }}>
              {slide.subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedCategory(slide.category);
                  const catalogEl = document.getElementById('product-catalog-section');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '0.8rem 1.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Explore {slide.category} <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255, 255, 255, 0.3)', fontSize: '0.82rem' }}>
                <Tag size={16} color="#34d399" />
                <span>Use Promo: <strong>{slide.coupon}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Product Image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '280px',
              height: '280px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              transform: 'rotate(-2deg) scale(1.02)',
              transition: 'all 0.3s ease'
            }}>
              <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Floating Offer Tag */}
            <div style={{ position: 'absolute', top: '10px', right: '20px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 900, fontSize: '0.85rem', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}>
              {slide.discount}
            </div>
          </div>

        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide(prev => (prev === 0 ? BANNERS.length - 1 : prev - 1))}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.2)' }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % BANNERS.length)}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.2)' }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{ width: idx === currentSlide ? '24px' : '8px', height: '8px', borderRadius: '4px', background: idx === currentSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)', transition: 'all 0.3s ease' }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
