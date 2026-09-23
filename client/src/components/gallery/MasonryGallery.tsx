'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GalleryItem } from '@/data/content';
import { cn } from '@/lib/utils';
import { Visual } from '@/components/ui/Visual';
import { lockScroll } from '@/components/effects/SmoothScroll';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'bags', label: 'Wire Bags' },
  { id: 'mehandi', label: 'Mehandi' },
  { id: 'blouse', label: 'Blouses' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

function group(item: GalleryItem): FilterId {
  const v = item.visual;
  if (v.type === 'mehandi') return 'mehandi';
  if (v.type === 'blouse') return 'blouse';
  return v.art.kind === 'wirebag' ? 'bags' : 'jewellery';
}

export function MasonryGallery({ items, showFilters = true, limit }: { items: GalleryItem[]; showFilters?: boolean; limit?: number }) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => items.filter((i) => filter === 'all' || group(i) === filter).slice(0, limit), [items, filter, limit]);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((d: number) => setActive((a) => (a === null ? a : (a + d + visible.length) % visible.length)), [visible.length]);

  useEffect(() => {
    lockScroll(active !== null);
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, step]);

  const current = active !== null ? visible[active] : null;

  return (
    <div>
      {showFilters && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn('relative rounded-full px-5 py-2 text-sm font-medium transition', filter === f.id ? 'text-ivory-50' : 'text-maroon-800 hover:bg-gold-100')}
            >
              {filter === f.id && <motion.span layoutId="gallery-filter" className="absolute inset-0 -z-10 rounded-full bg-maroon-800" />}
              {f.label}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="columns-2 gap-4 sm:gap-5 lg:columns-3 xl:columns-4">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              onClick={() => setActive(i)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl shadow-soft ring-1 ring-gold-200 sm:mb-5"
              aria-label={`Open ${item.title}`}
            >
              <motion.div layoutId={`gallery-${item.id}`} className={cn('w-full overflow-hidden', item.tall ? 'aspect-[3/4]' : 'aspect-square')}>
                <div className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-110">
                  <Visual visual={item.visual} label={item.title} />
                </div>
              </motion.div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-maroon-950/85 via-maroon-950/10 to-transparent p-4 text-left opacity-0 transition duration-500 group-hover:opacity-100">
                <p className="translate-y-3 font-display text-xl text-white transition duration-500 group-hover:translate-y-0">{item.title}</p>
                <p className="translate-y-3 text-xs text-gold-200 transition delay-75 duration-500 group-hover:translate-y-0">{item.caption}</p>
                <Expand className="absolute top-4 right-4 size-5 text-white" />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {current && (
          <motion.div className="fixed inset-0 z-[75] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-maroon-950/90 backdrop-blur" onClick={close} />
            <div className="relative w-full max-w-2xl" role="dialog" aria-modal="true" aria-label={current.title}>
              <motion.div layoutId={`gallery-${current.id}`} className="aspect-square overflow-hidden rounded-3xl ring-2 ring-gold-400 shadow-2xl">
                <Visual visual={current.visual} label={current.title} />
              </motion.div>
              <div className="mt-4 text-center text-ivory-50">
                <p className="font-display text-3xl">{current.title}</p>
                <p className="text-sm text-gold-200">{current.caption}</p>
              </div>
              <button type="button" onClick={close} className="absolute -top-3 -right-3 flex size-11 items-center justify-center rounded-full bg-white text-maroon-900 shadow-card" aria-label="Close">
                <X className="size-5" />
              </button>
              <button type="button" onClick={() => step(-1)} className="absolute top-1/2 -left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-maroon-900 shadow-card sm:-left-16" aria-label="Previous">
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" onClick={() => step(1)} className="absolute top-1/2 -right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-maroon-900 shadow-card sm:-right-16" aria-label="Next">
                <ChevronRight className="size-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
