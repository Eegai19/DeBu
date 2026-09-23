import type { Metadata, Viewport } from 'next';
import { Cinzel, Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google';
import { BRAND } from '@debu/shared';
import { SITE_URL } from '@/lib/config';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Toaster } from '@/components/layout/Toaster';
import { FloatingContact } from '@/components/layout/FloatingContact';
import { SmoothScroll } from '@/components/effects/SmoothScroll';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const greatVibes = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-great-vibes', display: 'swap' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-cinzel', display: 'swap' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `DeBu — ${BRAND.tagline}`,
    template: '%s | DeBu',
  },
  description:
    'DeBu is a home business crafting silk thread jewellery, custom wire bags, blouse alterations and bridal mehandi for weddings, haldi and every celebration. Shop online in ₹ with Cash on Delivery.',
  keywords: ['silk thread jewellery', 'silk thread bangles', 'jhumkas', 'maang tikka', 'wire bags', 'blouse alteration', 'bridal mehandi', 'handmade jewellery India'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'DeBu',
    title: `DeBu — ${BRAND.tagline}`,
    description: 'Handcrafted silk thread jewellery, wire bags, blouse alterations and mehandi.',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#45081b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${greatVibes.variable} ${cinzel.variable} ${jost.variable}`}>
      <body className="min-h-screen overflow-x-clip">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-maroon-800 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <SmoothScroll />
        <TopBar />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileMenu />
        <SearchOverlay />
        <CartDrawer />
        <FloatingContact />
        <Toaster />
      </body>
    </html>
  );
}
