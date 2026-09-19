# AGENTS.md — opencohort

Operating rules for any agent (human or AI) working in this repo. Read this before touching code.

## What this project is

**opencohort** — self-hosted course delivery for a creator with an existing audience.

A creator publishes chapters and lessons, invites a fixed cohort of students, and sees exactly
who has completed what. No marketplace, no discovery, no transaction fees, no marketing bundle.

Read `ROADMAP.md` for scope and `PROGRESS.md` for current state.

## Hard rules

### 1. The build must pass locally before any commit or push is handed over

Before reporting a slice complete, run and pass all three:

```
pnpm run typecheck
pnpm run lint
pnpm run build
```

`pnpm run verify` runs all three in sequence. Do not hand over a commit/push command until
they pass. No exceptions.

### 2. Never plan a long slice

A slice is **1–4 files**. If a slice needs more, it is two slices. Split it.

### 3. Victor commits, pushes, installs, and builds

The agent edits files. Victor reviews the diff, runs installs and builds, commits, pushes,
and verifies on Vercel. Never run `git commit`, `git push`, `pnpm install`, or `pnpm run build`
on his behalf — hand him the command and the reason, then wait for his feedback.

### 4. Drizzle safety rules (learned the hard way)

- `strict: true` in `drizzle.config.ts`. Without it, a column rename silently becomes
  drop + add, and the data is gone.
- Every foreign key gets an explicit `.references()`. Drizzle's `relations()` is **metadata
  only** — it does not create the constraint. Without `.references()` there is no FK in
  the database, just a column that happens to hold an id.
- Generated SQL is inspected before applying. Read the migration file.

### 5. Scope discipline

This project's differentiator is what it *doesn't* have. Before adding anything, ask:
is this in `ROADMAP.md` under "In scope"? If not, it goes in "Explicitly out of scope"
or it doesn't happen.

### 6. Authorisation is enforced server-side, in the query

Role guards in the UI are not security. Every server action and every page that reads
private data must:

- resolve the session server-side,
- check role and ownership **in the action**, before the mutation,
- filter by `creatorId` / `userId` **in the query itself**, not after fetching.

A student must never be able to read another student's progress, or a course they were
not invited to, even by editing a URL or a request body.

### 7. Access windows are checked on read

Lesson visibility depends on `enrollments.expiresAt`. Any query returning lessons to a
student must join through their enrollment and filter on the window. Do not cache a
"can view" decision in a client component.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Package manager | **pnpm** (not npm) — see the pnpm note below |
| DB | Neon Postgres |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | Better Auth |
| Styling | Tailwind v4 |
| Validation | Zod |
| Email | Resend (free tier, 3,000/mo) — digest only |
| Host | Vercel (+ Vercel cron for the digest) |

Free tiers only. No paid services, no subscriptions.

## Conventions

- TypeScript strict mode. No `any` without a comment explaining why.
- Server actions for mutations; no API routes except the Better Auth handler.
- Every DB access goes through a thin function in `src/db/` or `src/lib/` — do not inline
  queries in components. Keeps the ORM swappable.
- Zod schemas defined once, shared between server action and form.
- Use `pnpm`, never `npm`, in scripts and docs. `npx` becomes `pnpm dlx`.

## pnpm notes (migrated from npm 2026-09-19)

- **`pnpm-workspace.yaml` is load-bearing, not decoration.** pnpm 12 blocks dependency
  lifecycle scripts and treats unapproved ones as a **hard error** —
  `ERR_PNPM_IGNORED_BUILDS` — so `pnpm install` will not complete until every blocked
  package is decided in `allowBuilds`. Do not delete that file.
- The field is `allowBuilds`. pnpm 11 replaced `onlyBuiltDependencies` with it and now
  silently ignores the old name — config copied from a pnpm 10 project looks right and
  does nothing.
- `node_modules` is a symlinked layout. Mixing it with an npm-created `node_modules`
  causes confusing resolution failures; delete the folder before switching managers.
- `pnpm-lock.yaml` is committed. `package-lock.json` must not be reintroduced — having
  both makes Vercel guess which manager to use.

## Environment notes

- The developer's shell is **PowerShell**. Give PowerShell syntax, not cmd or bash:
  `Remove-Item -Recurse -Force`, `Get-Location`, `Get-ChildItem -Force`. `/s /q` and
  backslash line-continuations will not work.
- **Victor runs installs, git, and builds himself.** Give him the command and the reason;
  do not trigger them. He reports back.
- Database access goes through `getDb()` from `@/db`, never a client constructed inline.
  It connects lazily so a missing `DATABASE_URL` fails the query rather than crashing
  `next build`.
- **Auth tables belong to Better Auth.** `user`, `session`, `account`, `verification` are
  defined by it, not by us. `role` is added to its user via `additionalFields` in
  `lib/auth.ts`. Our tables reference `user.id` — do not create a parallel users table.
- `drizzle.config.ts` loads **both** `.env` and `.env.local` (`.env.local` wins). Plain
  `dotenv/config` does not read `.env.local` — that was a real bug, do not reintroduce it.
- `pnpm run db:check` verifies the database connection. Run it before any migration work.
- On Next 16, `params`, `searchParams`, `cookies()` and `headers()` are **async only** —
  always `await` them. And `middleware.ts` is renamed `proxy.ts` (Node runtime only).

## Memory

Project memory lives in `.workbuddy-ai/memory/`. Append to the dated log after each slice.
