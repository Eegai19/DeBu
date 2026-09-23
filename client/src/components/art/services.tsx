'use client';

import { useId } from 'react';
import { arcPoints, darken, lighten, round } from './primitives';
import { MarigoldG } from './decor';

const clean = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');

/* ═══════════════════════════ Blouse ═══════════════════════════ */

export type Neckline = 'round' | 'sweetheart' | 'v' | 'boat' | 'square';

const NECK: Record<Neckline, string> = {
  round: 'Q200 150 240 82',
  sweetheart: 'C168 132 192 150 200 136 C208 150 232 132 240 82',
  v: 'L200 172 L240 82',
  boat: 'Q200 110 240 82',
  square: 'L166 138 L234 138 L240 82',
};

export function BlouseArt({
  color = '#7a1030',
  neckline = 'round',
  embellished = true,
  fitted = true,
  showMarks = false,
  className,
}: {
  color?: string;
  neckline?: Neckline;
  embellished?: boolean;
  fitted?: boolean;
  showMarks?: boolean;
  className?: string;
}) {
  const id = clean(useId());
  const waist = fitted ? 0 : 14;
  const sleeveEnd = fitted ? 200 : 222;
  const uy = fitted ? 182 : 196;
  const [lx, rx] = fitted ? [130, 270] : [118, 282];
  const [sx1, sx2] = fitted ? [70, 330] : [62, 338];
  const right = fitted ? `C274 230 272 270 ${rx} 304` : `C${290 + waist} 230 ${288 + waist} 270 ${rx} 304`;
  const left = fitted ? `C126 270 128 230 118 ${uy}` : `C${110 - waist} 270 ${112 - waist} 230 118 ${uy}`;
  const outline = `M160 82 ${NECK[neckline]} L288 94 L342 140 L${sx2} ${sleeveEnd} L282 ${uy} ${right} Q200 ${embellished ? 326 : 312} ${lx} 304 ${left} L${sx1} ${sleeveEnd} L58 140 L112 94 Z`;
  const neckPath = `M160 82 ${NECK[neckline]}`;

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <linearGradient id={`silk-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(color, 0.25)} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="0.55" stopColor={lighten(color, 0.18)} />
          <stop offset="1" stopColor={darken(color, 0.35)} />
        </linearGradient>
        <linearGradient id={`zari-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a5714" />
          <stop offset="0.5" stopColor="#fae28b" />
          <stop offset="1" stopColor="#b07414" />
        </linearGradient>
        <filter id={`sh-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#45081b" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Hanger */}
      <path d="M200 30 C200 18 214 18 214 30 C214 38 200 40 200 48 L120 92 M200 48 L280 92" stroke="#8a5714" strokeWidth="4" fill="none" strokeLinecap="round" />

      <g filter={`url(#sh-${id})`}>
        <path d={outline} fill={`url(#silk-${id})`} />
        {/* Darts & seams */}
        <path d="M160 200 Q165 240 170 290 M240 200 Q235 240 230 290" stroke={darken(color, 0.4)} strokeOpacity="0.35" strokeWidth="1.5" fill="none" strokeDasharray={fitted ? '0' : '4 4'} />
        {!fitted && (
          <path d="M130 220 Q145 226 138 240 M270 226 Q255 232 262 246 M180 280 Q200 288 220 280" stroke={darken(color, 0.45)} strokeOpacity="0.45" strokeWidth="2" fill="none" />
        )}
      </g>

      {embellished && (
        <g>
          <path d={neckPath} fill="none" stroke={`url(#zari-${id})`} strokeWidth="7" />
          <path d={neckPath} fill="none" stroke="#fff6d0" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
          <path d={`M${sx1} ${sleeveEnd} L118 ${uy}`} stroke={`url(#zari-${id})`} strokeWidth="9" />
          <path d={`M${sx2} ${sleeveEnd} L282 ${uy}`} stroke={`url(#zari-${id})`} strokeWidth="9" />
          <path d={`M${lx} 304 Q200 ${embellished ? 326 : 312} ${rx} 304`} stroke={`url(#zari-${id})`} strokeWidth="8" fill="none" />
          {[
            [150, 210],
            [250, 210],
            [200, 250],
            [160, 270],
            [240, 270],
            [90, 160],
            [310, 160],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              {Array.from({ length: 6 }, (_, k) => (
                <ellipse key={k} cx="0" cy="-5" rx="2.4" ry="5" fill="#fae28b" transform={`rotate(${k * 60})`} />
              ))}
              <circle r="2.2" fill="#fff" />
            </g>
          ))}
          {/* Latkans */}
          {[138, 262].map((x) => (
            <g key={x}>
              <path d={`M${x} 306 L${x} 340`} stroke="#b07414" strokeWidth="1.5" />
              <circle cx={x} cy={344} r={6} fill={`url(#zari-${id})`} />
              <path d={`M${x - 5} 350 L${x + 5} 350 L${x + 3} 368 L${x - 3} 368 Z`} fill={lighten(color, 0.2)} />
            </g>
          ))}
        </g>
      )}

      {showMarks && (
        <g stroke="#ffffff" strokeWidth="2" strokeDasharray="6 5" fill="none" opacity="0.9">
          <path d="M126 196 C136 236 134 270 136 300" />
          <path d="M274 196 C264 236 266 270 264 300" />
          <path d="M66 196 L118 180" />
          <path d="M334 196 L282 180" />
          <text x="72" y="252" fill="#fff" stroke="none" fontSize="13" fontFamily="serif" fontStyle="italic">
            take in
          </text>
        </g>
      )}
    </svg>
  );
}

/* ═══════════════════════════ Mehandi hand ═══════════════════════════ */

const HENNA = '#7f3d1a';

type Finger = { x: number; top: number; w: number; bottom: number };
const FINGERS: Finger[] = [
  { x: 128, top: 96, w: 31, bottom: 220 },
  { x: 163, top: 66, w: 33, bottom: 220 },
  { x: 200, top: 80, w: 32, bottom: 220 },
  { x: 236, top: 118, w: 28, bottom: 226 },
];

function HandShape() {
  return (
    <>
      {FINGERS.map((f) => (
        <rect key={f.x} x={f.x} y={f.top} width={f.w} height={f.bottom - f.top + 10} rx={f.w / 2} />
      ))}
      <rect x={122} y={186} width={38} height={124} rx={19} transform="rotate(-35 141 305)" />
      <path d="M126 200 L266 204 C272 250 268 300 252 330 L250 420 L152 420 L150 330 C132 300 124 250 126 200 Z" />
    </>
  );
}

function Mandala({ cx, cy, r, detail = 2 }: { cx: number; cy: number; r: number; detail?: number }) {
  return (
    <g stroke={HENNA} fill="none" strokeWidth="1.6">
      <circle cx={cx} cy={cy} r={r * 0.14} fill={HENNA} />
      <circle cx={cx} cy={cy} r={r * 0.26} />
      {arcPoints(cx, cy, r * 0.42, r * 0.42, 0, Math.PI * 2, 13)
        .slice(0, -1)
        .map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={r * 0.07} ry={r * 0.14} transform={`rotate(${i * 30 + 90} ${p.x} ${p.y})`} />
        ))}
      <circle cx={cx} cy={cy} r={r * 0.58} />
      {arcPoints(cx, cy, r * 0.66, r * 0.66, 0, Math.PI * 2, 25)
        .slice(0, -1)
        .map((p, i) => (
          <circle key={`d${i}`} cx={p.x} cy={p.y} r={1.6} fill={HENNA} stroke="none" />
        ))}
      {detail > 1 &&
        Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          const r1 = r * 0.72;
          const r2 = r;
          const w = Math.PI / 18;
          const pt = (rr: number, t: number) => `${round(cx + rr * Math.cos(t))} ${round(cy + rr * Math.sin(t))}`;
          return <path key={`p${i}`} d={`M${pt(r1, a - w)} Q${pt(r2 * 1.05, a)} ${pt(r1, a + w)}`} />;
        })}
    </g>
  );
}

function Lattice({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const lines = [];
  for (let k = -h; k < w; k += 7) {
    lines.push(<line key={`a${k}`} x1={x + k} y1={y} x2={x + k + h} y2={y + h} />);
    lines.push(<line key={`b${k}`} x1={x + k + h} y1={y} x2={x + k} y2={y + h} />);
  }
  return (
    <g stroke={HENNA} strokeWidth="0.9" opacity="0.85">
      {lines}
    </g>
  );
}

export type MehandiStyle = 'bridal' | 'arabic' | 'minimal' | 'festival';

export function MehandiArt({ style = 'bridal', className, background = true }: { style?: MehandiStyle; className?: string; background?: boolean }) {
  const id = clean(useId());
  const dense = style === 'bridal';
  return (
    <svg viewBox="0 0 400 400" className={className} preserveAspectRatio={background ? 'xMidYMid slice' : 'xMidYMid meet'} aria-hidden>
      <defs>
        <clipPath id={`hand-${id}`}>
          <HandShape />
        </clipPath>
        <radialGradient id={`bg-${id}`} cx="0.5" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#fff8ec" />
          <stop offset="1" stopColor={style === 'festival' ? '#ffe7b0' : style === 'arabic' ? '#f7dfe6' : '#f6e2bf'} />
        </radialGradient>
        <linearGradient id={`skin-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7d6b6" />
          <stop offset="1" stopColor="#e2ac82" />
        </linearGradient>
        <filter id={`sh-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#5f2c12" floodOpacity="0.28" />
        </filter>
      </defs>

      {background && (
        <>
          <rect width="400" height="400" fill={`url(#bg-${id})`} />
          {[
            [44, 60, 'orange', 16],
            [356, 90, 'yellow', 14],
            [330, 330, 'red', 18],
            [60, 340, 'yellow', 13],
            [370, 220, 'orange', 10],
          ].map(([x, y, tone, r], i) => (
            <g key={i} transform={`translate(${x} ${y})`} opacity="0.9">
              <MarigoldG r={r as number} tone={tone as 'orange'} seed={i + 3} />
            </g>
          ))}
        </>
      )}

      <g filter={`url(#sh-${id})`} fill={`url(#skin-${id})`}>
        <HandShape />
      </g>

      <g clipPath={`url(#hand-${id})`} fill="none" stroke={HENNA} strokeWidth="1.5" strokeLinecap="round">
        {/* Finger tips */}
        {FINGERS.map((f) => (
          <rect key={`t${f.x}`} x={f.x} y={f.top} width={f.w} height={style === 'arabic' ? 20 : 26} fill={HENNA} stroke="none" />
        ))}
        <rect x={122} y={186} width={38} height={26} fill={HENNA} stroke="none" transform="rotate(-35 141 305)" />

        {/* Finger bands */}
        {FINGERS.map((f, i) => {
          const y1 = f.top + 42;
          const y2 = f.top + (f.bottom - f.top) * 0.62;
          return (
            <g key={`b${f.x}`}>
              <line x1={f.x} y1={y1} x2={f.x + f.w} y2={y1} strokeWidth="2.2" />
              <line x1={f.x} y1={y1 + 5} x2={f.x + f.w} y2={y1 + 5} />
              {Array.from({ length: 4 }, (_, k) => (
                <circle key={k} cx={f.x + 5 + (k * (f.w - 10)) / 3} cy={y1 + 11} r={1.6} fill={HENNA} stroke="none" />
              ))}
              {(dense || (style === 'festival' && i % 2 === 0)) && <Lattice x={f.x} y={y1 + 16} w={f.w} h={y2 - y1 - 20} />}
              {!dense && style !== 'festival' && (
                <path d={`M${f.x + f.w / 2} ${y1 + 20} q8 10 0 20 q-8 10 0 20`} />
              )}
              <line x1={f.x} y1={y2} x2={f.x + f.w} y2={y2} strokeWidth="2.2" />
              {Array.from({ length: 3 }, (_, k) => (
                <path key={`s${k}`} d={`M${f.x + (k * f.w) / 3} ${y2 + 3} q${f.w / 6} 7 ${f.w / 3} 0`} />
              ))}
            </g>
          );
        })}

        {/* Palm */}
        {style === 'arabic' ? (
          <g>
            <path d="M150 230 C190 250 170 290 210 300 C250 310 240 350 222 420" strokeWidth="2.4" />
            {[
              [158, 240, -30],
              [186, 268, 40],
              [206, 296, -20],
              [236, 320, 30],
              [228, 360, -40],
            ].map(([x, y, a], i) => (
              <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
                <path d="M0 0 C10 -6 22 -2 26 0 C22 2 10 6 0 0 Z" fill={HENNA} fillOpacity="0.2" />
                <path d="M0 0 C-10 -6 -22 -2 -26 0 C-22 2 -10 6 0 0 Z" />
              </g>
            ))}
            <Mandala cx={214} cy={262} r={26} detail={1} />
          </g>
        ) : (
          <g>
            <Mandala cx={197} cy={278} r={dense ? 60 : 48} detail={dense || style === 'festival' ? 2 : 1} />
            {dense && (
              <>
                <path d="M136 230 Q197 214 262 232" strokeWidth="2.2" />
                <path d="M136 238 Q197 222 262 240" />
                {Array.from({ length: 12 }, (_, k) => (
                  <path key={k} d={`M${140 + k * 10.5} ${round(236 - Math.sin((k / 11) * Math.PI) * 14)} q5 8 10 0`} />
                ))}
              </>
            )}
            {style === 'festival' &&
              [
                [150, 330],
                [250, 330],
                [160, 236],
                [240, 238],
              ].map(([x, y], i) => (
                <g key={i}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <ellipse key={k} cx={x} cy={y - 7} rx={3.5} ry={7} transform={`rotate(${k * 72} ${x} ${y})`} />
                  ))}
                  <circle cx={x} cy={y} r={2} fill={HENNA} />
                </g>
              ))}
          </g>
        )}

        {/* Wrist bands */}
        {style !== 'minimal' && (
          <g>
            <line x1={140} y1={352} x2={260} y2={352} strokeWidth="2.4" />
            <line x1={140} y1={358} x2={260} y2={358} />
            {Array.from({ length: 12 }, (_, k) => (
              <path key={k} d={`M${146 + k * 9.5} 360 q4.75 9 9.5 0`} />
            ))}
            {Array.from({ length: 12 }, (_, k) => (
              <circle key={`c${k}`} cx={151 + k * 9.5} cy={374} r={1.6} fill={HENNA} stroke="none" />
            ))}
            {dense && <Lattice x={140} y={384} w={120} h={30} />}
          </g>
        )}
      </g>
    </svg>
  );
}
