'use client'

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useHydratedStore } from '@/hooks/useHydratedStore'

import Dropdown from './Dropdown'
import SortableTab from './SortableTab'
import TabItem from './TabItem'

export default function TabBar() {
  const tabs = useHydratedStore(({ tabs }) => tabs)
  const setTabs = useHydratedStore(({ setTabs }) => setTabs)

  const activeTabId = useHydratedStore(({ activeTabId }) => activeTabId)
  const setActiveTabId = useHydratedStore(
    ({ setActiveTabId }) => setActiveTabId
  )

  const pinTab = useHydratedStore(({ pinTab }) => pinTab)
  const unpinTab = useHydratedStore(({ unpinTab }) => unpinTab)

  const [tabWidths, setTabWidths] = useState<{ [id: string]: number }>({})
  const [visibleCount, setVisibleCount] = useState(tabs.length)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    const active = tabs.find(t => t.slug === pathname)
    if (active) setActiveTabId(active.id)
    else router.push(tabs[0].slug)
  }, [pathname, tabs, setActiveTabId])

  const handleWidth = (id: string, width: number) =>
    setTabWidths(prev => ({ ...prev, [id]: width }))

  const [containerWidth, setContainerWidth] = useState(0)
  const [dropdownWidth, setDropdownWidth] = useState(40)

  const calculateVisible = () => {
    if (!containerRef.current) return
    setContainerWidth(containerRef.current.offsetWidth)

    if (dropdownRef.current)
      setDropdownWidth(dropdownRef.current.offsetWidth || 40)

    const fullTabs = [
      ...tabs.filter(t => t.pinned),
      ...tabs.filter(t => !t.pinned)
    ]
    let cumulative = 0
    let count = 0

    for (const tab of fullTabs) {
      const tabWidth = tabWidths[tab.id] || 100
      if (cumulative + tabWidth > containerWidth) break
      cumulative += tabWidth
      count++
    }

    if (count < fullTabs.length) {
      cumulative = 0
      count = 0

      for (const tab of fullTabs) {
        const tabWidth = tabWidths[tab.id] || 100
        if (cumulative + tabWidth > containerWidth - dropdownWidth) break
        cumulative += tabWidth
        count++
      }
    }

    setVisibleCount(count)
  }

  useEffect(() => {
    let rafId: number
    const handleResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => calculateVisible())
    }

    const observer = new ResizeObserver(calculateVisible)
    if (containerRef.current) observer.observe(containerRef.current)
    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [calculateVisible])

  const pinned = tabs.filter(t => t.pinned)
  const nonPinned = tabs.filter(t => !t.pinned)
  const fullTabs = [...pinned, ...nonPinned]
  const visibleTabs = fullTabs.slice(0, visibleCount)
  const overflowTabs = fullTabs.slice(visibleCount)
  const visibleNonPinned = visibleTabs.filter(t => !t.pinned)
  const overflowNonPinned = overflowTabs.filter(t => !t.pinned)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeContainer =
      active.data.current?.sortable.containerId || 'visible'
    const overContainer = over.data.current?.sortable.containerId || 'visible'

    const newVisibleNonPinned = [...visibleNonPinned]
    const newOverflowNonPinned = [...overflowNonPinned]

    const oldIndex =
      activeContainer === 'visible'
        ? newVisibleNonPinned.findIndex(t => t.id === active.id)
        : newOverflowNonPinned.findIndex(t => t.id === active.id)

    const newIndex =
      overContainer === 'visible'
        ? newVisibleNonPinned.findIndex(t => t.id === over.id)
        : newOverflowNonPinned.findIndex(t => t.id === over.id)

    const movingTab =
      activeContainer === 'visible'
        ? newVisibleNonPinned.splice(oldIndex, 1)[0]
        : newOverflowNonPinned.splice(oldIndex, 1)[0]

    if (overContainer === 'visible') {
      newVisibleNonPinned.splice(newIndex, 0, movingTab)
    } else {
      newOverflowNonPinned.splice(newIndex, 0, movingTab)
    }

    const newNonPinned = [...newVisibleNonPinned, ...newOverflowNonPinned]
    setTabs([...pinned, ...newNonPinned])
    calculateVisible()
  }

  const handleClick = (tab: { id: string; slug: string }) => {
    setActiveTabId(tab.id)
    router.replace(tab.slug)
    setIsDropdownOpen(false)
  }

  const handlePin = (tab: { id: string; pinned?: boolean }) => {
    if (tab.pinned) unpinTab(tab.id)
    else pinTab(tab.id)
    calculateVisible()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={containerRef}
        className='left-sidebar top-header relative flex h-16 w-[calc(100%-var(--sidebar))] overflow-hidden'
      >
        {pinned.map(tab => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onClick={() => handleClick(tab)}
            onPin={() => handlePin(tab)}
            onWidth={handleWidth}
          />
        ))}
        <SortableContext
          id='visible'
          items={visibleNonPinned.map(t => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          {visibleNonPinned.map(tab => (
            <SortableTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => handleClick(tab)}
              onPin={() => handlePin(tab)}
              onWidth={handleWidth}
            />
          ))}
        </SortableContext>
        {overflowTabs.length > 0 && (
          <div
            ref={dropdownRef}
            className='bg-accent absolute right-0 z-10 flex size-16 cursor-pointer items-center justify-center px-2 text-white'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ▼ {overflowTabs.length}
          </div>
        )}
        <Dropdown
          overflowTabs={overflowNonPinned}
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          isActive={(id: string) => id === activeTabId}
          onClick={handleClick}
          onPin={handlePin}
          onWidth={handleWidth}
        />
      </div>
    </DndContext>
  )
}
