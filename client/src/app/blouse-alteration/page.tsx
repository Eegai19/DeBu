import type { Metadata } from 'next';
import { Clock, Scissors } from 'lucide-react';
import { CONTACTS } from '@debu/shared';
import { BLOUSE_SERVICE_DETAILS, BLOUSE_STEPS } from '@/data/content';
import { formatPhone, telLink } from '@/lib/contact';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { BlouseArt } from '@/components/art/services';
import { BeforeAfter } from '@/components/services/BeforeAfter';
import { BookingForm } from '@/components/services/BookingForm';
import { ContactButtons } from '@/components/contact/ContactButtons';

export const metadata: Metadata = {
  title: 'Blouse Alteration',
  description: 'Expert blouse alteration, fitting correction, sleeve and neck redesign, and bridal blouse adjustments. Book online or call 9786488488.',
};

const BlouseBg = ({ children, tone }: { children: React.ReactNode; tone: string }) => <div className={`flex h-full w-full items-center justify-center ${tone}`}>{children}</div>;

export default function BlouseAlterationPage() {
  return (
    <>
      <PageHero
        eyebrow="Blouse Alteration"
        script="the perfect fit"
        title={
          <>
            Tailored to <span className="text-gold-gradient italic">flatter</span> you
          </>
        }
        description="From simple fitting fixes to complete neck and sleeve redesigns and delicate bridal blouse adjustments — we give your favourite blouses a flawless new life."
        crumbs={[{ label: 'Blouse Alteration' }]}
        visual={
          <BlouseBg tone="bg-gradient-to-br from-rani-100 via-ivory-100 to-gold-100">
            <BlouseArt color="#7a1030" neckline="sweetheart" className="h-[90%] w-[90%]" />
          </BlouseBg>
        }
      >
        <p className="mb-4 font-medium text-gold-200">
          Call or WhatsApp us for quick assistance ·{' '}
          <a href={telLink(CONTACTS.services.phone)} className="underline underline-offset-4">
            {formatPhone(CONTACTS.services.phone)}
          </a>
        </p>
        <ContactButtons line="services" tone="dark" message="Hi DeBu! I'd like to get my blouse altered." />
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <BeforeAfter
              before={
                <BlouseBg tone="bg-gradient-to-br from-stone-200 to-stone-300">
                  <BlouseArt color="#b52c52" neckline="round" fitted={false} embellished={false} showMarks className="h-[90%] w-[90%]" />
                </BlouseBg>
              }
              after={
                <BlouseBg tone="bg-gradient-to-br from-rani-100 via-ivory-100 to-gold-100">
                  <BlouseArt color="#b52c52" neckline="sweetheart" className="h-[90%] w-[90%]" />
                </BlouseBg>
              }
            />
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow="Before & After" script="see the difference" title="Transformations we love" className="mb-6 sm:mb-8" />
            <Reveal>
              <p className="leading-relaxed text-maroon-900/75">
                Drag the slider to see how a loose, plain blouse becomes a perfectly fitted festive piece — taken in at the sides, reshaped into a sweetheart neckline, and finished with zari borders and latkans.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { k: '2–3 days', v: 'Standard turnaround' },
                  { k: '24 hrs', v: 'Express for urgent functions' },
                  { k: '1,200+', v: 'Blouses altered' },
                  { k: 'Free', v: 'Re-fitting if needed' },
                ].map((s) => (
                  <div key={s.v} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-gold-200">
                    <p className="font-display text-3xl font-bold text-maroon-800">{s.k}</p>
                    <p className="text-sm text-maroon-900/60">{s.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-festive-glow py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Our Services" script="crafted with care" title="Alteration Services" description="Transparent starting prices — we confirm the final quote after seeing your blouse." />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOUSE_SERVICE_DETAILS.map((s, i) => (
              <StaggerItem key={s.title} className={i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-gold-200 transition duration-500 hover:-translate-y-2 hover:shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ivory-100 via-rani-50 to-gold-100">
                    <BlouseArt color={s.color} neckline={s.neckline} className="h-full w-full transition duration-700 group-hover:scale-110" />
                    <span className="absolute top-4 right-4 rounded-full bg-maroon-800 px-3 py-1 text-xs font-semibold text-gold-100">{s.price}</span>
                  </div>
                  <div className="flex-1 p-6">
                    <h3 className="flex items-center gap-2 text-2xl font-semibold text-maroon-900">
                      <Scissors className="size-5 text-gold-600" /> {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-maroon-900/70">{s.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading align="left" eyebrow="How it works" title="Simple, stress-free process" className="mb-8" />
            <ol className="space-y-5">
              {BLOUSE_STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.1}>
                  <li className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-maroon-800 font-display text-xl font-bold text-gold-200">{i + 1}</span>
                    <div>
                      <h3 className="text-2xl font-semibold text-maroon-900">{step.title}</h3>
                      <p className="text-maroon-900/65">{step.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <div className="mt-10 rounded-3xl bg-maroon-velvet p-6 text-ivory-50">
              <p className="flex items-center gap-2 font-display text-2xl">
                <Clock className="size-5 text-gold-300" /> Need it urgently?
              </p>
              <p className="mt-1 text-sm text-ivory-100/75">Call or WhatsApp us for quick assistance — {formatPhone(CONTACTS.services.phone)}</p>
              <ContactButtons line="services" tone="dark" className="mt-4" message="Hi DeBu! I need an urgent blouse alteration." />
            </div>
          </div>
          <Reveal direction="left">
            <div id="book" className="scroll-mt-28">
              <BookingForm service="blouse-alteration" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
