import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy and data handling practices for Paranormal Musings',
}

export default function PrivacyPage() {
  return (
    <article className="wrap py-12 lg:py-16 max-w-4xl mx-auto prose prose-invert">
      <h1 className="text-4xl font-display mb-8">Privacy Policy</h1>
      <p className="text-base text-body leading-relaxed mb-6">Last updated: August 31, 2026</p>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Overview</h2>
        <p>Paranormal Musings (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Information We Collect</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Contact Form Submissions</h3>
        <p>When you submit the "Write to Us" contact form, we collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your message</li>
        </ul>
        <p>This information is used solely to respond to your inquiry and is not shared with third parties.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
        <p>When you visit our site, we may automatically collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>IP address and browser type (via web server logs)</li>
          <li>Pages visited and time spent on each page</li>
          <li>Referrer information</li>
          <li>Search queries and queries used (if applicable)</li>
        </ul>
        <p>This data is used for analytics and site improvement purposes only.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Data Storage and Security</h2>
        <p>Contact form submissions are stored in two locations:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Primary:</strong> Transactional email via Resend</li>
          <li><strong>Backup:</strong> Payload CMS database</li>
        </ul>
        <p>We use industry-standard encryption (HTTPS) to protect your data in transit. Access to stored data is restricted to authorized personnel only.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To respond to your contact form submissions</li>
          <li>To improve our website and services</li>
          <li>To analyze site performance and user behavior</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p>We will never:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Sell your personal information</li>
          <li>Share your email with third parties for marketing</li>
          <li>Use your data for purposes other than stated here</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Third-Party Services</h2>
        <p>Our website uses the following third-party services:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Cloudflare Turnstile:</strong> Spam protection on the contact form</li>
          <li><strong>Resend:</strong> Transactional email delivery</li>
          <li><strong>Payload CMS:</strong> Content management and data storage</li>
        </ul>
        <p>Each service has its own privacy policy. We encourage you to review their policies as they govern their use of your data.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Cookies</h2>
        <p>Our website does not use cookies for tracking or analytics. See our <Link href="/cookies" className="text-gold-500 hover:text-gold-400 underline">Cookies Policy</Link> for details.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have rights regarding your personal data:</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">GDPR (EU Residents)</h3>
        <p className="mb-4">If you are in the EU, you have the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion (right to be forgotten)</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">India's DPDP Act (2023)</h3>
        <p className="mb-4">If you are in India, you have rights to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Know what personal data is collected and how it is used</li>
          <li>Correct, delete, or restrict your data</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <p className="mt-4">To exercise any of these rights, email: <a href="mailto:support@vedicology.com" className="text-gold-500 hover:text-gold-400 underline">support@vedicology.com</a></p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Data Retention</h2>
        <p>We retain contact form submissions indefinitely to maintain records, unless you request deletion. You may request deletion of your data at any time by emailing the address above.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Children's Privacy</h2>
        <p>Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Contact Us</h2>
        <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
        <p className="mt-4">
          <strong>Email:</strong> <a href="mailto:support@vedicology.com" className="text-gold-500 hover:text-gold-400 underline">support@vedicology.com</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. The date at the top of this page indicates when it was last revised. Your continued use of our site following any changes constitutes your acceptance of the updated policy.</p>
      </section>
    </article>
  )
}
