# Admin CMS Implementation Plan

A handoff spec for adding a passkey-protected admin UI backed by Neon Postgres to this
SvelteKit site. Written to be executed in a fresh chat — it contains the repo context needed,
so you shouldn't have to re-explore much.

---

## 1. Context & goal

This is a single-page personal website for a musician (Izabelė Jankauskaitė). Today the concert
calendar lives in `src/calendar.yaml` and is read at build time. We want the musician's manager
("the client") to manage concerts themselves through a small admin UI, without a developer in the
loop.

**Decision:** store **both the calendar and auth in Neon Postgres** (added via the Neon Vercel
integration, free tier). Migrate the existing YAML entries into Postgres once, locally, via a
script. Auth is passkey-only with a one-time invite flow. Then build a clean, simple admin UI to
list / create / edit / delete concerts, with a date picker that supports ranges **and** multiple
non-consecutive dates.

### Current stack (already in place — do not change unless noted)

- SvelteKit 2, **Svelte 4** (not Svelte 5 — no runes), Vite 5, TypeScript 5, Tailwind 3.
- Package manager: **yarn**. ESM (`"type": "module"`). `.npmrc` has `engine-strict=true`.
- Adapter: `@sveltejs/adapter-vercel` with **ISR** (`expiration: 3600`) in `svelte.config.js`.
  This is an SSR deployment with serverless functions — a DB + auth need **no adapter change**.
- **No auth, no env vars, no API routes, no hooks** exist today. All greenfield.
- Single route: `src/routes/+page.svelte` (+ `+layout.svelte`). Adding `/admin` roughly doubles
  the route surface but is isolated from the public page.

### Existing pieces to REUSE (do not reinvent)

- **Types** — `src/lib/types/event.type.ts` and `link.type.ts`:
  ```ts
  export type Event = { dates: string[]; title: string; program?: string; links: Link[] } // dates = YYYY-MM-DD
  export type Link  = { href: string; info?: string }
  ```
  Note: at runtime `links` and `program` are frequently absent — treat both as optional.
  `title`/`program` may contain inline HTML (`<b>`, `<i>`, `<br>`) rendered with `{@html}`.
- **Display formatter** — `src/lib/helpers/formatDates.ts` exports `formatDates(dates: string[])`
  and `MONTH_NAMES`. It turns a `YYYY-MM-DD[]` list into the calendar's natural-language string.
  The admin date picker must output exactly this shape (`YYYY-MM-DD[]`), and the admin form should
  render a **live preview** by calling `formatDates()` on the current selection.
- **Public components** — `src/lib/components/Calendar.svelte` + `CalendarItem.svelte` consume
  `Event[]` (with `dates: string[]`, `links: Link[]`). If the DB layer returns the same shape,
  these stay **completely unchanged**.

### The one swap point on the public side

`src/routes/+page.server.ts` currently does:
```ts
const calendarFile = await import('../calendar.yaml?raw')
const calendarEvents = YAML.parse(calendarFile.default)
return { calendarEvents }
```
Replace the YAML read with a DB query returning `Event[]` in the same shape. Everything downstream
keeps working. (Also delete the dead `import fs from 'fs'` line while there.)

---

## 2. Architecture

```
Public page (/)          -> +page.server.ts load -> SELECT * FROM events -> Event[] -> Calendar.svelte (unchanged)
Admin UI (/admin)        -> protected by hooks.server.ts (passkey session cookie)
  list/create/edit/delete-> form actions -> INSERT/UPDATE/DELETE events
Auth
  /admin/invite/[token]  -> passkey registration (WebAuthn)   -> credentials table
  /admin/login           -> passkey authentication (WebAuthn) -> signed session cookie
Storage: Neon Postgres   -> events, users, invites, credentials
```

- Calendar in Postgres (not git) — we lose git version history of the data, which is the accepted
  tradeoff for a real editing UI + instant updates.
- After the migration, `src/calendar.yaml` is obsolete. **Keep it as a one-time backup**, remove
  it from the runtime path.

---

## 3. Dependencies to add

```
yarn add @neondatabase/serverless drizzle-orm @simplewebauthn/server @simplewebauthn/browser jose flatpickr
yarn add -D drizzle-kit tsx
```

- `@neondatabase/serverless` — Neon HTTP driver (works fine in Vercel Node functions).
- `drizzle-orm` + `drizzle-kit` — typed schema + migrations (schema doubles as the source of truth).
  Raw SQL via `postgres`/`sql` tagged templates is a valid simpler alternative if you'd rather skip
  the ORM, but Drizzle keeps the CRUD typed and is recommended here.
- `@simplewebauthn/server` / `@simplewebauthn/browser` — WebAuthn ceremonies (v13+ API).
- `jose` — sign/verify the session cookie and the short-lived WebAuthn challenge cookie (stateless).
- `flatpickr` — the date picker (multiple-selection mode); framework-agnostic, Svelte 4-compatible.
- `tsx` — run the TS migration/invite scripts locally.

---

## 4. Environment variables

Add the Neon integration in the Vercel dashboard (Storage → Neon) — it auto-injects the DB URL(s).
Pull them locally with `vercel env pull .env.local`. Confirm the exact injected names; typically:

| Var | Purpose | Where |
|---|---|---|
| `DATABASE_URL` | Neon pooled connection string (used by neon-http) | auto (Vercel) |
| `SESSION_SECRET` | HMAC secret for signing the session + challenge JWTs | you set (Vercel + local) |
| `RP_ID` | WebAuthn Relying Party ID = the bare domain (e.g. `izabelejankauskaite.com`; `localhost` in dev) | you set |
| `ORIGIN` | Full origin (e.g. `https://izabelejankauskaite.com`; `http://localhost:5173` in dev) | you set |
| `RP_NAME` | Display name shown in the passkey prompt (e.g. `Izabelė Jankauskaitė`) | you set |
| `ISR_BYPASS_TOKEN` | Random token to revalidate the public page on write (optional, §9) | you set |

Access via `$env/dynamic/private` (never `$env/*/public` — these are all secret/server-only).
`.env*` is already gitignored.

**Passkey domain caveat:** passkeys are bound to `RP_ID`. Register and log in on the **same
domain**. Vercel preview deploys have different domains, so test the full flow on the production
domain (localhost works for local dev).

---

## 5. Database schema

`src/lib/server/db/schema.ts` (Drizzle):

```ts
import { pgTable, uuid, text, jsonb, integer, timestamp } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  dates: text('dates').array().notNull(),                 // ['2026-01-22', ...] YYYY-MM-DD, sorted asc
  program: jsonb('program')                               // structured rows; [] = no program
    .$type<{ composer: string; title: string }[]>().notNull().default([]),
  links: jsonb('links').$type<{ href: string; info?: string }[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),                          // display label, e.g. "Izabelė", "Cornelius"
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const invites = pgTable('invites', {
  token: text('token').primaryKey(),                      // 32 random bytes, base64url
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),   // null = unused; set on registration
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const credentials = pgTable('credentials', {
  id: text('id').primaryKey(),                            // credentialID (base64url)
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  publicKey: text('public_key').notNull(),               // base64url-encoded public key
  counter: integer('counter').notNull().default(0),
  transports: text('transports').array(),                // optional hint for the login prompt
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})
```

**Design notes**
- `dates` as `text[]` of `YYYY-MM-DD` (not `date[]`): keeps the exact string shape `formatDates` and
  the public components already expect, and ISO strings still sort correctly. Zero conversion, no
  timezone foot-guns.
- `links` as `jsonb`: matches the `Link[]` shape 1:1; simpler than a join table for this scale.
- `program` as `jsonb` array of `{ composer, title }`: mirrors the row-by-row admin editor (§9). The
  public display string is composed at read time (§7) as `<b>{composer}</b>: {title}` per line, so
  `CalendarItem.svelte` renders exactly as before. `[]` means no program.
- One `events` table (denormalized) is deliberate — ~60 rows, read-all-then-filter in JS as today.
- `users` → `credentials` is one-to-many: each user (you, the client, …) can enroll multiple
  passkeys (one per device). All users have equal edit rights — no roles; add a `role` column later
  if you ever want view-only accounts.
- Sessions are a **stateless signed cookie** (no table). If you later want server-side revocation,
  add a `sessions` table; not needed for "dead simple".

Create the tables against Neon with `drizzle-kit push` (add a `drizzle.config.ts` pointing at
`schema.ts`, dialect `postgresql`, `dbCredentials.url = DATABASE_URL`). `push` is fine for a project
this small; use `generate` + `migrate` if you prefer versioned migration files.

DB client — `src/lib/server/db/index.ts`:
```ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { env } from '$env/dynamic/private'
import * as schema from './schema'
export const db = drizzle(neon(env.DATABASE_URL), { schema })
```

---

## 6. One-time migration script (run locally)

`scripts/migrate-calendar.ts` — reads the existing YAML and inserts rows. Run once, locally, after
the tables exist.

```ts
import fs from 'node:fs'
import YAML from 'yaml'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { events } from '../src/lib/server/db/schema'

const db = drizzle(neon(process.env.DATABASE_URL!))
const parsed = YAML.parse(fs.readFileSync('src/calendar.yaml', 'utf8')) as {
  title: string; dates: string[]; program?: string; links?: { href: string; info?: string }[]
}[]

// The YAML `program` block is lines of "<b>Composer</b>: Title" -> structured rows.
function parseProgram(block?: string): { composer: string; title: string }[] {
  if (!block) return []
  return block.split('\n').filter(Boolean).map((line) => {
    const m = line.match(/^<b>(.*?)<\/b>:\s*(.*)$/)
    return m ? { composer: m[1], title: m[2] } : { composer: '', title: line } // fallback -> hand-check
  })
}

for (const e of parsed) {
  await db.insert(events).values({
    title: e.title,
    dates: [...e.dates].sort(),          // keep chronological ascending
    program: parseProgram(e.program),
    links: e.links ?? []
  })
}
console.log(`Inserted ${parsed.length} events`)
```

Run: `node --env-file=.env.local --import tsx scripts/migrate-calendar.ts`
(or `yarn tsx --env-file=.env.local scripts/migrate-calendar.ts`).

**Verify after running:** row count equals the number of YAML entries; spot-check a multi-date and
a multi-link entry (e.g. the `hr-Sinfonieorchester` entry with per-link `info:` labels); confirm no
`program` line landed in the fallback (`composer: ''`) unexpectedly and hand-fix any that did; load
the public site and confirm the calendar renders identically to before.

---

## 7. Public page: read from DB

`src/routes/+page.server.ts`:
```ts
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { events } from '$lib/server/db/schema'

export const load: PageServerLoad = async () => {
  const rows = await db.select().from(events)
  // Map to the existing Event shape; components + formatDates stay unchanged.
  const calendarEvents = rows.map((r) => ({
    title: r.title,
    dates: r.dates,
    // Compose the structured rows back into the exact display string CalendarItem expects.
    program: r.program.length
      ? r.program.map((p) => `<b>${p.composer}</b>: ${p.title}`).join('\n')
      : undefined,
    links: r.links
  }))
  return { calendarEvents }
}
```
Keep the existing JS-side `upcoming`/`past` split in `Calendar.svelte` (only ~60 rows; no need to
push filtering into SQL). Remove `src/calendar.yaml` from the runtime path (keep the file as backup).

---

## 8. Auth (passkey, one-time invite) — "dead simple"

**Identity model:** multiple users (e.g. the client plus you), all with **equal edit rights** — no
roles. Each user is a row in `users` and can register **several passkeys** (one per device). Passkey
only; no password, no email. Login is credential-first: the presented passkey identifies which user
is signing in.

### Session — `src/lib/server/auth/session.ts`
- On successful login, sign a JWT `{ sub: userId, name, exp }` with `SESSION_SECRET` (via `jose`),
  set it as an httpOnly, `secure`, `sameSite=lax`, path-scoped cookie (e.g. 30-day expiry).
  (Embedding `name` avoids a DB lookup on every request.)
- Helper `getSession(cookies)` verifies and returns `{ id, name }` or null.

### Route guard — `src/hooks.server.ts`
```ts
// Pseudocode
if (path.startsWith('/admin')
    && !path.startsWith('/admin/login')
    && !path.startsWith('/admin/invite')
    && !path.startsWith('/admin/api')) {
  const user = await getSession(event.cookies)
  if (!user) throw redirect(303, '/admin/login')
  event.locals.user = user
}
```
Also declare `interface Locals { user?: { id: string; name: string } }` in `src/app.d.ts`
(currently empty stub). The `/admin/api/*` WebAuthn endpoints handle their own checks (invite
validity / challenge), so they are excluded from the session guard.

### WebAuthn endpoints (JSON APIs, `+server.ts`)
Use JSON API endpoints (not form actions) because the browser JS from `@simplewebauthn/browser`
posts/receives JSON during the ceremony. The WebAuthn **challenge** is stored between the two calls
in a short-lived (≈5 min) signed cookie (`jose`), so no server table is needed for it.

- `POST /admin/api/register/options` — body: `{ token }`. Validate the invite (exists, not expired,
  `usedAt` null); load its `userId` + `users.name`. Call `generateRegistrationOptions({ rpID, rpName,
  userID: userId, userName: user.name, excludeCredentials: <that user's existing creds> })`. Store the
  returned `challenge` in the challenge cookie. Return options.
- `POST /admin/api/register/verify` — body: `{ token, attResp }`. `verifyRegistrationResponse({
  response, expectedChallenge, expectedOrigin: ORIGIN, expectedRPID: RP_ID })`. On success: insert
  into `credentials` (id, `userId = invite.userId`, publicKey, counter, transports), set
  `invites.usedAt = now()`. (An existing user re-using an invite this way = adding another device.)
- `POST /admin/api/login/options` — `generateAuthenticationOptions({ rpID, allowCredentials: [] })`.
  Empty `allowCredentials` uses discoverable passkeys, so the authenticator offers whichever user's
  passkey is on the device — no need to know who's logging in up front. Store challenge cookie.
- `POST /admin/api/login/verify` — look up the credential by `attResp.id` → its `userId` → load the
  user. `verifyAuthenticationResponse({ ..., credential })`, update the stored `counter`, then set the
  session cookie for that `{ id, name }`.

(Exact `@simplewebauthn` v13 field names: verify against its current docs when implementing — the
registration result exposes the credential under `registrationInfo.credential`.)

### Pages
- `src/routes/admin/invite/[token]/+page.svelte` — load validates the token server-side; page shows
  a "Create your passkey" button that runs `startRegistration()` against the register endpoints.
- `src/routes/admin/login/+page.svelte` — a "Log in with passkey" button running
  `startAuthentication()` against the login endpoints, then redirect to `/admin`.

### Generating invites — `scripts/create-invite.ts`
Bootstrap the first user + invite locally (avoids a chicken-and-egg with the guard). The script
resolves a user, then creates an invite bound to that user:
- `--name "Izabelė"` → insert a new `users` row and invite it (a new person).
- `--user <id>` → invite an existing user (adding another device for them).
```ts
// resolve userId (create users row from --name, or use --user)
// insert invite { token: base64url(randomBytes(32)), userId, expiresAt: now + 7d }, then print:
console.log(`${process.env.ORIGIN}/admin/invite/${token}`)
```
Run: `node --env-file=.env.local --import tsx scripts/create-invite.ts --name "Izabelė"`. Hand the
printed URL to that person.

Once anyone is logged in, the dashboard can create further invites (see §9), so the CLI is only
needed to bootstrap the very first user.

---

## 9. Admin UI

`src/routes/admin/+page.svelte` + `+page.server.ts` (behind the guard). Keep it clean and minimal,
styled with the site's existing Tailwind look (`bg-[aliceblue]`, etc.).

- **List** — `load` returns all events (sorted, upcoming first). Render a compact table/list: date
  summary (via `formatDates`), title, program indicator, link count, and Edit / Delete buttons.
- **Create / Edit form** — fields:
  - `title` (text).
  - `dates` — the flatpickr multiple-mode picker (§10) → hidden input carrying the sorted
    `YYYY-MM-DD[]` (JSON).
  - `program` — a **repeatable row editor**. Each row has two inputs: **Composer** and **Title**. An
    **"Add more"** button appends a new empty row; each row has a remove (×) button. Starts with one
    empty row. Bound to a `{ composer, title }[]` array stored directly as the `program` jsonb.
    (Title may contain inline `<i>`/`<b>`.) Drop fully-empty rows on save; all-empty → `[]`.
  - `links` — a **repeatable row editor**. Each row has **Link** (the `href`) and **Date (optional)**
    (stored as `info` in the old YAML — the per-link date label like `12.03.`). "Add more" appends a
    row; each row has a remove (×) button. Starts with one empty row. Bound to a `{ href, info? }[]`
    array stored as the `links` jsonb. Drop rows with an empty `href`; omit `info` when blank.
  - a **live preview** of the date string using `formatDates(selectedDates)`.
- **Actions** — `?/create`, `?/update` (by id), `?/delete` (by id) as SvelteKit form actions doing
  the corresponding Drizzle `insert`/`update`/`delete`. Set `updatedAt` on update.
- **People & invites** — a small section listing `users` (name + passkey count) with:
  - an **"Invite person"** action (`?/invite`) that takes a name, creates a `users` row + invite, and
    surfaces the generated `/admin/invite/<token>` URL to copy;
  - an **"Add a device"** action that mints an invite for the *current* user (second/replacement
    device);
  - optionally, remove a user or an individual passkey.
  Show the logged-in user's name (`locals.user`) and a **logout** button that clears the session cookie.
- The admin routes are dynamic (auth + actions), so they are not ISR-cached.

**Instant public updates (recommended):** the public `/` is ISR-cached (1h). After any
create/update/delete, revalidate it so edits show immediately:
- In `svelte.config.js`, add `bypassToken: process.env.ISR_BYPASS_TOKEN` to the `isr` config.
- After a successful write action, `await fetch(new URL('/', ORIGIN), { headers: {
  'x-prerender-revalidate': env.ISR_BYPASS_TOKEN } })`.
Alternatively, just lower/remove `expiration`. Without this, edits appear within up to 1 hour.

---

## 10. Date picker (multiple dates)

Concerts are a **flat list of individual dates** (`YYYY-MM-DD[]`), so use **flatpickr in
`mode: 'multiple'`** — it lets the editor click any number of non-consecutive days and returns them
directly. No range mode needed.

Wrap it in a small Svelte component, e.g. `src/lib/components/admin/DatePicker.svelte`:
- Initialise flatpickr on an input with `{ mode: 'multiple', dateFormat: 'Y-m-d' }`.
- On change, read `selectedDates`, format each as `YYYY-MM-DD` (flatpickr's `Y-m-d` already matches),
  sort, and bind the array to the form's hidden `dates` input (JSON-encoded).
- Below it, show a live `formatDates(dates)` preview so the editor sees the exact calendar string.
- Destroy the flatpickr instance on unmount.

Add the dependency and import flatpickr's CSS (e.g. in the admin route/layout). flatpickr is
framework-agnostic and works fine with Svelte 4.

---

## 11. Security notes

- `{@html}` renders `title`/`program`. The editor (the client) is trusted and the feature *relies*
  on inline `<b>/<i>/<br>`, so this is accepted author-trusted HTML — not an external XSS vector.
  If you ever open editing to untrusted users, sanitize on render.
- Session cookie: `httpOnly`, `secure`, `sameSite=lax`, scoped `path`. Reasonable expiry (~30d).
- Invite tokens: ≥32 random bytes, short expiry, single-use (`usedAt`).
- `RP_ID`/`ORIGIN` must exactly match the serving domain; test passkeys on the **production domain**.
- Optional: basic rate-limiting on the login endpoints.

---

## 12. Suggested implementation order

1. **DB foundation** — add deps; `drizzle.config.ts`; `schema.ts`; `db/index.ts`; `drizzle-kit push`
   to create tables in Neon. Pull env with `vercel env pull .env.local`.
2. **Migration** — write & run `scripts/migrate-calendar.ts`; verify row count + spot-checks.
3. **Public swap** — point `+page.server.ts` at the DB; confirm the public calendar is byte-for-byte
   the same as before; run `yarn svelte-check` (must stay 0 errors).
4. **Auth** — `session.ts`; `hooks.server.ts` + `app.d.ts` Locals; WebAuthn `+server.ts` endpoints;
   `create-invite.ts`; invite + login pages. Test: bootstrap the first user + invite via CLI →
   register passkey (credential row appears) → log in (session cookie set) → `/admin` loads;
   unauthenticated `/admin` redirects. Then invite a second user from the dashboard and confirm both
   can log in and edit.
5. **Admin UI** — dashboard list; create/edit/delete actions; links editor; date picker; live
   `formatDates` preview.
6. **Instant updates** — add `ISR_BYPASS_TOKEN` + revalidate-on-write (§9).
7. **Deploy** — set all env vars in Vercel (RP_ID/ORIGIN = prod domain, SESSION_SECRET,
   ISR_BYPASS_TOKEN; DATABASE_URL auto). Re-run the full passkey flow on the production domain.

## 13. Verification checklist

- [ ] `yarn svelte-check` → 0 errors / 0 warnings.
- [ ] Public calendar renders identically to the pre-migration YAML version.
- [ ] Migration row count == YAML entry count; multi-date & multi-link entries correct.
- [ ] Invite link registers a passkey; invite becomes single-use (second open fails).
- [ ] Passkey login sets a session; `/admin` reachable only when logged in.
- [ ] Two users (CLI bootstrap + dashboard invite) can each log in and edit; logout works.
- [ ] A user can add a second device (add-a-device invite) and log in from it.
- [ ] Create/edit/delete persists to Neon and (with revalidation) shows on `/` promptly.
- [ ] Date picker (flatpickr `mode: 'multiple'`): selecting several non-consecutive days yields a
      sorted `YYYY-MM-DD[]`; live preview matches `formatDates`.
- [ ] Program editor: composer/title rows with "Add more" / remove; round-trips to the same public
      display (`<b>Composer</b>: Title` per line).
- [ ] Links editor: Link + optional Date rows with "Add more" / remove; empty-href rows dropped.
- [ ] Full flow tested on the production domain (passkey domain binding).
```
