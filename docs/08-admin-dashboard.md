# IRONCORE — Feature Spec: Admin Dashboard
### File 08 of 09 — build LAST (it's a management surface over every other feature's data)

**Depends on:** `02-branch-architecture.md` through `07-signup-flow.md` (touches all of their tables)
**Required by:** Nothing — this is the final layer.

---

## 0. What this solves — and why it exists at all

Every public-facing feature spec so far creates data (leads, bookings, branches, trainers, classes, gallery entries) with **no public write access** by design (RLS locked to read-only or insert-only throughout). Something has to actually manage that data — currently the only path would be staff manually using the Supabase table editor directly, which is workable for you alone short-term but breaks down fast once "baad mein staff add hongi" (more staff are added) happens, since the Supabase dashboard isn't built for non-technical gym staff and gives them far more access/risk than they need.

**Scope decision (recommended, stated in the master index):** v1 admin dashboard, not a member-facing dashboard. This is for gym staff managing the business, not members managing their own accounts — that's a different, larger feature correctly deferred to v2 once payment exists.

---

## 1. Authentication

Per your confirmation: **single owner user for now, but built on Supabase Auth (not a single hardcoded password)** so adding real staff later is a matter of inviting users and assigning roles, not rebuilding the auth layer.

```sql
-- staff_profiles (extends Supabase auth.users with role + branch scoping)
id uuid pk references auth.users(id),
full_name text,
role text check (role in ('owner', 'branch_manager', 'staff')) default 'staff',
branch_id uuid references branches(id),   -- nullable for 'owner' role (owner sees all branches);
                                            -- required for 'branch_manager'/'staff' (scoped to one branch)
created_at timestamptz default now()
```

- For now: a single row with `role = 'owner'`, `branch_id = null` (owner sees everything across all branches — appropriate since you're the one using it).
- Future-ready: `branch_manager`/`staff` roles exist in the schema from day one so adding a real second user later is just inserting a `staff_profiles` row + a Supabase Auth invite — no migration needed at that point. **Do not build role-checking UI logic for `branch_manager`/`staff` in v1** — just leave the schema capable of it. Building the actual permission-gated UI for those roles is reasonable to defer until there's a real second user, since designing it correctly without a real use case to test against risks guessing wrong.
- Route protection: `/admin/*` routes check for a valid authenticated session via Supabase Auth middleware; redirect to `/admin/login` if absent. Standard Next.js + Supabase Auth pattern, nothing unusual needed here.

---

## 2. Information Architecture

```
/admin/login
/admin                          → Dashboard home: today/this-week snapshot (new leads count,
                                   today's class bookings, any classes nearing capacity)
/admin/leads                    → Leads inbox (see §3)
/admin/bookings                 → Class booking roster, by date (see §4)
/admin/branches                 → Branch list + edit (address, hours, geo coords)
/admin/trainers                 → Trainer roster management + branch assignment
/admin/classes                  → Class schedule management (the recurring templates)
/admin/membership                → Membership tier + PT package management, including
                                   per-branch pricing
/admin/gallery                  → Transformation gallery entries, including the consent
                                   checkbox required before publishing (per 06-transformation-
                                   gallery.md §3)
```

Owner role (the only one in active use right now) sees an unscoped view of all of the above across every branch, with a branch filter/switcher available on each list view (similar pattern to the public site's branch switcher, but here it's a filter on an otherwise-global view rather than a hard content gate).

---

## 3. Leads Inbox (`/admin/leads`) — Highest Priority Screen

This is the single most operationally important screen in the whole admin panel, since every signup-flow submission lands here and time-to-follow-up directly affects whether a lead converts.

- Table view: name, phone (click-to-call on mobile), email, branch, interest type + selected tier/package, goal, status, submitted date — sortable, with **newest-first as default** and a filter for `status = 'new'` as the default view (so staff land on "what needs action" first, not a full historical log).
- Status update is inline (a dropdown directly in the row: New / Contacted / Converted / Not Interested) — no need to open a separate detail page for the common case of just updating status after a call.
- Each lead row expands (or links to a detail view) showing the optional `message` field in full, plus `preferred_start_date`.
- **No bulk delete.** Leads are a permanent record of inbound interest even if they go cold — allow filtering them out of the default view (e.g. hide `not_interested` by default) rather than allowing deletion, since this data has ongoing value for understanding demand patterns per branch/offering.

---

## 4. Bookings Roster (`/admin/bookings`)

Per `05-timetable.md` §5: staff need a per-class, per-date view of who's actually booked in, not just the aggregate spots-remaining count the public site shows.

- Default view: today's classes (all branches, or filtered to one), each showing the class name/time/trainer and a roster of booked names/phone numbers below it — this is what staff would print or pull up at the front desk before a class starts.
- Date navigation (forward/back, matching the public timetable's "This Week / Next Week" horizon from `05-timetable.md` §2).
- Manual cancellation action available here too (staff cancelling on a member's behalf, e.g. a phone call asking to cancel) — uses the same underlying cancellation logic as the public self-service flow (§4 of `05-timetable.md`), just triggered from the staff side instead of requiring the visitor's emailed token.

---

## 5. Branches, Trainers, Classes, Membership/PT, Gallery — Standard CRUD Screens

These five screens are more conventional admin CRUD than the leads/bookings screens above, so spec'd at a lighter level of detail — standard patterns apply (table list view + create/edit form, Zod-validated, matching design-system form styling per `01-design-system.md` rather than introducing a separate "admin theme"):

- **Branches:** create/edit name, address, phone, opening hours (structured day-by-day input, not a raw JSON textarea), lat/lng (consider a simple map-click picker rather than requiring staff to know coordinates manually — a reasonable scope addition, flag as optional if it adds meaningful build time Codex should ask about first), `is_active` toggle.
- **Trainers:** create/edit profile fields, **multi-select branch assignment** (this is where the full many-to-many relationship from `04-trainers.md` is actually visible and editable — unlike the public site's deliberately single-branch view).
- **Classes:** create/edit the recurring class template (day, time, trainer, branch, capacity, type, intensity) — this is the `classes` table from `05-timetable.md`, not individual bookings.
- **Membership/PT:** edit tier/package details and, critically, **per-branch pricing** (`membership_tier_pricing` / `pt_package_pricing` rows) — this screen is what makes the "branch-wise pricing" decision from `03-membership-and-pt-packages.md` actually usable day-to-day, since otherwise that pricing could only be edited via raw SQL.
- **Gallery:** create/edit transformation entries, image upload (Supabase Storage), the required consent checkbox before `is_published` can be set true (per `06-transformation-gallery.md` §3).

---

## 6. Explicitly Out of Scope for v1 Admin

Stated to prevent scope creep during the build, not because these are bad ideas:
- Analytics/reporting dashboards beyond the simple home-page snapshot in §2.
- Staff permission UI for `branch_manager`/`staff` roles (schema supports it, UI doesn't gate on it yet — see §1).
- Bulk import/export tools.
- Audit log of admin actions (worth considering once multiple staff have write access — premature with a single owner user).
