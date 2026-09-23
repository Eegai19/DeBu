import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Shopping Cart', robots: { index: false } };

export default function CartPage() {
  return (
    <div className="bg-festive-glow">
      <div className="container-page py-14 sm:py-20">
        <SectionHeading eyebrow="Your Selection" script="almost yours" title="Shopping Cart" />
        <CartView />
      </div>
    </div>
  );
}
