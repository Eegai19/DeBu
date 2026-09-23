import Link from 'next/link';
import { ArrowRight, Scissors, Sparkle } from 'lucide-react';
import { BlouseArt, MehandiArt } from '@/components/art/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function ServicesSplit() {
  return (
    <section className="bg-festive-glow py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Services" script="beyond jewellery" title="Tailoring & Mehandi Artistry" description="Personal services for your special days — booked in minutes, delivered with care." />
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              href: '/blouse-alteration',
              title: 'Blouse Alteration',
              text: 'Fitting corrections, sleeve and neck redesigns, and delicate bridal blouse adjustments.',
              Icon: Scissors,
              art: <BlouseArt color="#d42a67" neckline="sweetheart" className="h-full w-full" />,
              bg: 'from-rani-100 via-ivory-100 to-gold-100',
            },
            {
              href: '/mehandi',
              title: 'Mehandi',
              text: 'Bridal, engagement, festival and family-function mehandi with rich, natural henna.',
              Icon: Sparkle,
              art: <MehandiArt style="bridal" background={false} className="h-full w-full" />,
              bg: 'from-marigold-100 via-ivory-100 to-haldi-100',
            },
          ].map((s, i) => (
            <Reveal key={s.href} direction={i ? 'left' : 'right'}>
              <Link href={s.href} className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br ${s.bg} p-6 shadow-soft ring-1 ring-gold-200 transition duration-500 hover:shadow-card sm:flex-row sm:items-center sm:p-8`}>
                <div className="mx-auto aspect-square w-56 shrink-0 transition duration-700 group-hover:scale-105 group-hover:-rotate-3 sm:w-60">{s.art}</div>
                <div className="mt-4 sm:mt-0 sm:pl-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-maroon-800 text-gold-200">
                    <s.Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-3xl font-semibold text-maroon-900 sm:text-4xl">{s.title}</h3>
                  <p className="mt-2 text-maroon-900/70">{s.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-medium text-rani-700">
                    Book now <ArrowRight className="size-4 transition group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
