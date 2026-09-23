'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { CONTACTS } from '@debu/shared';
import { formatPhone, telLink, whatsappLink } from '@/lib/contact';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

const SERVICE_ROUTES = ['/blouse-alteration', '/mehandi'];

/** Floating WhatsApp button that routes to the right number for the page. */
export function FloatingContact() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setShowTop(y > 800));

  const primary = SERVICE_ROUTES.some((r) => pathname.startsWith(r)) ? CONTACTS.services : CONTACTS.products;
  const lines = primary.key === 'services' ? [CONTACTS.services, CONTACTS.products] : [CONTACTS.products, CONTACTS.services];

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex size-11 items-center justify-center rounded-full bg-ivory-50 text-maroon-800 shadow-card ring-1 ring-gold-300 hover:bg-gold-100"
            aria-label="Back to top"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="w-72 origin-bottom-right rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-gold-200"
          >
            <p className="font-display text-xl font-semibold text-maroon-900">Namaste! 🙏</p>
            <p className="mb-3 text-sm text-maroon-900/65">Call or WhatsApp us for quick assistance.</p>
            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.key} className="rounded-2xl bg-ivory-100 p-3">
                  <p className="text-xs font-semibold tracking-wide text-gold-700 uppercase">{line.label}</p>
                  <p className="font-medium text-maroon-900">{formatPhone(line.phone)}</p>
                  <div className="mt-2 flex gap-2">
                    <a href={telLink(line.phone)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-maroon-800 py-2 text-sm text-white hover:bg-maroon-700">
                      <Phone className="size-3.5" /> Call
                    </a>
                    <a
                      href={whatsappLink(line.phone, `Hi DeBu! I have a question about ${line.label}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2 text-sm text-white hover:bg-[#1ebe5b]"
                    >
                      <WhatsAppIcon className="size-4" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105"
        aria-label={open ? 'Close contact options' : 'Contact us on WhatsApp'}
        aria-expanded={open}
      >
        {!open && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />}
        {open ? <X className="relative size-6" /> : <WhatsAppIcon className="relative size-7" />}
      </button>
    </div>
  );
}
