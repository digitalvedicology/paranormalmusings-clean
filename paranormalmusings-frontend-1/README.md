# Paranormal Musings

Next.js (App Router) build of the Paranormal Musings design — the blog of
Praveen Saanker, paranormal investigator.

The copy is not in this repo any more. It is edited in
[`../paranormalmusings-admin`](../paranormalmusings-admin) and fetched from its
API; this app renders whatever that returns.

## Running it

```bash
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
npm run build && npm start
```

Start the admin alongside it (`http://localhost:3001`) — without it the site
falls back to the bundled seed and every page still renders, but nothing you
edit will show up.

| Variable | What it does |
| --- | --- |
| `ADMIN_API_URL` | Where the admin's content API is |
| `CONTENT_REVALIDATE` | Seconds the fetched content is cached. Only a backstop — the admin pings the hook below after every save |
| `REVALIDATE_SECRET` | Must match the same variable in the admin's `.env.local` |

## Where the content comes from

Every page calls `getContent()` from `lib/content.ts` and reads what it needs off
the result:

```tsx
export default async function Something() {
  const content = await getContent()
  const meta = content.categoryMeta('eastern')
  …
}
```

One fetch per revalidation window, cached by Next under the `content` tag and
deduped across a render by React's `cache()` — so a page whose layout, hero and
six sections all ask for it still resolves it once. Pages stay static-fast while
remaining editable.

**If the admin is unreachable, `lib/seed/content.json` is served instead.** A CMS
being down should slow nobody's reading; the site serves what it last knew to be
true and logs a warning.

`app/api/revalidate/route.ts` is the hook the admin calls after each save. It
clears the `content` tag, which drops the cached document and every page built
from it — no path list to keep in step as sections are added or renamed.

### Client components

Four things run on the client — the header, the hero slider, the subscribe forms
and `ScrollReveal`. They cannot call `getContent()`, so the copy they need is
passed down as props from the server component above them. `photo()` is a pure
function and can be imported anywhere.

## Routes

| Route | Page |
| --- | --- |
| `/` | The full home page — hero slider and every section |
| `/about` | Bio, the four working principles, where to start reading |
| `/eastern-views` `/western-views` `/investigation` `/case-studies` | The four sections, each rendered by `components/CategoryRoute.tsx` |
| `/contact` | Contact form plus direct details |
| `/<category>/<slug>` | A written-up article |
| `/api/revalidate` | The admin's cache-clearing hook |

The four section routes are identical: they name their category key and hand off
to `CategoryRoute`, which picks the layout from the data — `hub` for the curated
index, `archive` for the plain reverse-chronological list — and 404s if the
section has been unpublished. **Which layout a section uses is a dropdown in the
admin, not a code change.**

Written-up articles are prerendered by `generateStaticParams`. `dynamicParams`
is `true` so a piece written after the last build still resolves; the route
checks the slug and the category segment itself, and an unknown URL 404s.

Every inner page opens with `components/PageHero.tsx`, which reuses the hero
slider's own drawn backdrops so a page reads as the same publication without
repeating the whole slider.

## Adding an article

In the admin: **Posts → Write a post**. Nothing to do here.

A body is a list of `h2` / `h3` / `p` / `quote` / `list` blocks rather than a
blob of HTML, which is what lets this app own the typography:

- `articleSections()` splits the flat list into the paragraphs before the first
  heading and the sections after it, giving each heading an anchor id
- a heading marked `tone: 'note'` renders as a set-apart advisory panel rather
  than running straight on

Posts without a body keep linking to their section page, flagged "Coming soon",
so nothing on the site ever links to an empty article.

`lib/articles/` and `advice()` in `lib/blocks.ts` are the original hand-authored
sources. Their content now lives in the admin, so those modules are no longer
imported by anything — they are kept only as the provenance of the seed and can
be deleted once you are happy.

The article page follows the standard blog anatomy — a main column beside a
sticky sidebar:

| Main column | Sidebar (`components/ArticleSidebar.tsx`) |
| --- | --- |
| Category chip, title, standfirst | About the author |
| Meta row: author, date, read time, comments | Email opt-in (the one dark card) |
| Featured image | Popular posts |
| Article body | Categories, with counts |
| Tags, author bio, comments + reply form | Topics |

The sidebar collapses below the article on narrow screens; above `lg` it sticks
under the header as the article scrolls.

## How it is put together

| Path | What lives there |
| --- | --- |
| `app/globals.css` | The design's own CSS — page shell (`.wrap`), photo grade (`.moody`), hero slider, reveal-on-scroll, hover behaviour |
| `tailwind.config.ts` | The two-colour palette (gold canopy, bark trunk) plus ink/paper neutrals, the display face, shadows |
| `lib/content.ts` | `getContent()` — the API client, its cache, the seed fallback, and every derived helper the pages read |
| `lib/content-types.ts` | The document's shape. A copy of `lib/types.ts` in the admin; change one, change the other |
| `lib/seed/content.json` | The bundled fallback, served when the admin cannot be reached |
| `components/hero/` | The full-screen slider and its four slides, each with a drawn SVG backdrop |
| `components/sections/` | One file per band of the page, in the order `app/page.tsx` composes them |

`FeatureBand` (lead story + side stack) and `CardBand` (three cards + compact
list) each take a `category` prop and show that category's six most recent
posts. `app/page.tsx` passes `content.home.featureCategory` and
`content.home.cardBandCategory`, so which section leads the home page is chosen
in the admin. A band whose section has been emptied renders nothing rather than
a heading over blank space.

Only four things run on the client — the header (sticky state, drawer, search
overlay), the hero slider, the subscribe forms, and `ScrollReveal`, which is a
single `IntersectionObserver` that lifts `.reveal` blocks into view. Every
section itself is a server component.

## Replacing the placeholders

- **Logo** — the tree-of-life mark is redrawn as SVG in `components/icons.tsx`.
  Once real artwork exists, swap the `Logo` body for an `<img src="/logo.png">`
  and drop the wordmark beside it, since the file already carries the lettering.
- **Hero photography** — see `public/images/README.md`.
- **Article and section artwork** — set in the admin, which uploads into
  `public/images`. Until a real picture is set, `artwork()` in `lib/content.ts`
  falls back to the picsum placeholder that record's seed generates, so no page
  is ever full of blank boxes.
- **The author portrait** — Site details in the admin. Falls back to a
  placeholder in the same way.
- **Newsletter** — `components/SubscribeForm.tsx` acknowledges in place; wire its
  `submit` to a list provider.

Images use plain `<img>` rather than `next/image`: the design's `.zoom-wrap`
scale transforms and the hero's `onError` fallback both work against the
wrapper `next/image` injects. `@next/next/no-img-element` is switched off in
`eslint.config.mjs` to match.

## The two section layouts

**`hub`** — `components/CategoryHub.tsx`, laid out as a blog index: one featured
piece across the top, "Recent blog posts" as a three-up card grid with numbered
pagination, then a dark call to action that butts against the footer so the two
read as one block.

**`archive`** — `components/CategoryPage.tsx`, the plain reverse-chronological
list: banner, lead story, grid, then the way across to the other sections.

Which one a section uses is its `layout` field, set in the admin. Each section
also carries three curation maps, all edited there:

| Field | What it holds |
| --- | --- |
| `hub.pillar` | Which piece is featured across the top |
| `hub.clusters` | Themed groups: title, blurb, and the slugs in each |
| `hub.questions` | The questions readers arrive with, each pointing at a guide |

Only `hub.pillar` is read by the current layout. The clusters and questions are
kept populated for when a richer hub is wanted again — rendering them is a
matter of adding the sections back, not re-authoring the content.

On the hub the visible heading is "Recent blog posts", so the page's real
subject is carried by an `sr-only` `h1`; otherwise the featured post's title
would read as the page's own.

`PostGrid` is the only client component here (it holds the current-page state;
the control shows first/last, the current page and its neighbours, with an
ellipsis across any gap). It takes flat `CardData` from `toCard()` rather than
the full post, so article bodies are never serialised into the browser payload.
Posts without a body appear in the grid flagged "Coming soon".
