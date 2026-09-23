import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import { BRAND, CONTACTS } from '@debu/shared';
import { FAQS } from '@/data/content';
import { formatPhone, telLink } from '@/lib/contact';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { ContactForm } from '@/components/contact/ContactForm';
import { Diya, Mandala, Marigold } from '@/components/art/decor';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Call or WhatsApp DeBu — Silk Thread Jewellery & Wire Bags: ${CONTACTS.products.phone}, Blouse Alteration & Mehandi: ${CONTACTS.services.phone}.`,
};

export default function ContactPage() {
  const lines = [
    { ...CONTACTS.products, text: 'Orders, custom colours, bulk return gifts and combo enquiries.', tone: 'from-maroon-800 to-rani-700' },
    { ...CONTACTS.services, text: 'Alteration bookings, mehandi dates, bridal packages and quotes.', tone: 'from-henna-600 to-marigold-600' },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        script="namaste!"
        title="We’d love to hear from you"
        description="Call or WhatsApp us for quick assistance — we usually reply within a few hours."
        crumbs={[{ label: 'Contact Us' }]}
        visual={
          <div className="bg-maroon-velvet relative flex h-full w-full items-center justify-center">
            <Mandala className="absolute inset-0 size-full animate-spin-slow opacity-40" stroke="#ebb42a" />
            <Diya size={180} className="relative" />
          </div>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <Stagger className="grid gap-6 md:grid-cols-2">
            {lines.map((l) => (
              <StaggerItem key={l.key}>
                <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${l.tone} p-8 text-ivory-50 shadow-card`}>
                  <Marigold size={140} className="absolute -top-8 -right-8 opacity-40" />
                  <p className="relative font-accent text-xs tracking-[0.3em] text-gold-200 uppercase">{l.label}</p>
                  <a href={telLink(l.phone)} className="relative mt-3 block font-display text-5xl font-bold">
                    {formatPhone(l.phone)}
                  </a>
                  <p className="relative mt-2 text-ivory-100/80">{l.text}</p>
                  <ContactButtons line={l.key} tone="dark" className="relative mt-6" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal direction="right">
            <ContactForm />
          </Reveal>
          <Reveal direction="left" className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-gold-200">
              {[
                { Icon: MapPin, t: 'Studio', v: `${BRAND.city} · Visits by appointment` },
                { Icon: Clock, t: 'Working hours', v: 'Mon – Sat, 10:00 AM – 8:00 PM' },
                { Icon: Mail, t: 'Email', v: BRAND.email },
              ].map(({ Icon, t, v }) => (
                <div key={t} className="flex items-start gap-4 border-b border-gold-100 py-4 last:border-0">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium text-maroon-900">{t}</p>
                    <p className="text-sm text-maroon-900/65">{v}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-paisley relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[2rem] bg-gold-50 ring-1 ring-gold-200">
              <div className="text-center">
                <MapPin className="mx-auto size-10 animate-bounce text-rani-600" />
                <p className="mt-2 font-display text-2xl text-maroon-900">{BRAND.city}</p>
                <p className="text-sm text-maroon-900/60">Pan-India shipping · Home-visit services locally</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-festive-glow py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gold-200 open:ring-gold-400">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold text-maroon-900">
                  {f.q}
                  <span className="text-2xl text-gold-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-maroon-900/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
