import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FEATURED_CATEGORIES } from '@/data/content';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { Visual } from '@/components/ui/Visual';

export function FeaturedCategories() {
  return (
    <section id="categories" className="bg-festive-glow relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Our Collections"
          script="crafted for you"
          title="Featured Categories"
          description="From silk thread bangles to bridal mehandi — everything you need to shine at every celebration."
        />
        <Stagger className="grid auto-rows-[220px] grid-cols-2 gap-4 sm:auto-rows-[260px] sm:gap-5 lg:grid-cols-4">
          {FEATURED_CATEGORIES.map((c, i) => (
            <StaggerItem key={c.title} className={cn(i === 0 && 'col-span-2 row-span-2', i === 4 && 'lg:row-span-2')}>
              <Link
                href={c.href}
                className="group relative block h-full overflow-hidden rounded-[1.75rem] shadow-soft ring-1 ring-gold-200 transition duration-500 hover:shadow-card hover:ring-gold-400"
              >
                <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-110 group-hover:rotate-1">
                  <Visual visual={c.visual} label={c.title} />
                </div>
                <div className={cn('absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100', c.accent)} />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-ivory-50 sm:p-6">
                  <div>
                    <h3 className={cn('font-semibold leading-tight', i === 0 ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl')}>{c.title}</h3>
                    <p className="mt-1 max-h-0 overflow-hidden text-sm text-ivory-100/85 opacity-0 transition-all duration-500 group-hover:max-h-10 group-hover:opacity-100 sm:max-h-10 sm:opacity-100">
                      {c.subtitle}
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition duration-500 group-hover:rotate-45 group-hover:bg-gold-400 group-hover:text-maroon-950">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
