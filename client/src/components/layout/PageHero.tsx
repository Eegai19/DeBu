import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Mandala } from '@/components/art/decor';
import { FloatingPetals } from '@/components/effects/FloatingPetals';
import { Sparkles } from '@/components/effects/Sparkles';
import { Reveal } from '@/components/ui/Reveal';

export function PageHero({
  eyebrow,
  title,
  script,
  description,
  crumbs = [],
  visual,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  script?: string;
  description?: ReactNode;
  crumbs?: { href?: string; label: string }[];
  visual?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-maroon-velvet relative overflow-hidden text-ivory-50">
      <div className="bg-paisley pointer-events-none absolute inset-0 opacity-50" />
      <Mandala className="pointer-events-none absolute top-1/2 -right-40 size-[640px] -translate-y-1/2 animate-spin-slower opacity-20" stroke="#ebb42a" />
      <FloatingPetals count={12} seed={11} />
      <Sparkles count={16} seed={5} />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ivory-100/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-200">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <ChevronRight className="size-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-gold-200">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-gold-200">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <Reveal>
            <p className="font-accent text-xs tracking-[0.35em] text-gold-300 uppercase">{eyebrow}</p>
            {script && <p className="mt-3 font-script text-4xl text-rani-300 sm:text-5xl">{script}</p>}
            <h1 className="mt-1 text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">{title}</h1>
            {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory-100/80 sm:text-lg">{description}</p>}
            {children && <div className="mt-8">{children}</div>}
          </Reveal>
        </div>
        {visual && (
          <Reveal direction="scale" delay={0.2} className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative aspect-square animate-float-slow overflow-hidden rounded-[2.5rem] border-4 border-gold-400/60 shadow-2xl">{visual}</div>
          </Reveal>
        )}
      </div>
      <svg className="absolute inset-x-0 -bottom-px h-8 w-full text-ivory-50 sm:h-12" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0 60 V30 Q60 0 120 30 T240 30 T360 30 T480 30 T600 30 T720 30 T840 30 T960 30 T1080 30 T1200 30 T1320 30 T1440 30 V60 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
