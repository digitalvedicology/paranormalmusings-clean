import type { Metadata } from 'next'
import CategoryRoute from '@/components/CategoryRoute'
import { getContent } from '@/lib/content'

const KEY = 'cases'

export async function generateMetadata(): Promise<Metadata> {
  const meta = (await getContent()).categoryMeta(KEY)
  return { title: meta.title, description: meta.lede }
}

export default function Page() {
  return <CategoryRoute category={KEY} />
}
