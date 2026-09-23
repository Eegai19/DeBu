'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 50,
  size = 'md',
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const btn = cn(
    'flex items-center justify-center rounded-full text-maroon-800 transition hover:bg-gold-100 disabled:opacity-30',
    size === 'sm' ? 'size-7' : 'size-9',
  );
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full border border-gold-300 bg-white p-1', className)} role="group" aria-label="Quantity">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        className={cn('w-10 bg-transparent text-center font-semibold text-maroon-900 [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none', size === 'sm' && 'w-8 text-sm')}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        aria-label="Quantity"
      />
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
