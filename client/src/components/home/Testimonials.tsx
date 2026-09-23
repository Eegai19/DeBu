'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TESTIMONIALS } from '@/data/content';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stars } from '@/components/ui/Stars';
import { Marigold } from '@/components/art/decor';

export function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setState(([i]) => [(i + d + TESTIMONIALS.length) % TESTIMONIALS.length, d]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const t = TESTIMONIALS[index];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rani-50 via-ivory-50 to-ivory-50 py-20 sm:py-28">
      <Marigold size={120} className="absolute top-10 -left-10 animate-float opacity-80" />
      <Marigold size={90} tone="yellow" seed={4} className="absolute right-6 bottom-10 animate-float-slow opacity-80" />
      <div className="container-page relative">
        <SectionHeading eyebrow="Love Notes" script="from our customers" title="Customer Testimonials" />
        <div className="relative mx-auto max-w-3xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-gold-200 sm:min-h-[280px] sm:p-12">
            <Quote className="absolute top-6 left-6 size-16 text-gold-200" />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative text-center"
              >
                <Stars rating={t.rating} className="justify-center" size="size-5" />
                <blockquote className="mt-5 font-display text-2xl leading-snug text-maroon-900 italic sm:text-3xl">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center justify-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-full bg-gold-sheen font-display text-xl font-bold text-maroon-900">{t.name.charAt(0)}</span>
                  <span className="text-left">
                    <span className="block font-semibold text-maroon-900">{t.name}</span>
                    <span className="block text-sm text-maroon-900/60">
                      {t.role} · {t.city}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button type="button" onClick={() => go(-1)} className="flex size-11 items-center justify-center rounded-full border border-gold-300 bg-white text-maroon-800 hover:bg-gold-100" aria-label="Previous testimonial">
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  className={cn('h-2.5 rounded-full transition-all', i === index ? 'w-8 bg-maroon-700' : 'w-2.5 bg-gold-300 hover:bg-gold-400')}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(1)} className="flex size-11 items-center justify-center rounded-full border border-gold-300 bg-white text-maroon-800 hover:bg-gold-100" aria-label="Next testimonial">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
