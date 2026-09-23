import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <Link href="/" className={cn('group flex items-center gap-2.5', className)} aria-label="DeBu home">
      <span className="relative flex size-11 items-center justify-center">
        <svg viewBox="0 0 48 48" className="absolute inset-0 size-full transition-transform duration-700 group-hover:rotate-90" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M24 2 C27 7 27 11 24 14 C21 11 21 7 24 2 Z" fill={i % 2 ? '#e84a8a' : '#ebb42a'} transform={`rotate(${i * 30} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="11" fill="#7a1030" stroke="#ebb42a" strokeWidth="1.5" />
        </svg>
        <span className="relative font-script text-xl leading-none text-gold-200">D</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-3xl font-bold tracking-wide', tone === 'dark' ? 'text-maroon-800' : 'text-gold-gradient')}>DeBu</span>
        <span className={cn('mt-0.5 hidden font-accent text-[9px] tracking-[0.25em] uppercase sm:block', tone === 'dark' ? 'text-gold-700' : 'text-gold-200/80')}>
          Handcrafted Elegance
        </span>
      </span>
    </Link>
  );
}
