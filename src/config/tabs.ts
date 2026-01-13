import type { Tab } from '@/types/tab'

export const initialTabs: Tab[] = [
  {
    id: '1',
    icon: '📊',
    title: 'Dashboard',
    slug: '/dashboard',
    pinned: false
  },
  { id: '2', icon: '🏦', title: 'Banking', slug: '/banking', pinned: false },
  {
    id: '3',
    icon: '📞',
    title: 'Telefonie',
    slug: '/telephonie',
    pinned: false
  },
  {
    id: '4',
    icon: '💰',
    title: 'Accounting',
    slug: '/accounting',
    pinned: false
  },
  { id: '5', icon: '🛒', title: 'Verkauf', slug: '/verkauf', pinned: false },
  {
    id: '6',
    icon: '📈',
    title: 'Statistik',
    slug: '/statistik',
    pinned: false
  },
  {
    id: '7',
    icon: '📮',
    title: 'Post Office',
    slug: '/post-office',
    pinned: false
  },
  {
    id: '8',
    icon: '🛠️',
    title: 'Administration',
    slug: '/administration',
    pinned: false
  },
  { id: '9', icon: '❓', title: 'Help', slug: '/help', pinned: false },
  {
    id: '10',
    icon: '📦',
    title: 'Warenbestand',
    slug: '/warenbestand',
    pinned: false
  },
  {
    id: '11',
    icon: '📋',
    title: 'Auswahllisten',
    slug: '/auswahllisten',
    pinned: false
  },
  { id: '12', icon: '🛍️', title: 'Einkauf', slug: '/einkauf', pinned: false },
  { id: '13', icon: '🧾', title: 'Rechnung', slug: '/rechnung', pinned: false }
]

export const tabMap: Record<string, { title: string; icon: string }> =
  initialTabs.reduce(
    (acc, t) => {
      const key = t.slug === '/' ? '' : t.slug.slice(1)
      acc[key] = { title: t.title, icon: t.icon }
      return acc
    },
    {} as Record<string, { title: string; icon: string }>
  )
