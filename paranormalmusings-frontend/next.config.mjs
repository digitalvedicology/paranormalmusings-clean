/**
 * Where uploaded pictures are allowed to come from.
 *
 * They are served either by this app under `/media/…` — the default, and a same
 * origin path the optimiser never has to be told about — or straight off the
 * admin, which is the fallback for hosts that will not let the two apps share a
 * folder (see DEPLOYING.md). Only the second needs listing, and it is read back
 * out of ADMIN_API_URL so moving the admin to another hostname does not quietly
 * turn every photograph on the site into a 400.
 */
function adminPattern() {
  try {
    const url = new URL(process.env.ADMIN_API_URL ?? '')
    const protocol = url.protocol.replace(':', '')
    if (protocol !== 'http' && protocol !== 'https') return null
    return { protocol, hostname: url.hostname, ...(url.port ? { port: url.port } : {}) }
  } catch {
    // Unset or malformed. The deployed hostname below still covers the live site.
    return null
  }
}

const remotePatterns = [
  // The placeholder service, standing in until a post has its own artwork.
  { protocol: 'https', hostname: 'picsum.photos' },
  // The deployed admin, which is what the stored URLs point at today.
  { protocol: 'https', hostname: 'admin.paranormalmusings.com' },
]

const fromEnv = adminPattern()
if (fromEnv && !remotePatterns.some((p) => p.hostname === fromEnv.hostname)) remotePatterns.push(fromEnv)

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  /**
   * Security headers for all responses.
   * Protects against XSS, clickjacking, MIME type sniffing, and other attacks.
   *
   * Staging environment: Also adds noindex headers (defense in depth with basic auth).
   */
  async headers() {
    const isStaging = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'

    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' https://challenges.cloudflare.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "media-src 'self' https:",
          "connect-src 'self' https: wss:",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join('; '),
      },
    ]

    // Add noindex headers for staging (defense in depth with basic auth)
    if (isStaging) {
      securityHeaders.push(
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        },
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        }
      )
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  images: {
    // AVIF first, WebP behind it: the browser takes whichever it can read and
    // both are a fraction of the source. Anything that can read neither still
    // gets the original.
    formats: ['image/avif', 'image/webp'],
    // The committed artwork is 1672px across, so widths above that only make the
    // optimiser encode variants nothing can use. Trimmed from Next's defaults
    // for the same reason — every extra width is another AVIF encode.
    deviceSizes: [640, 828, 1080, 1400, 1920],
    // The fixed-width pictures: cards, thumbnails, avatars.
    imageSizes: [24, 48, 64, 96, 128, 200, 256, 384, 512],
    // Both sources are immutable — a new upload gets a new name, and the
    // committed artwork only changes on a deploy, which clears this anyway.
    minimumCacheTTL: 31536000,
    remotePatterns,
  },
  redirects: async () => {
    const { default: redirectsList } = await import('./lib/redirects.js')
    return redirectsList
  },
}

export default nextConfig
