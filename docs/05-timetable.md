# IRONCORE — Feature Spec: Class Timetable & Booking System
### File 05 of 09

**Depends on:** `01-design-system.md`, `02-branch-architecture.md` (branch-scoping), `04-trainers.md` (classes reference trainers)
**Required by:** `08-admin-dashboard.md` (staff need to see/manage bookings)

---

## 0. What this solves — and why this file is bigger than the original spec's timetable section

Original `spec.md` §3.5 treated "spots left" as a display number, implicitly staff-updated. You've since confirmed this needs to be a **real booking system**: guest visitors (no login required) reserve an actual spot, the system tracks capacity automatically, and visitors can self-cancel via an emailed link.

This is a meaningfully larger build than a schedule display — it now involves **concurrency-safe capacity tracking** (so the last spot in a popular class can't be double-booked by two people clicking "Reserve" in the same second) and **secure, non-guessable cancellation links** (since there's no login to gate "is this your booking"). Both are addressed below — do not let this regress into a naive `UPDATE classes SET spots_left = spots_left - 1` without the safeguard in §3.2, and do not let cancellation links use a sequential or otherwise guessable ID (see §4).

---

## 1. Data Model

```sql
-- classes (the schedule definition — recurring weekly slot, not a specific dated instance)
id uuid pk,
branch_id uuid references branches(id),
name text,                          -- "Morning Strength", "HIIT Conditioning"
day_of_week text check (day_of_week in ('mon','tue','wed','thu','fri','sat','sun')),
start_time time,
end_time time,
trainer_id uuid references trainers(id),
intensity smallint check (intensity between 1 and 3),
class_type text check (class_type in ('strength','conditioning','mobility','hybrid')),
capacity int,                       -- total spots available for this class
is_active boolean default true,
created_at timestamptz default now()

-- class_bookings (an actual reservation against a specific date's occurrence of a class)
id uuid pk,
class_id uuid references classes(id),
class_date date,                    -- the SPECIFIC date being booked (a recurring "classes" row
                                     -- produces a different bookable occurrence each week)
name text,
email text,
phone text,
status text check (status in ('confirmed','cancelled')) default 'confirmed',
cancellation_token uuid default gen_random_uuid(),  -- see §4, NEVER expose the row's own `id` for this purpose
created_at timestamptz default now(),
cancelled_at timestamptz
```

**Why `class_bookings` is separate from `classes` and keyed by `class_date`:** `classes` defines the *recurring template* (e.g. "Morning Strength runs every Monday 6–7am"). A booking is for one specific occurrence of that recurring slot (e.g. "Monday, July 6th's Morning Strength"), not the template itself — otherwise capacity would never reset week to week. Spots remaining for a given date is always **computed**, not stored:

```sql
-- conceptual: spots remaining for a given class on a given date
SELECT classes.capacity - count(class_bookings.id)
FROM classes
LEFT JOIN class_bookings
  ON class_bookings.class_id = classes.id
  AND class_bookings.class_date = :requested_date
  AND class_bookings.status = 'confirmed'
WHERE classes.id = :class_id
GROUP BY classes.id, classes.capacity;
```

This avoids the classic bug of a stored `spots_left` counter drifting out of sync with actual bookings (e.g. if a cancellation fails to decrement correctly, or two processes race on an update) — computing it fresh from confirmed bookings is always correct by construction.

RLS: public read on `classes` where `is_active = true`. **No public read on `class_bookings` directly** — booking counts are only ever exposed through a server-side computed "spots remaining" value (via API route or Postgres function), never the raw booking rows, since those rows contain visitor name/email/phone and must not be queryable by other visitors. Insert into `class_bookings` happens only through the booking API route (§3), not direct client-side Supabase calls, so server-side capacity validation (§3.2) can't be bypassed by a modified client request.

---

## 2. Page: Timetable (`/timetable`, filtered by active branch)

As original spec §3.5: desktop = real grid (days × time slots), mobile = day-tabbed accordion. Filter bar by class type and trainer.

**New per-occurrence detail:** since classes now book per-date rather than being a flat recurring listing, the timetable view needs an explicit **date context** — default to "this week," with simple forward/back navigation (not a full calendar picker for v1, just "This Week / Next Week" or similar, since gym timetables are short-horizon by nature). Each class block shows: name, time (monospace), trainer (linked to profile), intensity icons (as original spec), and now a **live spots-remaining indicator** computed per §1 — shown only when `remaining <= 5` (matches original spec's urgency-without-fake-scarcity rule, now backed by real data rather than aspirational).

When `remaining = 0`: class block shows "FULL" (flat, muted-text treatment — not a harsh error-red, this is normal/expected state for a popular class, not a failure state) and the Reserve action becomes disabled, replaced with "Join Waitlist" — **waitlist is flagged as a nice-to-have for a later iteration, not required for v1**; for v1, a full class simply shows no booking action.

---

## 3. Booking Flow

### 3.1 UI

Each bookable class block (when spots remain) shows a "Reserve Spot" action. Clicking opens a lightweight inline form (not a full page navigation — a modal or expand-in-place panel fits the brand's snappy motion language): Name, Email, Phone (all required — phone matters because gym staff will realistically follow up by call/WhatsApp for no-shows, not just email). Submit → POST to `/api/bookings`.

### 3.2 Server-side booking logic (`/api/bookings/route.ts`) — concurrency safety required

This is the part that must not be built naively. The check-then-insert pattern (read current count, confirm it's under capacity, then insert) has a race condition if two requests hit at nearly the same moment for the last spot. Required approach:

```sql
-- Use a single atomic statement, not separate read-then-write calls from the API route.
-- Conceptual approach (exact implementation as a Postgres function or a single
-- transaction with a row lock — Codex should implement via a Supabase RPC function
-- for this specific operation, not raw client inserts):

BEGIN;
  SELECT capacity FROM classes WHERE id = :class_id FOR UPDATE;  -- lock the row
  -- count current confirmed bookings for that class_id + class_date
  -- if count < capacity: INSERT INTO class_bookings (...) and COMMIT
  -- else: ROLLBACK and return a "class is now full" response to the client
COMMIT;
```

The API route's job: validate input (Zod schema — name/email/phone required, valid email format), call this RPC function, and return either a success response (with the booking's `cancellation_token`, used immediately to build the confirmation email's cancel link — see §4) or a clear "this class just filled up" error the UI can show gracefully (since the visitor's view of "spots remaining" could be a few seconds stale by the time they submit — handle this as an expected case, not a server error).

### 3.3 Confirmation email

On successful booking, send a confirmation email (Resend, matching the signup flow's existing email integration per `07-signup-flow.md`) containing: class name, date, time, branch address, and a cancellation link (§4). Keep tone consistent with brand voice — direct, no exclamation-mark hype.

---

## 4. Cancellation — Secure Token Pattern (required, not optional)

Since there's no login, "is this person allowed to cancel this booking" can't be checked via session/auth. The **only** safe mechanism is a non-guessable token unique to that booking, sent only to the email the visitor provided at booking time.

**Required implementation:**
- `cancellation_token` is a `uuid` generated server-side at booking creation (already in the schema, §1) — this is what goes in the email link, **never the booking's primary-key `id`** if that ID is at all sequential or otherwise predictable. Using a separate random UUID specifically for this purpose (rather than reusing the row's own id) means even if `id` generation strategy changes later, the cancellation mechanism doesn't quietly become guessable.
- Cancellation link format: `/cancel-booking/[cancellation_token]`. This page does a server-side lookup by token; if found and `status = 'confirmed'`, show the booking details and a "Cancel This Booking" confirm button (don't auto-cancel on page load just from visiting the link — a confirm step prevents email link-preview bots or accidental clicks from cancelling a real booking).
- On confirmed cancellation: set `status = 'cancelled'`, `cancelled_at = now()`. This frees the spot immediately (since §1's computed-remaining-spots logic only counts `status = 'confirmed'` rows).
- Token lookups that don't match any booking, or match an already-cancelled booking, show a calm "This booking could not be found or has already been cancelled" state — not a generic 404, since this is a realistic and non-error path (someone re-clicking an old email link).

---

## 5. Admin visibility

Staff need to see real bookings (who's coming to which class, for headcount/prep purposes) — this is covered in `08-admin-dashboard.md`, flagged here so it's not forgotten: the admin panel needs a per-class, per-date roster view, not just the aggregate "spots remaining" number the public site shows.

---

## 6. Open item for the user

Real booking systems eventually run into "what happens with recurring classes far in the future" (e.g. can someone book 8 weeks out, or only this week/next week?) and "no-show policy" questions — these are business-process decisions, not technical ones, and don't block the v1 build, but worth deciding before launch: how far in advance should the timetable allow booking? Default assumption in this spec is **current week + next week only**, adjustable later.
