# IRONCORE — Gym / Fitness Website
### Full Build Specification v1.0
**For:** Codex / AI coding agent build-out
**Prepared by:** Product + Design spec (treat as source of truth — do not deviate from design tokens without flagging)
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + GSAP + Three.js (R3F) + Supabase

---

## 0. ONE-PARAGRAPH PITCH

IRONCORE is a premium strength & conditioning gym website. The site should feel like walking into a serious, no-excuses training facility at 6am: chalk dust, iron plates, taped grips, a scoreboard on the wall. Visually dark, intense, and athletic — near-black surfaces, one hot accent color used like a stopwatch hand, condensed scoreboard-style numerals for stats, and a signature animated "plate-loading" hero sequence instead of a generic gradient headline. No stock-photo-fitness-app clichés, no purple-blue SaaS gradients, no italic-everything.

---

## 1. DESIGN SYSTEM (NON-NEGOTIABLE — Codex must implement exactly)

### 1.1 Color Tokens

Define these as CSS variables in `globals.css` AND as Tailwind theme extensions. **No gradients anywhere in the UI.** Flat color only. This is a deliberate brand rule, not a limitation.

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

Tailwind config must map these 1:1 (e.g. `bg-bg`, `bg-surface`, `text-primary`, `text-accent`, `border-hairline`). **Forbidden:** any `bg-gradient-to-*` utility, any CSS `linear-gradient`/`radial-gradient` except the one explicitly allowed exception in §1.4 (hero plate sheen — see note).

### 1.2 Typography — 3 Roles, Used Strictly

| Role | Typeface | Usage | Notes |
|---|---|---|---|
| **Display / Scoreboard** | `Oswald` (Google Fonts) — condensed, bold, all-caps | Section titles, hero headline, big stat numbers | Tracked out slightly (`letter-spacing: 0.01em` for headlines, `0.04em` for all-caps eyebrows). Used SPARINGLY — never for body copy. |
| **Body** | `Inter` (Google Fonts) | Paragraphs, nav, buttons, form labels | Default weight 400/500. Clean, humanist, highly legible. |
| **Utility / Data** | `JetBrains Mono` (Google Fonts) | Prices, rep counts, timer displays, class times, set/rep notation, the plate-loading hero numbers | This is what makes stats feel like a gym scoreboard / weight plate readout instead of a generic SaaS dashboard. |

Type scale (rem, mobile → desktop via clamp):
- Hero H1: `clamp(2.75rem, 7vw, 6.5rem)` — Oswald, uppercase, line-height 0.95
- Section H2: `clamp(2rem, 4vw, 3.25rem)` — Oswald, uppercase
- H3: `1.5rem` — Oswald
- Body: `1rem`–`1.125rem` — Inter
- Caption/meta: `0.8125rem` — Inter, color `--color-text-muted`
- Stat numerals: `clamp(2.5rem, 5vw, 4rem)` — JetBrains Mono, weight 700

### 1.3 Layout & Structural Language

- **Sharp edges.** `border-radius: 0` on cards, buttons, images by default. Exception: pill-shaped nav CTA buttons may use `border-radius: 2px` max (near-sharp, not rounded). This matches the brand's "no-nonsense iron" feel.
- **Hairline rules**, not boxes/shadows, to separate sections (`border-top: 1px solid var(--color-border)`).
- **Numbered index motif is EARNED here** — unlike generic sites, this gym site has genuinely sequential content (timetable, 4-step signup flow, workout splits), so a recurring `001 / 002 / 003` monospace index marker next to section content is justified. Use it for: Programs list, How-it-works/signup steps, Trainer roster order. Do NOT use it decoratively on non-sequential content (e.g., don't number testimonials).
- **Whitespace:** generous vertical rhythm between sections (`py-24` to `py-32` desktop, `py-16` mobile). Let content breathe — intensity comes from typography and motion, not clutter.
- **Grid:** 12-col container, max-width `1440px`, gutter `24px` (`16px` mobile).

### 1.4 Signature Element — "Plate-Loading" Hero

This is the one bold, justified risk in the design — the single thing this site is remembered by.

**Concept:** Instead of a generic animated gradient blob or stock hero photo, the hero section features an interactive/animated **barbell with weight plates that load on dynamically** — built in Three.js (React Three Fiber). On page load, plates slide in from off-screen left/right and "clank" onto the bar in sequence (timed with GSAP), settling into place as the headline text reveals. On scroll, the camera does a subtle parallax dolly past the bar. This is real 3D geometry (simple primitives — cylinders + torus for plates, cylinder for bar — NOT a 3D model import requirement, keep it buildable with primitives + basic PBR materials so Codex doesn't need external assets), lit with a single warm key light + accent rim light in `--color-accent`, rendered on a flat `--color-bg` background (no gradient skybox).

**Fallback requirement:** On low-power devices / reduced-motion preference, replace the Three.js canvas with a static high-quality SVG/illustrated barbell graphic (flat colors, no gradient) and skip the animation — headline still fades/slides in via Framer Motion. This must be implemented, not optional — see §6 Accessibility.

**One exception to "no gradients" rule:** a very subtle radial sheen (5–8% opacity, accent color, large blur radius) is permitted ONLY behind the 3D plates to suggest stage lighting — this must be barely perceptible, not a visible color transition. Everything else stays flat.

### 1.5 Motion Language (Framer Motion + GSAP)

Motion must feel like **effort and impact**, not soft SaaS fades. Guidelines:
- Use **fast-in, settle-out easing** (`cubic-bezier(0.16, 1, 0.3, 1)` or GSAP `power3.out`) — snappy starts, not lazy linear drifts.
- Scroll-triggered reveals: content enters with a slight upward translate (16–24px) + opacity, staggered by 60–80ms per item in a list (trainer cards, program cards, timetable rows).
- Numbers (stats: "500+ Members", "12 Years", "40+ Classes/Week") should **count up** on scroll-into-view using a JS tween — this is a high-value, low-cost motion moment that reinforces the scoreboard motif.
- Hover states: cards lift `translateY(-4px)` with a hard-edged accent-color border appearing (`border-color` transition only — no box-shadow blur, keep it crisp/flat per brand).
- Page-load sequence: hero plate-loading animation (§1.4) is the ONE orchestrated big moment. Everything else should be comparatively quiet — per design philosophy, spend boldness in one place.
- Respect `prefers-reduced-motion`: disable count-up, parallax, and 3D scene; keep only opacity fades.

### 1.6 Imagery

- Photography style (placeholder guidance for the user to source/shoot later): high-contrast black & white or desaturated-with-accent-pop training photos — chalked hands, loaded barbells, training intensity, NOT smiling stock-photo treadmill shots.
- All images use `next/image` with a flat duotone overlay option (`--color-bg` shadows / `--color-text-primary` highlights) available as a reusable `<DuotoneImage>` component, so even placeholder stock images instantly match brand even before real photography is shot.
- Transformation gallery (§3.6) uses a strict before/after slider component — no decorative framing, just a hairline border and monospace caption (e.g., `12 WEEKS — JOHN D.`).

---

## 2. TECH STACK

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 14**, App Router, TypeScript strict mode | Match Awaisify Digital conventions |
| Styling | **Tailwind CSS** | Extended theme per §1, no default Tailwind gray/blue palette in use |
| Animation | **Framer Motion** (scroll reveals, page transitions, micro-interactions) + **GSAP** (hero plate-load sequence, timeline-based animation, ScrollTrigger for pinned sections) | |
| 3D | **React Three Fiber** + **drei** | Hero barbell scene only — keep scene complexity light for performance |
| Backend / DB | **Supabase** | Auth (optional, for member portal stretch goal), Postgres tables for signups, trainer data, class schedule, transformation gallery entries |
| Forms | **React Hook Form** + **Zod** validation | Signup form, contact form |
| Email (signup confirmation) | **Resend** (or Supabase Edge Function + Resend) | Triggered on successful signup insert |
| Icons | **Lucide React** | Flat, line-based, matches sharp-edge brand — no filled/rounded icon sets |
| Fonts | `next/font/google` — Oswald, Inter, JetBrains Mono | Self-hosted via next/font, no external font CDN calls |
| Deployment | Vercel | Match existing Awaisify deployment pattern |
| Analytics | GA4 (placeholder env var) | Match prior project pattern |

### 2.1 Folder Structure

```
/app
  /layout.tsx
  /page.tsx                      → Home
  /programs/page.tsx              → Full programs/membership listing
  /trainers/page.tsx               → Full trainer roster
  /trainers/[slug]/page.tsx        → Individual trainer profile
  /timetable/page.tsx              → Full class schedule
  /transformations/page.tsx        → Full gallery
  /join/page.tsx                   → Standalone signup flow
  /contact/page.tsx
  /api/signup/route.ts             → Handles Supabase insert + email trigger
  /api/contact/route.ts
/components
  /ui/                            → Button, Input, Select, Badge, Card (base primitives)
  /layout/                        → Navbar, Footer, MobileMenu
  /sections/                      → HeroPlateScene, ProgramsGrid, TrainerCard, TimetableGrid,
                                     TransformationSlider, StatsCounter, Testimonials, CTABand
  /three/                         → BarbellScene.tsx, PlateModel.tsx, hero canvas wrapper
/lib
  /supabase/                      → client.ts, server.ts, queries.ts
  /validations/                   → zod schemas (signupSchema, contactSchema)
  /utils/                          → cn helper, formatters
/public
  /fonts (if not using next/font), /images, /icons
```

---

## 3. PAGE-BY-PAGE SPEC

### 3.1 Global Navbar
- Fixed/sticky, transparent over hero, solidifies to `--color-bg` with hairline bottom border on scroll (Framer Motion `useScroll` driven).
- Logo (wordmark, Oswald, uppercase, accent-colored "CORE" suffix — e.g. **IRON**`CORE` with CORE in accent).
- Links: Programs · Trainers · Timetable · Transformations · Contact
- CTA button "JOIN NOW" — accent-filled, sharp corners, JetBrains Mono label, hover inverts to outline.
- Mobile: full-screen takeover menu, links stagger in via Framer Motion, large Oswald type.

### 3.2 Hero Section
- Full viewport height (`100svh`).
- Left/center: Headline (Oswald, huge) — e.g. **"TRAIN LIKE THE BAR DOESN'T LIE."** (Codex/copywriter may refine — tone: blunt, confident, no exclamation-mark hype-bro energy).
- Subhead (Inter, muted): one sentence on what the gym offers — strength training, conditioning, coaching.
- Two CTAs: primary "START YOUR TRIAL" (accent fill), secondary "VIEW PROGRAMS" (ghost/outline).
- Right/background: the 3D plate-loading scene (§1.4).
- Below fold-line: thin horizontal stat strip — count-up numbers: Members trained, Years open, Classes/week, Avg. member rating — JetBrains Mono numerals, Inter labels, separated by hairline verticals.

### 3.3 Membership / Programs Section (`/programs`)
- Section eyebrow: `MEMBERSHIP` (small caps, monospace, accent color).
- 3-tier pricing cards (e.g., **FOUNDATION / PERFORMANCE / ELITE** — or align to whatever 3 tiers fit the gym's real offering):
  - Each card: numbered index (`001/002/003`), tier name (Oswald), price (JetBrains Mono, large), billing cadence toggle (Monthly/Annual — annual shows a flat "2 months free" badge, no gradient banner), feature checklist (Lucide check icons), single CTA button.
  - Middle tier visually emphasized via accent-colored top border (1–2px) and a small `MOST COMMITTED` tag — avoid the cliché "MOST POPULAR" ribbon-with-shadow pattern; keep it flat/textual.
  - Hover: card lifts, border sharpens to accent.
- Below cards: a comparison table (full feature matrix) collapsible on mobile into accordion per tier.
- Day-pass / drop-in rate noted in fine print below table.

### 3.4 Trainer Profiles (`/trainers` + `/trainers/[slug]`)
- Roster grid (3-col desktop / 1-col mobile): photo (duotone-treated), name (Oswald), specialty tag (e.g. `POWERLIFTING`, `CONDITIONING`, `MOBILITY` — monospace pill, sharp corners, accent border only, transparent fill), short 1-line bio.
- Hover: photo desaturates fully → color pop on accent-tagged specialty text only.
- Individual trainer page: large portrait, full bio, certifications list, "philosophy" pull-quote (large Oswald italic-free — NO italics per brand rule, use accent color for emphasis instead), client results if available, embedded class schedule filtered to that trainer, booking CTA.
- Data model: trainers table in Supabase (`id, slug, name, photo_url, specialty, bio, certifications[], philosophy_quote, instagram_url, is_active`).

### 3.5 Class Timetable (`/timetable` + home preview)
- Full weekly grid (Mon–Sun columns × time-slot rows), desktop = real grid table; mobile = day-tabbed accordion list.
- Each class block: class name, time range (monospace), trainer name (linked to profile), intensity indicator (1–3 flame/bolt icons, Lucide, NOT a percentage bar — keep it iconographic and quick-scan).
- Filter bar: filter by class type (Strength / Conditioning / Mobility / Hybrid) and by trainer — flat tab/pill controls, no dropdown-heavy UI on desktop.
- Data model: `classes` table (`id, name, day, start_time, end_time, trainer_id, intensity, type, capacity, spots_left`).
- "Spots left" shown only when `spots_left <= 5`, in accent color, monospace — creates urgency without being a fake-scarcity dark pattern (must reflect real data, not hardcoded).

### 3.6 Transformation Gallery (`/transformations`)
- Masonry or strict-grid layout of before/after entries.
- Each entry: interactive **drag slider** (before/after image compare — build custom or use a lightweight library), caption below in monospace (`DURATION — FIRST NAME + LAST INITIAL`), optional short quote.
- Filter by goal (Fat Loss / Strength / Recomposition / Athletic Performance) — flat pill filters matching timetable filter style for consistency.
- Consent note in footer of this page: small print confirming all members pictured opted in — good practice to spec even though it's not a "feature," Codex should include the UI element.
- Data model: `transformations` table (`id, member_name, duration_weeks, goal_tag, before_image_url, after_image_url, quote, is_published`).

### 3.7 Signup Form (`/join` + embedded shorter version on home)
- Multi-step form (3 steps), each step shown with the numbered-index motif (`001 → 002 → 003`) doubling as a progress indicator:
  1. **Goal** — single-select cards (Lose Fat / Build Strength / General Fitness / Sport-Specific) — visual not dropdown.
  2. **Plan** — pulls live tier data from §3.3 (radio-style cards, price visible).
  3. **Details** — name, email, phone, preferred start date, optional message. React Hook Form + Zod validation, inline error states in `--color-error`, no red glow/shadow — just text + thin underline color change (matches flat brand rule).
- Submit → POST to `/api/signup` → Supabase insert into `leads` table → triggers confirmation email via Resend → success state replaces form with a flat confirmation panel (no celebratory confetti animation — keep tone consistent: confident, not gimmicky) plus "what happens next" 3-line list.
- Data model: `leads` table (`id, name, email, phone, goal, selected_plan, preferred_start_date, message, created_at, status`).
- Spam protection: honeypot field + rate limiting on the API route.

### 3.8 Footer
- 4-column: Brand blurb + social icons (Lucide, flat, accent on hover) · Quick links · Programs list links · Contact info + embedded small map placeholder.
- Bottom bar: copyright, Privacy/Terms links, "Built by Awaisify Digital" credit line (small, monospace, muted — optional but matches user's portfolio-building pattern).
- Newsletter mini-signup (email only, separate from main lead form) feeding a `newsletter_subscribers` Supabase table.

---

## 4. SUPABASE SCHEMA SUMMARY

```sql
-- trainers
id uuid pk, slug text unique, name text, photo_url text, specialty text,
bio text, certifications text[], philosophy_quote text, instagram_url text,
is_active boolean default true, created_at timestamptz default now()

-- classes
id uuid pk, name text, day text, start_time time, end_time time,
trainer_id uuid references trainers(id), intensity smallint check (intensity between 1 and 3),
type text, capacity int, spots_left int, created_at timestamptz default now()

-- membership_tiers
id uuid pk, name text, price_monthly numeric, price_annual numeric,
features text[], is_featured boolean default false, sort_order int

-- transformations
id uuid pk, member_name text, duration_weeks int, goal_tag text,
before_image_url text, after_image_url text, quote text,
is_published boolean default false, created_at timestamptz default now()

-- leads (signup form submissions)
id uuid pk, name text, email text, phone text, goal text,
selected_plan_id uuid references membership_tiers(id),
preferred_start_date date, message text, status text default 'new',
created_at timestamptz default now()

-- newsletter_subscribers
id uuid pk, email text unique, created_at timestamptz default now()
```

Row Level Security: public read on `trainers`, `classes`, `membership_tiers`, `transformations` (where `is_published`/`is_active = true`); insert-only public access on `leads` and `newsletter_subscribers`; no public update/delete on any table (admin-only via service role for a future admin dashboard — out of scope for v1 but schema should anticipate it).

---

## 5. SEO & PERFORMANCE

- Full metadata API usage per page (`generateMetadata`), OpenGraph + Twitter card images per major page.
- `sitemap.xml` + `robots.txt` generated via Next.js conventions.
- JSON-LD structured data: `LocalBusiness`/`HealthClub` schema on home page (name, address, opening hours, phone — placeholder fields for user to fill), `Person` schema on trainer pages.
- Images: `next/image` everywhere, AVIF/WebP, explicit width/height to avoid CLS.
- 3D hero scene must lazy-load (dynamic import, `ssr: false`) and show a flat-color placeholder until WebGL context is ready — never block LCP on the Three.js bundle.
- Lighthouse performance budget: target 90+ mobile performance despite 3D hero — achieved via the static-fallback strategy in §1.4, not by cutting the feature.
- Core Web Vitals: lazy-load below-fold sections' heavy assets (gallery images, trainer photos) via native `loading="lazy"`.

---

## 6. ACCESSIBILITY (REQUIRED, NOT OPTIONAL)

- `prefers-reduced-motion`: disables 3D scene (static SVG fallback), count-up numbers (show final value instantly), parallax, and stagger delays (instant fade only).
- Full keyboard navigation: all interactive cards (program tiers, trainer cards, timetable filters) must be focusable with a visible accent-colored 2px outline (sharp, not glow) — no focus traps in the multi-step form or mobile menu.
- Color contrast: verify `--color-text-secondary` and `--color-text-muted` against `--color-bg` meet WCAG AA for body text size; accent-on-dark CTA buttons must meet AA for the button label text.
- Before/after slider (§3.6) must have a non-drag accessible alternative (e.g., a toggle button) for keyboard/screen-reader users.
- Form: proper `<label>` association, `aria-invalid`/`aria-describedby` on validation errors, announced via `aria-live` region on submit success/failure.
- Alt text required on all images — written descriptively, not "image of trainer," per the gym's actual content (e.g., "Coach Bilal demonstrating a barbell back squat").

---

## 7. CONTENT THE USER STILL NEEDS TO PROVIDE

Codex should build with realistic placeholder content matching brand voice, but flag these as TODOs for the real gym owner to supply before launch:
- Real gym name/branding (spec uses "IRONCORE" as placeholder — confirm or replace)
- Actual address, hours, phone, map embed
- Real trainer photos, bios, certifications
- Real membership pricing and feature lists
- Real before/after transformation photos + written consent confirmation
- Real class schedule
- Brand logo file (current spec assumes wordmark-only logo, no icon mark — confirm)

---

## 8. BUILD PRIORITY ORDER (suggested sequence for Codex)

1. Design tokens + Tailwind config + font setup (§1, §2)
2. Layout shell: Navbar, Footer, base UI primitives (Button, Card, Input)
3. Home page static sections (no 3D yet): Hero (static fallback version first), Stats strip, Programs preview, Trainer preview, Timetable preview, CTA band
4. Supabase project setup + schema migration (§4) + seed data
5. Full Programs, Trainers, Timetable, Transformations pages wired to Supabase
6. Signup multi-step form + `/api/signup` route + Resend email
7. 3D plate-loading hero scene (build last — highest complexity, isolated component, won't block other progress)
8. Motion pass: Framer Motion scroll reveals + GSAP refinements across all sections
9. SEO metadata, sitemap, structured data
10. Accessibility audit + reduced-motion fallback pass
11. Performance pass (Lighthouse, image optimization, lazy loading)
12. Responsive QA across breakpoints (375px / 768px / 1024px / 1440px+)

---

## 9. NOTES FOR CODEX

- Do not substitute the color palette, type roles, or "no gradient" rule for a generic dark-theme default — these are deliberate brand decisions, not arbitrary choices to optimize away.
- The 3D hero is the signature element — don't skip it or silently downgrade it to a static image without flagging that tradeoff back to the user first.
- Keep the numbered-index motif (§1.3) restricted to genuinely sequential content only.
- All monospace numerals (prices, stats, times, reps) should consistently use JetBrains Mono — this is part of what makes the site feel like a gym scoreboard rather than a SaaS dashboard, so don't let body-font numerals creep into these spots.
- Flag any place where Supabase schema needs adjustment once real gym data/requirements are known.
