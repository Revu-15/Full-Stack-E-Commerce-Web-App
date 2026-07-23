import { Product, Category, Order } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Audio & Acoustics',
    slug: 'audio-acoustics',
    description: 'Premium headphones, studio monitors & spatial audio gear',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-2',
    name: 'Smart Devices',
    slug: 'smart-devices',
    description: 'Flagship smartwatches, tablets & ambient gadgets',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-3',
    name: 'Luxury Timepieces',
    slug: 'luxury-timepieces',
    description: 'Crafted mechanical movement & sapphire crystal watches',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-4',
    name: 'Apparel & Kicks',
    slug: 'apparel-kicks',
    description: 'Designer outerwear, limited edition sneakers & accessories',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Apex ANC Wireless Studio Headphones',
    slug: 'apex-anc-wireless-studio-headphones',
    description: 'Industry-leading noise cancellation, 40mm beryllium drivers, 50h battery life and lossless spatial audio.',
    price: 349.99,
    discountPrice: 299.99,
    sku: 'APX-ANC-01',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    category: MOCK_CATEGORIES[0],
    brand: { id: 'b-1', name: 'LuxeAudio', slug: 'luxeaudio' },
  },
  {
    id: 'prod-2',
    name: 'Chronos Sapphire Automatic Watch',
    slug: 'chronos-sapphire-automatic-watch',
    description: 'Precision 24-jewel automatic movement, 100m water resistance, genuine Italian leather strap.',
    price: 899.00,
    discountPrice: 799.00,
    sku: 'CHR-SAP-02',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 5.0,
    reviewCount: 42,
    isFeatured: true,
    category: MOCK_CATEGORIES[2],
    brand: { id: 'b-2', name: 'Chronos', slug: 'chronos' },
  },
  {
    id: 'prod-3',
    name: 'Pulse X Retina Smartwatch Ultra',
    slug: 'pulse-x-retina-smartwatch-ultra',
    description: 'Titanium chassis, 3000-nit OLED display, ECG monitoring, dual-frequency GPS and 7-day battery.',
    price: 499.99,
    discountPrice: 449.99,
    sku: 'PLS-RTN-03',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    reviewCount: 96,
    isFeatured: true,
    category: MOCK_CATEGORIES[1],
    brand: { id: 'b-3', name: 'PulseTech', slug: 'pulsetech' },
  },
  {
    id: 'prod-4',
    name: 'Vortex Red Edition Performance Kicks',
    slug: 'vortex-red-edition-performance-kicks',
    description: 'Carbon fiber plate, responsive nitrogen-infused foam, breathable knit upper designed for maximum speed.',
    price: 199.99,
    discountPrice: 169.99,
    sku: 'VRX-RED-04',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    reviewCount: 215,
    isFeatured: true,
    category: MOCK_CATEGORIES[3],
    brand: { id: 'b-4', name: 'Vortex Athletics', slug: 'vortex' },
  },
  {
    id: 'prod-5',
    name: 'Luminary Minimalist Desk Lamp',
    slug: 'luminary-minimalist-desk-lamp',
    description: 'Smart ambient color temperature control, Qi wireless charging pad built into anodized aluminum base.',
    price: 129.50,
    discountPrice: null,
    sku: 'LUM-DSK-05',
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    reviewCount: 38,
    isFeatured: false,
    category: MOCK_CATEGORIES[1],
    brand: { id: 'b-5', name: 'Luminary', slug: 'luminary' },
  },
  {
    id: 'prod-6',
    name: 'Acoustica Wooden Bookshelf Speakers',
    slug: 'acoustica-wooden-bookshelf-speakers',
    description: 'Hand-finished walnut cabinet, silk dome tweeters, Bluetooth 5.3 & optical input for audiophile clarity.',
    price: 449.00,
    discountPrice: 399.00,
    sku: 'ACT-WOD-06',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewCount: 84,
    isFeatured: false,
    category: MOCK_CATEGORIES[0],
    brand: { id: 'b-1', name: 'LuxeAudio', slug: 'luxeaudio' },
  },
];

export async function fetchProducts(query?: string, categorySlug?: string): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://luxecart-api-x5ek.onrender.com/api/v1';
    let url = `${baseUrl}/products?`;
    if (query) url += `search=${encodeURIComponent(query)}&`;
    if (categorySlug && categorySlug !== 'all') url += `category=${encodeURIComponent(categorySlug)}&`;

    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const rawProducts = json?.data?.products || json?.data;
      if (Array.isArray(rawProducts) && rawProducts.length > 0) {
        return rawProducts.map((p: any) => ({
          ...p,
          price: Number(p.price) || 199.99,
          discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
          category: p.category || { id: 'c-1', name: 'General', slug: 'general' },
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
          rating: Number(p.rating) || 4.8,
          reviewCount: Number(p.reviewCount) || 24,
        }));
      }
    }
  } catch (e) {
    // Fall back to mock data
  }

  let filtered = [...MOCK_PRODUCTS];
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (categorySlug && categorySlug !== 'all') {
    filtered = filtered.filter(p => p.category.slug === categorySlug);
  }
  return filtered;
}
