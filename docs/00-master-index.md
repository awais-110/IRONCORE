# IRONCORE — Master Spec Index
### v2.0 — Multi-file feature spec system

**Why this exists:** The original `spec.md` was a single monolithic document. As the real scope clarified (multi-branch, separate PT packages, admin needs), a single file became hard to hand to Codex incrementally and hard for you to review piece by piece. This index replaces it: each feature now has its own spec file, independently buildable and reviewable.

**How to use this with Codex:** Hand files in the build order below, one at a time or in small batches. Each file is self-contained but references others where there's a real dependency (e.g. Timetable depends on Branch Architecture existing first). Don't skip ahead of a dependency — Codex will end up guessing at schema that's defined "later."

---

## Confirmed product facts (do not re-derive — these are settled)

- **Real client gym**, not a template/demo — real branches, real trainers, real data will go in eventually.
- **Multiple branches/locations**, exact count unknown/growing — architecture must not hardcode a branch count anywhere.
- **Trainers are many-to-many with branches** — a trainer can work at one or several branches. Classes/timetable are branch-specific (one class belongs to exactly one branch).
- **Offerings = 3 distinct product types**, not one flat list: (1) general strength/gym-floor membership tiers, (2) group fitness classes (the spec's original "timetable"), (3) personal training packages sold separately from membership.
- **No online payment in v1.** Site captures leads only; sales close offline (call/in-person/WhatsApp). Do not build a checkout/cart flow.
- **No member-facing login/dashboard in v1.** This is intentionally deferred — see rationale in `08-admin-dashboard.md`. What v1 DOES need is a staff-facing admin panel, which is a different, smaller thing.
- **Language: English only** for all member-facing copy. (Internal admin UI can stay English too — no bilingual toggle anywhere in v1.)
- **Design system** (colors, type, motion, "no gradients" rule, the plate-loading hero) is locked from v1 — see `01-design-system.md`. Do not redesign this per-feature; every spec below inherits it.

---

## File map

| # | File | Covers | Depends on |
|---|---|---|---|
| 01 | `01-design-system.md` | Color tokens, type system, motion language, component visual rules | — (foundation, build first) |
| 02 | `02-branch-architecture.md` | Branch data model, branch-switcher UI, URL structure, how every other feature becomes branch-aware | 01 |
| 03 | `03-membership-and-pt-packages.md` | Gym-floor membership tiers + separate Personal Training package catalog | 01, 02 |
| 04 | `04-trainers.md` | Trainer roster, profile pages, many-to-many branch assignment | 01, 02 |
| 05 | `05-timetable.md` | Branch-scoped group class schedule, class types, capacity | 01, 02, 04 |
| 06 | `06-transformation-gallery.md` | Before/after gallery, branch + goal filtering | 01, 02 |
| 07 | `07-signup-flow.md` | Multi-step lead form, now branch-aware, covers all 3 offering types | 01, 02, 03, 05 |
| 08 | `08-admin-dashboard.md` | Staff-only panel: leads inbox, branch/trainer/class/gallery management | 02–07 (touches all data) |
| 09 | `09-hero-3d-scene.md` | Reference doc for the already-built interactive barbell hero component | 01 |

Existing original `spec.md` is now superseded by files 01–07 + 09 combined; keep it only as historical reference, don't hand it to Codex alongside these (would create conflicting instructions — the schema in old `spec.md` does NOT have branch_id columns and is now wrong).

---

## Recommended build order for Codex

1. `01-design-system.md` — tokens, fonts, base UI primitives
2. `02-branch-architecture.md` — this changes the DB shape for everything downstream; must exist before any other table is created
3. `04-trainers.md` (before Timetable, since Timetable references trainers)
4. `03-membership-and-pt-packages.md`
5. `05-timetable.md`
6. `06-transformation-gallery.md`
7. `09-hero-3d-scene.md` (drop in the already-built, already-tested component)
8. `07-signup-flow.md` (last of the public-facing pieces — it pulls live data from branches, tiers, PT packages, so everything it depends on should exist first)
9. `08-admin-dashboard.md` (last overall — it's a read/write surface over everything above)

---

## Open questions still pending (not yet asked / not yet answered)

These will get their own clarifying questions before the relevant file is finalized — flagging here so nothing is silently assumed:

- **PT package structure**: sold per-session, per-block (e.g. "8 sessions/month"), or per-goal program? Affects `03-membership-and-pt-packages.md` schema.
- **Branch display**: should the homepage ask the visitor to pick a branch first (location-gate), or show all branches and let content (timetable, trainers) be filterable? Affects `02-branch-architecture.md` UX.
- **Trainer-to-branch assignment in UI**: should the public trainer profile show "works at: Branch A, Branch C" or does each branch get its own filtered trainer list with no cross-branch indication? Affects `04-trainers.md`.
- **Class capacity/booking**: does "spots left" in the original spec mean a real booking system (member reserves a spot) or just a display number staff update manually? This is a meaningfully different build. Affects `05-timetable.md`.

Each of these is asked at the top of its relevant file before the spec body, so you can answer in context rather than all at once up front.
