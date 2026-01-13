'use client'

import { useSyncExternalStore } from 'react'

import { useTabStore } from '@/store'

/**
 * Safe selector hook for Zustand store that prevents hydration mismatches.
 * Uses useSyncExternalStore to provide consistent snapshots during SSR → hydration.
 *
 * Usage:
 * const tabs = useHydratedStore((state) => state.tabs);
 * const activeTabId = useHydratedStore((state) => state.activeTabId);
 */
export function useHydratedStore<T>(
  selector: (state: ReturnType<typeof useTabStore.getState>) => T
): T {
  // We get the raw store instance (not wrapped)
  const store = useTabStore

  return useSyncExternalStore(
    // Subscribe to store changes (Zustand provides this)
    store.subscribe,

    // getSnapshot – called on client during render & commit phases
    // After hydration completes, this will reflect the persisted state
    () => selector(store.getState()),

    // getServerSnapshot – only used during SSR and initial hydration
    // Must return a value that matches what the server rendered (initial state, no localStorage)
    () => selector(useTabStore.getInitialState?.() || store.getState())
    // Note: If your store doesn't expose getInitialState, fall back to store.getState()
    // (which is safe because persist hasn't run on server anyway)
  )
}
