import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

const categories = [
  { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', description: 'Flagship smartphones, 5G devices & mobile accessories' },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop', description: 'High-performance laptops, ultrabooks & gaming rigs' },
  { id: 'electronics', name: 'Electronics', icon: 'Headphones', description: 'Audio, cameras, smart displays & accessories' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', description: 'Trendy apparel, designer wear & seasonal collections' },
  { id: 'shoes', name: 'Shoes', icon: 'Footprints', description: 'Sneakers, formal shoes, running & athletic footwear' },
  { id: 'watches', name: 'Watches', icon: 'Watch', description: 'Luxury timepieces, smartwatches & fitness bands' },
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingBag', description: 'Organic staples, gourmet foods & daily essentials' },
  { id: 'home-kitchen', name: 'Home & Kitchen', icon: 'Home', description: 'Smart appliances, cookware & interior decor' },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', description: 'Skincare, cosmetics, hair care & luxury fragrances' },
  { id: 'books', name: 'Books', icon: 'BookOpen', description: 'Bestsellers, tech manuals, fiction & self-help' },
  { id: 'toys', name: 'Toys', icon: 'Gamepad2', description: 'Action figures, LEGO sets, educational toys & games' },
  { id: 'sports', name: 'Sports', icon: 'Trophy', description: 'Fitness gear, outdoor sports equipment & activewear' }
];

const sampleProducts = [
  // --- 1. MOBILES ---
  {
    id: 'mob-01',
    title: 'Apple iPhone 15 Pro Max (256GB, Titanium Black)',
    brand: 'Apple',
    category: 'Mobiles',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    rating: 4.9,
    reviewCount: 3420,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and 48MP 5x telephoto camera system.',
    features: ['A17 Pro chip with 6-core GPU', '6.7-inch Super Retina XDR display 120Hz', '48MP Main camera with 5x Telephoto zoom', 'Titanium design with Ceramic Shield'],
    specifications: { 'Display': '6.7-inch OLED Super Retina XDR', 'Processor': 'Apple A17 Pro (3nm)', 'Storage': '256GB NVMe', 'Camera': '48MP + 12MP Ultra Wide + 12MP 5x Telephoto' },
    seller: { name: 'NexCart Apple Authorized Store', rating: 4.9, returnPolicy: '7 Days Replacement', warranty: '1 Year Apple Brand Warranty' },
    deliveryDays: 1, freeDelivery: true, colors: ['Titanium Black', 'Natural Titanium', 'Blue Titanium'], sizes: ['128GB', '256GB', '512GB', '1TB'],
    offers: ['10% Instant Discount on HDFC Cards', 'No Cost EMI starts at $100/mo'], coupons: ['IPHONE100', 'NEXCART10'], tags: ['bestseller', 'deal', 'trending'], isFeatured: true, isTrending: true, isBestSeller: true, isDealOfDay: true
  },
  {
    id: 'mob-02',
    title: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)',
    brand: 'Samsung',
    category: 'Mobiles',
    price: 1299,
    originalPrice: 1419,
    discount: 8,
    rating: 4.8,
    reviewCount: 2150,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Welcome to mobile AI. Galaxy S24 Ultra brings Circle to Search, Live Translate, 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3 for Galaxy.',
    features: ['Live Translate & Circle to Search with Galaxy AI', '200MP Quad Telephoto Camera System', 'Built-in S Pen for drawing and precision control', 'Snapdragon 8 Gen 3'],
    specifications: { 'Display': '6.8-inch QHD+ Dynamic AMOLED 2X', 'Processor': 'Snapdragon 8 Gen 3', 'RAM & Storage': '12GB RAM, 512GB UFS 4.0' },
    seller: { name: 'Samsung Official Flagship', rating: 4.8, returnPolicy: '7 Days Replacement', warranty: '1 Year Samsung Warranty' },
    deliveryDays: 2, freeDelivery: true, colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'], sizes: ['256GB', '512GB', '1TB'],
    offers: ['Instant Cashback $120 on ICICI Cards'], coupons: ['SAMSUNG50', 'NEXCART10'], tags: ['trending', '5g', 'ai'], isFeatured: true, isTrending: true
  },
  {
    id: 'mob-03',
    title: 'Google Pixel 8 Pro (128GB, Bay Blue)',
    brand: 'Google',
    category: 'Mobiles',
    price: 799,
    originalPrice: 999,
    discount: 20,
    rating: 4.7,
    reviewCount: 1540,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The all-pro phone engineered by Google. Powered by Google Tensor G3 and custom Google AI for astonishing photos and Magic Audio Eraser.',
    features: ['Tensor G3 processor engineered for AI', 'Best Take & Magic Audio Eraser photo tools', '7 years guaranteed OS & security updates'],
    specifications: { 'Display': '6.7-inch Super Actua Display 120Hz', 'Processor': 'Google Tensor G3', 'Camera': '50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto' },
    seller: { name: 'Google Store Online', rating: 4.7, returnPolicy: '7 Days Replacement', warranty: '1 Year Warranty' },
    deliveryDays: 2, freeDelivery: true, colors: ['Bay Blue', 'Obsidian', 'Porcelain'], sizes: ['128GB', '256GB'],
    offers: ['Save $200 with trade-in'], coupons: ['PIXEL20'], tags: ['deal', 'trending'], isFeatured: true, isDealOfDay: true
  },
  {
    id: 'mob-04',
    title: 'OnePlus 12 5G (16GB RAM, 512GB, Silky Black)',
    brand: 'OnePlus',
    category: 'Mobiles',
    price: 799,
    originalPrice: 899,
    discount: 11,
    rating: 4.6,
    reviewCount: 980,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3 with 100W SUPERVOOC Fast Charging and 4th Gen Hasselblad Camera System.',
    features: ['100W SUPERVOOC Fast Charging', '4th Gen Hasselblad Camera', 'ProXDR 2K 120Hz Display'],
    specifications: { 'Display': '6.82-inch QHD+ 120Hz AMOLED', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '16GB LPDDR5X' },
    seller: { name: 'OnePlus Official', rating: 4.8, returnPolicy: '7 Days Replacement', warranty: '1 Year Warranty' },
    deliveryDays: 1, freeDelivery: true, colors: ['Silky Black', 'Flowy Emerald'], sizes: ['256GB', '512GB'],
    offers: ['Instant discount on HDFC Cards'], coupons: ['ONEPLUS10'], tags: ['5g', 'fastcharge']
  },
  {
    id: 'mob-05',
    title: 'Xiaomi 14 Ultra (16GB, 512GB, White)',
    brand: 'Xiaomi',
    category: 'Mobiles',
    price: 1099,
    originalPrice: 1299,
    discount: 15,
    rating: 4.7,
    reviewCount: 650,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Leica Quad Camera System with stepless variable aperture and 1-inch sensor for legendary mobile photography.',
    features: ['Leica Summilux Optical Lens', 'Snapdragon 8 Gen 3', '90W HyperCharge'],
    specifications: { 'Display': '6.73-inch WQHD+ AMOLED', 'Camera': '50MP 1-inch + 50MP + 50MP + 50MP' },
    seller: { name: 'Xiaomi Store', rating: 4.6, returnPolicy: '7 Days Replacement', warranty: '1 Year Warranty' },
    deliveryDays: 3, freeDelivery: true, colors: ['White', 'Black'], sizes: ['512GB'],
    offers: ['Free Photography Kit with purchase'], coupons: ['XIAOMI15'], tags: ['camera']
  },

  // --- 2. LAPTOPS ---
  {
    id: 'lap-01',
    title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD, Space Black)',
    brand: 'Apple',
    category: 'Laptops',
    price: 3499,
    originalPrice: 3899,
    discount: 10,
    rating: 4.9,
    reviewCount: 890,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The 16-inch MacBook Pro blasts forward with M3 Max, an advanced chip that brings massive performance for extreme creative workflows.',
    features: ['M3 Max chip with 16-core CPU and 40-core GPU', '36GB Unified Memory, 1TB SSD', '16.2-inch Liquid Retina XDR 120Hz display', 'Up to 22 hours battery life'],
    specifications: { 'Display': '16.2" Liquid Retina XDR 120Hz', 'Processor': 'Apple M3 Max (16 CPU / 40 GPU)', 'RAM': '36GB Unified Memory', 'Storage': '1TB NVMe SSD' },
    seller: { name: 'Apple Authorized Reseller', rating: 4.9, returnPolicy: '14 Days Replacement', warranty: '1 Year AppleCare' },
    deliveryDays: 1, freeDelivery: true, colors: ['Space Black', 'Silver'], sizes: ['36GB RAM / 1TB SSD'],
    offers: ['No Cost EMI starts at $291/mo'], coupons: ['MACBOOK100'], tags: ['bestseller', 'pro', 'trending'], isFeatured: true, isBestSeller: true
  },
  {
    id: 'lap-02',
    title: 'Dell XPS 15 9530 Touchscreen (i9-13900H, RTX 4070, 32GB RAM, 1TB SSD)',
    brand: 'Dell',
    category: 'Laptops',
    price: 2499,
    originalPrice: 2799,
    discount: 11,
    rating: 4.7,
    reviewCount: 620,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse yourself in content with bright 3.5K OLED touchscreen display, CNC machined aluminum chassis, and RTX 4070 graphics.',
    features: ['3.5K OLED Touch Display', 'NVIDIA GeForce RTX 4070 8GB', 'CNC machined aluminum chassis'],
    specifications: { 'CPU': 'Intel Core i9-13900H', 'GPU': 'RTX 4070', 'RAM': '32GB DDR5', 'Storage': '1TB SSD' },
    seller: { name: 'Dell Premier Store', rating: 4.8, returnPolicy: '14 Days', warranty: '1 Year Premium Support' },
    deliveryDays: 2, freeDelivery: true, colors: ['Platinum Silver'], sizes: ['3.5K OLED'],
    offers: ['Free Dell Wireless Mouse'], coupons: ['DELL100'], tags: ['creator', 'touch']
  },

  // --- 3. ELECTRONICS ---
  {
    id: 'ele-01',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)',
    brand: 'Sony',
    category: 'Electronics',
    price: 348,
    originalPrice: 399,
    discount: 13,
    rating: 4.8,
    reviewCount: 5120,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Industry-leading noise cancellation with two processors and 8 microphones for unparalleled audio quality and crystal-clear call quality.',
    features: ['Auto NC Optimizer adjusts based on environment', 'Up to 30-hour battery life with fast charge', 'Lightweight soft leatherette design'],
    specifications: { 'Driver Unit': '30mm', 'Battery Life': '30 Hours (NC ON)', 'Connectivity': 'Bluetooth 5.2, 3.5mm Aux' },
    seller: { name: 'Sony Direct Store', rating: 4.9, returnPolicy: '7 Days Replacement', warranty: '1 Year Sony Warranty' },
    deliveryDays: 1, freeDelivery: true, colors: ['Black', 'Silver', 'Midnight Blue'], sizes: ['Standard'],
    offers: ['Free carrying case included'], coupons: ['SONY20'], tags: ['bestseller', 'deal', 'audio'], isFeatured: true, isBestSeller: true, isDealOfDay: true
  },
  {
    id: 'ele-02',
    title: 'Apple iPad Pro 11-inch M4 Chip (256GB, Wi-Fi, Space Black)',
    brand: 'Apple',
    category: 'Electronics',
    price: 999,
    originalPrice: 1099,
    discount: 9,
    rating: 4.9,
    reviewCount: 1140,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The impossibly thin iPad Pro features a breakthrough Ultra Retina XDR OLED display, outrageous performance of M4 chip, and superfast wireless.',
    features: ['Tandem OLED Ultra Retina XDR Display', 'Apple M4 chip with 9-core CPU', 'Supports Apple Pencil Pro'],
    specifications: { 'Display': '11" Ultra Retina XDR OLED', 'Storage': '256GB', 'Thickness': '5.3 mm' },
    seller: { name: 'Apple Authorized Store', rating: 4.9, returnPolicy: '14 Days', warranty: '1 Year Apple Warranty' },
    deliveryDays: 1, freeDelivery: true, colors: ['Space Black', 'Silver'], sizes: ['256GB', '512GB'],
    offers: ['Trade in discount up to $150'], coupons: ['IPAD50'], tags: ['pro', 'tablet']
  },

  // --- 4. FASHION ---
  {
    id: 'fas-01',
    title: 'Levi\'s Men\'s Original Trucker Denim Jacket (Rigid Dark Indigo)',
    brand: 'Levi\'s',
    category: 'Fashion',
    price: 79,
    originalPrice: 98,
    discount: 19,
    rating: 4.7,
    reviewCount: 1840,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The original denim jacket since 1967. A symbol of self-expression for generations, crafted with 100% heavy cotton denim.',
    features: ['Regular fit through body and chest', 'Point collar with front button placket', 'Side welt pockets & chest patch pockets'],
    specifications: { 'Material': '100% Cotton Denim', 'Care': 'Machine wash cold', 'Fit': 'Regular Classic' },
    seller: { name: 'Levi\'s Official Store', rating: 4.8, returnPolicy: '30 Days Easy Returns', warranty: 'Authenticity Guaranteed' },
    deliveryDays: 2, freeDelivery: true, colors: ['Rigid Dark Indigo', 'Light Wash', 'Black Steel'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    offers: ['Buy 2 Get 15% Off'], coupons: ['LEVIS15'], tags: ['bestseller', 'denim'], isFeatured: true, isBestSeller: true
  },
  {
    id: 'fas-02',
    title: 'Nike Sportswear Tech Fleece Full-Zip Hoodie (Dark Grey Heather)',
    brand: 'Nike',
    category: 'Fashion',
    price: 125,
    originalPrice: 145,
    discount: 14,
    rating: 4.8,
    reviewCount: 2900,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Premium lightweight fleece that is smooth both inside and out, giving you plenty of warmth without adding bulk.',
    features: ['Zippered sleeve pocket for quick storage', '4-panel hood for streamlined look', 'Transparent taping highlights heritage lines'],
    specifications: { 'Material': '53% Cotton / 47% Polyester', 'Fit': 'Standard Fit' },
    seller: { name: 'Nike Retail Hub', rating: 4.9, returnPolicy: '30 Days Returns', warranty: 'Genuine Nike Product' },
    deliveryDays: 1, freeDelivery: true, colors: ['Dark Grey', 'Black', 'Olive Green'], sizes: ['S', 'M', 'L', 'XL'],
    offers: ['Free Shipping for Nike Members'], coupons: ['NIKE10'], tags: ['sportswear', 'trending']
  },

  // --- 5. SHOES ---
  {
    id: 'sho-01',
    title: 'Nike Air Jordan 1 Retro High OG (Chicago Lost & Found)',
    brand: 'Nike',
    category: 'Shoes',
    price: 180,
    originalPrice: 210,
    discount: 14,
    rating: 4.9,
    reviewCount: 4890,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The sneaker that started it all. Featuring vintage cracked leather accents and classic Varsity Red, Black, and Sail colorway.',
    features: ['Encapsulated Air-Sole unit in heel', 'Genuine leather upper', 'Solid rubber outsole for traction'],
    specifications: { 'Upper': 'Premium Full-Grain Leather', 'Sole': 'Rubber Cupsole with Air', 'Style': 'High Top Sneaker' },
    seller: { name: 'Nike Jordan Official', rating: 4.9, returnPolicy: '30 Days Returns', warranty: 'Authentic Jordan Brand' },
    deliveryDays: 1, freeDelivery: true, colors: ['Chicago Red/Black', 'Royal Blue'], sizes: ['8', '9', '10', '11', '12'],
    offers: ['Free Express Delivery', 'Collectible box included'], coupons: ['JORDAN20'], tags: ['bestseller', 'sneakers', 'trending'], isFeatured: true, isBestSeller: true
  },
  {
    id: 'sho-02',
    title: 'Adidas Ultraboost Light Running Shoes (Core Black / Solar Red)',
    brand: 'Adidas',
    category: 'Shoes',
    price: 150,
    originalPrice: 190,
    discount: 21,
    rating: 4.8,
    reviewCount: 3410,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience epic energy with the lightest Ultraboost ever made. Light BOOST cushioning material gives maximum return.',
    features: ['30% lighter Light BOOST material', 'PRIMEKNIT+ textile upper snug fit', 'Continental Rubber outsole for extraordinary grip'],
    specifications: { 'Weight': '299g (Size 9)', 'Midsole Drop': '10 mm', 'Upper': 'Adidas PRIMEKNIT' },
    seller: { name: 'Adidas Running Hub', rating: 4.8, returnPolicy: '30 Days', warranty: 'Original Adidas' },
    deliveryDays: 1, freeDelivery: true, colors: ['Core Black', 'Cloud White'], sizes: ['7', '8', '9', '10', '11'],
    offers: ['15% off code ULTRABOOST'], coupons: ['ULTRA15'], tags: ['running', 'boost']
  },

  // --- 6. WATCHES ---
  {
    id: 'wat-01',
    title: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium Case, Indigo Alpine Loop)',
    brand: 'Apple',
    category: 'Watches',
    price: 799,
    originalPrice: 849,
    discount: 6,
    rating: 4.9,
    reviewCount: 2150,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The ultimate sports and adventure watch. Powered by S9 SiP with 3000 nits display brightness and up to 72 hours in Low Power Mode.',
    features: ['49mm corrosion-resistant titanium case with sapphire front crystal', 'S9 SiP with Double Tap gesture control', 'Precision dual-frequency GPS system'],
    specifications: { 'Case': '49mm Aerospace Titanium', 'Display': '3000 nits Always-On Retina OLED', 'Battery': '36 to 72 Hours' },
    seller: { name: 'Apple Authorized Store', rating: 4.9, returnPolicy: '14 Days', warranty: '1 Year AppleCare' },
    deliveryDays: 1, freeDelivery: true, colors: ['Indigo Alpine Loop', 'Olive Alpine Loop'], sizes: ['Small', 'Medium', 'Large'],
    offers: ['No Cost EMI starting at $66/mo'], coupons: ['ULTRA50'], tags: ['bestseller', 'smartwatch', 'trending'], isFeatured: true, isBestSeller: true
  },

  // --- 7. GROCERY ---
  {
    id: 'gro-01',
    title: 'California Premium Whole Raw Almonds (3 Lbs Bag)',
    brand: 'Kirkland Signature',
    category: 'Grocery',
    price: 18.99,
    originalPrice: 24.99,
    discount: 24,
    rating: 4.8,
    reviewCount: 8400,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1508061252966-dfd30969eff2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% natural raw un-roasted un-salted California almonds packed with protein, healthy fats, and Vitamin E.',
    features: ['Heart-healthy plant-based protein snack', 'No additives, non-GMO, gluten-free', 'Resealable zipper bag for freshness'],
    specifications: { 'Weight': '3 lbs (1.36 kg)', 'Dietary': 'Non-GMO, Vegan, Gluten-Free' },
    seller: { name: 'NexCart Fresh Pantry', rating: 4.9, returnPolicy: 'Non-Returnable (Fresh Item)', warranty: 'Quality Guarantee' },
    deliveryDays: 1, freeDelivery: true, colors: ['Natural Raw'], sizes: ['3 Lbs'],
    offers: ['Subscribe & Save 10% extra'], coupons: ['PANTRY10'], tags: ['bestseller', 'organic'], isBestSeller: true
  },

  // --- 8. HOME & KITCHEN ---
  {
    id: 'hom-01',
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner (Yellow/Nickel)',
    brand: 'Dyson',
    category: 'Home & Kitchen',
    price: 649,
    originalPrice: 749,
    discount: 13,
    rating: 4.8,
    reviewCount: 3120,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517668808822-9e428824603b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dyson\'s most powerful, intelligent cordless vacuum. Laser reveals microscopic dust on hard floors and piezo sensor counts particle size.',
    features: ['Laser Slim Fluffy cleaner head reveals invisible dust', 'Piezo sensor automatically adapts suction power', 'LCD screen displays scientific proof of deep clean'],
    specifications: { 'Suction Power': '230 AW', 'Bin Volume': '0.2 Gallon', 'Weight': '6.8 lbs', 'Run Time': 'Up to 60 mins' },
    seller: { name: 'Dyson Official Direct', rating: 4.9, returnPolicy: '30 Days Money Back', warranty: '2 Years Dyson Warranty' },
    deliveryDays: 1, freeDelivery: true, colors: ['Yellow/Nickel'], sizes: ['Standard'],
    offers: ['Free Extra Filter Tool Kit'], coupons: ['DYSON50'], tags: ['bestseller', 'cleaning'], isFeatured: true, isBestSeller: true
  },

  // --- 9. BEAUTY ---
  {
    id: 'bea-01',
    title: 'La Mer Crème de la Mer Ultra-Rich Facial Cream (2 oz / 60ml)',
    brand: 'La Mer',
    category: 'Beauty',
    price: 380,
    originalPrice: 420,
    discount: 10,
    rating: 4.9,
    reviewCount: 920,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The legendary ultra-rich cream infused with cell-renewing Miracle Broth™ that immerses skin in deep moisture.',
    features: ['Miracle Broth™ accelerates natural cellular renewal', 'Soothes visible redness and irritation', 'Visibly diminishes fine lines and wrinkles'],
    specifications: { 'Volume': '2 oz (60 ml)', 'Skin Type': 'Dry to Normal', 'Key Ingredient': 'Miracle Broth' },
    seller: { name: 'La Mer Official Luxury', rating: 5.0, returnPolicy: '14 Days Unopened', warranty: 'Guaranteed Authentic' },
    deliveryDays: 1, freeDelivery: true, colors: ['Classic Cream'], sizes: ['60 ml'],
    offers: ['Includes Deluxe Sample Trio Set'], coupons: ['LAMER30'], tags: ['luxury', 'skincare'], isFeatured: true
  },

  // --- 10. BOOKS ---
  {
    id: 'bok-01',
    title: 'Atomic Habits by James Clear (Hardcover Edition)',
    brand: 'Penguin Random House',
    category: 'Books',
    price: 14.99,
    originalPrice: 27.00,
    discount: 44,
    rating: 4.9,
    reviewCount: 112000,
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 15 million copies sold worldwide.',
    features: ['Learn how to make time for new habits', 'Overcome lack of motivation and willpower', 'Design your environment for success'],
    specifications: { 'Format': 'Hardcover', 'Pages': '320', 'Language': 'English', 'ISBN': '978-0735211292' },
    seller: { name: 'NexCart Book World', rating: 4.9, returnPolicy: '30 Days Returns', warranty: 'Brand New Original' },
    deliveryDays: 1, freeDelivery: true, colors: ['White/Yellow Cover'], sizes: ['Hardcover'],
    offers: ['Buy 2 Get 1 50% Off on Books'], coupons: ['BOOK20'], tags: ['bestseller', 'self-help'], isBestSeller: true
  },

  // --- 11. TOYS ---
  {
    id: 'toy-01',
    title: 'LEGO Star Wars Millennium Falcon 75257 (1351 Pieces)',
    brand: 'LEGO',
    category: 'Toys',
    price: 135.99,
    originalPrice: 169.99,
    discount: 20,
    rating: 4.9,
    reviewCount: 7800,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Build and play with the starship of Star Wars: The Rise of Skywalker. Features rotating top/bottom gun turrets and spring shooters.',
    features: ['Includes 7 minifigures: Finn, Chewbacca, Lando, C-3PO', 'Detailed interior with cargo area, navigation computer', 'Measures 17" long and 12" wide'],
    specifications: { 'Piece Count': '1351 Pieces', 'Age Range': '9+ Years' },
    seller: { name: 'LEGO Official Flagship Store', rating: 4.9, returnPolicy: '30 Days Unopened', warranty: 'Authentic LEGO' },
    deliveryDays: 1, freeDelivery: true, colors: ['Star Wars Grey'], sizes: ['1351 Pcs Set'],
    offers: ['Free LEGO Polybag with purchase over $100'], coupons: ['LEGO20'], tags: ['bestseller', 'lego', 'starwars'], isFeatured: true, isBestSeller: true
  },

  // --- 12. SPORTS ---
  {
    id: 'spo-01',
    title: 'Wilson Evolution Game Basketball (Official Size 29.5")',
    brand: 'Wilson',
    category: 'Sports',
    price: 64.95,
    originalPrice: 79.99,
    discount: 19,
    rating: 4.9,
    reviewCount: 22400,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The #1 indoor game basketball in America. Signature Evo Microfiber Composite feel provides soft grip and moisture control.',
    features: ['Cushioned core carcass provides softer feel', 'Laid-in composite channels for texture', 'NFHS approved game ball'],
    specifications: { 'Size': 'Official Size 29.5"', 'Use': 'Indoor Hardwood Only', 'Material': 'Evo Microfiber Leather' },
    seller: { name: 'Wilson Sporting Goods', rating: 4.9, returnPolicy: '30 Days', warranty: '1 Year Warranty' },
    deliveryDays: 1, freeDelivery: true, colors: ['Evolution Orange'], sizes: ['Size 7 (29.5")'],
    offers: ['Includes ball pump needle'], coupons: ['WILSON10'], tags: ['bestseller', 'basketball'], isFeatured: true, isBestSeller: true
  }
];

// Combine with existing dataset to ensure over 109+ products remain intact
const dataFileExists = fs.existsSync(DB_FILE);
let existingData = { products: [], categories: [], coupons: [], orders: [], users: [], reviews: [] };

if (dataFileExists) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    existingData = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not parse existing data.json, creating fresh dataset.');
  }
}

// Merge images & attributes for existing items
const mergedProducts = (existingData.products && existingData.products.length > 0 ? existingData.products : sampleProducts).map(p => {
  const match = sampleProducts.find(s => s.id === p.id);
  if (match) {
    return { ...p, images: match.images };
  }
  // Ensure every product has at least 3 high quality image URLs
  if (!p.images || p.images.length < 3) {
    const fallbackImageSets = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ];
    return { ...p, images: [...(p.images || []), ...fallbackImageSets].slice(0, 4) };
  }
  return p;
});

const finalData = {
  ...existingData,
  categories: categories,
  products: mergedProducts.length >= 100 ? mergedProducts : sampleProducts
};

console.log(`🌱 Seeding NexCart Database with ${finalData.products.length} products with multi-image galleries...`);

fs.writeFileSync(DB_FILE, JSON.stringify(finalData, null, 2), 'utf-8');

console.log(`✅ NexCart Database updated successfully in ${DB_FILE}!`);
