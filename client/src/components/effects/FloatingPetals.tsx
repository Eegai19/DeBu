'use client';

import { useMemo } from 'react';
import { seeded } from '@/components/art/primitives';
import { PetalShape } from '@/components/art/decor';
import { cn } from '@/lib/utils';

const PALETTE = ['#f7881f', '#ffd43b', '#e84a8a', '#d42a67', '#fb923c', '#fcc419', '#faa4cc'];

/** Marigold & rose petals drifting down — a signature festive touch. */
export function FloatingPetals({ count = 18, seed = 7, className }: { count?: number; seed?: number; className?: string }) {
  const petals = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.round(rand() * 1000) / 10,
      size: 10 + Math.round(rand() * 14),
      duration: 12 + Math.round(rand() * 14),
      delay: -Math.round(rand() * 20),
      drift: Math.round((rand() - 0.5) * 160),
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
    }));
  }, [count, seed]);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 motion-reduce:hidden"
          style={
            {
              left: `${p.left}%`,
              animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <PetalShape color={p.color} size={p.size} />
        </span>
      ))}
    </div>
  );
}
