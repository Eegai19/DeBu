'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Lock, ShoppingBag, Trash2 } from 'lucide-react';
import { formatINR, WIRE_BAG_COLLECTION } from '@debu/shared';
import { cartTotals, useCart } from '@/store/cart';
import { useMounted } from '@/hooks/useMounted';
import { categoryName, colorLabel, sizeLabel } from '@/lib/format';
import { ProductArt } from '@/components/art/ProductArt';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ButtonLink } from '@/components/ui/Button';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { OrderSummary } from './OrderSummary';
import { CouponBox } from './CouponBox';

export function CartView() {
  const mounted = useMounted();
  const { items, couponCode, remove, setQuantity, clear } = useCart();
  const totals = cartTotals(items, couponCode);

  if (!mounted) return <div className="h-96 animate-pulse rounded-[2rem] bg-white/60" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-12 text-center shadow-soft ring-1 ring-gold-200">
        <ShoppingBag className="mx-auto size-16 text-gold-300" />
        <h2 className="mt-4 text-4xl font-semibold text-maroon-900">Your cart is empty</h2>
        <p className="mt-2 text-maroon-900/60">Explore our handcrafted collections and find something you’ll love.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/silk-thread-jewellery">Shop Jewellery</ButtonLink>
          <ButtonLink href="/wire-bags" variant="outline">
            Wire Bags
          </ButtonLink>
        </div>
      </div>
    );
  }

  const sizedBags = items.filter((i) => i.size);
  const hasPartialCollection = sizedBags.length > 0 && totals.collections.length === 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-gold-200">
          <div className="hidden grid-cols-[1fr_140px_120px_40px] gap-4 border-b border-gold-100 px-6 py-4 font-accent text-xs tracking-widest text-gold-700 uppercase md:grid">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span />
          </div>
          <ul>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.key}
                  layout
                  exit={{ opacity: 0, x: -80, height: 0 }}
                  className="grid grid-cols-[80px_1fr] items-center gap-4 border-b border-gold-100 px-4 py-5 last:border-0 sm:px-6 md:grid-cols-[1fr_140px_120px_40px]"
                >
                  <div className="col-span-2 flex items-center gap-4 md:col-span-1">
                    <Link href={item.kind === 'combo' ? '/silk-thread-jewellery#combos' : `/product/${item.slug}`} className="size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-gold-200 sm:size-24">
                      <ProductArt art={item.art} color={item.color} defaultColor={item.defaultColor} size={item.size} label={item.name} />
                    </Link>
                    <div className="min-w-0">
                      <p className="font-accent text-[10px] tracking-[0.2em] text-gold-700 uppercase">{categoryName(item.category)}</p>
                      <p className="font-display text-xl leading-tight font-semibold text-maroon-900">{item.name}</p>
                      <p className="mt-1 text-sm text-maroon-900/60">
                        {[item.size && `Size: ${sizeLabel(item.size)}`, colorLabel(item.color, item.customColor)].filter(Boolean).join(' · ')}
                      </p>
                      {item.notes && <p className="mt-0.5 line-clamp-1 text-xs text-maroon-900/50">Notes: {item.notes}</p>}
                      <p className="mt-1 text-sm text-maroon-900/70">{formatINR(item.unitPrice)} each</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-3 md:contents">
                    <div className="md:flex md:justify-center">
                      <QuantitySelector size="sm" value={item.quantity} onChange={(q) => setQuantity(item.key, q)} />
                    </div>
                    <p className="text-right font-display text-2xl font-bold text-maroon-800">{formatINR(item.unitPrice * item.quantity)}</p>
                    <button type="button" onClick={() => remove(item.key)} className="flex size-9 items-center justify-center rounded-full text-maroon-900/40 transition hover:bg-rani-50 hover:text-rani-600" aria-label={`Remove ${item.name}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {hasPartialCollection && (
          <p className="mt-4 rounded-2xl bg-gold-50 px-5 py-3 text-sm text-maroon-800 ring-1 ring-gold-200">
            💡 Add the Small, Medium <i>and</i> Large of the same wire bag to unlock the <b>{WIRE_BAG_COLLECTION.label}</b> — ₹{WIRE_BAG_COLLECTION.discount} OFF.{' '}
            <Link href="/wire-bags#collection-combo" className="font-semibold text-rani-700 underline">
              See offer
            </Link>
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/silk-thread-jewellery" className="flex items-center gap-2 font-medium text-maroon-800 hover:text-rani-700">
            <ArrowLeft className="size-4" /> Continue shopping
          </Link>
          <button type="button" onClick={clear} className="text-sm text-maroon-900/50 underline underline-offset-4 hover:text-rani-700">
            Clear cart
          </button>
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <CouponBox amount={totals.subtotal - totals.collectionDiscount} />
        <OrderSummary totals={totals}>
          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
            <Lock className="size-4" /> Proceed to Checkout
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-maroon-900/50">All prices in Indian Rupees (₹)</p>
        </OrderSummary>
        <div className="rounded-[2rem] bg-ivory-100 p-5 text-center ring-1 ring-gold-200">
          <p className="text-sm text-maroon-900/70">Prefer to order over the phone?</p>
          <ContactButtons line="products" size="sm" className="mt-3 justify-center" />
        </div>
      </div>
    </div>
  );
}
