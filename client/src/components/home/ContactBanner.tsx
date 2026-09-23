import { CONTACTS } from '@debu/shared';
import { formatPhone, telLink } from '@/lib/contact';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { Garland } from '@/components/art/decor';
import { Sparkles } from '@/components/effects/Sparkles';
import { Reveal } from '@/components/ui/Reveal';

export function ContactBanner() {
  return (
    <section className="container-page py-16 sm:py-24">
      <Reveal direction="scale">
        <div className="bg-maroon-velvet relative overflow-hidden rounded-[2.5rem] px-6 pt-28 pb-12 text-ivory-50 shadow-card sm:px-12 sm:pt-32">
          <Garland className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full" strands={12} length={3} />
          <Sparkles count={18} />
          <div className="relative text-center">
            <p className="font-accent text-xs tracking-[0.35em] text-gold-300 uppercase">We’re just a call away</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-6xl">
              Let’s make your celebration <span className="text-gold-gradient italic">unforgettable</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory-100/75">Call or WhatsApp us for custom orders, bookings and quick assistance.</p>
          </div>
          <div className="relative mt-10 grid gap-5 md:grid-cols-2">
            {[CONTACTS.products, CONTACTS.services].map((line) => (
              <div key={line.key} className="rounded-3xl border border-gold-300/30 bg-white/[0.07] p-6 text-center backdrop-blur transition hover:border-gold-300/70">
                <p className="font-accent text-xs tracking-[0.25em] text-gold-200 uppercase">{line.label}</p>
                <a href={telLink(line.phone)} className="mt-2 block font-display text-4xl font-bold text-gold-gradient sm:text-5xl">
                  {formatPhone(line.phone)}
                </a>
                <ContactButtons line={line.key} tone="dark" className="mt-5 justify-center" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
