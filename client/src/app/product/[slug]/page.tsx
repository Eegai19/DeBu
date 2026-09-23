import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COLORS, products as sampleProducts } from '@debu/shared';
import { getProduct, getRelatedProducts } from '@/lib/catalog';
import { SITE_URL } from '@/lib/config';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';

export function generateStaticParams() {
  return sampleProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: `${product.name} | DeBu`, description: product.description, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'DeBu' },
    color: product.colors.map((c) => COLORS[c].label).join(', '),
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="bg-festive-glow">
        <div className="container-page py-10 sm:py-14">
          <ProductDetail product={product} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="py-20">
          <div className="container-page">
            <SectionHeading eyebrow="You may also love" title="Related Products" />
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
