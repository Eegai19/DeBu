'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, PackageCheck } from 'lucide-react';
import { useState } from 'react';
import { WIRE_BAG_COLLECTION, formatINR, type ColorKey, type Product } from '@debu/shared';
import { useCart } from '@/store/cart';
import { useUi } from '@/store/ui';
import { cn } from '@/lib/utils';
import { sizeLabel } from '@/lib/format';
import { ProductArt } from '@/components/art/ProductArt';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { Button } from '@/components/ui/Button';
import { Sparkles } from '@/components/effects/Sparkles';

/** "Complete Collection Combo" — Small + Medium + Large of one bag with ₹75 off. */
export function CollectionCombo({ bags }: { bags: Product[] }) {
  const [slug, setSlug] = useState(bags[0]?.slug);
  const bag = bags.find((b) => b.slug === slug) ?? bags[0];
  const [color, setColor] = useState<ColorKey>(bag.defaultColor);
  const [customColor, setCustomColor] = useState('');
  const [error, setError] = useState<string>();
  const [added, setAdded] = useState(false);
  const addMany = useCart((s) => s.addMany);
  const toast = useUi((s) => s.toast);

  const sizes = bag.sizes ?? [];
  const original = sizes.reduce((s, o) => s + o.price, 0);
  const comboPrice = original - WIRE_BAG_COLLECTION.discount;
  const preview = color === 'custom' ? bag.defaultColor : color;

  const add = () => {
    if (color === 'custom' && customColor.trim().length < 2) {
      setError('Please describe the colour you would like.');
      return;
    }
    addMany(
      sizes.map((s) => ({
        kind: 'product' as const,
        productId: bag.id,
        slug: bag.slug,
        name: bag.name,
        category: bag.category,
        unitPrice: s.price,
        quantity: 1,
        color,
        customColor: color === 'custom' ? customColor.trim() : undefined,
        size: s.size,
        art: bag.art,
        image: bag.images[0],
        defaultColor: bag.defaultColor,
      })),
    );
    toast({ title: 'Complete Collection added!', description: `${bag.name} — Small, Medium & Large. ₹${WIRE_BAG_COLLECTION.discount} off applied in cart.`, action: { label: 'View cart', href: '/cart' } });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-maroon-velvet relative overflow-hidden rounded-[2.5rem] p-6 text-ivory-50 shadow-card sm:p-10 lg:p-14">
      <Sparkles count={24} />
      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="font-accent text-xs tracking-[0.35em] text-gold-300 uppercase">Combo Offer</p>
          <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">{WIRE_BAG_COLLECTION.label}</h2>
          <p className="mt-2 font-script text-3xl text-gold-200">Small + Medium + Large</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-sheen px-5 py-2 font-semibold text-maroon-950 shadow-glow">
            <PackageCheck className="size-5" /> {WIRE_BAG_COLLECTION.message}
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm text-ivory-100/70">Choose your design</p>
            <div className="flex flex-wrap gap-2">
              {bags.map((b) => (
                <button
                  key={b.slug}
                  type="button"
                  onClick={() => {
                    setSlug(b.slug);
                    setColor(b.defaultColor);
                  }}
                  className={cn('rounded-full border px-4 py-2 text-sm transition', b.slug === bag.slug ? 'border-gold-300 bg-gold-300 text-maroon-950' : 'border-gold-300/40 text-ivory-100 hover:border-gold-300')}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white/95 p-5 text-maroon-950">
            <ColorSelector
              compact
              colors={bag.colors}
              value={color}
              onChange={(c) => {
                setColor(c);
                setError(undefined);
              }}
              customColor={customColor}
              onCustomColorChange={setCustomColor}
              error={error}
            />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
            {sizes.map((s, i) => (
              <motion.div key={s.size} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="aspect-square overflow-hidden rounded-2xl ring-1 ring-gold-300/50">
                  <ProductArt art={bag.art} color={preview} defaultColor={bag.defaultColor} size={s.size} label={`${bag.name} ${s.size}`} />
                </div>
                <p className="mt-2 font-accent text-xs tracking-widest text-gold-200 uppercase">{sizeLabel(s.size)}</p>
                <p className="font-display text-xl">{formatINR(s.price)}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white/10 p-5 ring-1 ring-gold-300/30 backdrop-blur">
            <div className="flex justify-between text-ivory-100/75">
              <span>Individually</span>
              <span className="line-through">{formatINR(original)}</span>
            </div>
            <div className="mt-1 flex justify-between text-gold-200">
              <span>Collection discount</span>
              <span>−{formatINR(WIRE_BAG_COLLECTION.discount)}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-gold-300/30 pt-3">
              <span className="text-lg">Collection Price</span>
              <AnimatePresence mode="wait">
                <motion.span key={comboPrice} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="font-display text-4xl font-bold text-gold-gradient">
                  {formatINR(comboPrice)}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-1 text-right text-sm font-semibold text-leaf-500">
              <span className="rounded-full bg-white px-3 py-1 text-leaf-600">You save {formatINR(WIRE_BAG_COLLECTION.discount)}</span>
            </p>
            <Button type="button" size="lg" className="mt-5 w-full" onClick={add}>
              {added ? <Check className="size-5" /> : <PackageCheck className="size-5" />}
              {added ? 'Collection Added!' : 'Add Complete Collection'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
