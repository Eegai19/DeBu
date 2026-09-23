'use client';

import { Heart } from 'lucide-react';
import type { Product } from '@debu/shared';
import { useWishlist } from '@/store/wishlist';
import { useMounted } from '@/hooks/useMounted';
import { ButtonLink } from '@/components/ui/Button';
import { ProductCard } from './ProductCard';

export function WishlistView({ products }: { products: Product[] }) {
  const mounted = useMounted();
  const slugs = useWishlist((s) => s.slugs);
  if (!mounted) return <div className="h-80 animate-pulse rounded-[2rem] bg-white/60" />;
  const saved = slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));

  if (saved.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-12 text-center shadow-soft ring-1 ring-gold-200">
        <Heart className="mx-auto size-14 text-rani-300" />
        <h2 className="mt-4 text-4xl font-semibold text-maroon-900">Your wishlist is empty</h2>
        <p className="mt-2 text-maroon-900/60">Tap the ♥ on any design to save it here for later.</p>
        <ButtonLink href="/silk-thread-jewellery" className="mt-6">
          Discover Designs
        </ButtonLink>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {saved.map((p) => (
        <ProductCard key={p.slug} product={p} detailed />
      ))}
    </div>
  );
}
