import { getCombos, getFeaturedProducts } from '@/lib/catalog';
import { GALLERY } from '@/data/content';
import { Hero } from '@/components/home/Hero';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { StatsBand } from '@/components/home/StatsBand';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { ServicesSplit } from '@/components/home/ServicesSplit';
import { Testimonials } from '@/components/home/Testimonials';
import { ContactBanner } from '@/components/home/ContactBanner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { ComboCard } from '@/components/product/ComboCard';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';

export default async function HomePage() {
  const [featured, combos] = await Promise.all([getFeaturedProducts(8), getCombos()]);

  return (
    <>
      <Hero />
      <FeaturedCategories />
      <StatsBand />

      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Bestsellers" script="loved by brides" title="Handpicked for You" description="Our most-loved silk thread jewellery and wire bags. Tap the colour dots to preview any shade." />
          <Stagger className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} priority={i < 4} />
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/silk-thread-jewellery" size="lg">
              Shop All Jewellery
            </ButtonLink>
            <ButtonLink href="/wire-bags" size="lg" variant="outline">
              Explore Wire Bags
            </ButtonLink>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="bg-festive-glow py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Combo Offers" script="more sparkle, less spend" title="Bridal & Festival Combos" description="Perfectly matched sets, custom-made in your colour — with savings built in." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {combos.map((c, i) => (
              <ComboCard key={c.slug} combo={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ServicesSplit />

      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Gallery" script="moments we adorned" title="Our Creations" />
          <MasonryGallery items={GALLERY} showFilters={false} limit={8} />
          <div className="mt-10 text-center">
            <ButtonLink href="/gallery" variant="outline" size="lg">
              View Full Gallery
            </ButtonLink>
          </div>
        </div>
      </section>

      <Testimonials />
      <ContactBanner />
    </>
  );
}
