'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Sections stay server-rendered; this mounts once and lifts every `.reveal`
 * block into view as it scrolls in. It lives in the layout, so it re-observes
 * on each navigation — otherwise a new page's blocks would stay hidden.
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
