import { Mandala } from '@/components/art/decor';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
      <Mandala className="pointer-events-none absolute top-1/2 left-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 animate-spin-slower opacity-20" />
      <div className="container-page relative text-center">
        <p className="font-script text-5xl text-rani-600">oh no!</p>
        <h1 className="mt-2 font-display text-8xl font-bold text-festive-gradient">404</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-maroon-900/70">This page seems to have wandered off to a wedding. Let’s get you back to the celebrations.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/silk-thread-jewellery" variant="outline">
            Shop Jewellery
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
