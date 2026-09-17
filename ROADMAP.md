# ROADMAP.md — opencohort

## The product in one sentence

A self-hosted course delivery app where a creator publishes chapters and lessons, invites a
bounded cohort of students through private invite links, gates access behind an expiry window,
and sees exactly who has completed what — with no marketing, no discovery, no transaction fees.

**Positioning:** the tool a creator reaches for when they are *already being paid* and just need
somewhere to deliver. Not a platform. Not a marketplace. A gate.

## Who it is for

A creator **who already has an audience and already gets paid**. A tutor with local students, a
consultant running a paid cohort, an expert with an email list. They do not need discovery. They
do not need a checkout — they get paid by bank transfer, Stripe link, or cash. They need
somewhere private to put the material, a way to stop access when the term ends, and a way to see
who did the work.

## The commercial loop

The app must sit **on a moment where money already changes hands**. Three features create that
loop. They are small, and all three are retrofit-hostile — which is why they are in the spec
rather than the backlog.

1. **Invite-only enrollment.** A creator generates an invite link or code with a bounded number
   of seats. The app is private by default. Open enrollment makes this a free public tool;
   invite-only makes it something a creator can run a paid workshop on.
2. **Access windows.** `enrollments.expiresAt`. A lesson is visible only between `enrolledAt`
   and `expiresAt`. This is the single feature that separates a *paid* cohort from a free one —
   "you get 90 days of access". One nullable column, and it turns a viewer into a gate.
3. **Completion digest.** A scheduled job emails the creator their cohort's weekly progress:
   who stalled, who finished. Creators do not want to remember to check a dashboard. This is the
   feature people quote back when they say "I'd pay for that".

## Monetisation ladder

None of this is built now. All of it is unlocked by the commercial loop above.

| Stage | What it is | Why someone pays | Depends on |
|---|---|---|---|
| **v1.1 — self-host licence** | One-time payment for the code + deploy guide. Buyer runs it themselves. | Creators who refuse subscriptions. Highest margin, zero infra cost, no support burden. **First realistic revenue.** | Nothing — shippable the day the repo is public |
| **v1.2 — hosted plan** | We run it. $9–15/mo per creator, unlimited students. | Removes the deploy step for non-technical creators. | Invite + expiry (loop 1, 2) |
| **v1.3 — workshop in a box** | Cohort + expiry + digest + a payment link. Sell a 6-week workshop with zero platform fees. | The direct pitch against Teachable's 7.5% cut. | All three loop features |

Order matters: **self-host licence first.** No hosting bill, no uptime promise, no support
inbox. And a repo people pay to run reads far stronger on a portfolio than one with stars.


## The strategic bet

Every commercial platform bundles marketing tools because they must justify a monthly price.

| Tool | Price | What you pay for that we don't have |
|---|---|---|
| Teachable | $29/mo + 7.5% per transaction | Storefront, affiliates, tax handling |
| Kajabi | $119/mo | Funnel builder, email campaigns, landing pages |
| Thinkific | free → $74/mo | Blog, site builder, marketing integrations |
| Podia | $33/mo | Website, email, upsells |

We ship **none of that**, deliberately. The README should say so proudly.

This is the portfolio argument: showing you can decide what *not* to build is a senior signal.
A developer who ships a small, complete, honest tool demonstrates more judgment than one who
ships a half-finished clone of Kajabi.

## In scope

- Email/password auth with two roles: `creator`, `student`
- Courses: create, edit, publish/unpublish, private page by slug
- Lessons: create, edit, reorder, markdown body
- **Invites: creator generates an invite link with a bounded seat count and optional expiry**
- **Enrollment: student joins via invite link only — never by browsing. Private by default.**
- **Access windows: `enrollments.expiresAt`; lessons hidden once it passes**
- Progress: student marks a lesson complete; creator sees per-student completion
- Creator dashboard: roster + completion table
- **Weekly completion digest email to the creator (Vercel cron)**
- Route guards by role

## Explicitly out of scope

Do not build these. If asked, point here.

- Payments, pricing, subscriptions, checkout — we are the *gate*, not the till. A creator
  collects money however they already collect it, then issues an invite.
- Marketplace, course discovery, search across courses
- Drip sequences, marketing automation, landing pages, funnels
  *(one transactional email — the weekly digest — is in scope; that is the whole exception)*
- Certificates, badges, gamification
- Quizzes, grading, assignments
- SCORM / xAPI export — that is a *separate* project (idea #5)
- File/video upload and hosting — lesson bodies are markdown; video is an embed URL
- Multi-tenant organizations, team accounts
- Comments, discussions, forums
- Mobile app

## Data model

```
users        id, email, name, role ('creator' | 'student'), createdAt
courses      id, creatorId -> users, title, slug, description, publishedAt
lessons      id, courseId -> courses, title, slug, body(md), position, createdAt
invites      id, courseId -> courses, code(unique), seats, usedCount, expiresAt, createdAt
enrollments  id, userId -> users, courseId -> courses, enrolledAt, expiresAt(nullable)
progress     id, userId -> users, lessonId -> lessons, completedAt
```

Six tables. `progress` is the whole product — everything else exists to make that row
meaningful.

- `publishedAt` nullable = unpublished. No separate boolean; one source of truth.
- `invites.usedCount` vs `seats` is how a seat limit is enforced. Check before insert.
- `enrollments.expiresAt` nullable = lifetime access (a creator may grant it deliberately).


## Slices

| # | Deliverable | Files | Done when |
|---|---|---|---|
| 0 | Docs | `AGENTS.md`, `ROADMAP.md`, `PROGRESS.md` | Victor has read and confirmed |
| 1 | Scaffold + Drizzle config + Neon connection | `package.json`, `drizzle.config.ts`, `db/index.ts`, `.env.example` | `npm run dev` boots; a test query returns |
| 2 | Schema (6 tables) + first migration | `db/schema.ts`, `drizzle/0000_*.sql` | Generated SQL inspected and applied |
| 3 | Better Auth: sign-up / sign-in | `lib/auth.ts`, `app/api/auth/[...all]/route.ts`, 2 pages | Can create a user and read the session |
| 4 | Course CRUD, creator-gated | 1 action file, 2 pages, 1 component | Create a course; it persists |
| 5 | Lesson CRUD + ordering | 1 action file, 2 pages | Add and reorder lessons |
| 6 | **Invite-based enrollment + access window** | 1 action, 2 pages, 1 lib file | A student joins only via an invite code; seats are enforced; an expired enrollment hides lessons |
| 7 | Progress toggle + creator dashboard | 1 action, 2 pages | Student completes; creator sees it |
| 8 | Weekly completion digest (cron) | 1 cron route, 1 email template, 1 query | A stalled student appears in the digest; running locally produces the email |
| 9 | Polish: empty states, guards, README | misc | Full end-to-end walkthrough by a second person |

Every slice ends with the three build commands passing (see `AGENTS.md` rule 1).

**Realistic estimate:** 8–10 working days. Slices 1–3 are setup and move fast. Slices 4–7 are
the actual application. Slice 8 is small but needs a real email provider (Resend free tier:
3,000/mo) — still no subscription. Slice 9 is what makes it portfolio-worthy.

Slice 6 is deliberately bigger than the rest. Invites + seat enforcement + expiry is the
commercial loop; getting it wrong means a rewrite later. Do not split it further than
1–4 files without asking.

## Success measures

- A second person can sign up, join via an invite code, and mark a lesson complete without
  anyone touching the database.
- A student cannot join a course they were not invited to, and cannot see lessons after their
  access window closes.
- The creator receives a weekly digest naming who has stalled.
- A fresh clone + `.env` + `npm run dev` works from the README alone.
- The repo has a real commit history — not one "initial commit". It should read as
  engineering, not a dump.
- Victor can explain the `progress` table, the invite seat check, and the role guard in an
  interview unaided.
