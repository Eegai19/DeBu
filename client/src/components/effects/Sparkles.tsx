'use client';

import { useMemo } from 'react';
import { seeded } from '@/components/art/primitives';
import { SparkleShape } from '@/components/art/decor';
import { cn } from '@/lib/utils';

export function Sparkles({ count = 20, seed = 3, color = '#ffe680', className }: { count?: number; seed?: number; color?: string; className?: string }) {
  const stars = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.round(rand() * 1000) / 10,
      left: Math.round(rand() * 1000) / 10,
      size: 6 + Math.round(rand() * 14),
      delay: Math.round(rand() * 40) / 10,
      duration: 1.8 + Math.round(rand() * 20) / 10,
    }));
  }, [count, seed]);

  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
      {stars.map((s) => (
        <span key={s.id} className="absolute" style={{ top: `${s.top}%`, left: `${s.left}%` }}>
          <SparkleShape size={s.size} color={color} className="animate-twinkle opacity-0" style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }} />
        </span>
      ))}
    </div>
  );
}
