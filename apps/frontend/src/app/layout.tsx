import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NexCart — Shop Everything. Delivered Fast.',
  description:
    'NexCart is India\'s premium e-commerce destination. Mobiles, Laptops, Fashion, Grocery, Beauty, Books, Sports & more — with fast delivery and unbeatable prices.',
  keywords: 'nexcart, online shopping, e-commerce, mobiles, laptops, fashion, grocery, india',
  authors: [{ name: 'NexCart' }],
  openGraph: {
    title: 'NexCart — Shop Everything. Delivered Fast.',
    description: 'Shop 100+ top brands with same-day delivery, easy returns, and NexPrime benefits.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'NexCart',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexCart',
    description: 'India\'s premium e-commerce destination.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-gray-100">
        {children}
      </body>
    </html>
  );
}
