# Paranormal Musings — Admin

The editing surface for the public site, and the API the site reads from. One
Next.js app does both: the screens under `app/(admin)/`, the endpoints under
`app/api/`.

## Running it

```bash
npm install
cp .env.example .env.local     # then set ADMIN_PASSWORD
npm run dev                    # http://localhost:3001
```

The site runs alongside it on `http://localhost:3000` — start that too, or the
"View" links have nothing to open.

### Environment

| Variable | What it does |
| --- | --- |
| `ADMIN_PASSWORD` | The one password that unlocks the admin. **Unset means locked, not open.** |
| `ADMIN_API_KEY` | Lets scripts write without a browser session, via an `x-api-key` header. |
| `SITE_URL` | Where the public site is. Used by the "View" links and the refresh ping. |
| `REVALIDATE_SECRET` | Must match the same variable in the site's `.env.local`. |
| `UPLOAD_DIR` | Where uploaded pictures are written. Defaults to the site's own `public/images`. |
| `MEDIA_BASE_URL` | The URL prefix that directory is served under. Defaults to `/images`. |

## The screens

| Screen | What it controls |
| --- | --- |
| **Overview** | What is live, what is still a draft |
| **Pages** | The sections — Eastern Views, Western Views, Investigation, Case Studies. Their copy, address, layout, artwork, publish state and order |
| **Posts** | Every article: filing, metadata, and the body |
| **Home page** | Which section leads each band, and which posts fill the curated slots |
| **Navigation** | Header menu, topic chips, search suggestions, both footer lists |
| **Site details** | Name, byline, description, contact block |

### What "Pages" actually controls

A page's **layout** is a field, not a code path. `Curated hub` renders the
featured-piece-plus-grid index; `Archive list` renders the plain
reverse-chronological one. Switching a section between them is a dropdown — the
site picks the component from the data (`components/CategoryRoute.tsx` on the
site side).

**Unpublishing** a page removes it from the site completely: it drops out of the
menu, the footer and every listing, its posts stop being served, and its route
404s. That is enforced in `lib/published.ts` before anything is sent, so
unpublished content never reaches the browser at all.

## Where the content lives

Two backends, one interface. Everything above `lib/store.ts` — every route,
every screen — works the same either way.

**With `MONGODB_URI` set** the content lives in MongoDB: a record per post, a
record per section, and one record for everything else. Saving an article
writes that one record rather than rewriting all hundred and ten, so two edits
to different posts cannot overwrite each other.

**Without it** the content lives in `data/content.json`, written atomically
(temp file, then rename) so an interrupted save cannot corrupt it. That is what
makes a fresh clone runnable with nothing installed.

Either way, writes are serialised through one promise chain so two concurrent
requests cannot interleave a read-modify-write.

### Moving to MongoDB

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and
   copy its connection string
2. Allow the server to reach it — Atlas blocks every address until you add one
   under **Network Access**
3. Import what you have:

   ```bash
   MONGODB_URI="mongodb+srv://…" npm run migrate:mongo
   ```

4. Set `MONGODB_URI` on the admin and redeploy

The script refuses to overwrite a database that already holds content unless
given `--force`, and `data/content.json` stays as the seed for a fresh install.

## The API

Reads are open, because the public site has to render without a key. Writes need
either the session cookie or an `x-api-key` header.

| Method | Route | |
| --- | --- | --- |
| `GET` | `/api/content` | The published document — what the site reads |
| `GET` | `/api/content?preview=1` | The full document, drafts included · *auth* |
| `GET` `PUT` `POST` | `/api/categories` | List · reorder · create |
| `GET` `PATCH` `DELETE` | `/api/categories/[key]` | One page |
| `GET` `POST` | `/api/posts` | List (filterable by `category`, `status`, `q`) · create |
| `GET` `PATCH` `DELETE` | `/api/posts/[slug]` | One post |
| `GET` `PATCH` | `/api/home` | The home page's curated slots |
| `GET` `PATCH` | `/api/navigation` | Menu, topics, footer |
| `GET` `PATCH` | `/api/site` | Site details |
| `GET` `POST` | `/api/media` | The media library · upload an image |
| `DELETE` | `/api/media/[name]` | Remove an image, unless something still uses it |
| `POST` | `/api/auth/login` `/api/auth/logout` | |

`PATCH` is a merge: send only the fields you are changing. Failures come back as
`{ error, problems[] }` — `problems` is the per-field list the forms render.

### Nothing is left pointing at nothing

The store keeps references honest, so an edit cannot quietly break the site:

- **Renaming a post's slug** repoints every curated list that featured it, in the same write.
- **Deleting a post** clears it from the home bands, the footer and any hub.
- **Deleting a page** is refused while posts still live in it — the response names what to move first. Cascading would take articles down with it.
- **Moving a page's address** carries its menu link and topic chips along.
- **Unpublishing** anything empties the slots that referenced it, rather than rendering a broken card.

## Pictures

Every place the site shows a photograph is editable: a post, a section, each
related site in the footer, and the author portrait beside every byline.

The control does three things, because all three come up:

- **Upload** a file — it is written straight into the site's `public/images`
- **Choose existing** — the media library, so a picture can be reused
- **Paste a URL** — anything already hosted elsewhere

Uploads go to the *site's* folder rather than the admin's, so the site serves
its own pictures and keeps showing them whether or not the admin is running.
That is the same reasoning as the content fallback. Set `UPLOAD_DIR` if the two
apps are ever split across machines.

Each record also keeps a **placeholder seed**, used only while there is no real
photograph. Listings are therefore never full of blank grey boxes part-way
through gathering the photography — and clearing an image simply returns it to
its placeholder.

Accepted: JPEG, PNG, WebP, AVIF, GIF and SVG, up to 8MB. The stored extension
comes from the file's sniffed type rather than its name, and the name is
stripped to letters and digits, so an upload cannot name itself out of the
folder or arrive as `photo.jpg.html`. A file already in use cannot be deleted —
the response names what is using it.

## Articles are blocks, not HTML

A body is a list of `h2` / `h3` / `p` / `quote` / `list` blocks. That is what
lets the site own the typography: an `h2` opens a section and earns an anchor
link, `tone: 'note'` renders one as a set-apart advisory panel, a `list` gets the
design's own bullet rhythm. A rich-text box would hand back a blob of markup the
layout could not reason about, so the editor edits each block as what it is.

A post with an empty body still appears in listings, flagged "Coming soon", and
links to its section rather than to an empty article.

## Saving

Every successful write pings the site's `/api/revalidate`, which clears the
`content` cache tag — so an edit is live immediately rather than at the end of
the site's revalidation window. The ping is best-effort: if the site is down the
save has still succeeded, and the save bar says so instead of claiming a refresh
that did not happen.

## Auth

One shared password. The password itself is never stored in the cookie — signing
in mints an HMAC-signed token carrying only an expiry, so the cookie cannot be
forged without `ADMIN_PASSWORD` and cannot be replayed past its window.

The guard is `app/(admin)/layout.tsx`: an unauthenticated request is redirected
before any content is read off disk. If more than one person ever needs an
account, `lib/auth.ts` is the only file that has to change.
