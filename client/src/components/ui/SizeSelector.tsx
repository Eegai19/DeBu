'use client';

import { formatINR, type BagSize, type SizeOption } from '@debu/shared';
import { cn } from '@/lib/utils';
import { sizeLabel } from '@/lib/format';

export function SizeSelector({ sizes, value, onChange }: { sizes: SizeOption[]; value: BagSize; onChange: (s: BagSize) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-maroon-800">Size</legend>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((s) => {
          const selected = s.size === value;
          return (
            <button
              key={s.size}
              type="button"
              onClick={() => onChange(s.size)}
              aria-pressed={selected}
              className={cn(
                'rounded-2xl border px-2 py-2.5 text-center transition',
                selected ? 'border-gold-500 bg-gold-50 shadow-glow' : 'border-gold-200 bg-white hover:border-gold-400',
              )}
            >
              <span className="block font-accent text-sm font-semibold text-maroon-900">{sizeLabel(s.size)}</span>
              <span className="block text-sm font-semibold text-maroon-700">{formatINR(s.price)}</span>
              <span className="block text-[11px] text-maroon-900/55">{s.dimensions}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
