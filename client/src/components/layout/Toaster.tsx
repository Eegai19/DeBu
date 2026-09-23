'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useUi } from '@/store/ui';
import { cn } from '@/lib/utils';

const ICONS = { success: CheckCircle2, info: Info, error: XCircle };

export function Toaster() {
  const { toasts, dismiss } = useUi();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:right-4 sm:left-auto sm:items-end" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-maroon-900 p-4 text-ivory-50 shadow-2xl ring-1 ring-gold-400/40"
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', t.tone === 'error' ? 'text-rani-300' : 'text-gold-300')} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-ivory-100/75">{t.description}</p>}
                {t.action && (
                  <Link href={t.action.href} onClick={() => dismiss(t.id)} className="mt-2 inline-block text-sm font-semibold text-gold-300 underline-offset-4 hover:underline">
                    {t.action.label} →
                  </Link>
                )}
              </div>
              <button type="button" onClick={() => dismiss(t.id)} className="text-ivory-100/60 hover:text-white" aria-label="Dismiss">
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
