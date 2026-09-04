import Link from 'next/link'
import NewPageForm from '@/components/NewPageForm'

export const metadata = { title: 'New page' }

export default function NewPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link href="/pages" className="text-[13px] font-semibold text-gold-600 hover:text-gold-700">
          ← Pages
        </Link>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-ink">Add a page</h1>
      </header>

      <NewPageForm />
    </div>
  )
}
