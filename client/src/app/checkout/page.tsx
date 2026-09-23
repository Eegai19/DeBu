import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/cart/CheckoutForm';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="bg-festive-glow">
      <div className="container-page py-14 sm:py-20">
        <SectionHeading eyebrow="Secure Checkout" script="one step away" title="Checkout" />
        <CheckoutForm />
      </div>
    </div>
  );
}
