import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { isSignedIn } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * The guard for everything under this route group.
 *
 * Checking here rather than in middleware keeps the session logic in one file
 * that can use `node:crypto` — and because every child is a server component,
 * an unauthenticated request is redirected before any content is read off disk,
 * let alone rendered.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isSignedIn())) redirect('/login')

  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000'

  return (
    <div className="lg:grid lg:h-screen lg:grid-cols-[268px_1fr] lg:overflow-hidden">
      <div className="lg:h-screen">
        <Sidebar siteUrl={siteUrl} />
      </div>
      <main className="px-4 py-6 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-10 lg:py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  )
}
