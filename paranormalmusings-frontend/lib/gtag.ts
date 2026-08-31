/**
 * Google Analytics 4 tracking
 * Initialize gtag and track page views, events, and user interactions
 */

// Your GA4 Measurement ID - set this via environment variable
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * Initialize Google Analytics on the client
 */
export function initGA() {
  if (!GA_ID || typeof window === 'undefined') return

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', GA_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  })
  ;(window as any).gtag = gtag
}

/**
 * Track a custom event
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !GA_ID) return

  const gtag = (window as any).gtag
  if (!gtag) return

  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

/**
 * Track page view (called automatically, but can be used for SPAs)
 */
export function trackPageView(path: string, title: string) {
  if (typeof window === 'undefined' || !GA_ID) return

  const gtag = (window as any).gtag
  if (!gtag) return

  gtag('config', GA_ID, {
    page_path: path,
    page_title: title,
  })
}
