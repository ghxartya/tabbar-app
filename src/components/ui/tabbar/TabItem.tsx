'use client'

import clsx from 'clsx'
import { type HTMLAttributes, forwardRef, useLayoutEffect } from 'react'

import type { Tab } from '@/types/tab'

interface TabItemProps extends HTMLAttributes<HTMLDivElement> {
  tab: Tab
  isActive: boolean
  onClick: () => void
  onPin: () => void
  onWidth: (id: string, width: number) => void
}

const TabItem = forwardRef<HTMLDivElement, TabItemProps>(
  ({ tab, isActive, onClick, onPin, onWidth, ...rest }, ref) => {
    useLayoutEffect(() => {
      if (ref && typeof ref !== 'function' && ref.current) {
        onWidth(tab.id, ref.current.offsetWidth)
      }
    }, [tab.id, onWidth, ref])

    return (
      <div
        ref={ref}
        className={clsx(
          'text-secondary flex cursor-pointer items-center px-4 py-2',
          { 'text-primary! border-t-accent border-t-2': isActive }
        )}
        onClick={onClick}
        {...rest}
      >
        <span className='mr-2'>{tab.icon}</span>
        <span>{tab.title}</span>
        <button
          onClick={e => {
            e.stopPropagation()
            onPin()
          }}
          className='ml-2'
        >
          {tab.pinned ? '📌' : '🔗'}
        </button>
      </div>
    )
  }
)

TabItem.displayName = 'TabItem'

export default TabItem
