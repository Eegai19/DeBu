'use client';

import Image from 'next/image';
import type { ArtSpec, BagSize, ColorKey, PresetColorKey } from '@debu/shared';
import { ProductArt, type ArtView } from '@/components/art/ProductArt';
import { cn } from '@/lib/utils';

/**
 * Shows a product photo when one is provided in `images`, otherwise the
 * illustrated artwork (which recolours to the selected colour).
 */
export function ProductMedia({
  item,
  color,
  view = 0,
  size,
  className,
  priority,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
}: {
  item: { name: string; art: ArtSpec; images?: string[]; defaultColor: PresetColorKey };
  color?: ColorKey;
  view?: ArtView;
  size?: BagSize;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const photo = item.images?.length ? (item.images[view] ?? item.images[0]) : undefined;
  if (photo) {
    return (
      <div className={cn('relative h-full w-full', className)}>
        <Image src={photo} alt={item.name} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return <ProductArt art={item.art} color={color} defaultColor={item.defaultColor} view={view} size={size} className={className} label={item.name} />;
}
