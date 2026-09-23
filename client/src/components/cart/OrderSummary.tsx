'use client';

import { formatINR, GST, SHIPPING, WIRE_BAG_COLLECTION, type CartTotals } from '@debu/shared';
import { cn } from '@/lib/utils';

export function OrderSummary({ totals, className, children }: { totals: CartTotals; className?: string; children?: React.ReactNode }) {
  const row = 'flex items-center justify-between gap-4 py-1.5';
  return (
    <div className={cn('rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-gold-300', className)}>
      <h2 className="text-2xl font-semibold text-maroon-900">Order Summary</h2>
      <div className="mt-4 text-sm">
        <div className={row}>
          <span className="text-maroon-900/70">Subtotal ({totals.itemCount} items)</span>
          <span className="font-medium text-maroon-900">{formatINR(totals.subtotal)}</span>
        </div>
        {totals.collections.map((c) => (
          <div key={c.productId} className={cn(row, 'text-leaf-600')}>
            <span>
              Complete Collection · {c.name}
              {c.sets > 1 && ` ×${c.sets}`}
            </span>
            <span>−{formatINR(c.sets * WIRE_BAG_COLLECTION.discount)}</span>
          </div>
        ))}
        {totals.coupon && (
          <div className={cn(row, 'text-leaf-600')}>
            <span>Coupon ({totals.coupon.code})</span>
            <span>−{formatINR(totals.couponDiscount)}</span>
          </div>
        )}
        <div className={row}>
          <span className="text-maroon-900/70">Shipping</span>
          <span className={totals.shipping ? 'font-medium text-maroon-900' : 'font-semibold text-leaf-600'}>{totals.shipping ? formatINR(totals.shipping) : 'FREE'}</span>
        </div>
        {GST.enabled && (
          <div className={row}>
            <span className="text-maroon-900/70">{GST.label}</span>
            <span className="font-medium text-maroon-900">{formatINR(totals.gst)}</span>
          </div>
        )}
        <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-gold-300 pt-4">
          <span className="text-base font-semibold text-maroon-900">Total</span>
          <span className="font-display text-4xl font-bold text-maroon-800">{formatINR(totals.total)}</span>
        </div>
        {totals.collectionDiscount + totals.couponDiscount > 0 && (
          <p className="mt-2 rounded-xl bg-leaf-500/10 px-3 py-2 text-center text-sm font-semibold text-leaf-600">
            🎉 You’re saving {formatINR(totals.collectionDiscount + totals.couponDiscount)} on this order
          </p>
        )}
        {totals.freeShippingRemaining > 0 && totals.itemCount > 0 && (
          <p className="mt-2 text-center text-xs text-maroon-900/55">Add {formatINR(totals.freeShippingRemaining)} more for free shipping (orders above {formatINR(SHIPPING.freeAbove)})</p>
        )}
      </div>
      {children}
    </div>
  );
}
