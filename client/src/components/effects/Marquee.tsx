import { cn } from '@/lib/utils';
import { SparkleShape } from '@/components/art/decor';

export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn('relative flex overflow-hidden', className)}>
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 whitespace-nowrap motion-reduce:animate-none">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl italic sm:text-3xl">{w}</span>
            <SparkleShape size={16} color="#ebb42a" />
          </span>
        ))}
      </div>
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 whitespace-nowrap motion-reduce:animate-none" aria-hidden>
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl italic sm:text-3xl">{w}</span>
            <SparkleShape size={16} color="#ebb42a" />
          </span>
        ))}
      </div>
    </div>
  );
}
