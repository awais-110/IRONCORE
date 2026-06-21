# IRONCORE — Feature Spec: Branch Architecture
### File 02 of 09 — Build this SECOND, immediately after design system

**Depends on:** `01-design-system.md` (visual tokens only)
**Required by:** Every other feature file — this defines the `branches` table and the branch-context pattern that Trainers, Timetable, Membership, Gallery, and Signup all build on top of.

---

## 0. What this solves

The original `spec.md` assumed a single gym location. The real client has **multiple branches**, count not yet fixed (architecture must not hardcode a number anywhere — no "branch 1 / branch 2" special-casing, no UI that assumes exactly N branches). This file defines how the whole site becomes branch-aware without every other page needing to re-solve this problem.

---

## 1. Data Model

```sql
-- branches
id uuid pk,
slug text unique,                    -- e.g. "dha-phase-6", used in URLs
name text,                           -- e.g. "IRONCORE DHA Phase 6"
address_line text,
city text,
latitude numeric,
longitude numeric,
phone text,
opening_hours jsonb,                 -- { "mon": "6:00-23:00", "tue": "...", ... }
is_active boolean default true,      -- allows "coming soon" branches to exist without showing publicly
hero_image_url text,
created_at timestamptz default now()
```

RLS: public read where `is_active = true`. No public write.

**Critical downstream rule:** every table that is branch-specific (classes, in some cases trainers via join table — see §3) must carry a `branch_id` foreign key. Tables that are gym-wide (membership tier definitions, if pricing is shared — see `03-membership-and-pt-packages.md` for the actual decision) do NOT need one. Don't add `branch_id` reflexively to every table — only where content genuinely differs per branch.

---

## 2. Branch Context — How the Rest of the Site Knows Which Branch You're Viewing

This is the core mechanic every other feature relies on. Implement it once, here, correctly.

### 2.1 URL structure

Branch context lives in the URL so pages are shareable/bookmarkable and so there's no reliance on client-side state alone:

```
/                              → branch-detection + redirect happens here (see §2.2)
/[branchSlug]                  → branch home (or just informs the global layout — see note)
/[branchSlug]/trainers
/[branchSlug]/timetable
/[branchSlug]/transformations
/[branchSlug]/join
```

**Recommended simpler alternative if Codex/you prefer not to restructure all routes under `[branchSlug]`:** keep flat routes (`/trainers`, `/timetable`, etc.) and store the active branch in a cookie + a `BranchContext` React context, with a `?branch=slug` query param as the shareable/override mechanism. This avoids a full route restructure. **Recommendation: use the query-param + cookie approach for v1** — it's significantly less invasive to build and still fully shareable (`/timetable?branch=dha-phase-6` is a real, bookmarkable link). Only move to full path-based branch routing if SEO needs branch-specific pages to rank independently (a real future need — flag for v2, not required now).

### 2.2 First-visit branch detection flow

Per your decision: **auto-detect nearest branch, but always allow switching.** This requires a fallback chain — do not build this as a single `navigator.geolocation` call with no fallback, because permission can be denied, geolocation can time out, or the visitor can be on desktop with location services off entirely.

**Required flow, in order:**

1. **Check for existing selection first.** If a `selected_branch` cookie already exists (visitor has been here before or already chose), skip detection entirely and use it. Don't re-prompt returning visitors.
2. **Attempt browser geolocation** (`navigator.geolocation.getCurrentPosition`), with a short timeout (~4s). If granted and resolved: compute nearest branch via haversine distance against the `branches` table's lat/lng, set it as active, set the cookie.
3. **If geolocation is denied, errors, or times out:** fall back to **IP-based geolocation** (a lightweight third-party API or Vercel's geo headers if deploying on Vercel — `request.geo` is available in Next.js Middleware on Vercel at no extra integration cost, this is the cheapest correct option and should be preferred over a third-party IP API). Use city/region match against branch `city` field.
4. **If IP geo also fails or matches no known branch city:** show a lightweight, non-blocking **branch picker** (a small modal or inline banner, NOT a full-page gate that blocks the hero/content from rendering — per design philosophy, don't make the visitor do work before they see anything). Default to the first `is_active` branch by `created_at` so the page still renders something immediately while the picker is available.
5. **Always-visible branch switcher** in the navbar (see §3) regardless of which path above resolved — auto-detection is a convenience default, never a lock-in.

**Important UX constraint:** detection must never block first paint. The homepage hero, navbar, and above-fold content render immediately with a default/best-guess branch; if geolocation resolves a moment later to a different branch, transition the content smoothly (no jarring reload) — show a small dismissible toast: *"Showing [Branch Name] — [Switch]"* rather than silently swapping content the visitor already started reading.

### 2.3 Branch Switcher Component

- Lives in the navbar (desktop: dropdown from a location-pin icon + current branch name; mobile: full-width row in the mobile menu).
- Lists all `is_active` branches, each showing name + city + a "Nearest" badge (flat, monospace, accent-colored text only — no background fill, per no-gradient/flat-surface brand rule) next to whichever branch was geo-matched, even if the visitor manually switched away from it.
- Selecting a branch updates the cookie AND the `?branch=` param on the current page (so if the visitor is mid-browse on `/timetable`, switching branch re-filters the timetable in place rather than redirecting to home).
- Must be keyboard accessible (this is a primary navigation control, not decorative — full focus ring, arrow-key navigation through the list per standard listbox pattern).

---

## 3. Trainer–Branch Relationship (many-to-many)

Per your decision: a trainer can work at multiple branches, and **each branch shows its own independent trainer listing with no cross-branch mention** on the public trainer profile page.

```sql
-- trainer_branches (join table)
trainer_id uuid references trainers(id),
branch_id uuid references branches(id),
primary key (trainer_id, branch_id)
```

**Implementation consequence:** the public `/trainers` listing (and `/trainers/[slug]` profile) filters strictly by the currently active branch context (§2). A trainer who works at 3 branches will have their profile reachable via 3 different branch-filtered contexts, but each render shows that trainer as if they belong only to that branch — no "also at Branch X" text, per your explicit choice. (Internally, in the admin dashboard — `08-admin-dashboard.md` — staff WILL see the full multi-branch assignment, since that's an operational need, not a public-facing one. This public/admin distinction matters: don't let the "no cross-branch mention" rule leak into the admin panel where it would actually hurt usability.)

Full schema and profile page details live in `04-trainers.md` — this section only defines the join table and the filtering rule, since it's the branch-architecture half of that feature.

---

## 4. What Becomes Branch-Scoped vs. Branch-Wide

Explicit table so Codex doesn't have to infer this per-feature:

| Data | Branch-scoped? | Notes |
|---|---|---|
| Trainers | Yes (via join table, many-to-many) | See §3 |
| Classes / timetable | Yes (one class belongs to exactly one branch) | A trainer's class at Branch A doesn't appear in Branch B's timetable even if that trainer also works at Branch B |
| Membership tiers | **Decide in `03-membership-and-pt-packages.md`** | Likely branch-wide (same pricing everywhere) unless the gym actually prices differently per location — don't assume, this file flags it as a decision for that spec |
| PT packages | Same as above | |
| Transformation gallery | Yes, with a branch filter | A transformation can optionally be tagged to the branch the member trained at — nullable, since this may not always be known/relevant |
| Leads (signup submissions) | Yes | Every lead must capture which branch the visitor was viewing/selected when they signed up — critical for staff to know which branch to follow up from |

---

## 5. Footer / Contact

The footer's address/contact block (from original spec §3.8) must now show **the currently active branch's** address/phone/hours, not a single hardcoded gym address — pull from branch context. If a "Find a location" or "All locations" link is wanted as a fuller directory page (e.g. `/locations` listing every branch with mini-map), that's a reasonable addition — flag to the user as an optional extra page rather than assuming it's required.

---

## 6. Open implementation note for Codex

Haversine distance calculation (for §2.2 step 2) is a small, well-known formula — implement directly in a `/lib/geo.ts` utility rather than pulling in a geo library dependency for this single calculation. Keep the IP-geo fallback (§2.2 step 3) behind an environment-variable-gated integration so the site still builds and runs locally without that service configured (graceful no-op → falls through to the manual picker in step 4).
