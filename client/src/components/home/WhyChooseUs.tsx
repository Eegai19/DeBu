'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, HandHeart, Heart, Home, IndianRupee, Palette } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { WHY_CHOOSE_US } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lotus, Mandala } from '@/components/art/decor';

const ICONS = { hand: HandHeart, palette: Palette, 'indian-rupee': IndianRupee, heart: Heart, home: Home, gift: Gift } as const;

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.set('[data-why-card]', { opacity: 0, y: 70, rotateX: -25, transformPerspective: 900 });
      ScrollTrigger.batch('[data-why-card]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.12, ease: 'power3.out', overwrite: true }),
      });
      gsap.to('[data-why-mandala]', { rotate: 180, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: 1 } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-maroon-velvet relative overflow-hidden py-20 text-ivory-50 sm:py-28">
      <div data-why-mandala className="pointer-events-none absolute -top-40 -left-40 size-[600px] opacity-15">
        <Mandala className="size-full" stroke="#ebb42a" />
      </div>
      <div className="pointer-events-none absolute -right-40 -bottom-40 size-[500px] opacity-10">
        <Mandala className="size-full animate-spin-slow" stroke="#faa4cc" />
      </div>
      <div className="container-page relative">
        <SectionHeading tone="dark" eyebrow="The DeBu Promise" script="why families love us" title="Why Choose Us" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.title}
                data-why-card
                className="group relative overflow-hidden rounded-[1.75rem] border border-gold-400/25 bg-white/[0.06] p-7 backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:border-gold-300/60 hover:bg-white/[0.1]"
              >
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gold-400/10 blur-2xl transition duration-700 group-hover:scale-150 group-hover:bg-rani-400/20" />
                <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gold-sheen text-maroon-900 shadow-glow transition duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="size-7" />
                </span>
                <h3 className="relative mt-5 text-2xl font-semibold text-gold-100">{item.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ivory-100/75">{item.text}</p>
              </div>
            );
          })}
        </div>
        <Lotus size={90} className="mx-auto mt-14 opacity-90" />
      </div>
    </section>
  );
}
