import type { Metadata } from 'next';
import { GALLERY } from '@/data/content';
import { PageHero } from '@/components/layout/PageHero';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { ProductArt } from '@/components/art/ProductArt';

export const metadata: Metadata = { title: 'Gallery', description: 'A gallery of DeBu silk thread jewellery, wire bags, blouse alterations and mehandi designs.' };

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        script="moments we adorned"
        title="Our Creations"
        description="A glimpse of the jewellery, bags, blouses and mehandi we’ve crafted for celebrations across India."
        crumbs={[{ label: 'Gallery' }]}
        visual={<ProductArt art={{ kind: 'earring', variant: 1 }} color="pink" view={2} />}
      />
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <MasonryGallery items={GALLERY} />
        </div>
      </section>
    </>
  );
}
