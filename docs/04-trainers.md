# IRONCORE — Feature Spec: Trainers
### File 04 of 09

**Depends on:** `01-design-system.md`, `02-branch-architecture.md` §3 (trainer–branch join table + visibility rule already defined there)
**Required by:** `05-timetable.md` (classes reference trainers)

---

## 0. What this solves

Original `spec.md` §3.4 assumed one flat trainer roster for a single gym. Now: trainers can work at multiple branches (many-to-many), but per your explicit decision, **the public site shows each branch's roster independently with no cross-branch mention** — a trainer profile viewed while Branch A is active shows that trainer as if they only work at Branch A, even if they also work at Branch C. (Admin dashboard is the one place the full multi-branch picture is visible — that's an operational tool, not public content.)

---

## 1. Data Model

```sql
-- trainers
id uuid pk,
slug text unique,
name text,
photo_url text,
specialty text,                     -- e.g. "POWERLIFTING", "CONDITIONING", "MOBILITY" — short tag
bio text,
certifications text[],
philosophy_quote text,
instagram_url text,
is_active boolean default true,
created_at timestamptz default now()

-- trainer_branches (join table — defined in 02-branch-architecture.md §3, repeated here for completeness)
trainer_id uuid references trainers(id),
branch_id uuid references branches(id),
primary key (trainer_id, branch_id)
```

RLS: public read on `trainers` where `is_active = true`, joined through `trainer_branches` filtered to the active branch context. No public write.

**Slug uniqueness note:** since a trainer's profile URL (`/trainers/[slug]`) is the same regardless of which branch context loaded it, the slug must stay globally unique per trainer (not per branch) — this is already correct in the schema above (`slug text unique` at the trainer level, not branch-scoped), just confirming the reasoning so Codex doesn't "fix" this into a composite key.

---

## 2. Pages

### 2.1 Roster grid (`/trainers`, filtered by active branch context)

As original spec §3.4: 3-col desktop / 1-col mobile grid. Photo (duotone-treated per design system), name (Oswald), specialty tag (monospace pill, accent border only, transparent fill, sharp corners), one-line bio excerpt. Hover: photo desaturates fully, specialty tag text pops to full accent color.

**Branch-filtering behavior:** the query joins `trainers` through `trainer_branches` where `branch_id = [active branch]`. If the active branch has zero assigned trainers (e.g. a newly added branch before staff have been assigned), show a calm empty state — not a broken-looking blank grid — e.g. "Trainer profiles for this location are coming soon" with the branch switcher visible so the visitor can check another branch immediately.

### 2.2 Individual profile (`/trainers/[slug]`)

As original spec §3.4: large portrait, full bio, certifications list, philosophy pull-quote (Oswald, no italics — emphasis via accent color per brand rule), embedded class schedule **filtered to that trainer AND the active branch** (a trainer who teaches at 2 branches should only show Branch A's classes when viewed in Branch A's context — this naturally falls out of the timetable query already being branch-scoped per `05-timetable.md`, just confirming the trainer-profile embed inherits the same filter rather than showing all that trainer's classes everywhere).

**Edge case to handle explicitly:** if a visitor reaches a trainer's profile URL directly (e.g. from a shared link or search result) while a *different* branch is active than one the trainer is assigned to, the profile should still render (don't 404 a real trainer), but the embedded class schedule for that mismatched branch will correctly show empty — pair that empty state with a prompt like "View [Trainer Name]'s schedule at [Branch they actually work at]" rather than a bare blank table, since this is a realistic navigation path (direct links don't carry branch context reliably).

---

## 3. Specialty Tags — Keep a Controlled List

Rather than freeform text per trainer (which leads to inconsistent tags like "Powerlifting" vs "POWER LIFTING" vs "powerlifting coach" across different staff entering data later via the admin dashboard), define specialty as a small controlled set the admin dashboard will offer as a dropdown/multi-select rather than a free text field:

```
STRENGTH · POWERLIFTING · CONDITIONING · MOBILITY · HYPERTROPHY · OLYMPIC LIFTING · REHAB · NUTRITION COACHING
```

This list is a starting point — confirm with the user before launch whether it matches how this gym's trainers actually describe themselves; easy to extend, just shouldn't be free text from day one given multiple branches means multiple people will eventually be entering trainer data.

---

## 4. SEO

Per original spec §5: `Person` schema (JSON-LD) on each trainer profile page — `name`, `jobTitle` (derived from specialty), `image`, `worksFor` referencing the *currently viewed* branch's `LocalBusiness` entity (not all branches the trainer works at, consistent with the public single-branch-view rule established above).
