import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface SEOData {
  url: string
  seoTitle?: string
  metaDescription?: string
  keyword?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
}

// Parse CSV file
function parseCSV(filePath: string): SEOData[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter((line) => line.trim())

  // Skip header and empty lines
  const headerIndex = lines.findIndex((line) => line.includes('URL,SEO Title'))
  if (headerIndex === -1) {
    throw new Error('Invalid CSV format: could not find header')
  }

  const seoDataMap: SEOData[] = []

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('PAGES') || line.startsWith('CATEGORY') || line.startsWith('BLOG')) {
      continue
    }

    // Parse CSV line carefully handling quoted fields
    const parsed = parseCSVLine(line)
    if (parsed && parsed.url) {
      seoDataMap.push({
        url: parsed.url,
        seoTitle: parsed.seoTitle,
        metaDescription: parsed.metaDescription,
        keyword: parsed.keyword,
        ogTitle: parsed.ogTitle,
        ogDescription: parsed.ogDescription,
        ogImage: parsed.ogImage,
        canonical: parsed.canonical,
      })
    }
  }

  return seoDataMap
}

// Parse a single CSV line
function parseCSVLine(line: string) {
  const parts: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current.trim())

  // Remove surrounding quotes if present
  const cleanParts = parts.map((p) => (p.startsWith('"') && p.endsWith('"') ? p.slice(1, -1) : p))

  // Handle MISSING values
  return {
    url: cleanParts[0],
    seoTitle: cleanParts[1] && cleanParts[1] !== 'MISSING' ? cleanParts[1] : undefined,
    metaDescription: cleanParts[2] && cleanParts[2] !== 'MISSING' ? cleanParts[2] : undefined,
    keyword: cleanParts[3] && cleanParts[3] !== 'MISSING' ? cleanParts[3] : undefined,
    ogTitle: cleanParts[4] && cleanParts[4] !== 'MISSING' ? cleanParts[4] : undefined,
    ogDescription: cleanParts[5] && cleanParts[5] !== 'MISSING' ? cleanParts[5] : undefined,
    ogImage: cleanParts[6] && cleanParts[6] !== 'MISSING' ? cleanParts[6] : undefined,
    canonical: cleanParts[7] && cleanParts[7] !== 'MISSING' ? cleanParts[7] : undefined,
  }
}

// Extract slug from URL
function extractSlug(url: string): string | null {
  const match = url.match(/https:\/\/paranormalmusings\.com\/([^\/]+)\//)
  if (match && match[1]) {
    return match[1]
  }
  // Handle blog post URLs like /category/slug/
  const blogMatch = url.match(/\/([^\/]+)\/([^\/]+)\/$/)
  if (blogMatch && blogMatch[2]) {
    return blogMatch[2]
  }
  return null
}

// Extract category key from URL or href
function extractCategoryKey(url: string): string | null {
  // Map category URLs to keys
  const categoryMap: Record<string, string> = {
    '/category/case-studies/': 'cases',
    '/category/paranormal-eastern-views/': 'eastern',
    '/category/paranormal-investigation/': 'investigation',
    '/category/paranormal-western-views/': 'western',
    '/eastern-views': 'eastern',
    '/western-views': 'western',
    '/investigation': 'investigation',
    '/case-studies': 'cases',
  }

  for (const [urlPattern, key] of Object.entries(categoryMap)) {
    if (url.includes(urlPattern)) {
      return key
    }
  }
  return null
}

// Main import function
async function importSEOData(csvPath: string, contentPath: string) {
  console.log('📖 Reading CSV file...')
  const seoData = parseCSV(csvPath)
  console.log(`✓ Found ${seoData.length} SEO records`)

  console.log('📦 Reading content.json...')
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
  console.log(`✓ Found ${content.posts.length} posts and ${content.categories.length} categories`)

  let postsUpdated = 0
  let postsNotFound = 0
  let categoriesUpdated = 0
  let categoriesNotFound = 0

  const slugToSEO = new Map<string, SEOData>()
  const categoryKeyToSEO = new Map<string, SEOData>()

  for (const seo of seoData) {
    const slug = extractSlug(seo.url)
    if (slug) {
      slugToSEO.set(slug, seo)
    }

    const categoryKey = extractCategoryKey(seo.url)
    if (categoryKey) {
      categoryKeyToSEO.set(categoryKey, seo)
    }
  }

  // Update posts with SEO data
  for (const post of content.posts) {
    const seoEntry = slugToSEO.get(post.slug)
    if (seoEntry) {
      post.seo = {
        metaTitle: seoEntry.seoTitle,
        metaDescription: seoEntry.metaDescription,
        keyword: seoEntry.keyword,
        ogTitle: seoEntry.ogTitle,
        ogDescription: seoEntry.ogDescription,
        ogImage: seoEntry.ogImage,
        canonical: seoEntry.canonical,
      }
      postsUpdated++
    } else {
      postsNotFound++
    }
  }

  // Update categories with SEO data
  for (const category of content.categories) {
    const seoEntry = categoryKeyToSEO.get(category.key)
    if (seoEntry) {
      category.seo = {
        metaTitle: seoEntry.seoTitle,
        metaDescription: seoEntry.metaDescription,
        keyword: seoEntry.keyword,
        ogTitle: seoEntry.ogTitle,
        ogDescription: seoEntry.ogDescription,
        ogImage: seoEntry.ogImage,
        canonical: seoEntry.canonical,
      }
      categoriesUpdated++
    } else {
      categoriesNotFound++
    }
  }

  // Write updated content back
  console.log('💾 Writing updated content.json...')
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2))

  console.log(`\n✅ Import complete!`)
  console.log(`   Posts updated: ${postsUpdated}`)
  console.log(`   Posts not found: ${postsNotFound}`)
  console.log(`   Categories updated: ${categoriesUpdated}`)
  console.log(`   Categories not found: ${categoriesNotFound}`)
}

// Run the import
const csvPath = path.join(__dirname, '../..', 'paranormalmusings-seo-data.csv')
const contentPath = path.join(__dirname, '../data/content.json')

if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found at ${csvPath}`)
  process.exit(1)
}

if (!fs.existsSync(contentPath)) {
  console.error(`❌ Content file not found at ${contentPath}`)
  process.exit(1)
}

importSEOData(csvPath, contentPath).catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
