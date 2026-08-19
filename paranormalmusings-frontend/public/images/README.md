# Hero photography

Drop files here named `hero-1.jpg` … `hero-4.jpg` and they cover the drawn
backdrops in the hero slider automatically. Until then each slide falls back to
its own hand-drawn SVG atmosphere (see `components/hero/heroSlides.tsx`), so the
hero never depends on a photograph that may not be there.

Landscape, roughly 2400×1400 or larger. The `.moody` grade in
`app/globals.css` is applied on top, so supply the plain original — no need to
pre-tint anything.

## Everything else in here

The admin uploads into this folder — article artwork, section banners, the
author portrait, related-site pictures. They are referenced as `/images/<file>`
and served by this app, so the pictures keep working whether or not the admin is
running.

You can also drop files in by hand; they show up in the admin's media library
next time it is opened.
