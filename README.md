# Paranormal Musings

The blog of Praveen Saanker, paranormal investigator, and the admin that runs it.

| Folder | What it is | Port |
| --- | --- | --- |
| [`paranormalmusings-frontend`](paranormalmusings-frontend) | The public site | 3000 |
| [`paranormalmusings-admin`](paranormalmusings-admin) | The editing screens **and** the content API | 3001 |
| [`paranormalmusings-api`](paranormalmusings-api) | Empty — the API is part of the admin | — |

## Starting both

Two terminals:

```bash
cd paranormalmusings-admin
npm install
cp .env.example .env.local     # set ADMIN_PASSWORD
npm run dev                    # http://localhost:3001
```

```bash
cd paranormalmusings-frontend
npm install
cp .env.example .env.local
npm run dev                    # http://localhost:3000
```

Sign in at `http://localhost:3001` with whatever you set as `ADMIN_PASSWORD`.

`REVALIDATE_SECRET` has to be **the same string in both** `.env.local` files, or
edits will save but the site will take until its next revalidation to show them.

## How it fits together

```
  admin  ──────────────►  data/content.json      one document, the whole site
    │                            │
    │  GET /api/content          │
    ▼                            ▼
  site  ◄────────────────  the published view     drafts and unpublished
    ▲                                             sections stripped out
    │  POST /api/revalidate
    └─────────  admin pings after every save
```

The site fetches once per revalidation window and caches the result. After each
save the admin pings the site's revalidate hook, so an edit is live at once
rather than a minute later. **If the admin is down the site still renders** —
`lib/seed/content.json` is bundled as a fallback.

Drafts and unpublished sections are removed server-side, before the response
leaves the admin, so unfinished work never reaches a browser.

## What the admin controls

Everything the site renders except the design itself:

- **Pages** — the four sections. Their copy, address, banner artwork, publish
  state, order, and **which of the two layouts they use**: the curated hub or
  the plain archive. That last one is a dropdown, not a deploy.
- **Posts** — filing, cross-filing, metadata, and the body, written as blocks so
  the site keeps control of headings, quotes and lists.
- **Home page** — which section leads each band, and which posts fill the
  highlights, spotlight, investigation rows and latest-posts slots.
- **Navigation** — header menu, topic chips, search suggestions, footer lists.
- **Site details** — name, byline, description, contact block.

References are kept honest across all of it: renaming a post's slug repoints
everything that featured it, deleting one clears the slots it sat in, and
deleting a section is refused while posts still live there.

## Deploying

Both are ordinary Next.js apps. Two things to get right:

1. **`data/content.json` needs a persistent, writable disk.** On a serverless
   host the filesystem is ephemeral and every save is lost on the next cold
   start. Deploy the admin to something with a real disk (a VPS, a container
   with a volume, Railway, Render), or move the store to a database — that means
   rewriting `readDoc` and `writeDoc` in `paranormalmusings-admin/lib/store.ts`
   and nothing else.
2. **Change every value in both `.env.local` files.** The ones committed for
   local development are placeholders.

Back up the content by copying that one JSON file.
