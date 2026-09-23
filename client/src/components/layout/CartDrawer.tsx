'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { formatINR, SHIPPING } from '@debu/shared';
import { cartTotals, useCart } from '@/store/cart';
import { useUi } from '@/store/ui';
import { ProductArt } from '@/components/art/ProductArt';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ButtonLink } from '@/components/ui/Button';
import { colorLabel, sizeLabel } from '@/lib/format';
import { lockScroll } from '@/components/effects/SmoothScroll';

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const { items, couponCode, remove, setQuantity } = useCart();
  const totals = cartTotals(items, couponCode);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);
  useEffect(() => lockScroll(open), [open]);

  const progress = Math.min(100, (totals.discountedSubtotal / SHIPPING.freeAbove) * 100);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[65]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-maroon-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-gold-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-maroon-900">
                <ShoppingBag className="size-5 text-gold-600" /> Your Cart
                <span className="text-base font-normal text-maroon-900/50">({totals.itemCount})</span>
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full hover:bg-gold-100" aria-label="Close cart">
                <X className="size-5" />
              </button>
            </div>

            {items.length > 0 && (
              <div className="border-b border-gold-100 bg-gold-50/60 px-5 py-3 text-sm">
                {totals.freeShippingRemaining > 0 ? (
                  <p className="text-maroon-800">
                    Add <b>{formatINR(totals.freeShippingRemaining)}</b> more for <b>free shipping</b> 🎉
                  </p>
                ) : (
                  <p className="font-medium text-leaf-600">You’ve unlocked free shipping! 🎉</p>
                )}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gold-100">
                  <motion.div className="h-full rounded-full bg-gold-sheen" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="size-14 text-gold-300" />
                  <p className="mt-4 font-display text-2xl text-maroon-900">Your cart is empty</p>
                  <p className="mt-1 text-sm text-maroon-900/60">Discover handcrafted pieces made for your celebrations.</p>
                  <ButtonLink href="/silk-thread-jewellery" className="mt-6" onClick={() => setOpen(false)}>
                    Start Shopping
                  </ButtonLink>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li key={item.key} layout exit={{ opacity: 0, x: 60 }} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-gold-100">
                        <div className="size-20 shrink-0 overflow-hidden rounded-xl">
                          <ProductArt art={item.art} color={item.color} defaultColor={item.defaultColor} size={item.size} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium leading-snug text-maroon-900">{item.name}</p>
                            <button type="button" onClick={() => remove(item.key)} className="text-maroon-900/40 hover:text-rani-600" aria-label={`Remove ${item.name}`}>
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-maroon-900/60">
                            {[item.size && sizeLabel(item.size), colorLabel(item.color, item.customColor)].filter(Boolean).join(' · ')}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <QuantitySelector size="sm" value={item.quantity} onChange={(q) => setQuantity(item.key, q)} />
                            <span className="font-display text-lg font-bold text-maroon-800">{formatINR(item.unitPrice * item.quantity)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gold-200 bg-white px-5 py-4">
                {totals.collectionDiscount > 0 && (
                  <p className="mb-1 flex justify-between text-sm text-leaf-600">
                    <span>Complete Collection savings</span>
                    <span>−{formatINR(totals.collectionDiscount)}</span>
                  </p>
                )}
                <p className="flex justify-between text-lg">
                  <span className="text-maroon-900/70">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-maroon-900">{formatINR(totals.subtotal - totals.collectionDiscount)}</span>
                </p>
                <p className="mt-0.5 text-xs text-maroon-900/50">GST, shipping & coupons calculated at checkout.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ButtonLink href="/cart" variant="outline">
                    View Cart
                  </ButtonLink>
                  <ButtonLink href="/checkout">Checkout</ButtonLink>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
