/**
 * opencohort schema.
 *
 * Slice 2 fills this in. Six tables of our own, plus the auth tables that
 * Better Auth owns (see the "Auth tables" note at the bottom).
 *
 *   users        id, email, name, role ('creator' | 'student'), createdAt
 *   courses      id, creatorId -> users, title, slug, description, publishedAt
 *   lessons      id, courseId -> courses, title, slug, body(md), position, createdAt
 *   invites      id, courseId -> courses, code(unique), seats, usedCount, expiresAt, createdAt
 *   enrollments  id, userId -> users, courseId -> courses, enrolledAt, expiresAt(nullable)
 *   progress     id, userId -> users, lessonId -> lessons, completedAt
 *
 * Two rules from AGENTS.md apply to every foreign key below:
 *   - an explicit `.references()` is required; `relations()` is metadata only
 *     and does NOT create the constraint
 *   - `publishedAt` is nullable rather than a separate boolean, so there is
 *     only one source of truth for "is this live"
 *
 * Auth tables — DECISION (2026-09-17):
 * Better Auth owns `user`, `session`, `account`, `verification`. We do NOT
 * duplicate them. `role` is added to Better Auth's user via its
 * `additionalFields` option and defined in `lib/auth.ts` (slice 3), so the
 * column lives in its table with its migrations.
 *
 * Reason: checked `better-auth/dist/db/schema.d.mts` (v1.7.5) — its User model
 * is `id, createdAt, updatedAt, email, emailVerified, name, image`, and
 * `additionalFields` is the supported extension point. Fighting that to own a
 * parallel users table would mean hand-maintaining auth columns we do not
 * control. One table, one owner.
 *
 * Consequence for our FKs: `courses.creatorId`, `enrollments.userId` and
 * `progress.userId` reference Better Auth's `user.id`, not a table of ours.
 */

export {};
