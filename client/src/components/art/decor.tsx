'use client';

import { useId, type SVGProps } from 'react';
import { arcPoints, round, seeded } from './primitives';

const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9_-]/g, '');

/* ───────────── Marigold flower (as <g>, drawn around 0,0) ───────────── */

export function MarigoldG({ r = 20, tone = 'orange', seed = 1 }: { r?: number; tone?: 'orange' | 'yellow' | 'red'; seed?: number }) {
  const shades =
    tone === 'yellow'
      ? ['#c98a00', '#f5b301', '#ffd43b', '#ffe680']
      : tone === 'red'
        ? ['#8e1b0e', '#c7361b', '#e8582a', '#f88a4c']
        : ['#b34700', '#e06a0b', '#f7881f', '#ffad4d'];
  const rand = seeded(seed);
  const layers = [
    { rr: r, n: 16, pr: r * 0.34, c: shades[0] },
    { rr: r * 0.78, n: 14, pr: r * 0.32, c: shades[1] },
    { rr: r * 0.55, n: 12, pr: r * 0.3, c: shades[2] },
    { rr: r * 0.3, n: 9, pr: r * 0.26, c: shades[3] },
  ];
  return (
    <g>
      {layers.map((l, li) =>
        arcPoints(0, 0, l.rr - l.pr * 0.6, l.rr - l.pr * 0.6, li * 0.4, li * 0.4 + Math.PI * 2, l.n + 1)
          .slice(0, -1)
          .map((p, i) => <circle key={`${li}-${i}`} cx={round(p.x + (rand() - 0.5) * 2)} cy={round(p.y + (rand() - 0.5) * 2)} r={l.pr} fill={l.c} />),
      )}
      <circle r={r * 0.14} fill="#7a3a00" opacity="0.6" />
    </g>
  );
}

export function Marigold({ size = 48, tone = 'orange', seed = 1, ...rest }: { size?: number; tone?: 'orange' | 'yellow' | 'red'; seed?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-24 -24 48 48" width={size} height={size} aria-hidden {...rest}>
      <MarigoldG r={22} tone={tone} seed={seed} />
    </svg>
  );
}

/* ───────────── Mango leaf ───────────── */

export function LeafG({ angle = 0, s = 1 }: { angle?: number; s?: number }) {
  return (
    <g transform={`rotate(${angle}) scale(${s})`}>
      <path d="M0 0 C8 6 10 22 0 40 C-10 22 -8 6 0 0 Z" fill="#2f7d4a" />
      <path d="M0 2 L0 38" stroke="#1d5431" strokeWidth="1" />
    </g>
  );
}

/* ───────────── Toran — hanging marigold garland ───────────── */

export function Garland({ strands = 9, length = 6, className, ...rest }: { strands?: number; length?: number } & SVGProps<SVGSVGElement>) {
  const width = strands * 60;
  const height = 40 + length * 26 + 30;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="xMidYMin slice" aria-hidden {...rest}>
      <path d={`M0 18 Q${width / 2} 34 ${width} 18`} stroke="#8a5714" strokeWidth="3" fill="none" />
      {Array.from({ length: strands * 2 }, (_, i) => (
        <g key={`l${i}`} transform={`translate(${15 + i * 30} ${round(20 + Math.sin((i / (strands * 2)) * Math.PI) * 10)})`}>
          <LeafG angle={i % 2 ? 20 : -20} s={0.7} />
        </g>
      ))}
      {Array.from({ length: strands }, (_, i) => {
        const x = 30 + i * 60;
        const len = length - (i % 2);
        return (
          <g key={i} className="origin-top animate-sway" style={{ transformOrigin: `${x}px 24px`, animationDelay: `${(i % 4) * 0.4}s` }}>
            <line x1={x} y1={24} x2={x} y2={30 + len * 26} stroke="#6f4516" strokeWidth="1.5" />
            {Array.from({ length: len }, (_, j) => (
              <g key={j} transform={`translate(${x} ${44 + j * 26})`}>
                <MarigoldG r={13} tone={(i + j) % 3 === 0 ? 'yellow' : (i + j) % 5 === 0 ? 'red' : 'orange'} seed={i * 10 + j} />
              </g>
            ))}
            <g transform={`translate(${x} ${44 + len * 26})`}>
              <path d="M-5 0 L5 0 L0 16 Z" fill="#d4961a" />
              <circle cy="18" r="3" fill="#fff1b0" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ───────────── Mandala ───────────── */

export function MandalaG({ r = 180, stroke = '#d4961a', opacity = 1, rings = 6 }: { r?: number; stroke?: string; opacity?: number; rings?: number }) {
  return (
    <g fill="none" stroke={stroke} opacity={opacity} strokeWidth={1.2}>
      <circle r={r * 0.08} />
      {Array.from({ length: rings }, (_, k) => {
        const rr = (r * (k + 1)) / rings;
        const n = 8 + k * 4;
        const petal = (r / rings) * 0.9;
        return (
          <g key={k}>
            <circle r={rr} strokeOpacity={0.6} />
            {Array.from({ length: n }, (_, i) => {
              const a = (360 / n) * i;
              return k % 2 === 0 ? (
                <path key={i} d={`M0 ${-rr + petal} Q${petal * 0.45} ${-rr + petal * 0.45} 0 ${-rr} Q${-petal * 0.45} ${-rr + petal * 0.45} 0 ${-rr + petal}`} transform={`rotate(${a})`} />
              ) : (
                <circle key={i} cx={0} cy={-rr + petal * 0.5} r={petal * 0.22} transform={`rotate(${a})`} />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

export function Mandala({ className, stroke, opacity, rings, ...rest }: { stroke?: string; opacity?: number; rings?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden {...rest}>
      <MandalaG r={196} stroke={stroke} opacity={opacity} rings={rings} />
    </svg>
  );
}

/* ───────────── Diya (oil lamp) with flickering flame ───────────── */

export function Diya({ size = 64, className }: { size?: number; className?: string }) {
  const id = uid(useId());
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <radialGradient id={`flame-${id}`} cx="0.5" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#fff9d6" />
          <stop offset="0.45" stopColor="#ffd43b" />
          <stop offset="1" stopColor="#f7881f" />
        </radialGradient>
        <linearGradient id={`clay-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e06a0b" />
          <stop offset="1" stopColor="#7a1030" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="44" r="22" fill="#ffd43b" opacity="0.25" className="animate-pulse" />
      <path d="M50 20 C58 32 60 40 50 52 C40 40 42 32 50 20 Z" fill={`url(#flame-${id})`} className="origin-bottom animate-[sway_1.6s_ease-in-out_infinite]" style={{ transformOrigin: '50px 52px' }} />
      <path d="M14 56 C20 80 80 80 86 56 C70 62 30 62 14 56 Z" fill={`url(#clay-${id})`} />
      <path d="M14 56 C30 62 70 62 86 56" stroke="#ebb42a" strokeWidth="2.5" fill="none" />
      {[30, 42, 58, 70].map((x) => (
        <circle key={x} cx={x} cy={68} r={2.2} fill="#ebb42a" />
      ))}
    </svg>
  );
}

/* ───────────── Lotus ───────────── */

export function Lotus({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" width={size} height={(size * 80) / 120} className={className} aria-hidden>
      {[-60, -30, 30, 60].map((a) => (
        <path key={a} d="M60 70 C50 50 52 26 60 10 C68 26 70 50 60 70 Z" fill="#f56ba8" opacity="0.75" transform={`rotate(${a} 60 70)`} />
      ))}
      <path d="M60 70 C48 50 50 22 60 4 C70 22 72 50 60 70 Z" fill="#e84a8a" />
      <path d="M60 70 C54 54 55 34 60 20 C65 34 66 54 60 70 Z" fill="#fccde4" opacity="0.7" />
      <path d="M20 72 Q60 64 100 72" stroke="#2f7d4a" strokeWidth="3" fill="none" />
    </svg>
  );
}

/* ───────────── Petal & sparkle shapes ───────────── */

export function PetalShape({ color = '#f7881f', size = 18, className, style }: { color?: string; size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 20 28" width={size} height={size * 1.4} className={className} style={style} aria-hidden>
      <path d="M10 0 C18 8 18 20 10 28 C2 20 2 8 10 0 Z" fill={color} />
      <path d="M10 3 C12 10 12 18 10 25" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function SparkleShape({ size = 16, color = '#ffe680', className, style }: { size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
    </svg>
  );
}

export function PaisleyShape({ className, color = '#d4961a' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden>
      <path d="M30 4 C52 4 60 30 54 48 C48 68 22 80 10 66 C0 54 6 38 20 38 C32 38 34 24 30 4 Z" fill="none" stroke={color} strokeWidth="2" />
      <path d="M28 14 C44 16 50 34 46 46 C42 58 26 66 18 58" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="2 3" />
      <circle cx="30" cy="50" r="5" fill={color} opacity="0.7" />
    </svg>
  );
}

/* ───────────── Ornamental divider ───────────── */

export function OrnamentDivider({ className, color = '#d4961a' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden>
      <path d="M0 12 H92" stroke={color} strokeWidth="1.2" />
      <path d="M148 12 H240" stroke={color} strokeWidth="1.2" />
      <circle cx="88" cy="12" r="2.5" fill={color} />
      <circle cx="152" cy="12" r="2.5" fill={color} />
      <path d="M120 2 C126 8 126 16 120 22 C114 16 114 8 120 2 Z" fill={color} />
      <path d="M100 12 C106 6 112 8 116 12 C112 16 106 18 100 12 Z" fill={color} opacity="0.7" />
      <path d="M140 12 C134 6 128 8 124 12 C128 16 134 18 140 12 Z" fill={color} opacity="0.7" />
    </svg>
  );
}

/* ───────────── Temple arch frame (jharokha) ───────────── */

export function ArchFrame({ className }: { className?: string }) {
  const id = uid(useId());
  return (
    <svg viewBox="0 0 300 400" className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`arch-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a5714" />
          <stop offset="0.3" stopColor="#ebb42a" />
          <stop offset="0.5" stopColor="#fff1b0" />
          <stop offset="0.7" stopColor="#d4961a" />
          <stop offset="1" stopColor="#8a5714" />
        </linearGradient>
      </defs>
      <path
        d="M10 395 V150 C10 110 40 90 60 80 C80 70 100 40 120 30 C135 22 140 10 150 4 C160 10 165 22 180 30 C200 40 220 70 240 80 C260 90 290 110 290 150 V395"
        fill="none"
        stroke={`url(#arch-${id})`}
        strokeWidth="4"
      />
      <path
        d="M22 395 V156 C22 122 48 104 66 94 C86 84 104 56 124 44 C136 36 142 26 150 20 C158 26 164 36 176 44 C196 56 214 84 234 94 C252 104 278 122 278 156 V395"
        fill="none"
        stroke={`url(#arch-${id})`}
        strokeWidth="1.5"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
    </svg>
  );
}
