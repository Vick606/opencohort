# opencohort

**Course delivery for people who already have an audience.**

A self-hosted app where a creator publishes lessons, invites a bounded cohort through private
invite links, gates access behind an expiry window, and sees exactly who completed what.

No marketplace. No discovery. No transaction fees. No marketing funnel.

---

## Why this exists

Every commercial course platform bundles marketing tools, because they have to justify a
monthly price built to serve creators who need to *find* students.

| Platform | Price | What you pay for that opencohort doesn't have |
|---|---|---|
| Teachable | $29/mo + 7.5% per transaction | Storefront, affiliates, tax handling |
| Kajabi | $119/mo | Funnel builder, email campaigns, landing pages |
| Thinkific | free → $74/mo | Blog, site builder, marketing integrations |
| Podia | $33/mo | Website, email, upsells |

If you already have an audience — students, a mailing list, clients — you are paying for
tools you will never open.

opencohort is the other half: the part that actually delivers the course. You collect money
however you already collect it, then issue an invite. **It is the gate, not the till.**

## What it does

- **Courses and lessons** — markdown lesson bodies, drag-free reordering, draft/publish
- **Invite-only enrollment** — private by default. A creator generates an invite code with a
  bounded number of seats. There is no "browse courses" page, and that is the point.
- **Access windows** — an enrollment can expire. Lessons stop being visible when it does.
  This is what makes a paid cohort different from a free one.
- **Progress tracking** — a student marks lessons complete; the creator sees a roster with
  per-student completion.
- **Weekly digest** — the creator gets one email a week naming who stalled and who finished.
  Creators do not check dashboards.

## What it deliberately does not do

This list is a design decision, not a backlog.

- No payments or checkout — see "gate, not the till" above
- No marketplace, discovery, or cross-course search
- No drip campaigns, funnels, or landing pages
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
| Database | Neon Postgres |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | Better Auth |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Email | Resend (weekly digest only) |
| Hosting | Vercel + Vercel Cron |

Everything runs on free tiers.

## Status

Early. The roadmap, architecture decisions, and slice plan are in
[`ROADMAP.md`](./ROADMAP.md). Contributions aren't open yet — the shape is still moving.

## Running it locally

Coming once slice 1 lands. This section will be the real test: if a fresh clone plus a filled
`.env` doesn't boot with `npm run dev`, the README is broken.

## Licence

AGPL-3.0. See [`LICENSE`](./LICENSE).

In practice: use it, modify it, self-host it. But if you run a modified version as a network
service, you publish your changes. Commercial use is permitted — the licence is about
keeping derivatives open, not about restricting who may use it.

## Documentation for contributors and agents

[`AGENTS.md`](./AGENTS.md) holds the operating rules: build gates, slice sizing, Drizzle
safety rules, and the authorisation rules. Read it before touching code.
