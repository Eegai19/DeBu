'use client';

import { memo } from 'react';
import { COLORS, type ArtSpec, type BagSize, type ColorKey } from '@debu/shared';
import { cn } from '@/lib/utils';
import { ArtDefs, lighten, mix, palette, url, useArtIds, type ArtIds, type Palette } from './primitives';
import { BangleArt, EarringArt, NecklaceArt, TikkaArt } from './jewellery';
import { WireBagArt } from './wirebag';
import { MandalaG, MarigoldG, LeafG } from './decor';

export type ArtView = 0 | 1 | 2 | 3;

/** Focal box (x, y, size) used for the zoomed "detail" view of each kind. */
const DETAIL: Record<ArtSpec['kind'], [number, number, number]> = {
  bangle: [100, 90, 200],
  necklace: [100, 150, 190],
  earring: [50, 40, 170],
  tikka: [110, 110, 180],
  wirebag: [95, 140, 210],
  combo: [60, 40, 250],
};

function resolveHex(color: ColorKey | string | undefined, fallback: string) {
  if (!color || color === 'custom') return fallback;
  if (color in COLORS) return COLORS[color as ColorKey].hex;
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function Backdrop({ view, pal, ids }: { view: ArtView; pal: Palette; ids: ArtIds }) {
  const bgId = `${ids.soft}-bg`;
  if (view === 2) {
    return (
      <g>
        <defs>
          <radialGradient id={bgId} cx="0.5" cy="0.45" r="0.75">
            <stop offset="0" stopColor="#7a1030" />
            <stop offset="0.7" stopColor="#45081b" />
            <stop offset="1" stopColor="#2a0410" />
          </radialGradient>
        </defs>
        <rect x="-50" y="-50" width="500" height="500" fill={url(bgId)} />
        <g transform="translate(200 200)">
          <MandalaG r={230} stroke="#d4961a" opacity={0.28} rings={7} />
        </g>
        {[
          [36, 50, 'orange'],
          [370, 360, 'yellow'],
          [360, 40, 'red'],
          [30, 370, 'yellow'],
        ].map(([x, y, tone], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <MarigoldG r={20} tone={tone as 'orange'} seed={i + 11} />
          </g>
        ))}
      </g>
    );
  }
  if (view === 3) {
    return (
      <g>
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.55" stopColor="#ffe3b3" />
            <stop offset="1" stopColor="#fdc9dc" />
          </linearGradient>
        </defs>
        <rect x="-50" y="-50" width="500" height="500" fill={url(bgId)} />
        <g transform="translate(200 200)">
          <MandalaG r={250} stroke="#e06a0b" opacity={0.16} rings={6} />
        </g>
        {[
          [-6, -6, 26],
          [22, 34, 18],
          [406, 406, 28],
          [372, 380, 16],
          [400, 20, 18],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <MarigoldG r={r} tone={i % 2 ? 'yellow' : 'orange'} seed={i + 21} />
          </g>
        ))}
        <g transform="translate(40 60)">
          <LeafG angle={-120} s={0.9} />
        </g>
        <g transform="translate(368 370)">
          <LeafG angle={60} s={0.9} />
        </g>
      </g>
    );
  }
  return (
    <g>
      <defs>
        <radialGradient id={bgId} cx="0.5" cy="0.42" r="0.78">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="0.6" stopColor={mix(pal.lighter, '#fff8ec', 0.55)} />
          <stop offset="1" stopColor={mix(pal.light, '#fcefd9', 0.55)} />
        </radialGradient>
      </defs>
      <rect x="-50" y="-50" width="500" height="500" fill={url(bgId)} />
      <g transform="translate(200 200)">
        <MandalaG r={240} stroke="#d4961a" opacity={0.16} rings={7} />
      </g>
      <ellipse cx="200" cy="352" rx="130" ry="14" fill="#45081b" opacity="0.08" filter={url(ids.soft)} />
    </g>
  );
}

function ComboArt({ ids, pal, variant }: { ids: ArtIds; pal: Palette; variant: number }) {
  const v = variant % 3;
  return (
    <g>
      {/* Velvet jewellery box */}
      <g filter={url(ids.shadow)}>
        <rect x="26" y="34" width="348" height="332" rx="26" fill="#5f0c25" />
        <rect x="26" y="34" width="348" height="332" rx="26" fill="none" stroke={url(ids.gold)} strokeWidth="5" />
        <rect x="40" y="48" width="320" height="304" rx="18" fill="#7a1030" />
        <rect x="40" y="48" width="320" height="304" rx="18" fill="none" stroke="#d4961a" strokeOpacity="0.5" strokeDasharray="2 5" />
      </g>
      <g transform="translate(78 40) scale(0.61)">
        <NecklaceArt ids={ids} pal={pal} variant={v === 0 ? 0 : v === 1 ? 1 : 2} bust={false} />
      </g>
      {v === 1 ? (
        <g transform="translate(-6 190) scale(0.5)">
          <TikkaArt ids={ids} pal={pal} variant={0} />
        </g>
      ) : (
        <g transform="translate(36 212) scale(0.4)">
          <EarringArt ids={ids} pal={pal} variant={v === 0 ? 0 : 5} />
        </g>
      )}
      <g transform="translate(222 228) scale(0.36)">
        <BangleArt ids={ids} pal={pal} variant={v === 0 ? 2 : v === 1 ? 0 : 1} />
      </g>
    </g>
  );
}

export interface ProductArtProps {
  art: ArtSpec;
  color?: ColorKey | string;
  defaultColor?: ColorKey;
  view?: ArtView;
  size?: BagSize;
  className?: string;
  label?: string;
}

function ProductArtImpl({ art, color, defaultColor = 'maroon', view = 0, size, className, label }: ProductArtProps) {
  const ids = useArtIds();
  const hex = resolveHex(color, COLORS[defaultColor].hex);
  const pal = palette(hex);
  const [dx, dy, ds] = DETAIL[art.kind];
  const viewBox = view === 1 ? `${dx} ${dy} ${ds} ${ds}` : '0 0 400 400';

  let subject: React.ReactNode;
  switch (art.kind) {
    case 'bangle':
      subject = <BangleArt ids={ids} pal={pal} variant={art.variant} />;
      break;
    case 'necklace':
      subject = <NecklaceArt ids={ids} pal={pal} variant={art.variant} />;
      break;
    case 'earring':
      subject = <EarringArt ids={ids} pal={pal} variant={art.variant} />;
      break;
    case 'tikka':
      subject = <TikkaArt ids={ids} pal={pal} variant={art.variant} />;
      break;
    case 'wirebag':
      subject = <WireBagArt ids={ids} pal={pal} variant={art.variant} size={size} />;
      break;
    default:
      subject = <ComboArt ids={ids} pal={pal} variant={art.variant} />;
  }

  return (
    <svg
      viewBox={viewBox}
      className={cn('block h-full w-full', className)}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
    >
      <ArtDefs ids={ids} pal={pal} />
      <Backdrop view={view} pal={pal} ids={ids} />
      {view === 3 ? <g transform="rotate(-6 200 200)">{subject}</g> : subject}
      {view !== 1 && (
        <g fill="#fff" opacity="0.85">
          <path d="M338 70 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" />
          <path d="M70 300 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill={lighten('#d4961a', 0.4)} />
        </g>
      )}
    </svg>
  );
}

export const ProductArt = memo(ProductArtImpl);
