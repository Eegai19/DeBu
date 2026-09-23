'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { COLORS, type ColorKey, type PresetColorKey } from '@debu/shared';
import { cn } from '@/lib/utils';

export function ColorSelector({
  colors,
  value,
  onChange,
  customColor,
  onCustomColorChange,
  error,
  compact,
}: {
  colors: PresetColorKey[];
  value: ColorKey;
  onChange: (c: ColorKey) => void;
  customColor: string;
  onCustomColorChange: (v: string) => void;
  error?: string;
  compact?: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-maroon-800">
        Colour: <span className="font-semibold text-maroon-950">{COLORS[value].label}</span>
      </legend>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((key) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-pressed={selected}
              aria-label={COLORS[key].label}
              title={COLORS[key].label}
              className={cn(
                'relative flex items-center justify-center rounded-full ring-offset-2 ring-offset-ivory-50 transition hover:scale-110',
                compact ? 'size-7' : 'size-9',
                selected ? 'ring-2 ring-gold-500' : 'ring-1 ring-black/10',
              )}
              style={{ background: `radial-gradient(circle at 35% 30%, #ffffff66, transparent 45%), ${COLORS[key].hex}` }}
            >
              {selected && <Check className="size-4 text-white drop-shadow" strokeWidth={3} />}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange('custom')}
          aria-pressed={value === 'custom'}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition',
            compact ? 'h-7' : 'h-9',
            value === 'custom'
              ? 'border-gold-500 bg-gradient-to-r from-rani-100 via-gold-100 to-leaf-500/10 text-maroon-900'
              : 'border-gold-300 text-maroon-800 hover:bg-gold-50',
          )}
        >
          <Palette className="size-3.5" />
          Custom Color Request
        </button>
      </div>
      <AnimatePresence initial={false}>
        {value === 'custom' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <label className="mt-3 block">
              <span className="sr-only">Describe your custom colour</span>
              <input
                className="field-input"
                placeholder="e.g. Peacock blue with gold, or ‘match my lavender saree’"
                value={customColor}
                maxLength={80}
                onChange={(e) => onCustomColorChange(e.target.value)}
                aria-invalid={Boolean(error)}
              />
            </label>
            {error ? <p className="field-error">{error}</p> : <p className="mt-1.5 text-xs text-maroon-900/55">Tip: share a photo of your outfit on WhatsApp for a perfect match.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
