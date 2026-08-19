import { notFound } from 'next/navigation'
import CategoryHub from './CategoryHub'
import CategoryPage from './CategoryPage'
import { getContent, type Category } from '@/lib/content'

/**
 * One entry point for every category route.
 *
 * Which of the two layouts a section uses is a field on the category now, so
 * switching Eastern Views from the plain archive to the curated hub is a toggle
 * in the admin rather than an edit to its page file. Unpublishing a section
 * takes its route down with it.
 */
export default async function CategoryRoute({ category }: { category: Category }) {
  const content = await getContent()
  const meta = content.categoryMeta(category)

  if (!meta.published) notFound()

  return meta.layout === 'hub' ? <CategoryHub category={category} /> : <CategoryPage category={category} />
}
