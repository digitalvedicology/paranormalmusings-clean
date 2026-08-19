import SiteForm from '@/components/SiteForm'
import { readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Site details' }

export default async function SettingsPage() {
  const doc = await readDoc()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-[30px] leading-tight text-ink">Site details</h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">
          The name, byline and contact details that appear on every page.
        </p>
      </header>

      <SiteForm site={doc.site} siteUrl={process.env.SITE_URL ?? 'http://localhost:3000'} />
    </div>
  )
}
