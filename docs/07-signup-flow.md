# IRONCORE — Feature Spec: Signup / Lead Capture Flow
### File 07 of 09 — build LAST among public-facing pages (depends on everything else)

**Depends on:** `01-design-system.md`, `02-branch-architecture.md`, `03-membership-and-pt-packages.md`
**Required by:** `08-admin-dashboard.md` (staff act on leads this flow creates)

---

## 0. What this solves

Original `spec.md` §3.7 had a 3-step form assuming a single gym and one offering type. Now: the form must (1) know which branch the lead is for, and (2) handle that a visitor might be interested in **either** general membership **or** a personal training package — these lead to different next steps for staff, so the form shouldn't force every visitor through a "pick a membership tier" step if what they actually want is PT coaching.

**No online payment** (confirmed) — this entire flow ends in a captured lead, not a transaction. Don't build any payment UI, even a placeholder, since that would misrepresent what happens next to the visitor.

---

## 1. Data Model

```sql
-- leads
id uuid pk,
branch_id uuid references branches(id),              -- always populated, from active branch context
name text,
email text,
phone text,
goal text,                                            -- "Lose Fat" / "Build Strength" / "General Fitness" / "Sport-Specific"
interest_type text check (interest_type in ('membership', 'personal_training')),
membership_tier_id uuid references membership_tiers(id),   -- nullable, set only if interest_type = 'membership'
pt_package_id uuid references pt_packages(id),               -- nullable, set only if interest_type = 'personal_training'
preferred_start_date date,
message text,
status text check (status in ('new','contacted','converted','not_interested')) default 'new',
created_at timestamptz default now()
```

RLS: insert-only public access (no public read — a lead's own email/phone shouldn't be queryable by other visitors). Full read/update reserved for the admin dashboard via service-role access.

---

## 2. Form Structure — 4 Steps (Revised from Original 3)

The original 3-step flow (Goal → Plan → Details) assumed "Plan" always meant a membership tier. Since interest can now branch into two different product types, insert a step to resolve that first:

1. **Goal** — unchanged from original: single-select cards (Lose Fat / Build Strength / General Fitness / Sport-Specific). Visual cards, not a dropdown.
2. **Interest Type** — NEW: two large option cards, "Join the Gym" (membership) vs "Train with a Coach" (personal training). This single choice determines what step 3 shows.
3. **Plan / Package** — conditionally rendered based on step 2:
   - If membership: shows the active branch's membership tiers (live data from `membership_tier_pricing`, per `03-membership-and-pt-packages.md`) as radio-style cards with price visible.
   - If personal training: shows the active branch's PT packages, grouped by type as described in `03-membership-and-pt-packages.md` §2.2, as radio-style cards.
   - Either way, this step's data pulls from whichever branch is currently active (§2 branch context) — if the visitor switches branch mid-form, re-fetch this step's options rather than carrying over stale pricing from a different branch.
4. **Details** — unchanged from original: name, email, phone, preferred start date, optional message. React Hook Form + Zod validation, inline error states in `--color-error` (text + underline color, no glow/shadow, per flat-design brand rule).

The numbered-index motif (`001 → 002 → 003 → 004`) continues to double as the progress indicator, as in the original spec.

**Branch context is implicit, not a form step** — the visitor doesn't pick a branch as part of this flow; it's inherited from whatever branch is currently active in the global context (navbar switcher). If they want to sign up for a different branch than the one currently active, they switch branches first (via the navbar), which is more consistent with how the rest of the site already works than adding a 5th "pick your branch" step here.

---

## 3. Submission

POST to `/api/signup` → Zod-validated server-side → Supabase insert into `leads` (with `branch_id` taken from a server-trusted source — see note below, not blindly from client payload) → triggers confirmation email via Resend.

**Security note for Codex:** the `branch_id` sent with the form should be cross-checked server-side against the actual list of `is_active` branches before insert (reject if it doesn't match a real branch) — this is a basic validation step, not a serious threat model concern, but prevents garbage data from a tampered client request landing in the leads table.

Confirmation email content should differ slightly by `interest_type` — a membership inquiry confirmation can mention "see you on the floor," a PT inquiry confirmation should mention a coach will reach out to discuss goals — small copy branch, same email template otherwise.

Success state: flat confirmation panel (no confetti, per original spec's "confident not gimmicky" tone direction) + a short "what happens next" list, which should also differ slightly by `interest_type` (e.g. membership → "Our team will call you within 24 hours to get you started"; PT → "A coach will reach out to discuss your goals and match you with the right package").

---

## 4. Spam Protection

As original spec: honeypot field + rate limiting on the API route. No change needed here, just carried forward.

---

## 5. Home Page Embedded Mini-Version

Original spec mentioned a shorter embedded version on the home page in addition to the full `/join` page. Given the flow is now 4 steps instead of 3, **recommend the home page embed stay a simple "Goal + Email" capture (steps 1 + a single email field) that hands off to the full `/join` page to complete steps 2–4**, rather than trying to compress all 4 steps into a home-page widget. This keeps the home page lightweight while still capturing intent from visitors who aren't ready to commit to a full form on first scroll.

---

## 6. Relationship to Admin Dashboard

Every lead created here needs to be visible and actionable by staff — covered fully in `08-admin-dashboard.md`. This file only owns the public-facing capture; status transitions (`new → contacted → converted/not_interested`) happen exclusively in the admin panel, never from the public site.
