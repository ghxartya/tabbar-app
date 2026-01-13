'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { Tab } from '@/types/tab'

import SortableTab from './SortableTab'

interface DropdownProps {
  overflowTabs: Tab[]
  isOpen: boolean
  onClose: () => void
  isActive: (id: string) => boolean
  onClick: (tab: Tab) => void
  onPin: (tab: Tab) => void
  onWidth: (id: string, width: number) => void
}

export default function Dropdown({
  overflowTabs,
  isOpen,
  onClose,
  isActive,
  onClick,
  onPin,
  onWidth
}: DropdownProps) {
  if (!isOpen) return null

  return (
    <div className='border-frame fixed top-[calc(4rem+var(--header))] right-0 z-10 border-2 bg-white shadow-md'>
      <SortableContext
        id='overflow'
        items={overflowTabs.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {overflowTabs.map(tab => (
          <SortableTab
            key={tab.id}
            tab={tab}
            isActive={isActive(tab.id)}
            onClick={() => {
              onClick(tab)
              onClose()
            }}
            onPin={() => onPin(tab)}
            onWidth={onWidth}
          />
        ))}
      </SortableContext>
    </div>
  )
}
