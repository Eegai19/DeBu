import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'gold' | 'maroon' | 'outline' | 'ghost' | 'light' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const base =
  'shine group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.97]';

const variants: Record<Variant, string> = {
  gold: 'bg-gold-sheen text-maroon-950 shadow-glow hover:-translate-y-0.5 hover:bg-[position:100%_center] hover:shadow-[0_12px_40px_-10px_rgb(212_150_26/0.8)]',
  maroon: 'bg-maroon-800 text-ivory-50 shadow-card hover:-translate-y-0.5 hover:bg-maroon-700',
  outline: 'border border-gold-400 bg-transparent text-maroon-800 hover:border-gold-500 hover:bg-gold-50',
  ghost: 'text-maroon-800 hover:bg-maroon-50',
  light: 'border border-gold-300/60 bg-white/10 text-ivory-50 backdrop-blur hover:border-gold-300 hover:bg-white/20',
  whatsapp: 'bg-[#25D366] text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#1ebe5b]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm sm:text-base',
  lg: 'h-13 px-8 text-base sm:h-14 sm:text-lg',
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({ variant = 'gold', size = 'md', className }: Omit<Common, 'children'>) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, ...props }: Common & ComponentProps<'button'>) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, href, external, ...props }: Common & ComponentProps<'a'> & { href: string; external?: boolean }) {
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={buttonClasses({ variant, size, className })}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    );
  }
  return <Link href={href} className={buttonClasses({ variant, size, className })} {...props} />;
}
