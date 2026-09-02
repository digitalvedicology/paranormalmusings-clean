import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import SubscribeForm from './SubscribeForm'

export default async function SiteFooter() {
  const content = await getContent()
  return (
    <footer id="contact" className="bg-night-900 text-white scroll-mt-24">

      {/* Footer content */}
      <div className="wrap pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1.2fr_1fr] gap-10 lg:gap-12">
          {/* Brand + contact */}
          <div>
            <Image
              src="/images/paranormalmusings-logo.png"
              alt={`${content.site.name} logo featuring mystical third eye symbol`}
              width={310}
              height={124}
              className="h-11 w-auto brightness-0 invert"
            />

            <p className="mt-5 text-[14px] leading-[1.75] text-white/55 max-w-sm">
              Paranormal explorations and perspectives on &ldquo;life after death&rdquo; from Indian (Eastern) and
              Western viewpoints — including encounters with inhuman energies and the paranormal energy spectrum.
            </p>
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
            <p className="label text-white/40">Newsletter</p>
            <SubscribeForm variant="inline" />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/40">
          <p>
            © {new Date().getFullYear()} {content.site.name} · {content.site.author}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white/70 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white/70 transition">
              Cookies
            </Link>
            <Link href="/legal" className="hover:text-white/70 transition">
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
