import type { PlacedOrder } from './types';

const KEY = 'debu-last-order';

export function saveLastOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable — confirmation page falls back gracefully */
  }
}

export function readLastOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}

export function localOrderNumber() {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `DEBU-${stamp}-W${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
