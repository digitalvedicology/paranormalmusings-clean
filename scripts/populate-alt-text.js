#!/usr/bin/env node

/**
 * Bulk Alt Text Population Script
 * Updates all 12 images in Payload CMS media library with descriptions
 *
 * Usage: node populate-alt-text.js
 */

const API_URL = process.env.ADMIN_API_URL || 'http://localhost:3001'
const API_KEY = process.env.ADMIN_API_KEY || 'dev-api-key'

const altTextMap = {
  'hero-1.webp': 'Moonlit forest treeline at dusk under starry sky',
  'hero-2.webp': 'Lit doorway threshold glowing in darkness symbolizing passage between worlds',
  'hero-3.webp': 'Layered mountain ridges at sunset creating atmospheric spiritual landscape',
  'hero-4.webp': 'Night treeline silhouette with ethereal energy waves representing EVP phenomena',
  'eastern.webp': 'Hindu temple architecture representing Eastern spiritual perspectives',
  'western.webp': 'Western paranormal investigation concept imagery',
  'investigation.webp': 'Paranormal investigation equipment and techniques visualization',
  'cases.webp': 'Paranormal case study documentation and research records',
  'study.webp': 'Praveen Saanker paranormal investigator and author portrait',
  'about-header.webp': 'Study environment representing paranormal research and investigation practice',
  'paranormalmusings-logo.png': 'Paranormal Musings logo featuring mystical third eye symbol',
  'protection-from-spirits.png': 'Spiritual protection shield symbolizing defense against paranormal entities',
}

async function populateAltText() {
  console.log('🔍 Starting alt text population...\n')

  try {
    // Fetch all media
    console.log('📚 Fetching media library...')
    const mediaResponse = await fetch(`${API_URL}/api/media`, {
      headers: {
        'X-API-Key': API_KEY,
      },
    })

    if (!mediaResponse.ok) {
      throw new Error(`API error: ${mediaResponse.status} ${mediaResponse.statusText}`)
    }

    const { docs: mediaFiles } = await mediaResponse.json()
    console.log(`✅ Found ${mediaFiles.length} media files\n`)

    // Update each image with alt text
    let updated = 0
    let skipped = 0

    for (const media of mediaFiles) {
      const filename = media.filename
      const altText = altTextMap[filename]

      if (!altText) {
        console.log(`⏭️  Skipping: ${filename} (not in alt text map)`)
        skipped++
        continue
      }

      console.log(`📝 Updating: ${filename}`)
      console.log(`   → "${altText}"`)

      // Update media record with alt text
      const updateResponse = await fetch(`${API_URL}/api/media/${media.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({
          alt: altText,
        }),
      })

      if (!updateResponse.ok) {
        console.log(`   ❌ Failed: ${updateResponse.status}`)
        continue
      }

      console.log(`   ✅ Updated\n`)
      updated++
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 RESULTS')
    console.log('='.repeat(50))
    console.log(`✅ Updated: ${updated} images`)
    console.log(`⏭️  Skipped: ${skipped} images`)
    console.log(`📊 Total: ${updated + skipped} images processed`)
    console.log('='.repeat(50))

    if (updated === 12) {
      console.log('\n🎉 SUCCESS! All 12 images have alt text!\n')
      process.exit(0)
    } else {
      console.log(`\n⚠️  Expected 12 updates, got ${updated}. Check the output above.\n`)
      process.exit(1)
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Make sure Payload CMS is running: http://localhost:3001')
    console.error('2. Check that ADMIN_API_URL is set correctly')
    console.error('3. Verify media files exist in the library')
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  populateAltText()
}

module.exports = { populateAltText }
