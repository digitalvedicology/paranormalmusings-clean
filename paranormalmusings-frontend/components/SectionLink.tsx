import Link from 'next/link'
import { ArrowRight } from './icons'

/** The muted "see all" link with a trailing arrow that heads most sections. */
export default function SectionLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`link-arrow inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-ink transition ${className}`}
    >
      {children}
      <ArrowRight />
    </Link>
  )
}
