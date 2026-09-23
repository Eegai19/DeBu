'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Check, ChevronRight, Gift, Palette, ShoppingBag, Truck, Zap } from 'lucide-react';
import { useState } from 'react';
import { WIRE_BAG_COLLECTION, formatINR, type Product } from '@debu/shared';
import { useProductOptions } from '@/hooks/useAddToCart';
import { categoryName, colorLabel, sizeLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ArtView } from '@/components/art/ProductArt';
import { Price } from '@/components/ui/Price';
import { Stars } from '@/components/ui/Stars';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { Button } from '@/components/ui/Button';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { ProductMedia } from './ProductMedia';
import { ImageZoom } from './ImageZoom';
import { WishlistButton } from './WishlistButton';

const VIEWS: { view: ArtView; label: string }[] = [
  { view: 0, label: 'Studio' },
  { view: 1, label: 'Close-up' },
  { view: 2, label: 'Velvet' },
  { view: 3, label: 'Festive' },
];

export function ProductDetail({ product }: { product: Product }) {
  const opts = useProductOptions(product);
  const [view, setView] = useState<ArtView>(0);
  const router = useRouter();
  const previewColor = opts.color === 'custom' ? product.defaultColor : opts.color;
  const categoryHref = product.type === 'wire-bag' ? '/wire-bags' : `/silk-thread-jewellery/${product.category}`;
  const whatsappMsg = `Hi DeBu! I'm interested in ${product.name}${opts.sizes ? ` (${sizeLabel(opts.size)})` : ''} in ${colorLabel(opts.color, opts.customColor)}. Qty: ${opts.quantity}.`;

  return (
    <div>
      <nav className="mb-8 flex flex-wrap items-center gap-1 text-sm text-maroon-900/60" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-maroon-900">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        {product.type === 'jewellery' && (
          <>
            <Link href="/silk-thread-jewellery" className="hover:text-maroon-900">
              Silk Thread Jewellery
            </Link>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <Link href={categoryHref} className="hover:text-maroon-900">
          {categoryName(product.category)}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-maroon-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] shadow-card ring-1 ring-gold-200">
            <ImageZoom className="aspect-square">
              <AnimatePresence mode="wait">
                <motion.div key={`${view}-${previewColor}-${opts.size}`} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="h-full w-full">
                  <ProductMedia item={product} color={previewColor} view={view} size={opts.sizes ? opts.size : undefined} priority sizes="(min-width: 1024px) 50vw, 100vw" />
                </motion.div>
              </AnimatePresence>
            </ImageZoom>
            {product.badge && (
              <span className="absolute top-4 left-4 rounded-full bg-gold-sheen px-4 py-1.5 font-accent text-xs font-bold tracking-wider text-maroon-950 uppercase shadow-glow">{product.badge}</span>
            )}
            <WishlistButton slug={product.slug} name={product.name} className="absolute top-4 right-4" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {VIEWS.map((v) => (
              <button
                key={v.view}
                type="button"
                onClick={() => setView(v.view)}
                aria-label={`Show ${v.label} view`}
                aria-pressed={view === v.view}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-2xl ring-offset-2 ring-offset-ivory-50 transition',
                  view === v.view ? 'ring-2 ring-gold-500' : 'opacity-75 ring-1 ring-gold-200 hover:opacity-100',
                )}
              >
                <ProductMedia item={product} color={previewColor} view={v.view} size={opts.sizes ? opts.size : undefined} sizes="120px" />
                <span className="absolute inset-x-0 bottom-0 bg-maroon-950/60 py-0.5 text-center text-[10px] text-white">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="font-accent text-xs tracking-[0.3em] text-gold-700 uppercase">{categoryName(product.category)}</p>
          <h1 className="mt-2 text-4xl leading-tight font-semibold text-maroon-900 sm:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-maroon-900/60">
            <Stars rating={product.rating} />
            <span>
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </span>
          </div>
          <Price price={opts.unitPrice} compareAt={opts.sizes ? undefined : product.compareAtPrice} size="lg" className="mt-5" />
          <p className="mt-1 text-xs text-maroon-900/50">Inclusive of all handcrafting. GST shown at checkout.</p>

          <p className="mt-6 leading-relaxed text-maroon-900/75">{product.description}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-maroon-900/80">
                <Check className="mt-0.5 size-4 shrink-0 text-gold-600" /> {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-6 rounded-3xl bg-white/80 p-5 shadow-soft ring-1 ring-gold-200 sm:p-6">
            {opts.sizes && (
              <>
                <SizeSelector sizes={opts.sizes} value={opts.size} onChange={opts.setSize} />
                <p className="rounded-2xl bg-leaf-500/10 px-4 py-2.5 text-sm text-leaf-600">
                  🎁 <b>{WIRE_BAG_COLLECTION.label}:</b> {WIRE_BAG_COLLECTION.message} — applied automatically in your cart.
                </p>
              </>
            )}
            <ColorSelector colors={product.colors} value={opts.color} onChange={opts.setColor} customColor={opts.customColor} onCustomColorChange={opts.setCustomColor} error={opts.error} />
            {(product.customizationNotes || product.type === 'wire-bag') && (
              <label className="block">
                <span className="field-label">Customization notes</span>
                <textarea className="field-input min-h-20 resize-y" placeholder={product.customizationNotes} value={opts.notes} maxLength={500} onChange={(e) => opts.setNotes(e.target.value)} />
              </label>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <QuantitySelector value={opts.quantity} onChange={opts.setQuantity} />
              <span className="text-sm text-maroon-900/60">
                Total: <b className="text-maroon-900">{formatINR(opts.unitPrice * opts.quantity)}</b>
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" size="lg" className="sm:flex-1" onClick={opts.addToCart}>
                {opts.added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
                {opts.added ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="maroon"
                className="sm:flex-1"
                onClick={() => {
                  if (opts.addToCart()) router.push('/checkout');
                }}
              >
                <Zap className="size-5" /> Buy Now
              </Button>
            </div>
            <WishlistButton slug={product.slug} name={product.name} withLabel className="w-full" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              { Icon: BadgeCheck, t: '100% Handmade' },
              { Icon: Palette, t: 'Any colour' },
              { Icon: Truck, t: 'Pan-India delivery' },
              { Icon: Gift, t: 'Gift-ready packing' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1.5 rounded-2xl bg-gold-50 p-3 text-center text-maroon-800">
                <Icon className="size-5 text-gold-600" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-maroon-velvet p-6 text-ivory-50">
            <p className="font-display text-2xl">Prefer to order on call?</p>
            <p className="mt-1 text-sm text-ivory-100/70">Call or WhatsApp us for custom colours, bulk orders and quick assistance.</p>
            <ContactButtons line="products" tone="dark" message={whatsappMsg} className="mt-4" showNumber />
          </div>
        </div>
      </div>
    </div>
  );
}
