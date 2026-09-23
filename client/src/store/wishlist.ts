'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const exists = get().slugs.includes(slug);
        set({ slugs: exists ? get().slugs.filter((s) => s !== slug) : [...get().slugs, slug] });
        return !exists;
      },
      remove: (slug) => set({ slugs: get().slugs.filter((s) => s !== slug) }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: 'debu-wishlist', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
