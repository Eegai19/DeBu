import type { Metadata } from 'next';
import { OrderConfirmation } from '@/components/cart/OrderConfirmation';

export const metadata: Metadata = { title: 'Order Confirmed', robots: { index: false } };

export default async function OrderSuccessPage({ searchParams }: PageProps<'/order-success'>) {
  const { order } = await searchParams;
  return (
    <div className="bg-festive-glow">
      <div className="container-page py-14 sm:py-20">
        <OrderConfirmation orderNumber={typeof order === 'string' ? order : undefined} />
      </div>
    </div>
  );
}
