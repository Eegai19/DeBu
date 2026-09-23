'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { combos, formatINR, products } from '@debu/shared';
import { useUi } from '@/store/ui';
import { ProductArt } from '@/components/art/ProductArt';
import { categoryName } from '@/lib/format';
import { lockScroll } from '@/components/effects/SmoothScroll';

const SUGGESTIONS = ['Jhumka', 'Bridal', 'Haldi', 'Choker', 'Tikka', 'Return gift', 'Kundan'];

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return [...products, ...combos].filter((p) => {
    const hay = [p.name, p.description, p.category, 'tags' in p ? p.tags.join(' ') : '', categoryName(p.category)].join(' ').toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export function SearchOverlay() {
  const open = useUi((s) => s.searchOpen);
  const setOpen = useUi((s) => s.setSearchOpen);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchCatalog(query).slice(0, 6), [query]);

  useEffect(() => {
    lockScroll(open);
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const submit = (q: string) => {
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-maroon-950/70 backdrop-blur-md" onClick={() => setOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl bg-ivory-50 shadow-2xl ring-1 ring-gold-300"
            initial={{ y: -30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            data-lenis-prevent
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex items-center gap-3 border-b border-gold-200 px-5"
            >
              <Search className="size-5 text-gold-600" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jhumkas, bridal sets, wire bags…"
                className="h-16 flex-1 bg-transparent text-lg text-maroon-950 placeholder:text-maroon-900/40 focus:outline-none"
                aria-label="Search products"
              />
              <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full hover:bg-gold-100" aria-label="Close search">
                <X className="size-5" />
              </button>
            </form>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {!query && (
                <div>
                  <p className="mb-3 font-accent text-xs tracking-[0.25em] text-gold-700 uppercase">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border border-gold-300 px-4 py-1.5 text-sm text-maroon-800 transition hover:bg-gold-100">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {query && results.length === 0 && <p className="py-8 text-center text-maroon-900/60">No matches for “{query}”. Try another word or WhatsApp us for a custom design!</p>}
              <ul className="space-y-1">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.type === 'combo' ? `/silk-thread-jewellery#combos` : `/product/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-gold-50"
                    >
                      <span className="size-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-gold-200">
                        <ProductArt art={p.art} color={p.defaultColor} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-maroon-900">{p.name}</span>
                        <span className="block text-xs text-maroon-900/55">{categoryName(p.category)}</span>
                      </span>
                      <span className="font-display text-lg font-bold text-maroon-700">{formatINR(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {query && results.length > 0 && (
                <button type="button" onClick={() => submit(query)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-100 py-3 font-medium text-maroon-800 hover:bg-gold-200">
                  See all results <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
