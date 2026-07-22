/**
 * @file seed.ts
 * @description Database seeder — populates the database with initial data for
 * development and staging environments.
 *
 * Run with: pnpm db:seed
 *
 * Seeds:
 *   - Admin user
 *   - Categories (with subcategories)
 *   - Brands
 *   - Sample products
 *   - Banners
 *   - Coupons
 */

import { PrismaClient, Role, AuthProvider } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

// ── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── Main Seed Function ───────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...\n');

  // ── Admin User ─────────────────────────────────────────────────────────────

  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@luxecart.com' },
    update: {},
    create: {
      name: 'LuxeCart Admin',
      email: 'admin@luxecart.com',
      password: await hashPassword('Admin@123456'),
      role: Role.ADMIN,
      provider: AuthProvider.LOCAL,
      isVerified: true,
    },
  });
  console.log(`  ✅ Admin: ${adminUser.email}`);

  // ── Test Customer ──────────────────────────────────────────────────────────

  const testUser = await prisma.user.upsert({
    where: { email: 'customer@luxecart.com' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'customer@luxecart.com',
      password: await hashPassword('Customer@123'),
      role: Role.CUSTOMER,
      provider: AuthProvider.LOCAL,
      isVerified: true,
    },
  });
  console.log(`  ✅ Customer: ${testUser.email}\n`);

  // ── Categories ─────────────────────────────────────────────────────────────

  console.log('📁 Creating categories...');

  const categoryData = [
    {
      name: 'Electronics',
      description: 'Cutting-edge gadgets and tech accessories',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      children: ['Smartphones', 'Laptops', 'Audio', 'Smart Home', 'Cameras'],
    },
    {
      name: 'Fashion',
      description: 'Premium clothing, shoes, and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      children: ["Men's Clothing", "Women's Clothing", 'Footwear', 'Bags', 'Watches'],
    },
    {
      name: 'Home & Living',
      description: 'Furniture, decor, and everyday essentials',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      children: ['Furniture', 'Kitchen', 'Bedding', 'Lighting', 'Decor'],
    },
    {
      name: 'Sports & Fitness',
      description: 'Equipment and apparel for every sport',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      children: ['Gym Equipment', 'Running', 'Yoga', 'Outdoor Sports', 'Sports Nutrition'],
    },
    {
      name: 'Beauty & Wellness',
      description: 'Skincare, makeup, and personal care',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      children: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Personal Care'],
    },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categoryData) {
    const parent = await prisma.category.upsert({
      where: { slug: toSlug(cat.name) },
      update: {},
      create: {
        name: cat.name,
        slug: toSlug(cat.name),
        description: cat.description,
        image: cat.image,
        isActive: true,
      },
    });
    createdCategories[cat.name] = parent.id;
    console.log(`  📂 ${cat.name}`);

    for (const childName of cat.children) {
      const child = await prisma.category.upsert({
        where: { slug: toSlug(childName) },
        update: {},
        create: {
          name: childName,
          slug: toSlug(childName),
          parentId: parent.id,
          isActive: true,
        },
      });
      createdCategories[childName] = child.id;
      console.log(`    └─ ${childName}`);
    }
  }

  // ── Brands ─────────────────────────────────────────────────────────────────

  console.log('\n🏷️  Creating brands...');
  const brands = [
    { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'Samsung', logo: 'https://logo.clearbit.com/samsung.com' },
    { name: 'Sony', logo: 'https://logo.clearbit.com/sony.com' },
    { name: 'Nike', logo: 'https://logo.clearbit.com/nike.com' },
    { name: 'Adidas', logo: 'https://logo.clearbit.com/adidas.com' },
    { name: 'LG', logo: 'https://logo.clearbit.com/lg.com' },
    { name: 'Bose', logo: 'https://logo.clearbit.com/bose.com' },
    { name: 'IKEA', logo: 'https://logo.clearbit.com/ikea.com' },
    { name: 'Zara', logo: 'https://logo.clearbit.com/zara.com' },
    { name: 'Loreal', logo: 'https://logo.clearbit.com/loreal.com' },
  ];

  const createdBrands: Record<string, string> = {};
  for (const brand of brands) {
    const b = await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: { name: brand.name, slug: toSlug(brand.name), logo: brand.logo, isActive: true },
    });
    createdBrands[brand.name] = b.id;
    console.log(`  🏷️  ${brand.name}`);
  }

  // ── Sample Products ────────────────────────────────────────────────────────

  console.log('\n📦 Creating sample products...');

  const products = [
    {
      name: 'iPhone 15 Pro Max',
      description:
        'The iPhone 15 Pro Max features a titanium design, A17 Pro chip, and a 48MP main camera with 5x telephoto zoom. Experience the most advanced iPhone ever made.',
      price: 134900,
      discountPrice: 129900,
      sku: 'APL-IP15PM-256',
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
      ],
      categoryId: createdCategories['Smartphones'],
      brandId: createdBrands['Apple'],
      isFeatured: true,
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description:
        'Industry-leading noise cancellation with 8 microphones, crystal clear hands-free calling, and up to 30 hours of battery life. The ultimate wireless headphone experience.',
      price: 34990,
      discountPrice: 29990,
      sku: 'SNY-WH1000XM5-BLK',
      stock: 120,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      ],
      categoryId: createdCategories['Audio'],
      brandId: createdBrands['Sony'],
      isFeatured: true,
    },
    {
      name: 'Samsung 65" QLED 4K Smart TV',
      description:
        'Quantum Dot technology delivers brilliant 4K resolution with 100% color volume. AI-powered upscaling transforms all content to near 4K quality.',
      price: 129990,
      discountPrice: 109990,
      sku: 'SAM-QN65Q80C-65',
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f4e5f1?w=800',
      ],
      categoryId: createdCategories['Electronics'],
      brandId: createdBrands['Samsung'],
      isFeatured: false,
    },
    {
      name: 'Nike Air Max 270 React',
      description:
        'The Nike Air Max 270 React combines two of Nike\'s greatest innovations in one shoe. Maximum comfort with a large Air unit and React foam cushioning.',
      price: 14999,
      discountPrice: 11999,
      sku: 'NKE-AM270R-BLK-42',
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      ],
      categoryId: createdCategories['Footwear'],
      brandId: createdBrands['Nike'],
      isFeatured: true,
    },
    {
      name: 'Adidas Ultraboost 23',
      description:
        'Engineered for runners who demand the best. Boost midsole returns energy with every stride, while Primeknit upper offers a second-skin fit.',
      price: 17999,
      discountPrice: 14999,
      sku: 'ADI-UB23-WHT-43',
      stock: 150,
      images: [
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
      ],
      categoryId: createdCategories['Footwear'],
      brandId: createdBrands['Adidas'],
      isFeatured: false,
    },
    {
      name: 'Apple MacBook Pro 14" M3 Pro',
      description:
        'The most powerful MacBook Pro ever with M3 Pro chip. Features Liquid Retina XDR display, up to 22 hours battery life, and hardware-accelerated ray tracing.',
      price: 209900,
      discountPrice: null,
      sku: 'APL-MBP14-M3PRO-512',
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871525-7e01eeb88491?w=800',
      ],
      categoryId: createdCategories['Laptops'],
      brandId: createdBrands['Apple'],
      isFeatured: true,
    },
  ];

  for (const product of products) {
    const slug = toSlug(product.name);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        sku: product.sku,
        stock: product.stock,
        images: product.images,
        categoryId: product.categoryId!,
        brandId: product.brandId,
        isFeatured: product.isFeatured,
        isActive: true,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 500) + 20,
      },
    });
    console.log(`  📦 ${product.name}`);
  }

  // ── Banners ────────────────────────────────────────────────────────────────

  console.log('\n🖼️  Creating banners...');
  const banners = [
    {
      title: 'Summer Tech Sale',
      subtitle: 'Up to 40% off on Electronics',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400',
      link: '/products?category=electronics',
      position: 1,
    },
    {
      title: 'New Arrivals in Fashion',
      subtitle: 'Discover the latest trends',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400',
      link: '/products?category=fashion',
      position: 2,
    },
    {
      title: 'Home Makeover Collection',
      subtitle: 'Transform your living space',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1400',
      link: '/products?category=home-living',
      position: 3,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { id: `banner-${banner.position}` },
      update: {},
      create: { ...banner, isActive: true },
    }).catch(() => prisma.banner.create({ data: { ...banner, isActive: true } }));
    console.log(`  🖼️  ${banner.title}`);
  }

  // ── Coupons ────────────────────────────────────────────────────────────────

  console.log('\n🎟️  Creating coupons...');
  const coupons = [
    {
      code: 'WELCOME20',
      type: 'PERCENTAGE' as const,
      value: 20,
      minAmount: 999,
      maxDiscount: 500,
      maxUses: 1000,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      code: 'FLAT500',
      type: 'FIXED' as const,
      value: 500,
      minAmount: 2999,
      maxUses: 500,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      code: 'LUXE10',
      type: 'PERCENTAGE' as const,
      value: 10,
      minAmount: 499,
      maxDiscount: 300,
      maxUses: null, // Unlimited
      expiresAt: null,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: { ...coupon, isActive: true },
    });
    console.log(`  🎟️  ${coupon.code} (${coupon.type}: ${coupon.value}${coupon.type === 'PERCENTAGE' ? '%' : '₹'})`);
  }

  // ── Done ───────────────────────────────────────────────────────────────────

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📋 Credentials:');
  console.log('  Admin  → admin@luxecart.com / Admin@123456');
  console.log('  User   → customer@luxecart.com / Customer@123');
  console.log('  Coupons → WELCOME20, FLAT500, LUXE10\n');
}

// ── Execute ──────────────────────────────────────────────────────────────────

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
