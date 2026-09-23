import type { Metadata } from 'next';
import { getProducts } from '@/lib/catalog';
import { ShopExplorer } from '@/components/product/ShopExplorer';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Search', robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q.slice(0, 80) : '';
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="bg-festive-glow">
      <div className="container-page py-14 sm:py-20">
        <SectionHeading eyebrow="Search" title={query ? <>Results for “{query}”</> : 'Search our collection'} description="Refine by category, price and colour." />
        <ShopExplorer key={query} products={products} categories={categories} initialQuery={query} />
      </div>
    </div>
  );
}
