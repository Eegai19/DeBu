'use client';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Flower2, ShoppingBag, Star } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BRAND, COLORS, PRESET_COLORS } from '@debu/shared';
import { ProductArt } from '@/components/art/ProductArt';
import { ArchFrame, Diya, Garland, Mandala } from '@/components/art/decor';
import { ButtonLink } from '@/components/ui/Button';
import { FloatingPetals } from '@/components/effects/FloatingPetals';
import { Sparkles } from '@/components/effects/Sparkles';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const CYCLE = ['maroon', 'pink', 'green', 'blue', 'red', 'yellow', 'gold'] as const;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const fx = useTransform(sx, (v) => v * -18);
  const fy = useTransform(sy, (v) => v * -18);
  const bx = useTransform(sx, (v) => v * 10);
  const by = useTransform(sy, (v) => v * 10);

  useEffect(() => {
    const id = setInterval(() => setColorIdx((i) => (i + 1) % CYCLE.length), 2600);
    return () => clearInterval(id);
  }, []);

  useIsoLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('[data-hero-letter]', { yPercent: 120, rotate: 8, opacity: 0, duration: 1.2, stagger: 0.08 })
        .from('[data-hero-fade]', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.7')
        .from('[data-hero-cta]', { y: 20, scale: 0.9, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.6')
        .from('[data-hero-showcase]', { scale: 0.8, opacity: 0, rotate: -4, duration: 1.4, ease: 'expo.out' }, 0.2)
        .from('[data-hero-float]', { scale: 0, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.8)' }, 0.9);

      gsap.to('[data-hero-copy]', {
        yPercent: -18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('[data-hero-showcase]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('[data-hero-mandala]', {
        rotate: 120,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const color = CYCLE[colorIdx];

  return (
    <section
      ref={root}
      className="bg-maroon-velvet relative overflow-hidden text-ivory-50"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="bg-paisley pointer-events-none absolute inset-0 opacity-60" />
      <div data-hero-mandala className="pointer-events-none absolute top-1/2 right-[-20%] size-[900px] -translate-y-1/2 opacity-25 lg:right-[-8%]">
        <Mandala className="size-full animate-spin-slower" stroke="#ebb42a" rings={8} />
      </div>
      <Garland className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 w-full sm:h-36 lg:h-44" strands={16} length={5} />
      <FloatingPetals count={22} className="z-10" />
      <Sparkles count={26} className="z-10" />

      <div className="container-page relative z-20 grid min-h-[calc(100svh-7rem)] items-center gap-14 pt-32 pb-24 sm:pt-40 lg:grid-cols-[1.1fr_1fr] lg:pt-52">
        <div data-hero-copy className="text-center lg:text-left">
          <p data-hero-fade className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-white/5 px-4 py-1.5 font-accent text-[11px] tracking-[0.3em] text-gold-200 uppercase backdrop-blur">
            <Flower2 className="size-3.5" /> Handmade in India
          </p>
          <h1 className="mt-6 overflow-hidden py-2 font-display text-[5.5rem] leading-[0.85] font-bold sm:text-[8rem] lg:text-[10rem]" aria-label="DeBu">
            {'DeBu'.split('').map((l, i) => (
              <span key={i} data-hero-letter className="text-gold-gradient inline-block animate-shimmer" aria-hidden>
                {l}
              </span>
            ))}
          </h1>
          <p data-hero-fade className="mt-2 font-script text-4xl text-gold-100 sm:text-5xl">
            {BRAND.tagline}
          </p>
          <p data-hero-fade className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory-100/80 sm:text-lg lg:mx-0">
            Silk thread jewellery, custom wire bags, perfect-fit blouse alterations and bridal mehandi — lovingly handcrafted for weddings, haldi, sangeet and every festival.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <span data-hero-cta>
              <ButtonLink href="/silk-thread-jewellery" size="lg">
                <ShoppingBag className="size-5" /> Shop Silk Thread Jewellery
              </ButtonLink>
            </span>
            <span data-hero-cta>
              <ButtonLink href="/wire-bags" size="lg" variant="light">
                Explore Wire Bags
              </ButtonLink>
            </span>
            <span data-hero-cta>
              <ButtonLink href="/mehandi" size="lg" variant="light" className="border-rani-300/60 hover:bg-rani-500/30">
                <Flower2 className="size-5" /> Book Mehandi
              </ButtonLink>
            </span>
          </div>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ivory-100/75 lg:justify-start">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-gold-400 text-gold-400" /> 4.9 rated by 2,500+ customers
            </span>
            <span>✦ Fully customisable colours</span>
            <span>✦ Cash on Delivery</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <motion.div style={{ x: bx, y: by }}>
            <div data-hero-showcase className="relative">
              <div className="absolute -inset-10 rounded-full bg-gold-400/25 blur-3xl" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border-4 border-gold-400/70 bg-ivory-200 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)]">
                <AnimatePresence initial={false}>
                  <motion.div key={color} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { delay: 0.6, duration: 0.3 } }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    <ProductArt art={{ kind: 'necklace', variant: 0 }} color={color} className="h-full w-full" label="Rani Haar silk thread necklace" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <ArchFrame className="pointer-events-none absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)]" />
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card">
                <span className="text-xs font-medium whitespace-nowrap text-maroon-800">Made in your colour</span>
                <span className="flex gap-1">
                  {PRESET_COLORS.map((c) => (
                    <span key={c} className="size-3.5 rounded-full ring-1 ring-black/10 transition" style={{ background: COLORS[c].hex, transform: c === color ? 'scale(1.35)' : undefined }} />
                  ))}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ x: fx, y: fy }} className="absolute -top-6 -left-6 sm:-left-14">
            <div data-hero-float className="size-28 animate-float overflow-hidden rounded-full border-4 border-white/80 shadow-card sm:size-36">
              <ProductArt art={{ kind: 'earring', variant: 0 }} color="green" view={1} label="Silk thread jhumkas" />
            </div>
          </motion.div>
          <motion.div style={{ x: fx, y: fy }} className="absolute top-1/2 -right-4 sm:-right-12">
            <div data-hero-float className="size-24 animate-float-slow overflow-hidden rounded-3xl border-4 border-white/80 shadow-card [animation-delay:-3s] sm:size-32">
              <ProductArt art={{ kind: 'bangle', variant: 0 }} color="pink" label="Kundan silk bangles" />
            </div>
          </motion.div>
          <motion.div style={{ x: fx, y: fy }} className="absolute bottom-16 -left-4 sm:-left-16">
            <div data-hero-float className="flex animate-float items-center gap-2 rounded-2xl bg-white/95 p-2 pr-4 text-maroon-900 shadow-card [animation-delay:-1.5s]">
              <Diya size={40} />
              <div>
                <p className="text-sm font-semibold leading-tight">Festive Combos</p>
                <p className="text-xs text-leaf-600">Save up to 17%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <a href="#categories" className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-xs tracking-widest text-gold-200/80 uppercase" aria-label="Scroll to categories">
        Scroll
        <ChevronDown className="size-5 animate-bounce" />
      </a>
      <svg className="absolute inset-x-0 -bottom-px z-20 h-10 w-full text-ivory-50 sm:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0 80 V40 Q60 0 120 40 T240 40 T360 40 T480 40 T600 40 T720 40 T840 40 T960 40 T1080 40 T1200 40 T1320 40 T1440 40 V80 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
