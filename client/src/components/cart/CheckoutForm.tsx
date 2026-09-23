'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Banknote, CreditCard, Loader2, Lock, QrCode, ShieldCheck, ShoppingBag, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatINR, INDIAN_STATES, PATTERNS, PAYMENT_METHODS, type PaymentMethod } from '@debu/shared';
import { cartTotals, useCart } from '@/store/cart';
import { useMounted } from '@/hooks/useMounted';
import { ApiRequestError, ApiUnavailableError, postJson } from '@/lib/api';
import { localOrderNumber, saveLastOrder } from '@/lib/orders';
import { colorLabel, sizeLabel } from '@/lib/format';
import { UPI_ID } from '@/lib/config';
import type { PlacedOrder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ProductArt } from '@/components/art/ProductArt';
import { Button, ButtonLink } from '@/components/ui/Button';
import { OrderSummary } from './OrderSummary';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
    .refine((v) => PATTERNS.phone.test(v), 'Enter a valid 10-digit mobile number'),
  email: z.union([z.literal(''), z.email('Enter a valid email')]),
  address: z.string().trim().min(8, 'Please enter your full address (house no., street, area)').max(300),
  city: z.string().trim().min(2, 'Enter your city').max(60),
  state: z.string().refine((v) => INDIAN_STATES.includes(v), 'Select your state'),
  pincode: z.string().trim().regex(PATTERNS.pincode, 'Enter a valid 6-digit pincode'),
  notes: z.string().trim().max(1000).optional(),
});
type Values = z.input<typeof schema>;
type Parsed = z.output<typeof schema>;

const PAY_ICONS: Record<PaymentMethod, typeof Banknote> = { cod: Banknote, upi: Smartphone, online: CreditCard };

export function CheckoutForm() {
  const mounted = useMounted();
  const router = useRouter();
  const { items, couponCode, clear } = useCart();
  const totals = cartTotals(items, couponCode);
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [formError, setFormError] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values, unknown, Parsed>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', address: '', city: '', state: 'Tamil Nadu', pincode: '', notes: '' },
  });

  if (!mounted) return <div className="h-[600px] animate-pulse rounded-[2rem] bg-white/60" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-12 text-center shadow-soft ring-1 ring-gold-200">
        <ShoppingBag className="mx-auto size-14 text-gold-300" />
        <h2 className="mt-4 text-3xl font-semibold text-maroon-900">Nothing to check out yet</h2>
        <p className="mt-2 text-maroon-900/60">Add a few handcrafted favourites to your cart first.</p>
        <ButtonLink href="/silk-thread-jewellery" className="mt-6">
          Start Shopping
        </ButtonLink>
      </div>
    );
  }

  const onSubmit = async (v: Parsed) => {
    setFormError(undefined);
    const customer = { name: v.name, phone: v.phone, email: v.email || undefined, address: v.address, city: v.city, state: v.state, pincode: v.pincode };
    const payload = {
      items: items.map((i) => ({ kind: i.kind, slug: i.slug, size: i.size, color: i.color, customColor: i.customColor, notes: i.notes, quantity: i.quantity })),
      couponCode: totals.coupon?.code ?? null,
      customer,
      paymentMethod: payment,
      notes: v.notes || undefined,
    };

    let order: PlacedOrder;
    try {
      const res = await postJson<{ data: PlacedOrder }>('/orders', payload);
      order = { ...res.data, offline: false };
    } catch (err) {
      if (err instanceof ApiRequestError) {
        err.details?.forEach((d) => {
          const field = d.field.replace(/^customer\./, '') as keyof Values;
          if (field in schema.shape) setError(field, { message: d.message });
        });
        setFormError(err.details?.some((d) => d.field.startsWith('items')) ? `${err.message} ${err.details.map((d) => d.message).join(' ')}` : err.message);
        return;
      }
      if (!(err instanceof ApiUnavailableError)) throw err;
      // Offline fallback: capture locally & confirm over WhatsApp.
      order = {
        orderNumber: localOrderNumber(),
        createdAt: new Date().toISOString(),
        customer,
        items: items.map((i) => ({ name: i.name, size: i.size, color: i.color, customColor: i.customColor, quantity: i.quantity, unitPrice: i.unitPrice, lineTotal: i.unitPrice * i.quantity })),
        pricing: {
          subtotal: totals.subtotal,
          collectionDiscount: totals.collectionDiscount,
          couponCode: totals.coupon?.code,
          couponDiscount: totals.couponDiscount,
          shipping: totals.shipping,
          gst: totals.gst,
          total: totals.total,
        },
        paymentMethod: payment,
        offline: true,
      };
    }
    saveLastOrder(order);
    clear();
    router.push(`/order-success?order=${encodeURIComponent(order.orderNumber)}`);
  };

  const input = (name: keyof Values) => ({ 'aria-invalid': Boolean(errors[name]), ...register(name) });
  const err = (name: keyof Values) => errors[name] && <p className="field-error">{errors[name]?.message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-gold-200 sm:p-8">
          <h2 className="flex items-center gap-3 text-3xl font-semibold text-maroon-900">
            <span className="flex size-9 items-center justify-center rounded-full bg-maroon-800 font-display text-lg text-gold-200">1</span>
            Delivery Details
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Full Name *</span>
              <input className="field-input" autoComplete="name" {...input('name')} />
              {err('name')}
            </label>
            <label className="block">
              <span className="field-label">Mobile Number *</span>
              <div className="flex">
                <span className="flex items-center rounded-l-xl border border-r-0 border-gold-200 bg-gold-50 px-3 text-sm text-maroon-800">+91</span>
                <input className="field-input rounded-l-none" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} {...input('phone')} />
              </div>
              {err('phone')}
            </label>
            <label className="block sm:col-span-2">
              <span className="field-label">Email (optional, for order updates)</span>
              <input className="field-input" type="email" autoComplete="email" {...input('email')} />
              {err('email')}
            </label>
            <label className="block sm:col-span-2">
              <span className="field-label">Address *</span>
              <textarea className="field-input min-h-24 resize-y" autoComplete="street-address" placeholder="House no., street, area, landmark" {...input('address')} />
              {err('address')}
            </label>
            <label className="block">
              <span className="field-label">City *</span>
              <input className="field-input" autoComplete="address-level2" {...input('city')} />
              {err('city')}
            </label>
            <label className="block">
              <span className="field-label">State *</span>
              <select className="field-input" autoComplete="address-level1" {...input('state')}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {err('state')}
            </label>
            <label className="block">
              <span className="field-label">Pincode *</span>
              <input className="field-input" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...input('pincode')} />
              {err('pincode')}
            </label>
            <label className="block">
              <span className="field-label">Order notes</span>
              <input className="field-input" placeholder="Delivery instructions, event date…" {...input('notes')} />
            </label>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-gold-200 sm:p-8">
          <h2 className="flex items-center gap-3 text-3xl font-semibold text-maroon-900">
            <span className="flex size-9 items-center justify-center rounded-full bg-maroon-800 font-display text-lg text-gold-200">2</span>
            Payment Method
          </h2>
          <div className="mt-6 grid gap-3" role="radiogroup" aria-label="Payment method">
            {PAYMENT_METHODS.map((m) => {
              const Icon = PAY_ICONS[m.id];
              const selected = payment === m.id;
              return (
                <div key={m.id} className={cn('rounded-2xl border transition', selected ? 'border-gold-500 bg-gold-50/70 shadow-glow' : 'border-gold-200 hover:border-gold-400')}>
                  <label className="flex cursor-pointer items-center gap-4 p-4">
                    <input type="radio" name="payment" value={m.id} checked={selected} onChange={() => setPayment(m.id)} className="size-4 accent-maroon-700" />
                    <span className={cn('flex size-11 items-center justify-center rounded-xl', selected ? 'bg-maroon-800 text-gold-200' : 'bg-ivory-100 text-maroon-800')}>
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-medium text-maroon-900">{m.label}</span>
                      <span className="block text-sm text-maroon-900/60">{m.description}</span>
                    </span>
                  </label>
                  <AnimatePresence initial={false}>
                    {selected && m.id !== 'cod' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        {m.id === 'upi' ? (
                          <div className="mx-4 mb-4 flex items-center gap-4 rounded-xl bg-white p-4 ring-1 ring-gold-200">
                            <div className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-[repeating-conic-gradient(#45081b_0_25%,#fff_0_50%)] bg-[length:12px_12px] p-2">
                              <span className="flex size-full items-center justify-center rounded-lg bg-white">
                                <QrCode className="size-10 text-maroon-800" />
                              </span>
                            </div>
                            <div className="text-sm">
                              <p className="font-medium text-maroon-900">UPI ID: {UPI_ID}</p>
                              <p className="mt-1 text-maroon-900/65">Pay {formatINR(totals.total)} using any UPI app after placing the order. Share the screenshot on WhatsApp — we’ll confirm right away.</p>
                              <p className="mt-1 text-xs text-maroon-900/45">(Payment QR placeholder — live QR coming soon)</p>
                            </div>
                          </div>
                        ) : (
                          <div className="mx-4 mb-4 rounded-xl bg-white p-4 text-sm text-maroon-900/70 ring-1 ring-gold-200">
                            <p className="flex items-center gap-2 font-medium text-maroon-900">
                              <ShieldCheck className="size-4 text-leaf-600" /> Secure online payment
                            </p>
                            <p className="mt-1">Card, net-banking & wallet payments via our payment gateway are coming soon. For now we’ll send you a secure payment link on WhatsApp after you place the order.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-gold-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-maroon-900">Your Items</h2>
            <Link href="/cart" className="text-sm text-rani-700 underline-offset-4 hover:underline">
              Edit cart
            </Link>
          </div>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-gold-200">
                  <ProductArt art={i.art} color={i.color} defaultColor={i.defaultColor} size={i.size} />
                  <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-lg bg-maroon-800 text-[10px] font-bold text-white">{i.quantity}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-maroon-900">{i.name}</span>
                  <span className="block truncate text-xs text-maroon-900/55">{[i.size && sizeLabel(i.size), colorLabel(i.color, i.customColor)].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="text-sm font-semibold text-maroon-800">{formatINR(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <OrderSummary totals={totals}>
          {formError && <p className="mt-4 rounded-xl bg-rani-50 px-4 py-3 text-sm text-rani-700">{formError}</p>}
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-5" />}
            {isSubmitting ? 'Placing order…' : `Place Order · ${formatINR(totals.total)}`}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-maroon-900/50">
            <ShieldCheck className="size-3.5" /> Your details are only used to deliver your order.
          </p>
        </OrderSummary>
      </aside>
    </form>
  );
}
