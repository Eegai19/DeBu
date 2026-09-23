'use client';

import { COLORS, PRESET_COLORS } from '@debu/shared';
import { arcPoints, darken, GoldBead, Pearl, round, SilkBead, Stone, url, type ArtIds, type Palette } from './primitives';

interface JewelProps {
  ids: ArtIds;
  pal: Palette;
  variant: number;
}

/* ═══════════════════════════ Bangles ═══════════════════════════ */

interface RingProps {
  cx: number;
  cy: number;
  rx: number;
  ry?: number;
  w: number;
  ids: ArtIds;
  pal: Palette;
  solid?: string;
  stones?: number;
  gem?: 'kundan' | 'ruby' | 'emerald' | 'mix';
  pearls?: boolean;
  mirrors?: number;
  zari?: boolean;
  goldBand?: boolean;
}

function Ring({ cx, cy, rx, ry = rx, w, ids, pal, solid, stones = 0, gem = 'kundan', pearls, mirrors = 0, zari, goldBand }: RingProps) {
  const stroke = solid ?? url(ids.thread);
  const shade = solid ? darken(solid, 0.5) : pal.deeper;
  const circ = Math.PI * (rx + ry);
  const texture = `${(circ / 260).toFixed(2)} ${(circ / 130).toFixed(2)}`;
  const stonePts = stones ? arcPoints(cx, cy, rx, ry, -Math.PI / 2, Math.PI * 1.5, stones + 1).slice(0, -1) : [];
  const mirrorPts = mirrors ? arcPoints(cx, cy, rx, ry, -Math.PI / 2 + 0.2, Math.PI * 1.5 + 0.2, mirrors + 1).slice(0, -1) : [];
  const pearlCount = Math.round(circ / 11);
  return (
    <g filter={url(ids.shadow)}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={stroke} strokeWidth={w} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={shade} strokeOpacity="0.32" strokeWidth={w} strokeDasharray={texture} />
      <ellipse cx={cx} cy={cy - w * 0.12} rx={rx - w * 0.15} ry={Math.max(1, ry - w * 0.15)} fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth={w * 0.22} />
      {zari && (
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={url(ids.gold)} strokeWidth={w * 0.7} strokeDasharray="2.5 7" opacity="0.85" />
      )}
      {goldBand && <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={url(ids.gold)} strokeWidth={w * 0.28} />}
      <ellipse cx={cx} cy={cy} rx={rx + w / 2} ry={ry + w / 2} fill="none" stroke={url(ids.gold)} strokeWidth={Math.max(2, w * 0.12)} />
      <ellipse cx={cx} cy={cy} rx={Math.max(1, rx - w / 2)} ry={Math.max(1, ry - w / 2)} fill="none" stroke={url(ids.gold)} strokeWidth={Math.max(2, w * 0.12)} />
      {pearls &&
        [rx + w / 2 + 3, rx - w / 2 - 3].map((r, k) =>
          arcPoints(cx, cy, r, r * (ry / rx), 0, Math.PI * 2, pearlCount + 1)
            .slice(0, -1)
            .map((p, i) => <Pearl key={`${k}-${i}`} x={p.x} y={p.y} r={3.2} ids={ids} />),
        )}
      {mirrorPts.map((p, i) => (
        <g key={`m${i}`}>
          <circle cx={p.x} cy={p.y} r={w * 0.26} fill="#e9eef5" stroke={url(ids.gold)} strokeWidth="1.6" />
          <circle cx={p.x - 1.2} cy={p.y - 1.2} r={w * 0.08} fill="#fff" />
        </g>
      ))}
      {stonePts.map((p, i) => (
        <Stone
          key={`s${i}`}
          x={p.x}
          y={p.y}
          r={w * 0.36}
          ids={ids}
          gem={gem === 'mix' ? (['kundan', 'ruby', 'kundan', 'emerald'] as const)[i % 4] : gem}
        />
      ))}
    </g>
  );
}

export function BangleArt({ ids, pal, variant }: JewelProps) {
  switch (variant % 6) {
    case 1: // Haldi set — four fanned bangles with mirror work
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <Ring key={i} cx={140 + i * 40} cy={170 + i * 20} rx={92} w={15} ids={ids} pal={pal} mirrors={i % 2 ? 12 : 0} pearls={i === 3} />
          ))}
        </g>
      );
    case 2: // Bridal chuda — tall stack in perspective
      return (
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <Ring
              key={i}
              cx={200}
              cy={118 + i * 21}
              rx={128}
              ry={40}
              w={i % 3 === 1 ? 16 : 11}
              ids={ids}
              pal={pal}
              stones={i % 3 === 1 ? 14 : 0}
              gem={i % 2 ? 'kundan' : 'ruby'}
              goldBand={i % 3 === 2}
            />
          ))}
        </g>
      );
    case 3: // Pastel pearls
      return (
        <g>
          <Ring cx={160} cy={200} rx={92} w={26} ids={ids} pal={pal} pearls />
          <Ring cx={240} cy={200} rx={92} w={26} ids={ids} pal={pal} pearls stones={6} />
        </g>
      );
    case 4: // Temple kada
      return (
        <g>
          <Ring cx={200} cy={200} rx={112} w={58} ids={ids} pal={pal} zari />
          {arcPoints(200, 200, 112, 112, 0, Math.PI * 2, 25)
            .slice(0, -1)
            .map((p, i) => (i % 3 === 0 ? <Stone key={i} x={p.x} y={p.y} r={10} ids={ids} gem="ruby" /> : <GoldBead key={i} x={p.x} y={p.y} r={5} ids={ids} />))}
        </g>
      );
    case 5: {
      // Rainbow stack — each bangle a different preset colour
      const start = Math.max(0, PRESET_COLORS.findIndex((k) => COLORS[k].hex === pal.base));
      const order = [...PRESET_COLORS.slice(start), ...PRESET_COLORS.slice(0, start)].slice(0, 6);
      return (
        <g>
          {order.map((k, i) => (
            <Ring
              key={k}
              cx={200}
              cy={122 + i * 32}
              rx={124}
              ry={40}
              w={18}
              ids={ids}
              pal={pal}
              solid={COLORS[k].hex}
              stones={i % 2 === 0 ? 12 : 0}
              gem="kundan"
            />
          ))}
        </g>
      );
    }
    default: // Royal kundan pair
      return (
        <g>
          <Ring cx={158} cy={200} rx={96} w={30} ids={ids} pal={pal} stones={10} gem="mix" />
          <Ring cx={242} cy={200} rx={96} w={30} ids={ids} pal={pal} stones={10} gem="mix" />
        </g>
      );
  }
}

/* ═══════════════════════════ Necklaces ═══════════════════════════ */

export function Bust({ ids }: { ids: ArtIds }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${ids.soft}-bust`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1e2" />
          <stop offset="1" stopColor="#ecd8bc" />
        </linearGradient>
      </defs>
      <path
        d="M152 -10 L152 62 C152 102 124 124 76 142 C40 156 14 176 0 198 L0 410 L400 410 L400 198 C386 176 360 156 324 142 C276 124 248 102 248 62 L248 -10 Z"
        fill={`url(#${ids.soft}-bust)`}
        stroke="#d9c09c"
        strokeWidth="1.5"
      />
      <path d="M152 62 C160 92 240 92 248 62" fill="none" stroke="#d9c09c" strokeOpacity="0.8" strokeWidth="2" />
    </g>
  );
}

function Strand({
  cy,
  rx,
  ry,
  n,
  r,
  ids,
  pal,
  pattern = 'alt',
  from = 0.06,
  to = 0.94,
}: {
  cy: number;
  rx: number;
  ry: number;
  n: number;
  r: number;
  ids: ArtIds;
  pal: Palette;
  pattern?: 'alt' | 'silk' | 'pearl' | 'pearl-silk';
  from?: number;
  to?: number;
}) {
  const pts = arcPoints(200, cy, rx, ry, Math.PI * from, Math.PI * to, n);
  return (
    <g>
      <path
        d={pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
        fill="none"
        stroke={pal.dark}
        strokeWidth="1.5"
      />
      {pts.map((p, i) => {
        if (pattern === 'pearl') return <Pearl key={i} x={p.x} y={p.y} r={r} ids={ids} />;
        if (pattern === 'silk') return <SilkBead key={i} x={p.x} y={p.y} r={r} ids={ids} pal={pal} />;
        if (pattern === 'pearl-silk')
          return i % 2 ? <Pearl key={i} x={p.x} y={p.y} r={r * 0.7} ids={ids} /> : <SilkBead key={i} x={p.x} y={p.y} r={r} ids={ids} pal={pal} />;
        return i % 2 ? <GoldBead key={i} x={p.x} y={p.y} r={r * 0.55} ids={ids} /> : <SilkBead key={i} x={p.x} y={p.y} r={r} ids={ids} pal={pal} />;
      })}
    </g>
  );
}

function PearlFringe({ x, y, width, count, ids, drop = 14 }: { x: number; y: number; width: number; count: number; ids: ArtIds; drop?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const px = x - width / 2 + (width * i) / Math.max(1, count - 1);
        const len = round(drop + (count > 2 ? Math.sin((Math.PI * i) / (count - 1)) * drop * 0.6 : 0));
        return (
          <g key={i}>
            <line x1={px} y1={y} x2={px} y2={y + len} stroke="#b07414" strokeWidth="1" />
            <Pearl x={px} y={y + len + 3.5} r={3.8} ids={ids} />
          </g>
        );
      })}
    </g>
  );
}

function KundanPendant({ x, y, ids, pal, scale = 1 }: { x: number; y: number; ids: ArtIds; pal: Palette; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} filter={url(ids.shadow)}>
      <ellipse cx={0} cy={0} rx={30} ry={36} fill={url(ids.gold)} />
      <ellipse cx={0} cy={0} rx={24} ry={30} fill={url(ids.thread)} />
      <ellipse cx={0} cy={0} rx={24} ry={30} fill="none" stroke={pal.deeper} strokeOpacity="0.3" strokeWidth="6" strokeDasharray="1 2.2" />
      {arcPoints(0, 0, 20, 25, 0, Math.PI * 2, 11)
        .slice(0, -1)
        .map((p, i) => (
          <Stone key={i} x={p.x} y={p.y} r={4.6} ids={ids} />
        ))}
      <Stone x={0} y={0} r={12} ids={ids} gem="ruby" />
      <PearlFringe x={0} y={34} width={44} count={7} ids={ids} drop={10} />
    </g>
  );
}

function Paisley({ x, y, angle, ids, pal, s = 1 }: { x: number; y: number; angle: number; ids: ArtIds; pal: Palette; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <path d="M0 -16 C12 -16 16 -4 14 6 C11 16 -2 20 -9 13 C-15 7 -12 -2 -4 -2 C2 -2 3 -8 0 -16 Z" fill={url(ids.thread)} stroke={url(ids.gold)} strokeWidth="2.2" />
      <circle cx={4} cy={6} r={3.2} fill={url(ids.ruby)} stroke={url(ids.gold)} strokeWidth="1" />
      <path d="M-5 5 C-3 10 5 12 9 6" fill="none" stroke={pal.lighter} strokeOpacity="0.6" strokeWidth="1" />
    </g>
  );
}

function Tassel({ x, y, pal, ids, len = 34 }: { x: number; y: number; pal: Palette; ids: ArtIds; len?: number }) {
  return (
    <g>
      <path d={`M${x - 4} ${y} L${x + 4} ${y} L${x + 6} ${y + 9} L${x - 6} ${y + 9} Z`} fill={url(ids.gold)} />
      {Array.from({ length: 9 }, (_, i) => {
        const dx = (i - 4) * 1.4;
        return <path key={i} d={`M${x + dx * 0.6} ${y + 9} Q${x + dx} ${y + len * 0.6} ${x + dx * 1.8} ${y + len}`} stroke={i % 2 ? pal.base : pal.dark} strokeWidth="1.6" fill="none" />;
      })}
      <GoldBead x={x} y={y + 12} r={3} ids={ids} />
    </g>
  );
}

export function NecklaceArt({ ids, pal, variant, bust = true }: JewelProps & { bust?: boolean }) {
  const content = (() => {
    switch (variant % 6) {
      case 1: // Temple Lakshmi
        return (
          <g>
            <Strand cy={70} rx={112} ry={150} n={25} r={9} ids={ids} pal={pal} />
            <g filter={url(ids.shadow)}>
              <circle cx={200} cy={250} r={36} fill={url(ids.gold)} />
              <circle cx={200} cy={250} r={29} fill={url(ids.goldR)} />
              {arcPoints(200, 250, 32.5, 32.5, 0, Math.PI * 2, 19)
                .slice(0, -1)
                .map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={2} fill="#fff4c2" />
                ))}
              {/* stylised lotus & deity silhouette */}
              <path d="M200 232 C207 240 207 248 200 256 C193 248 193 240 200 232 Z" fill="#8a5714" opacity="0.7" />
              <path d="M186 262 C192 254 208 254 214 262 C208 266 192 266 186 262 Z" fill="#8a5714" opacity="0.6" />
              <circle cx={200} cy={228} r={5} fill={url(ids.ruby)} />
              <PearlFringe x={200} y={284} width={40} count={5} ids={ids} drop={9} />
            </g>
          </g>
        );
      case 2: // Haldi pearl choker
        return (
          <g>
            <Strand cy={46} rx={98} ry={92} n={22} r={8.5} ids={ids} pal={pal} pattern="silk" from={0.08} to={0.92} />
            <Strand cy={46} rx={98} ry={106} n={30} r={4.6} ids={ids} pal={pal} pattern="pearl" from={0.1} to={0.9} />
            <g filter={url(ids.shadow)}>
              {Array.from({ length: 8 }, (_, i) => (
                <ellipse key={i} cx={200} cy={155} rx={8} ry={17} fill={url(ids.bead)} transform={`rotate(${i * 45} 200 172)`} />
              ))}
              <Stone x={200} y={172} r={10} ids={ids} />
              <PearlFringe x={200} y={192} width={16} count={3} ids={ids} drop={10} />
            </g>
          </g>
        );
      case 3: // Sangeet tassels
        return (
          <g>
            <Strand cy={70} rx={112} ry={140} n={23} r={9} ids={ids} pal={pal} />
            {arcPoints(200, 70, 112, 140, Math.PI * 0.3, Math.PI * 0.7, 7).map((p, i) => (
              <Tassel key={i} x={p.x} y={p.y + 8} pal={pal} ids={ids} len={30 + (i === 3 ? 12 : Math.abs(3 - i) < 2 ? 6 : 0)} />
            ))}
          </g>
        );
      case 4: // Mango mala — layered paisleys
        return (
          <g>
            <Strand cy={70} rx={96} ry={112} n={27} r={5.5} ids={ids} pal={pal} pattern="pearl-silk" />
            {arcPoints(200, 70, 118, 158, Math.PI * 0.08, Math.PI * 0.92, 13).map((p, i, arr) => {
              const prev = arr[Math.max(0, i - 1)];
              const next = arr[Math.min(arr.length - 1, i + 1)];
              const angle = round((Math.atan2(next.y - prev.y, next.x - prev.x) * 180) / Math.PI);
              return <Paisley key={i} x={p.x} y={p.y} angle={angle + 90} ids={ids} pal={pal} s={i === 6 ? 1.5 : 1.05} />;
            })}
          </g>
        );
      case 5: // Minimal mala
        return (
          <g>
            <Strand cy={70} rx={106} ry={128} n={35} r={6} ids={ids} pal={pal} />
            <line x1={200} y1={204} x2={200} y2={214} stroke="#b07414" strokeWidth="1.5" />
            <SilkBead x={200} y={224} r={10} ids={ids} pal={pal} />
            <Pearl x={200} y={243} r={6} ids={ids} />
          </g>
        );
      default: // Rani haar — double strand with kundan pendant
        return (
          <g>
            <Strand cy={70} rx={96} ry={110} n={23} r={7.5} ids={ids} pal={pal} pattern="pearl-silk" />
            <Strand cy={70} rx={120} ry={168} n={29} r={9.5} ids={ids} pal={pal} />
            <KundanPendant x={200} y={262} ids={ids} pal={pal} />
          </g>
        );
    }
  })();

  return (
    <g>
      {bust && <Bust ids={ids} />}
      {content}
    </g>
  );
}

/* ═══════════════════════════ Earrings ═══════════════════════════ */

function Dome({ x, yt, w, h, ids, pal, fringe = true }: { x: number; yt: number; w: number; h: number; ids: ArtIds; pal: Palette; fringe?: boolean }) {
  const yb = yt + h;
  const d = `M${x - w / 2} ${yb} C${x - w / 2} ${yt + h * 0.25} ${x - w * 0.2} ${yt} ${x} ${yt} C${x + w * 0.2} ${yt} ${x + w / 2} ${yt + h * 0.25} ${x + w / 2} ${yb} Z`;
  const fringeCount = Math.max(5, Math.round(w / 11));
  return (
    <g>
      <GoldBead x={x} y={yb + 8} r={Math.max(4, w * 0.07)} ids={ids} />
      <path d={d} fill={url(ids.threadV)} />
      {Array.from({ length: 9 }, (_, i) => {
        const k = i - 4;
        return <path key={i} d={`M${x} ${yt + 1} Q${x + (k * w) / 11} ${yt + h * 0.35} ${x + (k * w) / 9} ${yb}`} fill="none" stroke={pal.deeper} strokeOpacity="0.28" strokeWidth="1.1" />;
      })}
      <path d={`M${x - w * 0.28} ${yt + h * 0.35} Q${x} ${yt + h * 0.22} ${x + w * 0.28} ${yt + h * 0.35}`} stroke="#fff" strokeOpacity="0.35" strokeWidth={w * 0.05} fill="none" strokeLinecap="round" />
      {arcPoints(x, yt + h * 0.62, w * 0.34, 4, Math.PI, Math.PI * 2, 7).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y + h * 0.05} r={Math.max(1.8, w * 0.03)} fill={url(ids.goldR)} />
      ))}
      <ellipse cx={x} cy={yb} rx={w / 2 + 2} ry={Math.max(3.5, w * 0.06)} fill={url(ids.gold)} />
      {fringe &&
        Array.from({ length: fringeCount }, (_, i) => {
          const px = x - w / 2 + (w * i) / (fringeCount - 1);
          return (
            <g key={i}>
              <line x1={px} y1={yb + 2} x2={px} y2={yb + 11} stroke="#b07414" strokeWidth="1" />
              <Pearl x={px} y={yb + 14} r={Math.max(2.8, w * 0.045)} ids={ids} />
            </g>
          );
        })}
    </g>
  );
}

function Hook({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} C${x} ${y - 16} ${x + 14} ${y - 20} ${x + 16} ${y - 8}`} fill="none" stroke="#b9975b" strokeWidth="2" strokeLinecap="round" />;
}

function Earring({ x, ids, pal, variant }: { x: number } & JewelProps) {
  switch (variant % 6) {
    case 1: // Chandbali
      return (
        <g filter={url(ids.shadow)}>
          <Hook x={x} y={70} />
          <Stone x={x} y={82} r={11} ids={ids} gem="emerald" />
          <GoldBead x={x} y={100} r={4} ids={ids} />
          <path d={`M${x - 58} 150 A58 58 0 0 0 ${x + 58} 150 L${x + 32} 150 A32 32 0 0 1 ${x - 32} 150 Z`} fill={url(ids.thread)} stroke={url(ids.gold)} strokeWidth="3.5" />
          <path d={`M${x - 58} 150 L${x - 32} 150 M${x + 32} 150 L${x + 58} 150`} stroke={url(ids.gold)} strokeWidth="3.5" />
          <path d={`M${x - 20} 150 Q${x} 104 ${x + 20} 150`} fill={url(ids.gold)} opacity="0.95" />
          <Stone x={x} y={138} r={7} ids={ids} gem="ruby" />
          {arcPoints(x, 150, 45, 45, 0.15, Math.PI - 0.15, 7).map((p, i) => (
            <Stone key={i} x={p.x} y={p.y} r={5.5} ids={ids} gem={i % 2 ? 'ruby' : 'kundan'} />
          ))}
          {arcPoints(x, 150, 62, 62, 0.1, Math.PI - 0.1, 13).map((p, i) => (
            <Pearl key={`p${i}`} x={p.x} y={p.y + 5} r={4} ids={ids} />
          ))}
        </g>
      );
    case 2: // Mini jhumka
      return (
        <g filter={url(ids.shadow)}>
          <Hook x={x} y={120} />
          <Stone x={x} y={132} r={10} ids={ids} />
          <GoldBead x={x} y={148} r={3.5} ids={ids} />
          <Dome x={x} yt={154} w={62} h={46} ids={ids} pal={pal} />
        </g>
      );
    case 3: // Layered tier
      return (
        <g filter={url(ids.shadow)}>
          <Hook x={x} y={58} />
          <Stone x={x} y={70} r={12} ids={ids} gem="ruby" />
          <GoldBead x={x} y={88} r={4} ids={ids} />
          <Dome x={x} yt={94} w={56} h={40} ids={ids} pal={pal} fringe={false} />
          <GoldBead x={x} y={152} r={4.5} ids={ids} />
          <Dome x={x} yt={158} w={96} h={66} ids={ids} pal={pal} />
        </g>
      );
    case 4: // Pearl drop stud
      return (
        <g filter={url(ids.shadow)}>
          <Hook x={x} y={120} />
          <circle cx={x} cy={160} r={38} fill={url(ids.gold)} />
          <circle cx={x} cy={160} r={32} fill={url(ids.thread)} />
          <circle cx={x} cy={160} r={24} fill="none" stroke={pal.deeper} strokeOpacity="0.3" strokeWidth="16" strokeDasharray="1 2.4" />
          {arcPoints(x, 160, 27, 27, 0, Math.PI * 2, 13)
            .slice(0, -1)
            .map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={2.2} fill={url(ids.goldR)} />
            ))}
          <Stone x={x} y={160} r={12} ids={ids} />
          <line x1={x} y1={198} x2={x} y2={212} stroke="#b07414" strokeWidth="1.5" />
          <GoldBead x={x} y={214} r={4} ids={ids} />
          <Pearl x={x} y={232} r={13} ids={ids} />
        </g>
      );
    case 5: // Haldi flower top
      return (
        <g filter={url(ids.shadow)}>
          <Hook x={x} y={68} />
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx={x} cy={80} rx={7} ry={15} fill={url(ids.bead)} transform={`rotate(${i * 45} ${x} 95)`} />
          ))}
          <Stone x={x} y={95} r={9} ids={ids} />
          <GoldBead x={x} y={120} r={4} ids={ids} />
          <Dome x={x} yt={126} w={84} h={60} ids={ids} pal={pal} />
        </g>
      );
    default: // Grand jhumka
      return (
        <g filter={url(ids.shadow)}>
          <Hook x={x} y={58} />
          <circle cx={x} cy={80} r={22} fill={url(ids.gold)} />
          <circle cx={x} cy={80} r={17} fill={url(ids.thread)} />
          {arcPoints(x, 80, 20, 20, 0, Math.PI * 2, 13)
            .slice(0, -1)
            .map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={2.3} fill={url(ids.pearl)} />
            ))}
          <Stone x={x} y={80} r={10} ids={ids} gem="ruby" />
          <GoldBead x={x} y={108} r={5} ids={ids} />
          <Dome x={x} yt={116} w={112} h={82} ids={ids} pal={pal} />
        </g>
      );
  }
}

export function EarringArt({ ids, pal, variant }: JewelProps) {
  return (
    <g>
      <Earring x={128} ids={ids} pal={pal} variant={variant} />
      <Earring x={272} ids={ids} pal={pal} variant={variant} />
    </g>
  );
}

/* ═══════════════════════════ Forehead pendants ═══════════════════════════ */

function Chain({ x1, y1, x2, y2, ids, pal }: { x1: number; y1: number; x2: number; y2: number; ids: ArtIds; pal: Palette }) {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 11));
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b07414" strokeWidth="1.4" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        return i % 3 === 1 ? <SilkBead key={i} x={px} y={py} r={4.2} ids={ids} pal={pal} /> : <GoldBead key={i} x={px} y={py} r={2.6} ids={ids} />;
      })}
    </g>
  );
}

export function TikkaArt({ ids, pal, variant }: JewelProps) {
  switch (variant % 5) {
    case 1: // Teardrop
      return (
        <g>
          <Chain x1={200} y1={-5} x2={200} y2={150} ids={ids} pal={pal} />
          <g filter={url(ids.shadow)}>
            <path d="M200 150 C236 196 246 226 236 250 C226 276 174 276 164 250 C154 226 164 196 200 150 Z" fill={url(ids.gold)} />
            <path d="M200 164 C228 202 234 226 227 245 C219 266 181 266 173 245 C166 226 172 202 200 164 Z" fill={url(ids.thread)} />
            <path d="M200 164 C228 202 234 226 227 245 C219 266 181 266 173 245 C166 226 172 202 200 164 Z" fill="none" stroke={pal.deeper} strokeOpacity="0.3" strokeWidth="10" strokeDasharray="1 2.4" />
            <Stone x={200} y={230} r={14} ids={ids} gem="ruby" />
            {[
              [200, 192],
              [184, 250],
              [216, 250],
            ].map(([sx, sy], i) => (
              <Stone key={i} x={sx} y={sy} r={5} ids={ids} />
            ))}
            <PearlFringe x={200} y={272} width={46} count={5} ids={ids} drop={12} />
            <Pearl x={200} y={300} r={9} ids={ids} />
          </g>
        </g>
      );
    case 2: // Sun motif
      return (
        <g>
          <Chain x1={200} y1={-5} x2={200} y2={140} ids={ids} pal={pal} />
          <g filter={url(ids.shadow)}>
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M200 146 L208 176 L200 186 L192 176 Z" fill={i % 2 ? url(ids.gold) : url(ids.bead)} transform={`rotate(${i * 22.5} 200 200)`} />
            ))}
            <circle cx={200} cy={200} r={30} fill={url(ids.gold)} />
            <circle cx={200} cy={200} r={24} fill={url(ids.thread)} />
            <Stone x={200} y={200} r={13} ids={ids} gem="emerald" />
            <PearlFringe x={200} y={252} width={36} count={5} ids={ids} drop={10} />
          </g>
        </g>
      );
    case 3: // Passa (side fan)
      return (
        <g>
          <Chain x1={90} y1={-5} x2={150} y2={130} ids={ids} pal={pal} />
          <Chain x1={40} y1={30} x2={150} y2={130} ids={ids} pal={pal} />
          <g filter={url(ids.shadow)}>
            {[0, 1, 2].map((row) => (
              <g key={row}>
                <path d={`M${230 - (80 - row * 20)} 140 A${80 - row * 20} ${80 - row * 20} 0 0 0 ${230 + (80 - row * 20)} 140`} fill={row === 0 ? url(ids.thread) : row === 1 ? url(ids.gold) : url(ids.bead)} stroke={url(ids.gold)} strokeWidth="2.5" />
                {row === 0 &&
                  arcPoints(230, 140, 70, 70, 0.12, Math.PI - 0.12, 9).map((p, i) => <Stone key={i} x={p.x} y={p.y} r={5} ids={ids} gem={i % 2 ? 'ruby' : 'kundan'} />)}
              </g>
            ))}
            <rect x={146} y={132} width={168} height={10} rx={5} fill={url(ids.gold)} />
            <Stone x={150} y={137} r={9} ids={ids} gem="ruby" />
            <Stone x={230} y={172} r={11} ids={ids} />
            {arcPoints(230, 140, 84, 84, 0.1, Math.PI - 0.1, 11).map((p, i) => (
              <g key={`f${i}`}>
                <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 12} stroke="#b07414" strokeWidth="1" />
                <Pearl x={p.x} y={p.y + 15} r={3.8} ids={ids} />
              </g>
            ))}
          </g>
        </g>
      );
    case 4: // Petite
      return (
        <g>
          <Chain x1={200} y1={-5} x2={200} y2={170} ids={ids} pal={pal} />
          <g filter={url(ids.shadow)}>
            <circle cx={200} cy={196} r={26} fill={url(ids.gold)} />
            <circle cx={200} cy={196} r={20} fill={url(ids.thread)} />
            <circle cx={200} cy={196} r={14} fill="none" stroke={pal.deeper} strokeOpacity="0.3" strokeWidth="12" strokeDasharray="1 2.2" />
            <Stone x={200} y={196} r={8} ids={ids} />
            <line x1={200} y1={222} x2={200} y2={232} stroke="#b07414" strokeWidth="1.2" />
            <Pearl x={200} y={242} r={9} ids={ids} />
          </g>
        </g>
      );
    default: // Round kundan
      return (
        <g>
          <Chain x1={200} y1={-5} x2={200} y2={132} ids={ids} pal={pal} />
          <g filter={url(ids.shadow)}>
            <circle cx={200} cy={190} r={52} fill={url(ids.gold)} />
            <circle cx={200} cy={190} r={45} fill={url(ids.thread)} />
            <circle cx={200} cy={190} r={36} fill="none" stroke={pal.deeper} strokeOpacity="0.3" strokeWidth="18" strokeDasharray="1 2.4" />
            <circle cx={200} cy={190} r={26} fill={url(ids.gold)} />
            {arcPoints(200, 190, 36, 36, 0, Math.PI * 2, 11)
              .slice(0, -1)
              .map((p, i) => (
                <Stone key={i} x={p.x} y={p.y} r={5.5} ids={ids} gem={i % 2 ? 'ruby' : 'kundan'} />
              ))}
            <Stone x={200} y={190} r={17} ids={ids} gem="emerald" />
            <PearlFringe x={200} y={240} width={70} count={9} ids={ids} drop={14} />
          </g>
        </g>
      );
  }
}

