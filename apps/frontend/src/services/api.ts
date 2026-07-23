import { Product, Category } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles', description: 'Flagship smartphones, 5G devices & accessories', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
  { id: 'cat-laptops', name: 'Laptops', slug: 'laptops', description: 'Ultra-thin ultrabooks, gaming laptops & workstations', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
  { id: 'cat-electronics', name: 'Electronics', slug: 'electronics', description: '4K Smart TVs, wireless audio, cameras & drones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: 'cat-fashion', name: 'Fashion', slug: 'fashion', description: 'Designer denim, jackets, streetwear & apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80' },
  { id: 'cat-shoes', name: 'Shoes', slug: 'shoes', description: 'Performance running kicks, sneakers & boots', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 'cat-watches', name: 'Watches', slug: 'watches', description: 'Automatic timepieces & retina smartwatches', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80' },
  { id: 'cat-grocery', name: 'Grocery', slug: 'grocery', description: 'Organic produce, gourmet coffee & pantry items', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80' },
  { id: 'cat-home', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Smart appliances, cookware & minimalist decor', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80' },
  { id: 'cat-beauty', name: 'Beauty', slug: 'beauty', description: 'Luxury skincare, fragrances & cosmetics', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { id: 'cat-books', name: 'Books', slug: 'books', description: 'Bestselling novels, tech guides & biographies', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' },
  { id: 'cat-toys', name: 'Toys', slug: 'toys', description: 'STEM kits, RC drones, action figures & games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', description: 'Fitness gear, yoga mats, dumbbells & cycles', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80' },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'Lenovo', 'Asus', 'Bose', 'Puma', 'Logitech', 'Canon', 'LG', 'KitchenAid', 'Seiko'];

export const SAMPLE_IMAGES: Record<string, string[]> = {
  mobiles: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
  ],
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f4e5f1?w=800&q=80',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  ],
  watches: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  ],
  grocery: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  ],
  'home-kitchen': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  ],
  books: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
  ],
  toys: [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
  ],
};

function generate100Products(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  const CATEGORY_PRICE_RANGES: Record<string, { min: number; max: number }> = {
    mobiles: { min: 14999, max: 89999 },
    laptops: { min: 39999, max: 139999 },
    electronics: { min: 2999, max: 49999 },
    fashion: { min: 999, max: 5999 },
    shoes: { min: 1999, max: 14999 },
    watches: { min: 2999, max: 39999 },
    grocery: { min: 299, max: 1999 },
    'home-kitchen': { min: 1499, max: 19999 },
    beauty: { min: 499, max: 4999 },
    books: { min: 399, max: 1499 },
    toys: { min: 699, max: 5999 },
    sports: { min: 899, max: 12999 },
  };

  MOCK_CATEGORIES.forEach((category) => {
    const images = SAMPLE_IMAGES[category.slug] || SAMPLE_IMAGES['electronics'];
    const itemsPerCategory = Math.floor(100 / MOCK_CATEGORIES.length) + (category.slug === 'mobiles' ? 4 : 0);
    const range = CATEGORY_PRICE_RANGES[category.slug] || { min: 999, max: 9999 };

    for (let i = 1; i <= itemsPerCategory; i++) {
      const brandName = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      const basePrice = Math.floor(Math.random() * (range.max - range.min)) + range.min;
      const discountPrice = Math.random() > 0.3 ? Math.floor(basePrice * 0.85) : null;
      const rating = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
      const reviewCount = Math.floor(Math.random() * 450) + 12;
      const selectedImg = images[(i - 1) % images.length];

      products.push({
        id: `prod-${idCounter}`,
        name: `${brandName} ${category.name.replace('&', '')} Pro ${i}`,
        slug: `${brandName.toLowerCase()}-${category.slug}-pro-${i}-${idCounter}`,
        description: `Premium ${category.name} product with top-tier build quality, 1-year warranty, fast NexPrime delivery, and high performance.`,
        price: basePrice,
        discountPrice,
        sku: `SKU-${category.slug.toUpperCase()}-${idCounter}`,
        stock: Math.floor(Math.random() * 60) + 5,
        images: [selectedImg, ...images.filter(img => img !== selectedImg)],
        rating,
        reviewCount,
        isFeatured: i <= 2,
        category,
        brand: { id: `brand-${brandName.toLowerCase()}`, name: brandName, slug: brandName.toLowerCase() },
      });

      idCounter++;
    }
  });

  return products;
}

export const MOCK_PRODUCTS: Product[] = generate100Products();

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
        return rawProducts.map((p: any, idx: number) => {
          const catSlug = p.category?.slug || categorySlug || 'electronics';
          const catImages = SAMPLE_IMAGES[catSlug] || SAMPLE_IMAGES['electronics'];
          const assignedImg = catImages[idx % catImages.length];

          // Convert dollar to Indian Rupee (INR) if price < 2000
          let rawPrice = Number(p.price) || 2999;
          if (rawPrice < 2000) {
            rawPrice = Math.round(rawPrice * 85);
          }

          let rawDiscount = p.discountPrice ? Number(p.discountPrice) : null;
          if (rawDiscount && rawDiscount < 2000) {
            rawDiscount = Math.round(rawDiscount * 85);
          }

          return {
            ...p,
            price: rawPrice,
            discountPrice: rawDiscount,
            category: p.category || { id: 'c-1', name: 'General', slug: catSlug },
            images: [assignedImg],
            rating: Number(p.rating) || 4.8,
            reviewCount: Number(p.reviewCount) || 24,
          };
        });
      }
    }
  } catch (e) {
    // Fallback to 100 generated products
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
