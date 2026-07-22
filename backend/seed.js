import { db } from './db.js';

const initialCategories = [
  {
    id: 'cat_electronics',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Cutting-edge gadgets, audio gear, and smart devices.'
  },
  {
    id: 'cat_fashion',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    description: 'Designer apparel, luxury streetwear, and footwear.'
  },
  {
    id: 'cat_home',
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    description: 'Modern furniture, minimalist lighting, and home decor.'
  },
  {
    id: 'cat_accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Timeless luxury watches, eyewear, and leather goods.'
  }
];

const initialProducts = [
  {
    id: 'prod_1',
    title: 'AuraSound Max Wireless ANC Headphones',
    price: 299.99,
    originalPrice: 349.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 128,
    stock: 25,
    tags: ['Best Seller', 'ANC', 'Wireless'],
    description: 'Immerse yourself in pristine acoustics with custom 40mm beryllium drivers, active hybrid noise cancellation, 40-hour battery life, and spatial audio support.',
    specs: {
      'Battery Life': '40 Hours with ANC on',
      'Bluetooth Version': '5.3 Codec Support (LDAC, AAC)',
      'Charging': 'USB-C Fast Charging (10 min = 5 hours)',
      'Weight': '250g'
    },
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'prod_2',
    title: 'Chronos Heritage Mechanical Watch',
    price: 450.00,
    originalPrice: 599.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 64,
    stock: 12,
    tags: ['Luxury', 'Mechanical', 'Handcrafted'],
    description: 'Precision Swiss-inspired mechanical movement encased in 316L surgical stainless steel with a scratch-resistant sapphire crystal lens and genuine Italian leather strap.',
    specs: {
      'Movement': 'Automatic 24-Jewel Self-Winding',
      'Case Diameter': '41mm',
      'Water Resistance': '50 Meters (5 ATM)',
      'Strap Material': 'Full-Grain Italian Calfskin'
    },
    isFeatured: true,
    isTrending: false
  },
  {
    id: 'prod_3',
    title: 'Minimalist Artisan Wool Blend Trench Coat',
    price: 289.00,
    originalPrice: 380.00,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 42,
    stock: 8,
    tags: ['Designer', 'Winter', 'Sustainable'],
    description: 'Elegantly tailored outerwear crafted from double-faced Merino wool blend. Features clean lapels, storm flaps, and a removable waist belt for a sleek silhouette.',
    specs: {
      'Material': '80% Merino Wool, 20% Recycled Cashmere',
      'Fit': 'Relaxed Oversized Fit',
      'Care': 'Dry Clean Only',
      'Origin': 'Made in Portugal'
    },
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'prod_4',
    title: 'Nordic Sculptural Ceramic Desk Lamp',
    price: 135.00,
    originalPrice: 169.00,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 89,
    stock: 18,
    tags: ['Eco', 'Handmade', 'Warm Light'],
    description: 'Contemporary architectural table lamp featuring a matte terracotta ceramic base and a textured linen diffuser shade that emits soft, ambient illumination.',
    specs: {
      'Light Source': 'Warm LED 2700K (Included)',
      'Switch': 'Touch Dimmer Slider (10%-100%)',
      'Dimensions': '38cm Height x 24cm Base Width',
      'Cord Length': '2.0m Braided Fabric Cable'
    },
    isFeatured: true,
    isTrending: false
  },
  {
    id: 'prod_5',
    title: 'UrbanTech Water-Resistant Modular Backpack',
    price: 179.50,
    originalPrice: 220.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 95,
    stock: 30,
    tags: ['Waterproof', 'Laptop Sleeve', 'Travel'],
    description: 'Engineered for daily commuters and digital nomads. Constructed from 1000D Cordura nylon with an expanded 28L volume, magnetic Fidlock buckles, and RFID anti-theft pocket.',
    specs: {
      'Laptop Compartment': 'Fits up to 16" MacBook Pro',
      'Capacity': '22L - 28L Expandable',
      'Material': 'Ballistic Nylon with TPU Water Coating',
      'Weight': '1.1 kg'
    },
    isFeatured: false,
    isTrending: true
  },
  {
    id: 'prod_6',
    title: 'LuxeVision Ultra-HD Smart Projector',
    price: 649.00,
    originalPrice: 799.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviewCount: 37,
    stock: 5,
    tags: ['4K Cinema', 'Smart TV', 'Dolby Audio'],
    description: 'Transform any wall into a 150-inch cinema with 2200 ANSI Lumens brightness, auto-keystone correction, integrated Harman Kardon speakers, and native Netflix streaming.',
    specs: {
      'Resolution': '4K UHD (3840 x 2160)',
      'Brightness': '2200 ANSI Lumens',
      'Audio': 'Dual 10W Harman Kardon Speakers',
      'OS': 'Android TV 11.0'
    },
    isFeatured: false,
    isTrending: true
  },
  {
    id: 'prod_7',
    title: 'Silk & Cashmere Ribbed Knit Cardigan',
    price: 195.00,
    originalPrice: 240.00,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 51,
    stock: 14,
    tags: ['Soft Touch', 'Knitwear', 'Premium'],
    description: 'Ultra-soft cardigan spun from a luxurious silk-cashmere yarn blend. Features genuine mother-of-pearl buttons and deep side pockets.',
    specs: {
      'Material': '70% Mongolian Cashmere, 30% Mulberry Silk',
      'Closure': 'Mother of Pearl Buttons',
      'Fit': 'Tailored Slim Fit'
    },
    isFeatured: false,
    isTrending: false
  },
  {
    id: 'prod_8',
    title: 'AuraBar Pour-Over Coffee Station',
    price: 160.00,
    originalPrice: 199.00,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1517668808822-9e428824603b?w=800&auto=format&fit=crop&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 76,
    stock: 22,
    tags: ['Barista Grade', 'Coffee', 'Stainless Steel'],
    description: 'Craft pour-over coffee like a master barista. Includes double-walled borosilicate glass carafe, precision gooseneck kettle, and digital micro-gram scale.',
    specs: {
      'Carafe Capacity': '800ml (4 Cups)',
      'Filter Type': 'Reusable Titanium Coated Stainless Steel Mesh',
      'Kettle': 'Variable Temperature Control (100°F - 212°F)'
    },
    isFeatured: true,
    isTrending: true
  }
];

const initialReviews = [
  {
    id: 'rev_101',
    productId: 'prod_1',
    user: 'Sarah Jenkins',
    rating: 5,
    comment: 'The noise cancellation is mind-blowing! Comfortable enough to wear through transatlantic flights.',
    date: '2026-06-14'
  },
  {
    id: 'rev_102',
    productId: 'prod_1',
    user: 'Marcus Vance',
    rating: 5,
    comment: 'Audio quality rivals headphones twice the price. Deep bass without muddying mids.',
    date: '2026-07-02'
  },
  {
    id: 'rev_103',
    productId: 'prod_2',
    user: 'David K.',
    rating: 5,
    comment: 'Stunning craftsmanship. The blue second hand gives it such an understated elegance.',
    date: '2026-05-29'
  }
];

export function seedDatabase() {
  const data = {
    categories: initialCategories,
    products: initialProducts,
    orders: [],
    coupons: [
      { code: 'LUXE10', type: 'percent', value: 10, minSpend: 50, description: '10% off on orders over $50' },
      { code: 'LUXE20', type: 'percent', value: 20, minSpend: 150, description: '20% off on orders over $150' },
      { code: 'WELCOME50', type: 'fixed', value: 50, minSpend: 200, description: '$50 off on orders over $200' }
    ],
    reviews: initialReviews
  };

  db.saveData(data);
  console.log('✅ Database successfully seeded with products, categories & reviews!');
}

seedDatabase();
