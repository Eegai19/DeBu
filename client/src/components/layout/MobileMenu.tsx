'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { NAV_LINKS } from '@/data/content';
import { useUi } from '@/store/ui';
import { cn } from '@/lib/utils';
import { Mandala } from '@/components/art/decor';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { lockScroll } from '@/components/effects/SmoothScroll';
import { Logo } from './Logo';

export function MobileMenu() {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);
  useEffect(() => {
    lockScroll(open);
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-maroon-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.aside
            className="bg-maroon-velvet absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto p-6 text-ivory-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            data-lenis-prevent
            aria-label="Mobile navigation"
          >
            <Mandala className="pointer-events-none absolute -right-24 -bottom-24 size-80 animate-spin-slow opacity-20" stroke="#ebb42a" />
            <div className="relative flex items-center justify-between">
              <Logo tone="light" />
              <button type="button" onClick={() => setOpen(false)} className="flex size-10 items-center justify-center rounded-full bg-white/10" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <nav className="relative mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-xl px-4 py-3 font-display text-2xl transition',
                        active ? 'bg-white/10 text-gold-300' : 'text-ivory-50 hover:bg-white/5 hover:text-gold-200',
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link href="/gallery" className="block rounded-xl px-4 py-3 font-display text-2xl text-ivory-50 hover:bg-white/5">
                Gallery
              </Link>
            </nav>
            <div className="relative mt-auto space-y-5 pt-10">
              <div>
                <p className="mb-2 font-accent text-xs tracking-[0.25em] text-gold-300 uppercase">Jewellery & Wire Bags</p>
                <ContactButtons line="products" size="sm" tone="dark" />
              </div>
              <div>
                <p className="mb-2 font-accent text-xs tracking-[0.25em] text-gold-300 uppercase">Blouse & Mehandi</p>
                <ContactButtons line="services" size="sm" tone="dark" />
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
