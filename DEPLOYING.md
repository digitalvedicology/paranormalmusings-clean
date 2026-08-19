# Deploying to Hostinger

For `paranormalmusings.com` on a Hostinger Cloud plan, which runs Node.js apps
as "web apps". Two of them:

| Hostname | App | What it is |
| --- | --- | --- |
| `frontend.paranormalmusings.com` | `paranormalmusings-frontend` | The public site |
| `admin.paranormalmusings.com` | `paranormalmusings-admin` | The editing screens and the content API |

The admin is a separate hostname rather than a path on the main site because
they are two Node processes. It also keeps the editing surface off the public
domain entirely.

---

## Before you start: where the content lives

This is the part that bites if it is skipped.

A redeploy **replaces the whole app folder** with a fresh checkout. Anything the
running app wrote inside that folder is gone. Two things get written while the
site is in use:

- `data/content.json` — every edit you make in the admin
- uploaded photographs

So both must live **outside** either app folder, in a directory that redeploys
never touch. Pick one path on the account and point both apps at it:

```
/home/uXXXXXXXX/pm-data/          <- content.json is written here
/home/uXXXXXXXX/pm-data/media/    <- uploaded photographs
```

Find your real `uXXXXXXXX` in hPanel under **Files → File Manager** — it is the
folder your `domains/` directory sits in. Create `pm-data/media` there with the
File Manager's *New folder* button before deploying.

Nothing needs seeding by hand. On its first read the admin finds
`pm-data/content.json` missing, copies the version committed with the code into
it, and saves there from then on.

---

## 1. Create the subdomains

hPanel → **Domains → paranormalmusings.com → Subdomains**. Create both `frontend` and `admin`,
giving you `frontend.paranormalmusings.com` and `admin.paranormalmusings.com`. Leave the document root at whatever it
suggests; the web app takes it over.

DNS for a subdomain of a domain already on Hostinger propagates in minutes.

---

## 2. Deploy the site

hPanel → **Websites → Add Website → Node.js web app**, choose
`frontend.paranormalmusings.com`, and connect the GitHub repository.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Branch | `main` |
| Node version | 22 |
| Build command | `npm run build:frontend` |
| Output directory | `paranormalmusings-frontend/.next` |

**On the build command.** The repository holds both apps in subfolders. If the
deploy screen offers a *root directory* field, set it to
`paranormalmusings-frontend` and use the ordinary `npm run build` instead. If it
does not, the root `package.json` in this repo exists exactly for that case —
`build:frontend` installs and builds the right subfolder from the repository
root.

Environment variables:

```
ADMIN_API_URL      = https://admin.paranormalmusings.com
CONTENT_REVALIDATE = 60
REVALIDATE_SECRET  = <a long random string>
MEDIA_DIR          = /home/uXXXXXXXX/pm-data/media
```

Generate the secret with `openssl rand -hex 32`, or any password generator. It
is not a password you ever type — it only has to match between the two apps.

---

## 3. Deploy the admin

Same flow, on `admin.paranormalmusings.com`.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Branch | `main` |
| Node version | 22 |
| Build command | `npm run build:admin` |
| Output directory | `paranormalmusings-admin/.next` |

Environment variables:

```
ADMIN_PASSWORD    = <the password you will sign in with>
ADMIN_API_KEY     = <a long random string>
SITE_URL          = https://frontend.paranormalmusings.com
REVALIDATE_SECRET = <the same string as the site's>
DATA_DIR          = /home/uXXXXXXXX/pm-data
UPLOAD_DIR        = /home/uXXXXXXXX/pm-data/media
MEDIA_BASE_URL    = /media
```

`REVALIDATE_SECRET` must be **identical** in both apps. If it is not, saves still
work but the site waits up to `CONTENT_REVALIDATE` seconds to show them.

**Do not reuse the local development password.** `ADMIN_PASSWORD` is the only
thing between the internet and your content, and it also signs the session
cookie.

---

## 4. Check it

1. `https://frontend.paranormalmusings.com` — the site, with all its content.
2. `https://admin.paranormalmusings.com` — the sign-in screen.
3. Sign in, change something small, save. The save bar should say
   **"Saved and the site has been refreshed."** Anything else means the two
   apps cannot reach each other — check `SITE_URL` and `REVALIDATE_SECRET`.
4. Reload the site. The change should be there.
5. Upload a photograph on a post, save, and confirm it appears on the site. That
   proves `UPLOAD_DIR` and `MEDIA_DIR` are pointing at the same folder.

Then the real test: **redeploy the admin and confirm your change is still
there.** If it reverted, `DATA_DIR` is not set or is pointing inside the app
folder.

---

## Living with it

**Content is no longer in git once you are live.** The committed
`data/content.json` seeds a fresh deployment and nothing more. The real content
is `pm-data/content.json` on the server. Editing that file in the repo will not
change the live site, and pulling will not overwrite the live content.

**Back up by downloading `pm-data/`** — the JSON and the media folder together
are the whole site's content. hPanel's File Manager can zip and download it.

**Pushing to `main` redeploys.** Code changes go out; content stays put.

---

## If Hostinger will not build from a subfolder

Some panels only build from the repository root and offer no root-directory
field. If `build:frontend` does not work either, split the repo:

```bash
# from a clone of the monorepo
git subtree split --prefix=paranormalmusings-frontend -b frontend-only
git subtree split --prefix=paranormalmusings-admin    -b admin-only
```

Push each branch to its own repository and point one web app at each. History is
preserved. It is more repositories to keep in step — `lib/types.ts` in the admin
and `lib/content-types.ts` in the site have to stay identical — so only do this
if the single-repo route genuinely fails.

---

## Cost of getting it wrong

| Symptom | Cause |
| --- | --- |
| Content reverts after a deploy | `DATA_DIR` unset, or inside the app folder |
| Uploaded photos vanish after a deploy | `UPLOAD_DIR` unset, or inside the app folder |
| Photos upload but show as broken on the site | `MEDIA_DIR` does not match `UPLOAD_DIR` |
| Saves work but the site is stale for a minute | `REVALIDATE_SECRET` differs between the apps |
| Site shows old content and never updates | `ADMIN_API_URL` wrong — the site is serving its bundled fallback |
| Admin will not accept any password | `ADMIN_PASSWORD` not set; an unset password locks the admin rather than opening it |
