import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { isConfigured, isSignedIn } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isSignedIn()) redirect('/')

  const { next } = await searchParams
  // Only ever bounce back to a path on this origin.
  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <p className="label text-gold-600">Paranormal Musings</p>
          <h1 className="mt-2 font-display text-[30px] leading-tight text-ink">Admin</h1>
          <p className="mt-2 text-[13.5px] text-muted">Sign in to edit the site&rsquo;s pages and posts.</p>
        </div>

        <div className="card p-6">
          {isConfigured() ? (
            <LoginForm next={destination} />
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] text-amber-900">
              <p className="font-semibold">No password is set.</p>
              <p className="mt-1 leading-relaxed">
                Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env.local</code>,
                set <code className="font-mono">ADMIN_PASSWORD</code>, and restart the server. Until then the admin
                stays locked.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
