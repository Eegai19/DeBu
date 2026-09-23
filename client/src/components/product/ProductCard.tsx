'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@debu/shared';
import { useProductOptions } from '@/hooks/useAddToCart';
import { categoryName } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Price } from '@/components/ui/Price';
import { Stars } from '@/components/ui/Stars';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { Button } from '@/components/ui/Button';
import { ProductMedia } from './ProductMedia';
import { WishlistButton } from './WishlistButton';

/**
 * Product card. `detailed` cards (category & shop pages) include the
 * description, colour customisation, size (wire bags), quantity and Add to Cart.
 */
export function ProductCard({ product, detailed = false, priority }: { product: Product; detailed?: boolean; priority?: boolean }) {
  const opts = useProductOptions(product);
  const href = `/product/${product.slug}`;
  const previewColor = opts.color === 'custom' ? product.defaultColor : opts.color;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-gold-200/70 transition-shadow duration-500 hover:shadow-card hover:ring-gold-300"
    >
      <Link href={href} className="relative block aspect-square overflow-hidden" aria-label={product.name}>
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-110">
          <ProductMedia item={product} color={previewColor} size={opts.sizes ? opts.size : undefined} priority={priority} />
        </div>
        {/* Hover reveal — alternate styled view */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <ProductMedia item={product} color={previewColor} view={2} size={opts.sizes ? opts.size : undefined} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-4 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-maroon-900 opacity-0 shadow-soft transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Eye className="size-4" /> View details
        </span>
      </Link>

      {product.badge && (
        <span className="absolute top-3 left-3 rounded-full bg-gold-sheen px-3 py-1 font-accent text-[10px] font-bold tracking-wider text-maroon-950 uppercase shadow-glow">
          {product.badge}
        </span>
      )}
      <WishlistButton slug={product.slug} name={product.name} className="absolute top-3 right-3" />

      <div className={cn('flex flex-1 flex-col gap-3', detailed ? 'p-5' : 'p-3.5 sm:p-5')}>
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="font-accent text-[10px] tracking-[0.2em] text-gold-700 uppercase">{categoryName(product.category)}</p>
            <div className={cn('items-center gap-1', detailed ? 'flex' : 'hidden sm:flex')}>
              <Stars rating={product.rating} size="size-3" />
              <span className="text-[11px] text-maroon-900/50">({product.reviews})</span>
            </div>
          </div>
          <Link href={href}>
            <h3 className={cn('mt-1 leading-tight font-semibold text-maroon-900 transition group-hover:text-rani-700', detailed ? 'text-2xl' : 'text-lg sm:text-2xl')}>{product.name}</h3>
          </Link>
        </div>

        <Price price={opts.unitPrice} compareAt={opts.sizes ? undefined : product.compareAtPrice} size="sm" />

        {detailed && (
          <>
            <p className="line-clamp-2 text-sm leading-relaxed text-maroon-900/65">{product.description}</p>
            {opts.sizes && <SizeSelector sizes={opts.sizes} value={opts.size} onChange={opts.setSize} />}
            <ColorSelector
              compact
              colors={product.colors}
              value={opts.color}
              onChange={opts.setColor}
              customColor={opts.customColor}
              onCustomColorChange={opts.setCustomColor}
              error={opts.error}
            />
            {product.customizationNotes && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-maroon-800">Customization notes</span>
                <textarea
                  className="field-input min-h-16 resize-none text-sm"
                  placeholder={product.customizationNotes}
                  value={opts.notes}
                  maxLength={500}
                  onChange={(e) => opts.setNotes(e.target.value)}
                />
              </label>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <QuantitySelector size="sm" value={opts.quantity} onChange={opts.setQuantity} />
              <Button type="button" size="sm" className="h-10 min-w-[8.5rem] flex-1 whitespace-nowrap" onClick={opts.addToCart}>
                <AnimatePresence mode="wait" initial={false}>
                  {opts.added ? (
                    <motion.span key="done" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-1.5">
                      <Check className="size-4" /> Added
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-1.5">
                      <ShoppingBag className="size-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </>
        )}

        {!detailed && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
            {product.colors.slice(0, 7).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => opts.setColor(c)}
                aria-label={`Preview in ${c}`}
                className={cn('size-4 rounded-full ring-offset-1 transition hover:scale-125', opts.color === c ? 'ring-2 ring-gold-500' : 'ring-1 ring-black/10')}
                style={{ background: `var(--swatch-${c})` }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
