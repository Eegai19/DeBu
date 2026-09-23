'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, PackageCheck } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { CONTACTS, formatINR } from '@debu/shared';
import { readLastOrder } from '@/lib/orders';
import { whatsappLink } from '@/lib/contact';
import { colorLabel, formatDate, sizeLabel } from '@/lib/format';
import { UPI_ID } from '@/lib/config';
import type { PlacedOrder } from '@/lib/types';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { FloatingPetals } from '@/components/effects/FloatingPetals';

const PAYMENT_LABEL = { cod: 'Cash on Delivery', upi: 'UPI', online: 'Online Payment' } as const;

let cached: PlacedOrder | null | undefined;
const getOrder = () => (cached === undefined ? (cached = readLastOrder()) : cached);

function orderMessage(o: PlacedOrder) {
  const lines = o.items.map((i) => `• ${i.name}${i.size ? ` (${sizeLabel(i.size)})` : ''} — ${colorLabel(i.color, i.customColor)} × ${i.quantity} = ${formatINR(i.lineTotal)}`);
  return [
    `Hi DeBu! I placed order ${o.orderNumber}.`,
    ...lines,
    `Total: ${formatINR(o.pricing.total)} (${PAYMENT_LABEL[o.paymentMethod]})`,
    `Deliver to: ${o.customer.name}, ${o.customer.address}, ${o.customer.city}, ${o.customer.state} - ${o.customer.pincode}. Ph: ${o.customer.phone}`,
  ].join('\n');
}

export function OrderConfirmation({ orderNumber }: { orderNumber?: string }) {
  const order = useSyncExternalStore(
    () => () => {},
    getOrder,
    () => null,
  );
  const matches = order && (!orderNumber || order.orderNumber === orderNumber);

  if (!matches) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-card ring-1 ring-gold-200">
        <PackageCheck className="mx-auto size-14 text-gold-500" />
        <h1 className="mt-4 text-4xl font-semibold text-maroon-900">Thank you!</h1>
        {orderNumber && (
          <p className="mt-2 text-maroon-900/70">
            Order <b>{orderNumber}</b>
          </p>
        )}
        <p className="mt-2 text-maroon-900/60">For order updates, WhatsApp us with your order number.</p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href={whatsappLink(CONTACTS.products.phone, `Hi DeBu! I'd like an update on order ${orderNumber ?? ''}`)} variant="whatsapp">
            <WhatsAppIcon /> WhatsApp Us
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Home
          </ButtonLink>
        </div>
      </div>
    );
  }

  const o = order;
  return (
    <div className="relative mx-auto max-w-3xl">
      <FloatingPetals count={26} seed={42} className="fixed" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-gold-300">
        <div className="bg-maroon-velvet px-6 py-10 text-center text-ivory-50">
          <motion.div initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.2 }}>
            <CheckCircle2 className="mx-auto size-20 text-gold-300" />
          </motion.div>
          <p className="mt-4 font-script text-4xl text-gold-200">Dhanyavaad!</p>
          <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">{o.offline ? 'Order captured!' : 'Order placed successfully'}</h1>
          <p className="mt-3 text-ivory-100/80">
            Order number <b className="font-accent tracking-wider text-gold-200">{o.orderNumber}</b> · {formatDate(o.createdAt)}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {o.offline && (
            <div className="mb-6 rounded-2xl bg-gold-50 p-4 text-sm text-maroon-900 ring-1 ring-gold-300">
              <b>Please confirm on WhatsApp:</b> we couldn’t reach our order server right now, so tap the button below to send your order details to us. We’ll confirm within minutes.
            </div>
          )}
          {o.paymentMethod === 'upi' && (
            <div className="mb-6 rounded-2xl bg-leaf-500/10 p-4 text-sm text-maroon-900">
              <b>Pay via UPI:</b> send {formatINR(o.pricing.total)} to <b>{UPI_ID}</b> and share the payment screenshot on WhatsApp with your order number.
            </div>
          )}
          {o.paymentMethod === 'online' && (
            <div className="mb-6 rounded-2xl bg-leaf-500/10 p-4 text-sm text-maroon-900">We’ll send a secure payment link to your WhatsApp shortly.</div>
          )}

          <h2 className="text-2xl font-semibold text-maroon-900">Order Summary</h2>
          <ul className="mt-4 divide-y divide-gold-100 text-sm">
            {o.items.map((i, k) => (
              <li key={k} className="flex justify-between gap-4 py-3">
                <span>
                  <span className="font-medium text-maroon-900">{i.name}</span>
                  <span className="block text-xs text-maroon-900/55">
                    {[i.size && sizeLabel(i.size), colorLabel(i.color, i.customColor), `Qty ${i.quantity}`].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="font-medium text-maroon-900">{formatINR(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-dashed border-gold-300 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-maroon-900/65">Subtotal</dt>
              <dd>{formatINR(o.pricing.subtotal)}</dd>
            </div>
            {o.pricing.collectionDiscount > 0 && (
              <div className="flex justify-between text-leaf-600">
                <dt>Complete Collection discount</dt>
                <dd>−{formatINR(o.pricing.collectionDiscount)}</dd>
              </div>
            )}
            {o.pricing.couponDiscount > 0 && (
              <div className="flex justify-between text-leaf-600">
                <dt>Coupon {o.pricing.couponCode}</dt>
                <dd>−{formatINR(o.pricing.couponDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-maroon-900/65">Shipping</dt>
              <dd>{o.pricing.shipping ? formatINR(o.pricing.shipping) : 'FREE'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-maroon-900/65">GST</dt>
              <dd>{formatINR(o.pricing.gst)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-semibold text-maroon-900">Total ({PAYMENT_LABEL[o.paymentMethod]})</dt>
              <dd className="font-display text-3xl font-bold text-maroon-800">{formatINR(o.pricing.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl bg-ivory-100 p-4 text-sm">
            <p className="font-medium text-maroon-900">Delivering to</p>
            <p className="text-maroon-900/70">
              {o.customer.name} · +91 {o.customer.phone}
              <br />
              {o.customer.address}, {o.customer.city}, {o.customer.state} – {o.customer.pincode}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={whatsappLink(CONTACTS.products.phone, orderMessage(o))} variant="whatsapp" size="lg">
              <WhatsAppIcon /> {o.offline ? 'Confirm on WhatsApp' : 'Share on WhatsApp'}
            </ButtonLink>
            <ButtonLink href="/silk-thread-jewellery" variant="outline" size="lg">
              Continue Shopping
            </ButtonLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
