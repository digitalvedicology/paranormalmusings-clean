# Hero photography

`hero-1.webp` … `hero-4.webp` cover the drawn backdrops in the hero slider. The
paths are listed in `components/hero/heroSlides.tsx`; change one there if you
rename a file. Until a slide has a photograph it falls back to its own
hand-drawn SVG atmosphere, so the hero never depends on a file that may not be
there.

Landscape, roughly 1600–2400px across. The `.moody` grade in `app/globals.css`
is applied on top, so supply the plain original — no need to pre-tint anything.

## Save photographs as WebP, not PNG

Everything committed here is WebP, and it matters more than it sounds: the same
artwork was 1.8MB each as PNG and is 60–100KB as WebP, with nothing visible
lost. PNG is a lossless format meant for flat graphics and screenshots — used
for a photograph it stores every sensor-level speck of noise at full fidelity.

To convert one (sharp is already a dependency):

```bash
node -e "require('sharp')('in.png').webp({quality:82,effort:6}).toFile('out.webp')"
```

The logo stays PNG because it is small and flat, which is what PNG is good at.

## Everything else in here

The admin uploads into this folder — article artwork, section banners, the
author portrait, related-site pictures. They are referenced as `/images/<file>`
and served by this app, so the pictures keep working whether or not the admin is
running.

You can also drop files in by hand; they show up in the admin's media library
next time it is opened.

## They are never served as-is

Every picture on the site goes through `next/image`, which resizes it to the
widths the page actually asks for and re-encodes it to AVIF or WebP for whatever
the reader's browser can read. So the file here is the master copy; nobody ever
downloads it. That is also why an upload arriving as a large PNG is survivable —
it is only the master that is oversized — but converting it still saves the
server the work and the repository the weight.
