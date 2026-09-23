'use client';

import { ProductArt } from '@/components/art/ProductArt';
import { BlouseArt, MehandiArt } from '@/components/art/services';
import type { Visual as VisualSpec } from '@/data/content';
import { cn } from '@/lib/utils';

/** Renders any of the illustrated visuals used across the site. */
export function Visual({ visual, className, label }: { visual: VisualSpec; className?: string; label?: string }) {
  if (visual.type === 'mehandi') return <MehandiArt style={visual.style} className={cn('h-full w-full', className)} />;
  if (visual.type === 'blouse')
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br from-ivory-100 via-rani-50 to-gold-100', className)}>
        <BlouseArt color={visual.color} neckline={visual.neckline} embellished={visual.embellished ?? true} fitted={visual.fitted ?? true} className="h-[88%] w-[88%]" />
      </div>
    );
  return <ProductArt art={visual.art} color={visual.color} view={visual.view} className={className} label={label} />;
}
