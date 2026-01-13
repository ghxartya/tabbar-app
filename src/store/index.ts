import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { initialTabs } from '@/config/tabs'

import type { Tab } from '@/types/tab'

type State = {
  tabs: Tab[]
  activeTabId: string
}

type Actions = {
  setTabs: (tabs: Tab[]) => void
  setActiveTabId: (id: string) => void
  pinTab: (id: string) => void
  unpinTab: (id: string) => void
}

export const useTabStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      tabs: initialTabs,
      activeTabId: '1',
      setTabs: tabs => set({ tabs }),
      setActiveTabId: id => set({ activeTabId: id }),
      pinTab: id => {
        const tabs = get().tabs
        const tabIndex = tabs.findIndex(t => t.id === id)
        if (tabIndex !== -1 && !tabs[tabIndex].pinned) {
          const tab = { ...tabs[tabIndex], pinned: true }
          const newTabs = [...tabs]
          newTabs.splice(tabIndex, 1)
          const pinned = newTabs.filter(t => t.pinned)
          const nonPinned = newTabs.filter(t => !t.pinned)
          set({ tabs: [...pinned, tab, ...nonPinned] })
        }
      },
      unpinTab: id => {
        const tabs = get().tabs
        const tabIndex = tabs.findIndex(t => t.id === id)
        if (tabIndex !== -1 && tabs[tabIndex].pinned) {
          const tab = { ...tabs[tabIndex], pinned: false }
          const newTabs = [...tabs]
          newTabs.splice(tabIndex, 1)
          const pinned = newTabs.filter(t => t.pinned)
          const nonPinned = newTabs.filter(t => !t.pinned)
          set({ tabs: [...pinned, ...nonPinned, tab] })
        }
      }
    }),
    {
      name: 'tab-storage',
      partialize: state => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId
      })
    }
  )
)
