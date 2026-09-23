import { formatINR } from '@debu/shared';
import { cn } from '@/lib/utils';

export function Price({ price, compareAt, className, size = 'md' }: { price: number; compareAt?: number; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const off = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-display font-bold text-maroon-800', size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl')}>{formatINR(price)}</span>
      {off > 0 && (
        <>
          <span className={cn('text-maroon-900/40 line-through', size === 'lg' ? 'text-lg' : 'text-sm')}>{formatINR(compareAt!)}</span>
          <span className="rounded-full bg-leaf-500/10 px-2 py-0.5 text-xs font-semibold text-leaf-600">{off}% OFF</span>
        </>
      )}
    </div>
  );
}
