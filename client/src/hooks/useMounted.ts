'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** True only after hydration — use to guard UI that reads localStorage-backed stores. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
