'use client';

import type { BagSize } from '@debu/shared';
import { GoldBead, url, type ArtIds, type Palette } from './primitives';

const SCALE: Record<BagSize, number> = { small: 0.72, medium: 0.86, large: 1 };
const IVORY = '#f7ecd6';

function WeavePattern({ id, variant, pal }: { id: string; variant: number; pal: Palette }) {
  switch (variant % 6) {
    case 1: // diamond lattice
      return (
        <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="18" height="18" fill={pal.base} />
          <rect x="5" y="5" width="8" height="8" rx="1.5" fill={pal.deeper} opacity="0.75" />
          <path d="M0 0 H18 M0 18 H18 M0 0 V18 M18 0 V18" stroke={pal.light} strokeWidth="1.5" opacity="0.7" />
        </pattern>
      );
    case 2: // polka
      return (
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill={pal.base} />
          <path d="M0 5.5 H22 M0 16.5 H22" stroke={pal.dark} strokeWidth="1" opacity="0.4" />
          <circle cx="5.5" cy="5.5" r="3.4" fill="#fff6d8" />
          <circle cx="16.5" cy="16.5" r="3.4" fill="#ebb42a" />
        </pattern>
      );
    case 3: // stripes
      return (
        <pattern id={id} width="12" height="36" patternUnits="userSpaceOnUse">
          <rect width="12" height="18" fill={pal.base} />
          <rect y="18" width="12" height="18" fill={IVORY} />
          <path d="M6 0 V36" stroke="#000" strokeOpacity="0.12" strokeWidth="1" />
          <path d="M0 9 H12 M0 27 H12" stroke="#000" strokeOpacity="0.08" strokeWidth="6" />
        </pattern>
      );
    case 5: // chevron
      return (
        <pattern id={id} width="28" height="20" patternUnits="userSpaceOnUse">
          <rect width="28" height="20" fill={IVORY} />
          <path d="M0 6 L14 16 L28 6" stroke={pal.base} strokeWidth="7" fill="none" />
          <path d="M0 -4 L14 6 L28 -4" stroke={pal.dark} strokeWidth="3" fill="none" />
        </pattern>
      );
    default: // basket weave (classic & pooja)
      return (
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={pal.dark} />
          {[2, 6, 10].map((y) => (
            <rect key={`a${y}`} x="1" y={y - 1} width="10" height="3" rx="1.5" fill={pal.base} />
          ))}
          {[14, 18, 22].map((x) => (
            <rect key={`b${x}`} x={x - 1} y="1" width="3" height="10" rx="1.5" fill={pal.light} />
          ))}
          {[2, 6, 10].map((x) => (
            <rect key={`c${x}`} x={x - 1} y="13" width="3" height="10" rx="1.5" fill={pal.light} />
          ))}
          {[14, 18, 22].map((y) => (
            <rect key={`d${y}`} x="13" y={y - 1} width="10" height="3" rx="1.5" fill={pal.base} />
          ))}
        </pattern>
      );
  }
}

function Handle({ d, pal, back }: { d: string; pal: Palette; back?: boolean }) {
  return (
    <g opacity={back ? 0.75 : 1}>
      <path d={d} fill="none" stroke={back ? pal.deeper : pal.dark} strokeWidth="15" strokeLinecap="round" />
      <path d={d} fill="none" stroke={back ? pal.dark : pal.base} strokeWidth="11" strokeLinecap="round" />
      <path d={d} fill="none" stroke={pal.lighter} strokeOpacity="0.55" strokeWidth="11" strokeDasharray="2 4" />
    </g>
  );
}

export function WireBagArt({ ids, pal, variant, size = 'large' }: { ids: ArtIds; pal: Palette; variant: number; size?: BagSize }) {
  const v = variant % 6;
  const weaveId = `${ids.thread}-weave`;
  const pooja = v === 4;
  const mini = v === 2;
  const s = SCALE[size];

  const top = pooja ? 196 : mini ? 176 : 150;
  const bottom = 324;
  const halfTop = pooja ? 135 : mini ? 100 : 118;
  const halfBottom = pooja ? 120 : mini ? 88 : 96;
  const body = `M${200 - halfTop} ${top} L${200 + halfTop} ${top} L${200 + halfBottom + 2} ${bottom - 18} Q${200 + halfBottom} ${bottom} ${200 + halfBottom - 18} ${bottom} L${200 - halfBottom + 18} ${bottom} Q${200 - halfBottom} ${bottom} ${200 - halfBottom - 2} ${bottom - 18} Z`;

  const handleFront = pooja
    ? `M${200 - halfTop + 20} ${top} C${200 - halfTop + 20} 70 ${200 + halfTop - 20} 70 ${200 + halfTop - 20} ${top}`
    : `M${200 - halfTop + 34} ${top + 4} C${200 - halfTop + 30} ${top - 110} ${200 + halfTop - 30} ${top - 110} ${200 + halfTop - 34} ${top + 4}`;
  const handleBack = `M${200 - halfTop + 44} ${top} C${200 - halfTop + 44} ${top - 98} ${200 + halfTop - 44} ${top - 98} ${200 + halfTop - 44} ${top}`;
  const border = v === 1 ? url(ids.gold) : v === 3 || v === 5 ? pal.dark : pal.deeper;

  return (
    <g transform={`translate(200 ${bottom}) scale(${s}) translate(-200 ${-bottom})`}>
      <defs>
        <WeavePattern id={weaveId} variant={v} pal={pal} />
        <linearGradient id={`${weaveId}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      {!pooja && <Handle d={handleBack} pal={pal} back />}

      <g filter={url(ids.shadow)}>
        <path d={body} fill={`url(#${weaveId})`} />
        <path d={body} fill={`url(#${weaveId}-shade)`} />
        {/* Rim */}
        <rect x={200 - halfTop - 6} y={top - 9} width={halfTop * 2 + 12} height={18} rx={9} fill={border} />
        <rect x={200 - halfTop - 6} y={top - 9} width={halfTop * 2 + 12} height={18} rx={9} fill="none" stroke={pal.lighter} strokeOpacity="0.45" strokeWidth="9" strokeDasharray="2 4" />
        {/* Base band */}
        <path d={`M${200 - halfBottom + 4} ${bottom - 12} L${200 + halfBottom - 4} ${bottom - 12}`} stroke={border} strokeWidth="10" strokeLinecap="round" />
        {v === 1 && (
          <>
            <path d={`M${200 - halfTop + 10} ${top + 26} L${200 + halfTop - 10} ${top + 26}`} stroke={url(ids.gold)} strokeWidth="5" />
            <path d={`M${200 - halfBottom} ${bottom - 34} L${200 + halfBottom} ${bottom - 34}`} stroke={url(ids.gold)} strokeWidth="5" />
          </>
        )}
        {pooja && [150, 200, 250].map((x) => <GoldBead key={x} x={x} y={top + 36} r={5} ids={ids} />)}
      </g>

      <Handle d={handleFront} pal={pal} />

      {mini && (
        <g transform={`translate(${200 + halfTop - 18} ${top + 10})`}>
          <path d="M0 0 C-22 -18 -26 8 0 0 C22 -18 26 8 0 0 Z" fill="#ebb42a" stroke="#8a5714" strokeWidth="1.5" />
          <path d="M0 0 L-8 24 M0 0 L8 22" stroke="#d4961a" strokeWidth="4" strokeLinecap="round" />
          <circle r="4" fill="#fff1b0" />
        </g>
      )}
    </g>
  );
}

export const BAG_SCALE = SCALE;
