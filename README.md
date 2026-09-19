# opencohort

**A small, self-hosted app for delivering a course to a group you already know.**

A creator publishes lessons, invites a bounded group through private invite links, sets an
access window, and sees who has completed what.

It does course delivery. That's the whole scope.

---

## What this is

opencohort is built for a specific situation: you have a group of people you already teach —
students, clients, a cohort you run — and you want somewhere to put the material and a way
to see who has done the work.

It is intentionally small. The goal is one thing done well rather than a suite of features
half-built.

## What it does

- **Courses and lessons** — markdown lesson bodies, ordering, draft and publish
- **Invite-only enrollment** — private by default. A creator generates an invite code with a
  bounded number of seats. There is no public course listing.
- **Access windows** — an enrollment can expire, after which lessons stop being visible.
  Useful when you're running something time-boxed.
- **Progress tracking** — a student marks lessons complete; the creator sees a roster with
  per-student completion.
- **Weekly digest** — the creator gets one email a week naming who stalled and who finished.

## What it deliberately does not do

This list is a design decision, not a backlog.

- No payments or checkout — issue an invite after collecting payment however you prefer
- No public marketplace or course discovery
- No marketing campaigns, funnels, or landing pages
- No certificates, badges, or gamification
- No quizzes or grading
- No file or video upload — lesson bodies are markdown, video is an embed URL
- No multi-tenant organisations
- No comments or forums
- No mobile app
- No SCORM/xAPI export

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Package manager | pnpm |
| Database | Neon Postgres |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | Better Auth |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Email | Resend (weekly digest only) |
| Hosting | Vercel + Vercel Cron |

Everything runs on free tiers.

## Status

Early and actively being built. Contributions aren't open yet — the shape is still moving.

## Running it locally

Requires **Node.js 20.9 or newer** and **pnpm**.

```
pnpm install
```

Then copy `.env.example` to `.env.local` and fill in `DATABASE_URL` with a Postgres
connection string (Neon's free tier is what this is built against).

Confirm the connection before doing anything else:

```
pnpm run db:check
```

That prints `PASS` or a specific failure. Then:

```
pnpm dev
```

The app runs at http://localhost:3000. Note that the UI is still being built — the
scaffold boots, but the course pages are in progress.

> A note for the curious: `pnpm-workspace.yaml` exists in this single-package repo because
> pnpm 12 refuses to install until every dependency with a build script is explicitly
> approved in `allowBuilds`. It is configuration, not a monorepo definition.

## Licence

AGPL-3.0. See [`LICENSE`](./LICENSE).

In practice: use it, modify it, self-host it. If you run a modified version as a network
service, you publish your changes. Commercial use is permitted — the licence is about
keeping derivatives open, not about restricting who may use it.

## Notes for contributors and agents

[`AGENTS.md`](./AGENTS.md) holds the operating rules: build gates, slice sizing, Drizzle
safety rules, and the authorisation rules. Read it before touching code.
