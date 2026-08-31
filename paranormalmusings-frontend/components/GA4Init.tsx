'use client'

import { useEffect } from 'react'

/**
 * Initialize Google Analytics 4 on the client
 * This component loads the gtag script and initializes tracking
 */
export default function GA4Init() {
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID

    if (!gaId) {
      console.warn('GA4: NEXT_PUBLIC_GA_ID not configured')
      return
    }

    // Load gtag script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    // Initialize gtag
    interface WindowWithDataLayer extends Window {
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
    }
    const windowWithDataLayer = window as WindowWithDataLayer
    windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || []
    function gtag(...args: unknown[]) {
      windowWithDataLayer.dataLayer?.push(args)
    }
    windowWithDataLayer.gtag = gtag

    gtag('js', new Date())
    gtag('config', gaId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    })
  }, [])

  return null
}
