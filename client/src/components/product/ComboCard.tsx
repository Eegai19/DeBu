'use client';

import { motion } from 'framer-motion';
import { Check, ShoppingBag, Sparkles } from 'lucide-react';
import { formatINR, type Combo } from '@debu/shared';
import { useProductOptions } from '@/hooks/useAddToCart';
import { categoryName } from '@/lib/format';
import { ProductArt } from '@/components/art/ProductArt';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';

export function ComboCard({ combo, index = 0 }: { combo: Combo; index?: number }) {
  const opts = useProductOptions(combo);
  const previewColor = opts.color === 'custom' ? combo.defaultColor : opts.color;
  const pct = Math.round((combo.savings / combo.originalPrice) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-gold-300"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <div className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-105">
          <ProductArt art={combo.art} color={previewColor} defaultColor={combo.defaultColor} label={combo.name} />
        </div>
        {combo.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-gold-sheen px-3 py-1 font-accent text-[10px] font-bold tracking-wider text-maroon-950 uppercase shadow-glow">{combo.badge}</span>
        )}
        <motion.div
          initial={{ rotate: -12, scale: 0.6 }}
          whileInView={{ rotate: 8, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.4 + index * 0.1 }}
          className="absolute top-4 right-4 flex size-20 flex-col items-center justify-center rounded-full bg-rani-600 text-center text-white shadow-card ring-4 ring-white/60"
        >
          <span className="text-[10px] tracking-wider uppercase">Save</span>
          <span className="font-display text-2xl leading-none font-bold">{pct}%</span>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-3xl font-semibold text-maroon-900">{combo.name}</h3>
          <p className="mt-1 text-sm text-maroon-900/65">{combo.tagline}</p>
        </div>

        <ul className="space-y-1.5 rounded-2xl bg-ivory-100 p-4 text-sm">
          {combo.items.map((i) => (
            <li key={i.slug} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-maroon-900">
                <Sparkles className="size-3.5 text-gold-500" />
                {i.name} <span className="hidden text-xs text-maroon-900/45 sm:inline">({categoryName(i.category)})</span>
              </span>
              <span className="text-maroon-900/55">{formatINR(i.price)}</span>
            </li>
          ))}
          <li className="mt-2 flex justify-between border-t border-gold-200 pt-2">
            <span className="text-maroon-900/60">Original Price</span>
            <span className="text-maroon-900/50 line-through">{formatINR(combo.originalPrice)}</span>
          </li>
          <li className="flex items-baseline justify-between">
            <span className="font-medium text-maroon-900">Combo Price</span>
            <span className="font-display text-3xl font-bold text-maroon-800">{formatINR(combo.price)}</span>
          </li>
          <li className="flex justify-end">
            <span className="rounded-full bg-leaf-500/10 px-3 py-1 text-xs font-bold text-leaf-600">You save {formatINR(combo.savings)}</span>
          </li>
        </ul>

        <ColorSelector compact colors={combo.colors} value={opts.color} onChange={opts.setColor} customColor={opts.customColor} onCustomColorChange={opts.setCustomColor} error={opts.error} />

        <div className="mt-auto flex items-center gap-3 pt-1">
          <QuantitySelector size="sm" value={opts.quantity} onChange={opts.setQuantity} />
          <Button type="button" className="flex-1" onClick={opts.addToCart}>
            {opts.added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
            {opts.added ? 'Added!' : 'Add Combo'}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
