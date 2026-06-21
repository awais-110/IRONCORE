# IRONCORE — Feature Spec: Design System
### File 01 of 09 — build FIRST, every other file inherits this

**Depends on:** Nothing — this is the foundation.
**Required by:** Every other file.

---

## 0. What this is

This file is the design-token and visual-rule foundation extracted from the original monolithic spec. Every other feature file in this set inherits these rules — they are not re-stated per feature, just referenced. If a feature file's visual description ever seems to conflict with this file, this file wins; flag the conflict rather than silently picking one.

**Brand identity in one line:** a serious, no-excuses strength training facility at 6am — chalk dust, iron plates, taped grips, a scoreboard on the wall. Dark, intense, athletic. One hot accent color, used like a stopwatch hand. No gradients, no rounded-everything, no stock-photo-fitness-app clichés.

---

## 1. Color Tokens

```css
:root {
  /* Surfaces */
  --color-bg:            #0A0A0B;  /* near-black, warm — like rubber gym flooring, NOT pure #000 */
  --color-surface:       #161618;  /* card / panel surface */
  --color-surface-raised:#1D1D20;  /* hover / elevated state */
  --color-border:        #2A2A2D;  /* hairline dividers */
  --color-border-strong: #3A3A3D;  /* emphasized dividers, table rules */

  /* Text */
  --color-text-primary:  #EDEAE4;  /* "chalk white" — never pure #FFF */
  --color-text-secondary:#B8B5AE;
  --color-text-muted:    #8A8A8E;

  /* The ONE accent — use like a stopwatch second-hand: sparingly, always intentional */
  --color-accent:        #FF4D1C;  /* vermilion-orange */
  --color-accent-dim:    #C73D15;  /* pressed/hover state of accent */
  --color-accent-tint:   #2A1410;  /* accent used at ~10% as a background wash only, flat not gradient */

  /* Functional (forms, status) */
  --color-success:       #4CAF6D;
  --color-error:         #E5484D;
}
```

Tailwind config maps these 1:1 (`bg-bg`, `bg-surface`, `text-primary`, `text-accent`, `border-hairline`, etc).

**Forbidden:** any `bg-gradient-to-*` utility, any CSS `linear-gradient`/`radial-gradient`, with exactly one narrow exception defined in `09-hero-3d-scene.md` (a near-imperceptible radial sheen behind the hero's 3D scene). Everywhere else: flat color only. This is a deliberate brand decision — don't "fix" it toward a generic dark-theme gradient default.

---

## 2. Typography — 3 Roles, Used Strictly

| Role | Typeface | Usage | Notes |
|---|---|---|---|
| **Display / Scoreboard** | `Oswald` (Google Fonts) — condensed, bold, all-caps | Section titles, hero headline, big stat numbers | Tracked slightly (`letter-spacing: 0.01em` headlines, `0.04em` all-caps eyebrows). Never used for body copy. |
| **Body** | `Inter` (Google Fonts) | Paragraphs, nav, buttons, form labels | Weight 400/500. |
| **Utility / Data** | `JetBrains Mono` (Google Fonts) | Prices, rep counts, timer displays, class times, set/rep notation, stat numerals | This is what makes stats read as a gym scoreboard rather than a SaaS dashboard — don't let body-font numerals creep into these spots. |

Type scale (clamp-based, mobile → desktop):
- Hero H1: `clamp(2.75rem, 7vw, 6.5rem)` — Oswald, uppercase, line-height 0.95
- Section H2: `clamp(2rem, 4vw, 3.25rem)` — Oswald, uppercase
- H3: `1.5rem` — Oswald
- Body: `1rem`–`1.125rem` — Inter
- Caption/meta: `0.8125rem` — Inter, `--color-text-muted`
- Stat numerals: `clamp(2.5rem, 5vw, 4rem)` — JetBrains Mono, weight 700

---

## 3. Layout & Structural Language

- **Sharp edges.** `border-radius: 0` on cards, buttons, images by default. Exception: pill-shaped nav CTA buttons may use `border-radius: 2px` max.
- **Hairline rules**, not shadows/boxes, to separate sections.
- **Numbered index motif** (`001 / 002 / 003`, monospace) — reserved for genuinely sequential content (programs list, signup steps, trainer roster order, class booking progress). Never used decoratively on non-sequential content like testimonials.
- **Whitespace:** generous vertical rhythm (`py-24` to `py-32` desktop, `py-16` mobile).
- **Grid:** 12-col container, max-width `1440px`, gutter `24px` (`16px` mobile).

---

## 4. Motion Language

Motion should feel like **effort and impact**, not soft SaaS fades:
- Fast-in, settle-out easing (`cubic-bezier(0.16, 1, 0.3, 1)` or GSAP `power3.out`) — snappy starts, not lazy drifts.
- Scroll reveals: slight upward translate (16–24px) + opacity, staggered 60–80ms per list item.
- Stat numbers **count up** on scroll-into-view.
- Hover: cards lift `translateY(-4px)` with a hard-edged accent border appearing — no box-shadow blur (flat, per brand rule).
- Respect `prefers-reduced-motion`: disable count-up, parallax, and any 3D scene; keep only opacity fades.

---

## 5. Imagery

- Photography direction: high-contrast B&W or desaturated-with-accent-pop training photos — chalked hands, loaded barbells, real intensity. Not smiling stock-photo treadmill shots.
- Reusable `<DuotoneImage>` component (flat duotone overlay using `--color-bg` shadows / `--color-text-primary` highlights) so placeholder stock images still read on-brand before real photography exists.

---

## 6. Component Base Rules (apply across all feature files)

- Buttons: flat fill (`--color-accent`) or outline/ghost — no gradient fills, no shadow glow.
- Form inputs: hairline border, color shifts to `--color-accent` on focus (no glow ring), validation errors shown via text + underline color change in `--color-error`.
- Pills/tags (specialty tags, filters): accent-colored border with transparent fill — not solid-fill badges.
- Icons: Lucide React, flat/line-based — matches sharp-edge brand, no filled/rounded icon sets.
