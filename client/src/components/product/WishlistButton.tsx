'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlist';
import { useUi } from '@/store/ui';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

export function WishlistButton({ slug, name, className, withLabel }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const mounted = useMounted();
  const active = useWishlist((s) => s.slugs.includes(slug)) && mounted;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUi((s) => s.toast);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(slug);
        toast({
          title: added ? 'Saved to wishlist' : 'Removed from wishlist',
          description: name,
          tone: added ? 'success' : 'info',
          action: added ? { label: 'View wishlist', href: '/wishlist' } : undefined,
        });
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        'flex items-center justify-center gap-2 rounded-full transition',
        withLabel ? 'h-11 border border-gold-300 px-5 text-sm font-medium text-maroon-800 hover:bg-rani-50' : 'size-10 bg-white/90 shadow-soft backdrop-blur hover:bg-white',
        className,
      )}
    >
      <Heart className={cn('size-5 transition', active ? 'scale-110 fill-rani-600 text-rani-600' : 'text-maroon-800')} />
      {withLabel && (active ? 'Wishlisted' : 'Add to Wishlist')}
    </motion.button>
  );
}
