'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Tag, X } from 'lucide-react';
import { useState } from 'react';
import { COUPONS, evaluateCoupon } from '@debu/shared';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

export function CouponBox({ amount }: { amount: number }) {
  const { couponCode, applyCoupon } = useCart();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const apply = (value: string) => {
    const result = evaluateCoupon(value, amount);
    setMessage({ ok: result.valid, text: result.message });
    if (result.valid) {
      applyCoupon(result.coupon!.code);
      setCode('');
    }
  };

  const active = couponCode ? evaluateCoupon(couponCode, amount) : null;

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-gold-200">
      <h3 className="flex items-center gap-2 text-xl font-semibold text-maroon-900">
        <Tag className="size-5 text-gold-600" /> Apply Coupon
      </h3>
      {couponCode ? (
        <div className={cn('mt-4 flex items-center justify-between rounded-2xl border border-dashed px-4 py-3', active?.valid ? 'border-leaf-500 bg-leaf-500/5' : 'border-rani-400 bg-rani-50')}>
          <div>
            <p className="font-accent font-bold tracking-wider text-maroon-900">{couponCode}</p>
            <p className={cn('text-xs', active?.valid ? 'text-leaf-600' : 'text-rani-700')}>{active?.message}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              applyCoupon(null);
              setMessage(null);
            }}
            className="flex size-8 items-center justify-center rounded-full hover:bg-white"
            aria-label="Remove coupon"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) apply(code);
          }}
        >
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="field-input flex-1 uppercase" aria-label="Coupon code" />
          <button type="submit" className="rounded-xl bg-maroon-800 px-5 text-sm font-medium text-white transition hover:bg-maroon-700">
            Apply
          </button>
        </form>
      )}
      <AnimatePresence>
        {message && !couponCode && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn('mt-2 text-sm', message.ok ? 'text-leaf-600' : 'text-rani-700')}>
            {message.text}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="mt-4 space-y-2">
        {COUPONS.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => apply(c.code)}
            className="flex w-full items-center justify-between gap-3 rounded-xl bg-ivory-100 px-3 py-2 text-left text-xs transition hover:bg-gold-100"
          >
            <span className="font-accent font-bold tracking-wider text-maroon-800">{c.code}</span>
            <span className="flex-1 text-maroon-900/65">{c.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
