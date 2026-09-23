import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JEWELLERY_CATEGORIES } from '@debu/shared';
import { getCombos, getProducts } from '@/lib/catalog';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ProductArt } from '@/components/art/ProductArt';
import { ShopExplorer } from '@/components/product/ShopExplorer';
import { ComboCard } from '@/components/product/ComboCard';
import { ContactButtons } from '@/components/contact/ContactButtons';

export const metadata: Metadata = {
  title: 'Silk Thread Jewellery',
  description: 'Handmade silk thread bangles, necklaces, jhumkas and maang tikkas — custom-made in any colour. Bridal & festival combos with savings.',
};

const CATEGORY_ART = {
  bangles: { kind: 'bangle', variant: 0, color: 'maroon' },
  necklaces: { kind: 'necklace', variant: 1, color: 'green' },
  earrings: { kind: 'earring', variant: 0, color: 'pink' },
  'forehead-pendants': { kind: 'tikka', variant: 0, color: 'blue' },
} as const;

export default async function JewelleryPage() {
  const [all, combos] = await Promise.all([getProducts(), getCombos()]);
  const jewellery = all.filter((p) => p.type === 'jewellery');

  return (
    <>
      <PageHero
        eyebrow="Silk Thread Jewellery"
        script="handwound with love"
        title={
          <>
            Jewellery that <span className="text-gold-gradient italic">celebrates</span> you
          </>
        }
        description="Every bangle, necklace, jhumka and tikka is wound by hand in rich silk thread and finished with kundan, pearls and zari — in any colour you dream of."
        crumbs={[{ label: 'Silk Thread Jewellery' }]}
        visual={<ProductArt art={{ kind: 'combo', variant: 0 }} color="maroon" view={2} />}
      >
        <ContactButtons line="products" tone="dark" message="Hi DeBu! I'd like to order silk thread jewellery." />
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Shop by Category" title="Choose Your Sparkle" />
          <Stagger className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {JEWELLERY_CATEGORIES.map((c) => {
              const art = CATEGORY_ART[c.slug];
              const count = jewellery.filter((p) => p.category === c.slug).length;
              return (
                <StaggerItem key={c.slug}>
                  <Link href={`/silk-thread-jewellery/${c.slug}`} className="group block overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-gold-200 transition duration-500 hover:-translate-y-2 hover:shadow-card hover:ring-gold-400">
                    <div className="aspect-square overflow-hidden">
                      <div className="h-full w-full transition duration-[1.2s] group-hover:scale-110">
                        <ProductArt art={{ kind: art.kind, variant: art.variant }} color={art.color} label={c.name} />
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-2xl font-semibold text-maroon-900">{c.name}</h3>
                      <p className="mt-1 hidden text-sm text-maroon-900/60 sm:block">{c.blurb}</p>
                      <p className="mt-2 flex items-center gap-1 text-sm font-medium text-rani-700">
                        {count} designs <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-page">
          <SectionHeading eyebrow="All Designs" title="The Complete Collection" description="Filter by category, price and colour — or search for your favourite style." />
          <ShopExplorer products={jewellery} categories={JEWELLERY_CATEGORIES.map((c) => c.slug)} />
        </div>
      </section>

      <section id="combos" className="bg-festive-glow scroll-mt-24 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Combo Offers" script="perfectly matched sets" title="Special Combos" description="Buy the full look and save — every combo is custom-made in the colour you choose." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {combos.map((c, i) => (
              <ComboCard key={c.slug} combo={c} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
