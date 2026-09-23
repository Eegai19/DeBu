'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { computeTotals, type CartTotals } from '@debu/shared';
import type { CartItem, NewCartItem } from '@/lib/types';

export const MAX_QTY = 50;

export function cartKey(i: Pick<CartItem, 'kind' | 'slug' | 'size' | 'color' | 'customColor' | 'notes'>) {
  return [i.kind, i.slug, i.size ?? '', i.color, i.customColor?.trim().toLowerCase() ?? '', i.notes?.trim() ?? ''].join('|');
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  add: (item: NewCartItem) => void;
  addMany: (items: NewCartItem[]) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (code: string | null) => void;
}

function merge(items: CartItem[], incoming: NewCartItem): CartItem[] {
  const key = cartKey(incoming);
  const qty = incoming.quantity ?? 1;
  const existing = items.find((i) => i.key === key);
  if (existing) {
    return items.map((i) => (i.key === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) } : i));
  }
  return [...items, { ...incoming, key, quantity: Math.min(MAX_QTY, qty) }];
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      add: (item) => set((s) => ({ items: merge(s.items, item) })),
      addMany: (list) => set((s) => ({ items: list.reduce(merge, s.items) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
        })),
      clear: () => set({ items: [], couponCode: null }),
      applyCoupon: (code) => set({ couponCode: code ? code.trim().toUpperCase() : null }),
    }),
    {
      name: 'debu-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function cartTotals(items: CartItem[], couponCode: string | null): CartTotals {
  return computeTotals(
    items.map((i) => ({
      kind: i.kind,
      productId: i.productId,
      name: i.name,
      size: i.size,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    })),
    couponCode,
  );
}

export const useCartCount = () => useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
