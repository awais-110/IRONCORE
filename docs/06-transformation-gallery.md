# IRONCORE — Feature Spec: Transformation Gallery
### File 06 of 09

**Depends on:** `01-design-system.md`, `02-branch-architecture.md` (optional branch filter only — this feature is the least affected by multi-branch)
**Required by:** Nothing downstream — this is a leaf feature.

---

## 0. What this solves

Mostly unchanged from original `spec.md` §3.6. The only addition: transformations can optionally be tagged to the branch where the member trained, since a multi-branch gym will want to eventually show "results from your location" — but this is **nullable/optional**, not required per entry, since branch attribution may not always be tracked or relevant (e.g. early entries before multi-branch tracking existed, or a member who trained across branches).

---

## 1. Data Model

```sql
-- transformations
id uuid pk,
member_name text,                   -- first name + last initial only, per privacy convention (e.g. "John D.")
duration_weeks int,
goal_tag text check (goal_tag in ('fat_loss','strength','recomposition','athletic_performance')),
branch_id uuid references branches(id),   -- NULLABLE — see note above
before_image_url text,
after_image_url text,
quote text,
is_published boolean default false,       -- staff must explicitly publish — never auto-public on upload
created_at timestamptz default now()
```

RLS: public read where `is_published = true`. No public write — entries are added via the admin dashboard (`08-admin-dashboard.md`) with real member consent collected offline before publishing (see §3 below — this is a real compliance concern, not boilerplate).

---

## 2. Page (`/transformations`)

As original spec §3.6: masonry or strict grid, interactive before/after drag slider per entry, monospace caption (`DURATION — FIRST NAME + LAST INITIAL`), optional short quote underneath.

**Filters:**
- By goal (`Fat Loss / Strength / Recomposition / Athletic Performance`) — flat pill filters, same visual treatment as timetable's class-type filters for system-wide consistency.
- By branch — **only show this filter control if more than one branch has published entries.** If all current transformations happen to be tagged to a single branch (or none are tagged at all), don't show an empty/useless branch filter — this is a small but real polish detail that matters once there are genuinely multiple branches with their own results.

**Accessibility requirement (carried over from original spec §6, restated here since it's specific to this component):** the before/after drag slider must have a non-drag keyboard/screen-reader-accessible alternative — a simple toggle button cycling between "Before" and "After" labeled images satisfies this without needing to replicate the drag interaction itself.

---

## 3. Consent — Required UI Element, Not Just a Footer Note

Original spec already flagged a consent note in the page footer confirming members pictured opted in. Restating with more weight here because this is a real legal/ethical requirement, not a nice-to-have: the admin dashboard's transformation-entry form (`08-admin-dashboard.md`) should require an explicit "consent confirmed" checkbox before an entry can be set to `is_published = true` — this creates an actual record that someone on staff affirmatively confirmed consent at the time of publishing, rather than relying on the public-facing footer text alone to cover this.

---

## 4. SEO

No structured data needed beyond standard `next/image` alt text (descriptive, e.g. "Before and after transformation — 12 weeks, fat loss program" rather than generic "before after image" per original spec §6's alt-text rule). This page is unlikely to carry significant standalone SEO weight compared to Programs/Trainers/Timetable, so no special schema markup required here.
