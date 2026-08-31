import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Information about cookies and tracking on Paranormal Musings',
}

export default function CookiesPage() {
  return (
    <article className="wrap py-12 lg:py-16 max-w-4xl mx-auto prose prose-invert">
      <h1 className="text-4xl font-display mb-8">Cookies Policy</h1>
      <p className="text-base text-body leading-relaxed mb-6">Last updated: August 31, 2026</p>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Overview</h2>
        <p>Paranormal Musings does not use cookies for tracking, analytics, or personalization purposes. This policy explains our approach to cookies and similar tracking technologies.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device by websites you visit. They can be used for various purposes including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Remembering user preferences</li>
          <li>Tracking user behavior across sites</li>
          <li>Enabling personalized content</li>
          <li>Analytics and user profiling</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Our Cookie Policy</h2>
        <p className="font-semibold mb-4">Paranormal Musings does not set or use cookies.</p>
        <p>We do not use cookies for:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Tracking user behavior or analytics</li>
          <li>Advertising or personalized content</li>
          <li>Cross-site tracking</li>
          <li>User profiling or identification</li>
        </ul>
        <p className="mt-4">Our website functions without relying on cookies. You can visit Paranormal Musings with cookie storage disabled in your browser with no impact on functionality.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Analytics</h2>
        <p>We do not use traditional analytics platforms (Google Analytics, Mixpanel, etc.) that rely on cookies for tracking.</p>
        <p className="mt-4">We may use privacy-respecting analytics tools that:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Do not use cookies</li>
          <li>Do not track individual users</li>
          <li>Aggregate data only</li>
          <li>Respect Do Not Track preferences</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Third-Party Embeds</h2>
        <p>Some pages may contain embedded content from third-party services (e.g., form providers, email delivery services). These services may set their own cookies according to their policies. We recommend reviewing the privacy policies of services we integrate with.</p>
        <p className="mt-4">Current third-party integrations:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Cloudflare Turnstile:</strong> Spam protection (no cookies for core functionality)</li>
          <li><strong>Resend:</strong> Email delivery (no cookies)</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Browser Do Not Track</h2>
        <p>Paranormal Musings respects the Do Not Track (DNT) preference in your browser. Since we do not track users, DNT has no additional effect on our site, but we acknowledge and respect your privacy preference.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Your Privacy Controls</h2>
        <p>You can control cookies in your browser settings:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
          <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li><strong>Edge:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
        </ul>
        <p className="mt-4">You can also enable "Block all cookies" in your browser settings. Paranormal Musings will function normally with cookies blocked.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Similar Tracking Technologies</h2>
        <p>Beyond cookies, similar tracking technologies include:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Local storage (localStorage)</li>
          <li>Session storage (sessionStorage)</li>
          <li>Web beacons / pixels</li>
          <li>Fingerprinting</li>
        </ul>
        <p className="mt-4">Paranormal Musings does not use these technologies for tracking or analytics purposes.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Contact Form Data</h2>
        <p>When you submit the contact form, we collect your name, email, and message. This data is not stored in cookies — it is transmitted securely to our email service (Resend) and backup storage (Payload CMS). See our <a href="/privacy" className="text-gold-500 hover:text-gold-400 underline">Privacy Policy</a> for details.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Changes to This Policy</h2>
        <p>We may update this Cookies Policy if we change our practices. The date at the top of this page indicates the last revision. Continued use of our site constitutes acceptance of any changes.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Questions?</h2>
        <p>If you have questions about our cookies or privacy practices:</p>
        <p className="mt-4">
          <a href="mailto:support@vedicology.com" className="text-gold-500 hover:text-gold-400 underline">support@vedicology.com</a>
        </p>
        <p className="mt-4">Or use our <a href="/" className="text-gold-500 hover:text-gold-400 underline">contact form</a>.</p>
      </section>

      <section className="mb-10 bg-gold-500/10 border-l-4 border-gold-500 p-6">
        <h3 className="text-lg font-semibold mb-2">TL;DR</h3>
        <p>We don't use cookies, don't track you, and don't sell your data. Our site works fine with cookies disabled.</p>
      </section>
    </article>
  )
}
