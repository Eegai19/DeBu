import { Phone, Sparkles, Truck } from 'lucide-react';
import { CONTACTS, SHIPPING, formatINR } from '@debu/shared';
import { formatPhone, telLink } from '@/lib/contact';

export function TopBar() {
  return (
    <div className="relative z-50 bg-maroon-950 text-[13px] text-ivory-100">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <p className="flex items-center gap-2 truncate">
          <Truck className="size-3.5 shrink-0 text-gold-300" />
          <span className="truncate">
            Free shipping above {formatINR(SHIPPING.freeAbove)} · Use <b className="text-gold-300">WELCOME50</b> on your first order
          </span>
        </p>
        <div className="hidden items-center gap-5 md:flex">
          <a href={telLink(CONTACTS.products.phone)} className="flex items-center gap-1.5 hover:text-gold-300">
            <Sparkles className="size-3.5 text-gold-300" /> Jewellery & Bags: {formatPhone(CONTACTS.products.phone)}
          </a>
          <a href={telLink(CONTACTS.services.phone)} className="flex items-center gap-1.5 hover:text-gold-300">
            <Phone className="size-3.5 text-gold-300" /> Blouse & Mehandi: {formatPhone(CONTACTS.services.phone)}
          </a>
        </div>
      </div>
    </div>
  );
}
