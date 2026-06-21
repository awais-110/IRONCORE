# IRONCORE — Feature Spec: Membership Tiers & Personal Training Packages
### File 03 of 09

**Depends on:** `01-design-system.md`, `02-branch-architecture.md` (branch-specific pricing model)
**Required by:** `07-signup-flow.md` (pulls live tier/package data into the signup form)

---

## 0. What this solves

The original `spec.md` had one flat "3-tier pricing card" model for general membership. The real offering is **two distinct product types**:

1. **Gym-floor membership tiers** — ongoing access to train (Foundation/Performance/Elite-style recurring plans).
2. **Personal Training (PT) packages** — sold separately from membership, and per your confirmation, **not one fixed shape** — they can be a single session, a session-pack, a recurring monthly block, or a fixed-length goal program. These are genuinely different purchase structures, not just different prices on the same template.

Additionally: **pricing can differ by branch.** A flat global price field is no longer correct — every priced item needs to resolve to a specific branch's price.

---

## 1. Data Model

### 1.1 Membership tiers (gym-floor access)

```sql
-- membership_tiers
id uuid pk,
name text,                          -- "FOUNDATION", "PERFORMANCE", "ELITE"
description text,
features text[],                    -- shared feature list, same across branches
is_featured boolean default false,  -- drives the "MOST COMMITTED" emphasis styling
sort_order int,
is_active boolean default true,
created_at timestamptz default now()

-- membership_tier_pricing  (branch-specific price for a given tier)
id uuid pk,
tier_id uuid references membership_tiers(id),
branch_id uuid references branches(id),
price_monthly numeric,
price_annual numeric,               -- nullable if annual billing isn't offered at that branch
currency text default 'PKR',
unique (tier_id, branch_id)
```

**Why split into two tables instead of a `branch_id` column on `membership_tiers` directly:** the tier's *identity* (name, features, what it includes) is shared across branches — you don't want 6 branches × 3 tiers = 18 separate "Foundation" rows that can drift out of sync in description/features. Only the *price* varies. This is the correct normalization for "same product, different price by location," and it also means: if a tier's feature list changes, it changes everywhere in one edit, but a single branch's price can be adjusted without touching anything else.

### 1.2 Personal Training packages

```sql
-- pt_packages
id uuid pk,
name text,                          -- "Single Session", "10-Session Pack", "Monthly Performance Coaching", "12-Week Transformation Program"
package_type text check (package_type in ('single_session', 'session_pack', 'monthly_recurring', 'fixed_program')),
description text,
trainer_tier text,                  -- optional, e.g. "Any Trainer" vs "Senior Coach" if pricing differs by trainer level — nullable if not applicable
sort_order int,
is_active boolean default true,

-- type-specific attributes (only the relevant ones are populated per package_type; rest stay null)
session_count int,                  -- used by 'session_pack' (e.g. 10) — null for other types
duration_weeks int,                 -- used by 'fixed_program' (e.g. 12) — null for other types
sessions_per_month int,             -- used by 'monthly_recurring' (e.g. 8) — null for other types

created_at timestamptz default now()

-- pt_package_pricing  (branch-specific price, same split-table reasoning as membership)
id uuid pk,
package_id uuid references pt_packages(id),
branch_id uuid references branches(id),
price numeric,                      -- single price field; what it's "per" is implied by package_type
                                     -- (per session for single_session, per pack for session_pack,
                                     --  per month for monthly_recurring, total for fixed_program)
currency text default 'PKR',
unique (package_id, branch_id)
```

**Note on `price` meaning being type-dependent:** rather than separate `price_per_session` / `price_per_pack` / `price_per_month` / `price_total` columns (which would mean three of the four are always null on any given row — messy), one `price` column is used and the UI label is derived from `package_type`. This keeps the table clean; the display layer (§2) is responsible for rendering "/session" vs "/month" vs "total" correctly based on type.

RLS for both feature tables: public read where `is_active = true`; pricing tables public read with no restriction beyond their parent's active status; no public write on any of these — pricing changes go through the admin dashboard (`08-admin-dashboard.md`), not the public site.

---

## 2. Display Logic

### 2.1 Membership tier cards (`/programs` or branch-scoped equivalent)

Same visual structure as original spec §3.3 (numbered index, monospace price, middle-tier emphasis), with one addition: **price resolves against the active branch context** (`02-branch-architecture.md` §2). If a tier has no `membership_tier_pricing` row for the currently active branch, do not silently show $0 or hide the tier — show a flat "Contact for pricing at this location" state instead, since a missing price row is a real data gap that should be visible to staff (and not misleadingly rendered as free or broken).

Billing toggle (Monthly/Annual) behaves as in the original spec — flat "2 months free" text badge, no banner/ribbon styling.

### 2.2 PT package display (new section, separate from membership tiers — do not merge into the same grid)

Distinct visual section, positioned after the membership tiers section, with its own eyebrow label (`PERSONAL TRAINING`, same monospace/accent treatment as `MEMBERSHIP` eyebrow). Cards group by `package_type` rather than a flat list, since the four types are genuinely different decisions for the visitor:

- **Single Session** — shown as one simple card, price labeled `/session`.
- **Session Packs** — if multiple pack sizes exist (e.g. 5-pack, 10-pack), shown as a small card row, price labeled `/pack` with `session_count` shown prominently in the monospace stat style (e.g. `10×` before "SESSIONS").
- **Monthly Recurring** — price labeled `/month`, with `sessions_per_month` shown the same way (e.g. `8×` "SESSIONS/MONTH").
- **Fixed Programs** — price labeled total (e.g. `PKR 45,000` with smaller text "12-week program" below, not `/month` or `/session`), `duration_weeks` shown as part of the card subtitle rather than a separate stat.

Each PT card carries the same numbered-index motif as membership tiers (continues the sequence or starts its own — Codex's call, but be consistent: don't number membership 001-003 and then restart PT packages at 001 again on the same page; continue 004 onward if they're visually one flowing list, or give PT its own visually distinct section where restarting at 001 reads as intentional, not a duplicate-numbering bug).

---

## 3. Relationship to Signup Flow

The `leads` table (defined fully in `07-signup-flow.md`) needs to reference what the visitor was interested in, but since "interest" can now be a membership tier OR a PT package, the schema there should accommodate both — flagged here so it's not designed in isolation:

```sql
-- relevant columns on leads, defined fully in 07-signup-flow.md:
interest_type text check (interest_type in ('membership', 'personal_training')),
membership_tier_id uuid references membership_tiers(id),   -- nullable, populated only if interest_type = 'membership'
pt_package_id uuid references pt_packages(id),               -- nullable, populated only if interest_type = 'personal_training'
branch_id uuid references branches(id)                       -- always populated
```

---

## 4. Open question for the user (not yet answered — confirm before Codex builds this section)

You said PT packages are "a mix" of types — to actually populate real package data (not placeholder), I'll need from you eventually: which specific package types this gym actually sells (e.g. do they do fixed-length programs at all, or mainly session packs?), and roughly how many of each. Not required to build the schema/UI (which supports all four types regardless), but required before launch content is real instead of placeholder. Flagging here rather than blocking the spec on it.
