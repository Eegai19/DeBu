import { cn } from '@/lib/utils';
import { OrnamentDivider } from '@/components/art/decor';
import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow,
  title,
  script,
  description,
  align = 'center',
  tone = 'light',
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  script?: string;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <Reveal className={cn('mb-10 sm:mb-14', align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && (
        <p className={cn('font-accent text-xs font-semibold tracking-[0.35em] uppercase', dark ? 'text-gold-300' : 'text-gold-600')}>{eyebrow}</p>
      )}
      {script && <p className={cn('mt-2 font-script text-3xl sm:text-4xl', dark ? 'text-rani-300' : 'text-rani-600')}>{script}</p>}
      <h2 className={cn('mt-1 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl', dark ? 'text-ivory-50' : 'text-maroon-900')}>{title}</h2>
      <OrnamentDivider className={cn('mt-5 h-5 w-48', align === 'center' && 'mx-auto')} color={dark ? '#f5cd50' : '#d4961a'} />
      {description && (
        <p className={cn('mt-5 text-base leading-relaxed sm:text-lg', dark ? 'text-ivory-100/80' : 'text-maroon-900/70')}>{description}</p>
      )}
    </Reveal>
  );
}
