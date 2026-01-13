import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { tabMap } from '@/config/tabs'

interface TabPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params
}: TabPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params)
  const { title = 'Not Found' } = tabMap[slug] || {}
  return { title }
}

export async function generateStaticParams() {
  return Object.keys(tabMap).map(slug => ({ slug }))
}

export default async function TabPage({ params }: TabPageProps) {
  const { slug } = await Promise.resolve(params)
  if (!(slug in tabMap)) notFound()

  const { title } = tabMap[slug]

  return (
    <div className='left-sidebar top-header relative z-1 w-[calc(100%-var(--sidebar))] p-6'>
      <h1 className='text-xl font-bold'>{title}</h1>
      <p>Content for {title}</p>
    </div>
  )
}
