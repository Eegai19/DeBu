'use client';

import { create } from 'zustand';

export type ToastTone = 'success' | 'info' | 'error';
export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; href: string };
}

interface UiState {
  searchOpen: boolean;
  cartOpen: boolean;
  menuOpen: boolean;
  toasts: Toast[];
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  toast: (t: Omit<Toast, 'id' | 'tone'> & { tone?: ToastTone }) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useUi = create<UiState>()((set, get) => ({
  searchOpen: false,
  cartOpen: false,
  menuOpen: false,
  toasts: [],
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toast: (t) => {
    const id = nextId++;
    set({ toasts: [...get().toasts.slice(-2), { tone: 'success', ...t, id }] });
    setTimeout(() => get().dismiss(id), 4200);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
