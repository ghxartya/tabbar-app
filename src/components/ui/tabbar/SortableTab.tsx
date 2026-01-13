'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { Tab } from '@/types/tab'

import TabItem from './TabItem'

interface SortableTabProps {
  tab: Tab
  isActive: boolean
  onClick: () => void
  onPin: () => void
  onWidth: (id: string, width: number) => void
}

export default function SortableTab({
  tab,
  isActive,
  onClick,
  onPin,
  onWidth
}: SortableTabProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tab.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <TabItem
      ref={setNodeRef}
      style={style}
      tab={tab}
      isActive={isActive}
      onClick={onClick}
      onPin={onPin}
      onWidth={onWidth}
      {...attributes}
      {...listeners}
    />
  )
}
