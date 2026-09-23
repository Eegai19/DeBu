import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JEWELLERY_CATEGORIES, type JewelleryCategory } from '@debu/shared';
import { getCombos, getProductsByCategory } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductArt } from '@/components/art/ProductArt';
import { ShopExplorer } from '@/components/product/ShopExplorer';
import { ComboCard } from '@/components/product/ComboCard';
import { ContactButtons } from '@/components/contact/ContactButtons';

const HERO_ART: Record<JewelleryCategory, { kind: 'bangle' | 'necklace' | 'earring' | 'tikka'; variant: number; color: 'maroon' | 'pink' | 'green' | 'red' }> = {
  bangles: { kind: 'bangle', variant: 2, color: 'red' },
  necklaces: { kind: 'necklace', variant: 0, color: 'pink' },
  earrings: { kind: 'earring', variant: 3, color: 'green' },
  'forehead-pendants': { kind: 'tikka', variant: 0, color: 'maroon' },
};

export function generateStaticParams() {
  return JEWELLERY_CATEGORIES.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<'/silk-thread-jewellery/[category]'>): Promise<Metadata> {
  const { category } = await params;
  const cat = JEWELLERY_CATEGORIES.find((c) => c.slug === category);
  return cat ? { title: `${cat.name} — Silk Thread Jewellery`, description: cat.blurb } : {};
}

export default async function CategoryPage({ params }: PageProps<'/silk-thread-jewellery/[category]'>) {
  const { category } = await params;
  const cat = JEWELLERY_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const [products, combos] = await Promise.all([getProductsByCategory(cat.slug), getCombos()]);
  const art = HERO_ART[cat.slug];
  const relatedCombos = combos.filter((c) => c.items.some((i) => i.category === cat.slug));

  return (
    <>
      <PageHero
        eyebrow="Silk Thread Jewellery"
        title={cat.name}
        script="handcrafted in every colour"
        description={`${cat.blurb} Choose your colour — or request a custom shade — and we’ll make it just for you.`}
        crumbs={[{ href: '/silk-thread-jewellery', label: 'Silk Thread Jewellery' }, { label: cat.name }]}
        visual={<ProductArt art={{ kind: art.kind, variant: art.variant }} color={art.color} view={2} />}
      >
        <ContactButtons line="products" tone="dark" message={`Hi DeBu! I'm looking for silk thread ${cat.name.toLowerCase()}.`} />
      </PageHero>

      <div className="container-page">
        <nav className="scrollbar-none -mt-2 flex gap-2 overflow-x-auto py-8" aria-label="Jewellery categories">
          {JEWELLERY_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/silk-thread-jewellery/${c.slug}`}
              className={cn(
                'shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition',
                c.slug === cat.slug ? 'border-maroon-800 bg-maroon-800 text-ivory-50 shadow-soft' : 'border-gold-300 bg-white text-maroon-800 hover:bg-gold-50',
              )}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/silk-thread-jewellery#combos" className="shrink-0 rounded-full border border-rani-300 bg-rani-50 px-5 py-2.5 text-sm font-medium text-rani-700 hover:bg-rani-100">
            Combos ✦
          </Link>
        </nav>
        <ShopExplorer products={products} categories={[cat.slug]} initialCategory={cat.slug} showCategoryFilter={false} />
      </div>

      {relatedCombos.length > 0 && (
        <section className="bg-festive-glow mt-20 py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Complete the look" title={`Combos with ${cat.name}`} />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedCombos.map((c, i) => (
                <ComboCard key={c.slug} combo={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
