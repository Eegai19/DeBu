'use client';

import { useRef, useState, type ReactNode } from 'react';
import { MoveHorizontal } from 'lucide-react';

/** Draggable before / after comparison slider. */
export function BeforeAfter({ before, after, beforeLabel = 'Before', afterLabel = 'After' }: { before: ReactNode; after: ReactNode; beforeLabel?: string; afterLabel?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-square touch-pan-y overflow-hidden rounded-[2rem] shadow-card ring-1 ring-gold-300 select-none"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>
      <span className="absolute top-4 left-4 rounded-full bg-maroon-950/70 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">{beforeLabel}</span>
      <span className="absolute top-4 right-4 rounded-full bg-gold-sheen px-3 py-1 text-xs font-semibold tracking-wider text-maroon-950 uppercase">{afterLabel}</span>
      <div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-gold-sheen shadow-glow" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-maroon-800 shadow-card ring-2 ring-gold-400">
          <MoveHorizontal className="size-5" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
        aria-label="Compare before and after"
      />
    </div>
  );
}
