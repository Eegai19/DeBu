'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { NAV_LINKS } from '@/data/content';
import { useCartCount } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { useUi } from '@/store/ui';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function IconBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-rani-600 px-1 text-[11px] leading-5 font-bold text-white ring-2 ring-ivory-50"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const cartCount = useCartCount();
  const wishCount = useWishlist((s) => s.slugs.length);
  const { setSearchOpen, setCartOpen, setMenuOpen } = useUi();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  const iconBtn = 'relative flex size-10 items-center justify-center rounded-full text-maroon-800 transition hover:bg-gold-100 hover:text-maroon-950';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-500',
        scrolled ? 'glass border-b border-gold-200/70 shadow-soft' : 'border-b border-transparent bg-ivory-50/60',
      )}
    >
      <div className={cn('container-page flex items-center justify-between gap-4 transition-all duration-500', scrolled ? 'h-16' : 'h-20')}>
        <Logo />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors',
                  active ? 'text-maroon-900' : 'text-maroon-900/70 hover:text-maroon-900',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-gold-100 via-gold-200/70 to-gold-100 ring-1 ring-gold-300/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button type="button" className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search products">
            <Search className="size-5" />
          </button>
          <Link href="/wishlist" className={iconBtn} aria-label="Wishlist">
            <Heart className="size-5" />
            {mounted && <IconBadge count={wishCount} />}
          </Link>
          <button type="button" className={iconBtn} onClick={() => setCartOpen(true)} aria-label="Open cart">
            <ShoppingBag className="size-5" />
            {mounted && <IconBadge count={cartCount} />}
          </button>
          <button type="button" className={cn(iconBtn, 'xl:hidden')} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
