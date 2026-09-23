import { MARQUEE_WORDS, STATS } from '@/data/content';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { Marquee } from '@/components/effects/Marquee';
import { Reveal } from '@/components/ui/Reveal';

export function StatsBand() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gold-sheen -rotate-1 py-4 text-maroon-900 shadow-glow">
        <Marquee items={MARQUEE_WORDS} />
      </div>
      <div className="container-page grid grid-cols-2 gap-6 py-16 sm:py-20 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="text-center">
            <p className="font-display text-5xl font-bold text-festive-gradient sm:text-6xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </p>
            <p className="mt-2 font-accent text-xs tracking-[0.25em] text-maroon-800/70 uppercase">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
