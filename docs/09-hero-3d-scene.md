# IRONCORE — Feature Spec: Hero 3D Scene
### File 09 of 09

**Depends on:** `01-design-system.md` (colors used in the scene)
**Status:** **Already built and verified** — this file is a reference doc, not a build instruction. Hand Codex the actual `BarbellScene.tsx` file alongside this spec.

---

## 0. What this is

The hero's signature visual element: an interactive 3D barbell with weight plates, replacing a generic gradient/stock-photo hero. This was built and tested earlier in this project (TypeScript compiled clean, production build verified via Vite) — this file documents what it does and how to integrate it, since the component file itself doesn't need to be re-spec'd, only wired in correctly.

---

## 1. What it does

- **Idle state:** the barbell gently tilts toward wherever the cursor is, smoothly lerped (never snaps to position).
- **Drag-to-spin:** click-and-drag (or touch-and-drag) anywhere on the canvas spins the barbell on its long axis, like physically spinning a loaded bar. Releasing leaves it spinning with decaying inertia, not an abrupt stop.
- **Hover glow:** hovering the accent-ring plate (the orange glowing ring on the right-side plate stack, matching the originally provided reference image) pulses its emissive brightness up smoothly.
- **Reduced motion:** when `prefers-reduced-motion` is set, idle tilt and drag inertia are disabled entirely — the scene renders its static first frame only.

---

## 2. Integration

```tsx
// In the Hero section component:
import dynamic from "next/dynamic";

const BarbellScene = dynamic(() => import("@/components/three/BarbellScene"), {
  ssr: false,
  loading: () => <HeroStaticFallback />, // see §3
});
```

File location: `/components/three/BarbellScene.tsx` — drop in as-is, it's self-contained (no external model assets, built from Three.js primitives only).

**Layering:** the component renders an absolutely-positioned full-bleed canvas (`absolute inset-0`) — it's meant to sit behind/beside the hero headline as a background layer, not as a standalone element with its own box. Wrap it in a `relative` positioned hero container and place the headline content in a layer above it (`z-10` or similar), per original spec §3.2's hero layout (headline left/center, 3D scene right/background).

---

## 3. Required: Static Fallback for No-WebGL / JS-disabled cases

The component itself handles `prefers-reduced-motion` internally (disables animation, keeps the canvas), but does **not** handle the case where WebGL is entirely unavailable or JS fails to load. Per the original design system spec's accessibility section and the original spec's performance section (§5–6 of the original `spec.md`), a static SVG/illustrated barbell fallback is still required at the Hero component level (not inside `BarbellScene.tsx` itself) for:
- The brief loading window before the dynamic import resolves (`loading:` prop above).
- Environments where WebGL genuinely isn't available (rare, but real — older devices, locked-down browsers).

This fallback was not part of the already-built component and still needs to be built as a separate flat-color SVG illustration matching the same barbell silhouette, swapped in via the `loading` prop and a WebGL-availability check (`try { canvas.getContext('webgl') }` pattern) rather than left as a blank space.

---

## 4. Performance notes (carried from original spec §5)

- Lazy-loaded via dynamic import with `ssr: false` — must never block LCP.
- `dpr={[1, 1.75]}` is already capped in the component to avoid full-resolution rendering on high-DPI mobile screens.
- Target: 90+ mobile Lighthouse performance despite the 3D hero, achieved via the fallback strategy above, not by removing the feature.

---

## 5. Brand token sync warning (already noted inside the component file itself)

The component duplicates color hex values (`COLOR_BG`, `COLOR_ACCENT`, etc.) as raw strings rather than reading CSS variables, because Three.js materials need actual hex/string values, not CSS custom properties. **If `01-design-system.md`'s color tokens ever change, these constants inside `BarbellScene.tsx` must be updated to match manually** — this is called out in a comment at the bottom of the component file itself. Worth extracting to a shared `/lib/three-tokens.ts` if more 3D components get added later, but not necessary for this single component today.
