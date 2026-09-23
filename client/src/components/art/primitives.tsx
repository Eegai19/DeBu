'use client';

import { useId } from 'react';

/* ───────────── Colour helpers ───────────── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const c = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

export const lighten = (hex: string, t: number) => mix(hex, '#ffffff', t);
export const darken = (hex: string, t: number) => mix(hex, '#000000', t);

export interface Palette {
  base: string;
  light: string;
  lighter: string;
  dark: string;
  deeper: string;
}

export function palette(hex: string): Palette {
  return {
    base: hex,
    light: lighten(hex, 0.35),
    lighter: lighten(hex, 0.7),
    dark: darken(hex, 0.3),
    deeper: darken(hex, 0.55),
  };
}

/* ───────────── Shared gradient ids ───────────── */

export interface ArtIds {
  thread: string;
  threadV: string;
  bead: string;
  gold: string;
  goldR: string;
  pearl: string;
  kundan: string;
  ruby: string;
  emerald: string;
  shadow: string;
  soft: string;
}

export function useArtIds(): ArtIds {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `${name}-${raw}`;
  return {
    thread: id('thread'),
    threadV: id('threadv'),
    bead: id('bead'),
    gold: id('gold'),
    goldR: id('goldr'),
    pearl: id('pearl'),
    kundan: id('kundan'),
    ruby: id('ruby'),
    emerald: id('emerald'),
    shadow: id('shadow'),
    soft: id('soft'),
  };
}

export const url = (id: string) => `url(#${id})`;

export function ArtDefs({ ids, pal }: { ids: ArtIds; pal: Palette }) {
  return (
    <defs>
      <linearGradient id={ids.thread} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={pal.light} />
        <stop offset="0.45" stopColor={pal.base} />
        <stop offset="1" stopColor={pal.dark} />
      </linearGradient>
      <linearGradient id={ids.threadV} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={pal.light} />
        <stop offset="0.5" stopColor={pal.base} />
        <stop offset="1" stopColor={pal.deeper} />
      </linearGradient>
      <radialGradient id={ids.bead} cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor={pal.lighter} />
        <stop offset="0.35" stopColor={pal.base} />
        <stop offset="1" stopColor={pal.deeper} />
      </radialGradient>
      <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a5714" />
        <stop offset="0.25" stopColor="#ebb42a" />
        <stop offset="0.5" stopColor="#fff1b0" />
        <stop offset="0.75" stopColor="#d4961a" />
        <stop offset="1" stopColor="#7a4a10" />
      </linearGradient>
      <radialGradient id={ids.goldR} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#fff6c8" />
        <stop offset="0.4" stopColor="#ebb42a" />
        <stop offset="1" stopColor="#7a4a10" />
      </radialGradient>
      <radialGradient id={ids.pearl} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.55" stopColor="#f8efe2" />
        <stop offset="1" stopColor="#c9b8a3" />
      </radialGradient>
      <radialGradient id={ids.kundan} cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#f3f7ff" />
        <stop offset="0.8" stopColor="#c5d3ea" />
        <stop offset="1" stopColor="#8d9bb8" />
      </radialGradient>
      <radialGradient id={ids.ruby} cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ff9fb0" />
        <stop offset="0.45" stopColor="#d0103a" />
        <stop offset="1" stopColor="#5c0418" />
      </radialGradient>
      <radialGradient id={ids.emerald} cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#a8f0c6" />
        <stop offset="0.45" stopColor="#12895a" />
        <stop offset="1" stopColor="#053d26" />
      </radialGradient>
      <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#45081b" floodOpacity="0.28" />
      </filter>
      <filter id={ids.soft} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>
  );
}

/* ───────────── Jewellery building blocks ───────────── */

type Pt = { x: number; y: number };

export function Pearl({ x, y, r, ids }: Pt & { r: number; ids: ArtIds }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={url(ids.pearl)} />
      <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#fff" opacity="0.9" />
    </g>
  );
}

export function GoldBead({ x, y, r, ids }: Pt & { r: number; ids: ArtIds }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={url(ids.goldR)} />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.3} fill="#fffbe0" opacity="0.8" />
    </g>
  );
}

export function SilkBead({ x, y, r, ids, pal }: Pt & { r: number; ids: ArtIds; pal: Palette }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={url(ids.bead)} />
      {/* wound-thread lines */}
      <ellipse cx={x} cy={y} rx={r * 0.35} ry={r * 0.98} fill="none" stroke={pal.dark} strokeOpacity="0.35" strokeWidth="0.8" />
      <ellipse cx={x} cy={y} rx={r * 0.7} ry={r * 0.98} fill="none" stroke={pal.dark} strokeOpacity="0.3" strokeWidth="0.8" />
      <line x1={x} y1={y - r} x2={x} y2={y + r} stroke={pal.dark} strokeOpacity="0.3" strokeWidth="0.8" />
      <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.25} fill="#fff" opacity="0.45" />
    </g>
  );
}

export function Stone({
  x,
  y,
  r,
  ids,
  gem = 'kundan',
}: Pt & { r: number; ids: ArtIds; gem?: 'kundan' | 'ruby' | 'emerald' }) {
  const fill = gem === 'ruby' ? ids.ruby : gem === 'emerald' ? ids.emerald : ids.kundan;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={url(ids.gold)} />
      <circle cx={x} cy={y} r={r * 0.72} fill={url(fill)} />
      <circle cx={x - r * 0.25} cy={y - r * 0.28} r={r * 0.2} fill="#fff" opacity="0.95" />
    </g>
  );
}

/** A small twinkle star used for sparkle highlights inside artwork. */
export function Glint({ x, y, s = 8, opacity = 0.9 }: Pt & { s?: number; opacity?: number }) {
  return (
    <path
      d={`M${x} ${y - s} Q${x + s * 0.15} ${y - s * 0.15} ${x + s} ${y} Q${x + s * 0.15} ${y + s * 0.15} ${x} ${y + s} Q${x - s * 0.15} ${y + s * 0.15} ${x - s} ${y} Q${x - s * 0.15} ${y - s * 0.15} ${x} ${y - s}Z`}
      fill="#fff"
      opacity={opacity}
    />
  );
}

/** Rounds to 2 decimals so server- and browser-rendered SVG attributes match. */
export const round = (n: number) => Math.round(n * 100) / 100;

/** Points evenly distributed along an elliptical arc. */
export function arcPoints(cx: number, cy: number, rx: number, ry: number, from: number, to: number, count: number): Pt[] {
  return Array.from({ length: count }, (_, i) => {
    const t = from + ((to - from) * i) / Math.max(1, count - 1);
    return { x: round(cx + rx * Math.cos(t)), y: round(cy + ry * Math.sin(t)) };
  });
}

/** Deterministic PRNG so server and client render identical artwork. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
