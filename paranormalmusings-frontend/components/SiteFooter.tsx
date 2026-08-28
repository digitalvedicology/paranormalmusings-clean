import Link from 'next/link'
import SubscribeForm from './SubscribeForm'
import { getContent } from '@/lib/content'

const socials = [
  {
    label: 'Instagram',
    path: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17" cy="7" r="1" fill="currentColor" />
      </>
    ),
    size: 'w-[17px] h-[17px]',
  },
  {
    label: 'LinkedIn',
    path: (
      <path
        fill="currentColor"
        d="M4.5 8.8h3v10.7h-3V8.8Zm1.5-4.6a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM10 8.8h2.9v1.5h.04c.4-.76 1.4-1.56 2.9-1.56 3.1 0 3.66 2 3.66 4.7v6h-3v-5.3c0-1.27-.02-2.9-1.8-2.9-1.8 0-2.07 1.37-2.07 2.8v5.4h-3V8.8Z"
      />
    ),
    size: 'w-[17px] h-[17px]',
  },
  {
    label: 'X',
    path: (
      <path
        fill="currentColor"
        d="M17.5 3h3l-6.6 7.5L21.8 21h-6l-4.7-6-5.3 6H2.8l7-8L2.5 3h6.2l4.2 5.6L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z"
      />
    ),
    size: 'w-[15px] h-[15px]',
  },
  {
    label: 'YouTube',
    path: (
      <path
        fill="currentColor"
        d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z"
      />
    ),
    size: 'w-[18px] h-[18px]',
  },
]

export default async function SiteFooter() {
  const content = await getContent()
  return (
    <footer id="contact" className="bg-night-900 text-white scroll-mt-24">
      <div className="wrap pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1.2fr_1fr] gap-10 lg:gap-12">
          {/* Brand + contact */}
          <div>
            <img
              src="/images/paranormalmusings-logo.png"
              alt={content.site.name}
              className="h-11 w-auto brightness-0 invert"
            />

            <p className="mt-5 text-[14px] leading-[1.75] text-white/55 max-w-sm">
              Paranormal explorations and perspectives on &ldquo;life after death&rdquo; from Indian (Eastern) and
              Western viewpoints — including encounters with inhuman energies and the paranormal energy spectrum.
            </p>

            <ul className="mt-6 space-y-3 text-[13.5px] text-white/60">
              <li className="flex gap-3 items-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-gold-300" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3.5 7 8.5 5.5L20.5 7" />
                </svg>
                <a href={content.site.email.href} className="hover:text-white transition">
                  {content.site.email.label}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="grid place-items-center w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/15 transition"
                >
                  <svg viewBox="0 0 24 24" className={social.size}>
                    {social.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="label text-white/40">Blog Categories</p>
            <ul className="mt-5 space-y-3 text-[14px] text-white/65">
              {content.categoryOrder.map((key) => {
                const category = content.categoryMeta(key)
                return (
                  <li key={key}>
                    <Link href={category.href} className="hover:text-white transition">
                      {category.title} <span className="text-white/30">({category.count})</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <p className="label text-white/40 mt-9">Explore</p>
            <ul className="mt-5 space-y-3 text-[14px] text-white/65">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular posts */}
          <div>
            <p className="label text-white/40">Popular Posts</p>
            <ul className="mt-5 space-y-3.5 text-[14px] leading-snug text-white/65">
              {content.footerPopular.map((post) => (
                <li key={post.slug}>
                  <Link href={content.postHref(post)} className="hover:text-white transition">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="label text-white/40">Notes from the field</p>
            <p className="mt-5 text-[14px] leading-[1.75] text-white/55">
              New investigations, case notes and perspectives on life after death — once a week, and nothing else.
            </p>

            <SubscribeForm variant="inline" />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/40">
          <p>
            © {new Date().getFullYear()} {content.site.name} · {content.site.author}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/70 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white/70 transition">
              Terms
            </a>
            <a href="#" className="hover:text-white/70 transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
