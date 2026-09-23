import type { Metadata } from 'next';
import { Clock, Leaf } from 'lucide-react';
import { CONTACTS } from '@debu/shared';
import { GALLERY, MEHANDI_SERVICES } from '@/data/content';
import { formatPhone } from '@/lib/contact';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { MehandiArt } from '@/components/art/services';
import { BookingForm } from '@/components/services/BookingForm';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Mehandi',
  description: 'Book bridal, engagement, festival and family-function mehandi with natural henna. Call or WhatsApp 9786488488.',
};

export default function MehandiPage() {
  const mehandiGallery = [
    ...GALLERY.filter((g) => g.visual.type === 'mehandi'),
    { id: 'm4', title: 'Minimal Mehandi', caption: 'Quick festive design', visual: { type: 'mehandi' as const, style: 'minimal' as const }, tall: true },
    { id: 'm5', title: 'Bridal Detail', caption: 'Bride’s left hand', visual: { type: 'mehandi' as const, style: 'bridal' as const } },
  ];

  return (
    <>
      <PageHero
        eyebrow="Mehandi"
        script="stories in henna"
        title={
          <>
            Book Your <span className="text-gold-gradient italic">Mehandi Artist</span> Today
          </>
        }
        description="Rich, dark, natural henna — hand-drawn with intricate motifs for brides, families and festivals. We travel to your home or venue."
        crumbs={[{ label: 'Mehandi' }]}
        visual={<MehandiArt style="bridal" className="h-full w-full" />}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#book" size="lg">
            Book Now
          </ButtonLink>
          <ContactButtons line="services" tone="dark" message="Hi DeBu! I'd like to book a mehandi artist." />
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Mehandi Services" script="for every occasion" title="Choose Your Celebration" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MEHANDI_SERVICES.map((s, i) => (
              <StaggerItem key={s.title} className={i < 2 ? 'lg:col-span-1' : ''}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-gold-200 transition duration-500 hover:-translate-y-2 hover:shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <MehandiArt style={s.style} className="h-full w-full transition duration-[1.2s] group-hover:scale-110" />
                    <span className="absolute top-4 right-4 rounded-full bg-henna-600 px-3 py-1 text-xs font-semibold text-white">{s.price}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-semibold text-maroon-900">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-maroon-900/70">{s.text}</p>
                    <p className="mt-4 flex items-center gap-1.5 text-sm text-henna-600">
                      <Clock className="size-4" /> {s.duration}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
            <StaggerItem>
              <div className="bg-maroon-velvet flex h-full flex-col justify-center rounded-[1.75rem] p-8 text-ivory-50">
                <Leaf className="size-10 text-leaf-500" />
                <h3 className="mt-4 text-3xl font-semibold">100% natural henna</h3>
                <p className="mt-2 text-sm text-ivory-100/75">Freshly prepared, chemical-free paste with essential oils for a deep, long-lasting stain that’s safe for kids too.</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="bg-festive-glow py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Gallery" title="Mehandi Designs" />
          <MasonryGallery items={mehandiGallery} showFilters={false} />
        </div>
      </section>

      <section id="book" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading align="left" eyebrow="Reserve your date" script="slots fill fast" title="Book Your Mehandi Artist Today" className="mb-8" />
            <Reveal>
              <p className="leading-relaxed text-maroon-900/75">
                Wedding season dates fill up quickly — share your event details and we’ll confirm availability, artists and a custom quote within a few hours.
              </p>
              <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-gold-200">
                <p className="font-accent text-xs tracking-[0.25em] text-gold-700 uppercase">Mehandi & Blouse Alteration</p>
                <p className="mt-1 font-display text-4xl font-bold text-maroon-800">{formatPhone(CONTACTS.services.phone)}</p>
                <p className="mt-1 text-sm text-maroon-900/65">Call or WhatsApp us for quick assistance.</p>
                <ContactButtons line="services" className="mt-4" message="Hi DeBu! I'd like to book a mehandi artist." />
              </div>
            </Reveal>
          </div>
          <Reveal direction="left">
            <BookingForm service="mehandi" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
