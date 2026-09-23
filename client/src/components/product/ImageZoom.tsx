'use client';

import { useRef, useState, type ReactNode } from 'react';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Hover (desktop) or tap (touch) to magnify, following the pointer. */
export function ImageZoom({ children, className, scale = 2.2 }: { children: ReactNode; className?: string; scale?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  const track = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setOrigin(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
  };

  return (
    <div
      ref={ref}
      className={cn('group relative cursor-zoom-in overflow-hidden', zoomed && 'cursor-zoom-out', className)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setZoomed(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setZoomed(false)}
      onPointerMove={(e) => track(e.clientX, e.clientY)}
      onClick={(e) => {
        track(e.clientX, e.clientY);
        if (window.matchMedia('(hover: none)').matches) setZoomed((z) => !z);
      }}
    >
      <div className="h-full w-full transition-transform duration-300 ease-out" style={{ transform: zoomed ? `scale(${scale})` : 'scale(1)', transformOrigin: origin }}>
        {children}
      </div>
      <span className={cn('pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-maroon-800 shadow-soft transition', zoomed && 'opacity-0')}>
        <ZoomIn className="size-3.5" /> <span className="hidden sm:inline">Hover</span>
        <span className="sm:hidden">Tap</span> to zoom
      </span>
    </div>
  );
}
