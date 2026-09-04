# paranormalmusings-api

**Nothing lives here. The API is part of the admin app.**

The content API is served by `paranormalmusings-admin` as Next.js route handlers
under `app/api/`, rather than as a separate service. One app owns both the
editing screens and the endpoints they call, so there is a single deployment, a
single set of types, and no second server to keep in step.

| You want | Look in |
| --- | --- |
| The endpoints | `paranormalmusings-admin/app/api/` |
| The data store | `paranormalmusings-admin/lib/store.ts` |
| The types the API speaks | `paranormalmusings-admin/lib/types.ts` |
| The content itself | `paranormalmusings-admin/data/content.json` |
| How it all fits together | `paranormalmusings-admin/README.md` |

This folder is kept only so the path is not mistaken for something missing. It
can be deleted.
