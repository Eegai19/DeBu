import type { Metadata } from 'next';
import { getProducts } from '@/lib/catalog';
import { WishlistView } from '@/components/product/WishlistView';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div className="bg-festive-glow">
      <div className="container-page py-14 sm:py-20">
        <SectionHeading eyebrow="Saved for later" script="your favourites" title="Wishlist" />
        <WishlistView products={products} />
      </div>
    </div>
  );
}
