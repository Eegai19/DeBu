import type { Metadata } from 'next';
import { Camera, Palette, Ruler, Sparkles as SparklesIcon } from 'lucide-react';
import { WIRE_BAG_COLLECTION } from '@debu/shared';
import { getProductsByCategory } from '@/lib/catalog';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ProductArt } from '@/components/art/ProductArt';
import { ProductCard } from '@/components/product/ProductCard';
import { CollectionCombo } from '@/components/product/CollectionCombo';
import { ContactButtons } from '@/components/contact/ContactButtons';

export const metadata: Metadata = {
  title: 'Wire Bags',
  description: `Hand-woven, fully customisable wire bags in Small, Medium and Large. ${WIRE_BAG_COLLECTION.message}.`,
};

const STEPS = [
  { Icon: Ruler, title: 'Pick a size', text: 'Small, Medium or Large — or all three with the Complete Collection.' },
  { Icon: Palette, title: 'Choose colours', text: 'Any preset colour or a custom shade. Two-colour weaves available.' },
  { Icon: SparklesIcon, title: 'Add your notes', text: 'Initials, handle length, lining, bulk return-gift tags — just tell us.' },
  { Icon: Camera, title: 'Approve & receive', text: 'We share a photo on WhatsApp before dispatch for your approval.' },
];

export default async function WireBagsPage() {
  const bags = await getProductsByCategory('wire-bags');

  return (
    <>
      <PageHero
        eyebrow="Wire Bags"
        script="woven by hand"
        title={
          <>
            Fully <span className="text-gold-gradient italic">customisable</span> wire bags
          </>
        }
        description="Sturdy, washable and gorgeous — for temple visits, shopping, lunch and return gifts. Every bag comes in Small, Medium and Large, in the colours you choose."
        crumbs={[{ label: 'Wire Bags' }]}
        visual={<ProductArt art={{ kind: 'wirebag', variant: 1 }} color="pink" view={3} />}
      >
        <ContactButtons line="products" tone="dark" message="Hi DeBu! I'd like to order custom wire bags." />
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, text }, i) => (
              <StaggerItem key={title} className="relative rounded-3xl bg-white p-6 shadow-soft ring-1 ring-gold-200">
                <span className="absolute top-5 right-6 font-display text-5xl font-bold text-gold-100">0{i + 1}</span>
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-gold-sheen text-maroon-900 shadow-glow">
                  <Icon className="size-6" />
                </span>
                <h3 className="relative mt-4 text-2xl font-semibold text-maroon-900">{title}</h3>
                <p className="relative mt-1 text-sm text-maroon-900/65">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="The Collection"
            title="Wire Bag Gallery"
            description="Select a size and colour, add your customisation notes, and we’ll weave it for you. Real product photos are coming soon — the designs below are shown in illustration."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {bags.map((bag, i) => (
              <ProductCard key={bag.slug} product={bag} detailed priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      <section id="collection-combo" className="scroll-mt-24 py-16">
        <div className="container-page">
          <CollectionCombo bags={bags} />
        </div>
      </section>
    </>
  );
}
