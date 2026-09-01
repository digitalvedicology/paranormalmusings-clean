import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import ContactFormModal from './ContactFormModal'

export default async function SiteFooter() {
  const content = await getContent()
  return (
    <>
      {/* Share your stories section - appears on all pages */}
      <section className="wrap pb-14 lg:pb-20 scroll-mt-24">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-mist via-gold-50 to-gold-100 px-6 sm:px-10 lg:px-14 py-10 lg:py-12 reveal">
          <div className="grid lg:grid-cols-[1fr_1.05fr_auto] gap-8 lg:gap-10 items-center">
            <h2 className="font-display text-[28px] lg:text-[34px] leading-[1.15] text-ink">
              Share your
              <br className="hidden lg:block" /> paranormal stories.
            </h2>

            <div>
              <p className="text-[14.5px] leading-relaxed text-body/90 max-w-md">
                Have experiences to share? Questions about the paranormal? Get in touch — I&apos;d love to hear from you.
              </p>
              <div className="mt-5">
                <ContactFormModal />
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="w-[150px] h-[110px] rounded-2xl bg-paper shadow-float grid place-items-center rotate-[-6deg]">
                <svg viewBox="0 0 24 24" className="w-14 h-14 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

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

          {/* Newsletter - disabled until wired to real ESP */}
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
    </>
  )
}
