/**
 * opencohort schema.
 *
 * Slice 2 fills this in. Six tables, and `progress` is the only one that
 * matters — everything else exists to make a row in it meaningful.
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
 */

export {};
