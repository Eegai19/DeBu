import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { BRAND, CONTACTS, JEWELLERY_CATEGORIES } from '@debu/shared';
import { formatPhone, telLink } from '@/lib/contact';
import { Garland, Mandala } from '@/components/art/decor';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { Logo } from './Logo';

const SHOP = [
  ...JEWELLERY_CATEGORIES.map((c) => ({ href: `/silk-thread-jewellery/${c.slug}`, label: c.name })),
  { href: '/silk-thread-jewellery#combos', label: 'Combo Offers' },
  { href: '/wire-bags', label: 'Wire Bags' },
];
const SERVICES = [
  { href: '/blouse-alteration', label: 'Blouse Alteration' },
  { href: '/mehandi', label: 'Mehandi Booking' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/cart', label: 'Cart' },
  { href: '/contact', label: 'Contact Us' },
];

export function Footer() {
  return (
    <footer className="bg-maroon-velvet relative mt-24 overflow-hidden text-ivory-100">
      <Garland className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-90" strands={14} length={2} />
      <Mandala className="pointer-events-none absolute -bottom-40 -left-40 size-[520px] animate-spin-slower opacity-10" stroke="#ebb42a" />
      <div className="container-page relative pt-32 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 font-script text-3xl text-gold-200">{BRAND.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory-100/70">
              A home-grown label crafting silk thread jewellery, custom wire bags, blouse alterations and bridal mehandi — with love, for every celebration.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: BRAND.instagram, Icon: InstagramIcon, label: 'Instagram' },
                { href: BRAND.facebook, Icon: FacebookIcon, label: 'Facebook' },
                { href: BRAND.youtube, Icon: YoutubeIcon, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-gold-400/40 text-gold-200 transition hover:-translate-y-1 hover:bg-gold-400 hover:text-maroon-950"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop">
            <h3 className="font-accent text-sm tracking-[0.25em] text-gold-300 uppercase">Shop</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {SHOP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ivory-100/75 transition hover:pl-1 hover:text-gold-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="font-accent text-sm tracking-[0.25em] text-gold-300 uppercase">Services</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {SERVICES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ivory-100/75 transition hover:pl-1 hover:text-gold-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-accent text-sm tracking-[0.25em] text-gold-300 uppercase">Get in touch</h3>
            <div className="mt-5 space-y-5 text-sm">
              {[CONTACTS.products, CONTACTS.services].map((line) => (
                <div key={line.key}>
                  <p className="text-ivory-100/60">{line.label}</p>
                  <a href={telLink(line.phone)} className="font-display text-2xl font-semibold text-gold-200 hover:text-gold-100">
                    {formatPhone(line.phone)}
                  </a>
                  <ContactButtons line={line.key} size="sm" tone="dark" className="mt-2" />
                </div>
              ))}
              <p className="flex items-center gap-2 text-ivory-100/70">
                <Mail className="size-4 text-gold-300" /> {BRAND.email}
              </p>
              <p className="flex items-center gap-2 text-ivory-100/70">
                <MapPin className="size-4 text-gold-300" /> {BRAND.city}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-gold-400/20 pt-6 text-xs text-ivory-100/55 sm:flex-row">
          <p>© {new Date().getFullYear()} DeBu. All rights reserved. Made with ♥ in India.</p>
          <p>All prices in INR (₹) · Cash on Delivery available</p>
        </div>
      </div>
    </footer>
  );
}
