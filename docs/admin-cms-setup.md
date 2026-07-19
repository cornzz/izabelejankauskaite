# Admin CMS — setup & runbook

The code for the passkey-protected admin CMS (per [admin-cms-plan.md](./admin-cms-plan.md)) is
implemented. The steps below are the ones that need a live Neon database, Vercel env vars, and a
real browser — they can't be done from the repo alone. Do them in order.

## 1. Provision the database

1. In the Vercel dashboard: **Storage → Neon** (free tier) and attach it to this project. It
   auto-injects `DATABASE_URL` (and friends).
2. Pull the env vars locally:
   ```
   vercel env pull .env.local
   ```
3. Add the remaining secrets to `.env.local` (see [.env.example](../.env.example) for the full list):
   ```
   SESSION_SECRET=$(openssl rand -base64 32)
   ISR_BYPASS_TOKEN=$(openssl rand -base64 32)
   RP_ID=localhost
   ORIGIN=http://localhost:5173
   RP_NAME=Izabelė Jankauskaitė
   ```

## 2. Create the tables & migrate the calendar

```
yarn db:push            # creates events / content / users / invites / credentials in Neon
yarn calendar:migrate   # inserts the 57 rows from src/calendar.yaml
```

(Re-run `yarn db:push` whenever the schema changes — e.g. it adds the `content` table that
backs the editable biography. No data migration is needed for the biography: the public page
shows the built-in default text until an admin first saves one under **Biography** in the panel.)

Expected: `Inserted 57 events.` The migration also reports that **5** program lines are kept
verbatim (composer=""): two `TBA`, the `Music from <b>Mozart</b>, …` prose line, and the two
`<i>…of April:</i>` date labels in the Kammerorchester Basel entry. That's correct — the round-trip
was verified to reproduce every entry's program string exactly.

Then start the dev server and confirm the public calendar at `/` renders identically to before:

```
yarn dev
```

`src/calendar.yaml` is now only a backup — it's no longer read at runtime (kept in git on purpose).

## 3. Bootstrap the first user

```
yarn invite:create --name "Izabelė"
```

This prints an invite URL (`http://localhost:5173/admin/invite/<token>`). Open it, click **Create
your passkey**, and you'll be registered + logged in and dropped at `/admin`. From there you can
invite more people and add more devices without the CLI.

- `yarn invite:create --user <userId>` mints an "add a device" invite for an existing user.

## 4. Deploy

Set every var from `.env.example` in the Vercel dashboard (Project → Settings → Environment
Variables), using the **production** values:

| Var                | Production value                        |
| ------------------ | --------------------------------------- |
| `DATABASE_URL`     | auto (Neon integration)                 |
| `SESSION_SECRET`   | the generated secret                    |
| `ISR_BYPASS_TOKEN` | the generated token                     |
| `RP_ID`            | `izabelejankauskaite.com` (bare domain) |
| `ORIGIN`           | `https://izabelejankauskaite.com`       |
| `RP_NAME`          | `Izabelė Jankauskaitė`                  |

**Passkeys are bound to `RP_ID`.** Register and log in on the same domain — Vercel preview deploys
have different domains, so run the full passkey flow on the **production** domain. Re-run
`yarn invite:create` against the production DB (with production `ORIGIN` in the env) to get a
production invite link, or generate one from the dashboard once logged in.

## Handy scripts

| Command                          | What it does                       |
| -------------------------------- | ---------------------------------- |
| `yarn db:push`                   | Sync the Drizzle schema to Neon    |
| `yarn db:studio`                 | Open Drizzle Studio against the DB |
| `yarn calendar:migrate`          | One-time YAML → Postgres import    |
| `yarn invite:create --name "…"`  | Mint an invite for a new person    |
| `yarn invite:create --user <id>` | Mint an add-a-device invite        |

All four read `.env.local` via `node --env-file`.
