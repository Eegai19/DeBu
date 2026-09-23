'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { COLORS, PRESET_COLORS, type PresetColorKey, type Product } from '@debu/shared';
import { categoryName } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';

const PRICE_RANGES = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: 'u300', label: 'Under ₹300', min: 0, max: 299 },
  { id: '300-600', label: '₹300 – ₹600', min: 300, max: 600 },
  { id: '600-1000', label: '₹600 – ₹1,000', min: 601, max: 1000 },
  { id: 'a1000', label: 'Above ₹1,000', min: 1001, max: Infinity },
] as const;

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
] as const;

type SortId = (typeof SORTS)[number]['id'];
type PriceId = (typeof PRICE_RANGES)[number]['id'];

export function ShopExplorer({
  products,
  categories,
  initialCategory = 'all',
  showCategoryFilter = true,
  initialQuery = '',
}: {
  products: Product[];
  categories: string[];
  initialCategory?: string;
  showCategoryFilter?: boolean;
  initialQuery?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState<PriceId>('all');
  const [color, setColor] = useState<PresetColorKey | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortId>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === price)!;
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        p.price >= range.min &&
        p.price <= range.max &&
        (!color || p.defaultColor === color) &&
        (!q || [p.name, p.description, ...p.tags, categoryName(p.category)].join(' ').toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return sorted;
  }, [products, category, price, color, query, sort]);

  const activeCount = (category !== initialCategory ? 1 : 0) + (price !== 'all' ? 1 : 0) + (color ? 1 : 0) + (query ? 1 : 0);
  const reset = () => {
    setCategory(initialCategory);
    setPrice('all');
    setColor(null);
    setQuery('');
  };

  const chip = (active: boolean) =>
    cn(
      'rounded-full border px-4 py-2 text-sm transition',
      active ? 'border-maroon-800 bg-maroon-800 text-ivory-50 shadow-soft' : 'border-gold-300 bg-white text-maroon-800 hover:border-gold-500 hover:bg-gold-50',
    );

  const filters = (
    <div className="space-y-7">
      {showCategoryFilter && (
        <div>
          <h3 className="mb-3 font-accent text-xs font-semibold tracking-[0.25em] text-gold-700 uppercase">Category</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={chip(category === 'all')} onClick={() => setCategory('all')}>
              All
            </button>
            {categories.map((c) => (
              <button key={c} type="button" className={chip(category === c)} onClick={() => setCategory(c)}>
                {categoryName(c)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="mb-3 font-accent text-xs font-semibold tracking-[0.25em] text-gold-700 uppercase">Price</h3>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
          {PRICE_RANGES.map((r) => (
            <button key={r.id} type="button" className={chip(price === r.id)} onClick={() => setPrice(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-accent text-xs font-semibold tracking-[0.25em] text-gold-700 uppercase">Colour</h3>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(color === c ? null : c)}
              aria-pressed={color === c}
              title={COLORS[c].label}
              aria-label={`Filter by ${COLORS[c].label}`}
              className={cn('size-9 rounded-full ring-offset-2 transition hover:scale-110', color === c ? 'ring-2 ring-gold-500' : 'ring-1 ring-black/10')}
              style={{ background: `radial-gradient(circle at 35% 30%, #ffffff66, transparent 45%), ${COLORS[c].hex}` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-maroon-900/55">Every design can be made in any colour — this filters by the showcased shade.</p>
      </div>
      {activeCount > 0 && (
        <button type="button" onClick={reset} className="text-sm font-medium text-rani-700 underline underline-offset-4">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-gold-200">{filters}</div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gold-600" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search in this collection…" className="field-input rounded-full pl-11" aria-label="Search products" />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex h-12 items-center gap-2 rounded-full border border-gold-300 bg-white px-5 text-sm font-medium text-maroon-800 lg:hidden"
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="size-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-rani-600 px-2 text-xs text-white">{activeCount}</span>}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortId)} className="field-input h-12 rounded-full py-0 sm:w-56" aria-label="Sort products">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden lg:hidden">
              <div className="relative rounded-3xl bg-white p-5 shadow-soft ring-1 ring-gold-200">
                <button type="button" onClick={() => setFiltersOpen(false)} className="absolute top-4 right-4" aria-label="Close filters">
                  <X className="size-5 text-maroon-800" />
                </button>
                {filters}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mb-5 text-sm text-maroon-900/60">
          Showing <b className="text-maroon-900">{filtered.length}</b> of {products.length} handcrafted designs
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gold-300 bg-white/60 p-12 text-center">
            <p className="font-display text-3xl text-maroon-900">No designs match these filters</p>
            <p className="mt-2 text-maroon-900/60">Try clearing a filter — or WhatsApp us, we love custom requests!</p>
            <button type="button" onClick={reset} className="mt-5 rounded-full bg-maroon-800 px-6 py-2.5 text-sm text-white">
              Reset filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard product={p} detailed priority={i < 3} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
