# 03 · Design system & motion system

Step 3 of 5 · Branch `redesign`
Skills used: `design-tokens` + `design-system` (3-tier DTCG tokens, 4 px base) and `taste/motion-choreography.md` (closest installed equivalents of `ui-design-system`).
Token source of truth: [`tokens/tokens.json`](../../tokens/tokens.json) (DTCG). `build.mjs` compiles it to CSS custom properties; no component uses a raw value.

---

## 1. Two directions

**A · Federal Standard (refined).** Deep navy and white surfaces, Old Glory red as the single accent, Barlow Condensed headlines (drawn from American highway and federal signage) over Barlow text. Square corners, hairline rules, a small red-white-blue ribbon as the only patriotic ornament. The 3D moment is a calm topographic wire grid with a few red nodes linked by thin routes: ground, infrastructure, logistics. Reads like a defense or infrastructure contractor: dense with facts, confident, quiet.

**B · Monument.** Warm stone and slate surfaces with a brushed-brass accent, a classical serif for headlines (Caslon, the face of the Declaration) and a neutral sans for text. Generous whitespace, engraved-style rules, a slowly rotating architectural lattice (columns and beams) as the 3D moment. Reads like a law firm or a heritage institution: dignified, but softer and more "established" than "operational".

**Decision: A.** It matches the approved navy/red direction from the previous round, it fits an operations-heavy offer (staffing, facilities, training) better than a heritage look, and its condensed type packs credentials and codes into small spaces, which matters for skeptical scanners. B's brass and serif drift back toward the "premium lifestyle" register that was rejected.

---

## 2. Foundations

### 2.1 Colour (semantic)

| Token | Light theme | Dark theme | Notes |
|---|---|---|---|
| `bg` | slate-50 `#f4f6f9` | navy-900 `#0a1628` | Sections alternate light / dark |
| `surface` | white | navy-800 `#102240` | Cards, panels |
| `text` | navy-900 | white | 16.8:1 / 15.9:1 |
| `text-muted` | slate-600 `#4b5768` | slate-400 `#9aa8bd` | 7.3:1 / 7.5:1 |
| `accent` | red-600 `#b31942` | red-400 `#e04a5f` | 6.2:1 on paper; 4.6:1 on navy-900 (large text only on navy-800, 4.0:1) |
| `link` | navy-700 `#1b3a6b` | white | Underlined, never colour-only |
| `focus` | red-600 | red-400 | 2 px outline, 2 px offset |
| `error` | red-600 | red-400 | Always paired with an icon and text |
| `success` | green-700 `#1e6b45` | `#6fd3a0` | 6.5:1 |
| `border-input` | slate-300 `#7d8a9e` | slate-400 | ≥ 3:1 for UI boundaries (WCAG 1.4.11) |

Rules: one accent per view; red is never a large background except the mobile "Email" button and the ribbon; no gradients except the hero vignette and the ribbon/band.

### 2.2 Typography (2 families, self-hosted, `font-display: swap`)

| Role | Family / weight | Size (fluid) | Line height | Tracking | Case |
|---|---|---|---|---|---|
| Display XL (H1 home) | Barlow Condensed 700 | `clamp(52px, 8.4vw, 136px)` | 0.92 | 0 | Upper |
| Display L (page H1) | Barlow Condensed 700 | `clamp(44px, 6vw, 96px)` | 0.95 | 0 | Upper |
| H2 | Barlow Condensed 700 | `clamp(34px, 4vw, 64px)` | 1.0 | 0 | Upper |
| H3 | Barlow Condensed 600 | `clamp(24px, 2.2vw, 32px)` | 1.1 | 0.01em | Upper |
| Lead | Barlow 400 | `clamp(18px, 1.4vw, 21px)` | 1.5 | 0 | Sentence |
| Body | Barlow 400 | 17px | 1.6 | 0 | Sentence, 60–72ch |
| Label / eyebrow | Barlow 600 | 13px | 1.4 | 0.14em | Upper |
| Code values (UEI, CAGE) | Barlow Condensed 600 | 18–20px | 1.2 | 0.08em | Upper, tabular |

Files: `barlow-condensed-600/700`, `barlow-400/500/600` (latin subsets, ~22 KB each). The 800 weight and Libre Caslon are dropped (brief: max 2 families). Preload only Barlow Condensed 700 and Barlow 400.

### 2.3 Space, layout, shape

- 4 px base; scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Section padding `clamp(80px, 11vw, 160px)`.
- Container max 1280 px; gutters `clamp(20px, 4vw, 56px)`; 12-column grid on ≥ 900 px.
- Breakpoints: 360 (min supported) · 600 · 900 · 1200.
- Radius: 0 by default; 2 px on inputs and tags.
- Elevation: `shadow-1` (cards at rest on light), `shadow-2` (hover, menus). No glows.
- Rules: 1 px hairlines; 3 px red rule as the "active / selected" signal; ribbon marker 32 × 8 px.

### 2.4 Iconography

Inline SVG, 1.75 px stroke, 20/24 px grid, `currentColor`. Set: arrow-right, arrow-down, download, copy, check, phone, mail, map-pin, alert, pause, play, star (bullet), external. No emoji, no icon on every heading.

---

## 3. Motion system

### 3.1 Principles

1. **Never gate content.** All text is visible at first paint; motion only enhances. (Removes the previous logo overture.)
2. **Engineered, calm.** Ease-out entrances, no bounce, no elastic, no springs, no cursor effects, no spinning marks.
3. **Purpose per effect:** attention (hero scene, counters), structure (pinned story, in-page nav), progress (strip progress, story progress bar), feedback (buttons, copy, form).
4. **Composited only:** `transform` and `opacity` (plus `clip-path` on one reveal). No layout-reading scroll handlers.

### 3.2 Durations & easing

| Tier | Token | Use |
|---|---|---|
| Instant | 100 ms | Press feedback |
| Fast | 200 ms | Hover, focus, icon swaps, underline |
| Base | 300 ms | Menu, panel, nav state |
| Moderate | 500 ms | Section reveals |
| Slow | 800 ms | Counters, 3D scene fade-in (UI maximum) |
| Ambient | 20–60 s | Background drift, light sweep loop |

Easing: `out` cubic-bezier(.2,.7,.2,1) default · `inOut` (.65,0,.35,1) for scroll-linked and in-place · `in` (.5,0,.75,0) for exits · `linear` for ambient and progress.

### 3.3 Patterns

| Pattern | Trigger | Spec | Reduced motion / paused |
|---|---|---|---|
| **Reveal** | IntersectionObserver, 12% visible | opacity 0→1, translateY 16→0 px, 500 ms out; stagger 60 ms, capped at 400 ms total | Visible immediately |
| **Rule draw** | Same | `scaleX(0→1)` from left, 500 ms inOut | Static rule |
| **Pinned story** (Home capabilities) | CSS `position: sticky` + IO per step | Active step number, progress bar `scaleY` | Plain stacked list |
| **Scroll-linked strike** (Challenge) | CSS scroll-driven animation `animation-timeline: view()`; fallback IO + one rAF loop only while visible | Red line `scaleX(0→1)` per problem, staggered ranges | Strikes shown drawn |
| **Counter** | IO 50% visible, once | 0 → value, 800 ms out, `tabular-nums` | Final value |
| **In-page nav state** | IO per section | Red underline moves 300 ms | Instant |
| **Page transition** | View Transitions API (`@view-transition { navigation: auto }`), same-origin | 200 ms cross-fade of `main`; header and strip stay | None |
| **Button** | hover / focus / press | Fill sweep `scaleX` 300 ms out; arrow translateX 4 px; press scale .98 at 100 ms | Colour change only |
| **Link underline** | hover / focus | Underline `scaleX` 200 ms | Static underline |
| **Card** | hover / focus-within | translateY −2 px, shadow-1→2, top rule turns red, 200 ms | No translate |
| **Ambient grid** (page headers, dark bands) | Always, when visible | CSS background drift `translate3d` over 40 s, linear | Static |
| **Light sweep** (teaming band) | On entry, once | Gradient band translateX across, 1.2 s inOut | None |
| **Copy feedback** | click | Icon cross-fade 200 ms + live region text | Same (no motion needed) |

### 3.4 Pause control (WCAG 2.2.2 / Section 508)

Footer and mobile menu carry a **"Pause motion"** toggle (`aria-pressed`). It persists per visitor (localStorage, with a try/catch fallback), adds `html.motion-paused`, stops the WebGL loop, pauses CSS ambient animations (`animation-play-state: paused`) and disables scroll-linked effects. `prefers-reduced-motion: reduce` sets the same state by default.

### 3.5 Signature 3D scene: "Operations grid"

- **Concept:** a wide topographic wire surface (≈ 96 × 48 line grid) seen at a low angle, gently undulating like terrain. Seven red nodes sit on the surface, joined by thin routes that light up in sequence: facilities connected by logistics. Calm, slow, operational.
- **Behaviour:** waves drift continuously (very slow); pointer tilts the camera ±3°; scrolling the hero away raises the camera and flattens the waves (progress driven by one passive scroll read per frame while the hero is visible); nodes pulse at 0.25 Hz.
- **Tech:** custom WebGL1 (one vertex + one fragment shader, line primitives), **no library**, ~7 KB raw. Loaded with dynamic `import()` after `load` + `requestIdleCallback`, never before LCP.
- **Poster:** the same grid as an inline SVG (static perspective lines + nodes) in the HTML, so the hero looks complete at first paint; the canvas cross-fades in over 800 ms when the first frame renders.
- **Guards:** one canvas on screen; DPR capped at 2 (1.5 below 900 px); renders only while visible (IntersectionObserver) and while the tab is visible (`visibilitychange`); stays on poster if `prefers-reduced-motion`, motion paused, `navigator.connection.saveData`, `hardwareConcurrency ≤ 2`, `deviceMemory ≤ 2`, or WebGL unavailable; grid density halves below 900 px.

### 3.6 Per-effect performance cost

| Effect | Bytes | Main-thread cost | GPU / compositor | Verdict |
|---|---|---|---|---|
| Reveals (IO + CSS) | < 1 KB | One IO callback per element, once | Opacity/transform layers | Keep |
| Pinned story | < 1 KB | IO only | None (sticky is layout-free on scroll) | Keep |
| Scroll-linked strike | < 1 KB | None where scroll-timeline is supported; fallback rAF only while visible | Transform | Keep |
| Counters | < 1 KB | ~48 rAF frames once | None | Keep |
| View Transitions | 0 KB (CSS) | Snapshot on navigation | Cross-fade | Keep; progressive |
| Ambient grid drift | 0 KB | None | One composited layer per band | Keep; paused off-screen via `content-visibility` |
| WebGL operations grid | ~7 KB, lazy | Shader compile ~10–30 ms after load; ~0.3 ms/frame JS | ~10k line vertices, trivial | Keep with guards |
| Lenis smooth scroll | 4 KB gz | Per-frame scroll hijack, INP risk | | **Dropped:** native scroll is better for INP and accessibility |
| GSAP + ScrollTrigger | ~45 KB gz | 1–2 s boot on mid-range phones in the baseline | | **Dropped:** every pattern above is covered by CSS + IO |
| Three.js / R3F | 150–300 KB gz | 2.5 s script eval in the baseline | | **Dropped:** a custom shader is lighter |

### 3.7 Packages

**None added.** The brief's suggested tools are replaced by platform features, justified by the baseline: GSAP and Three.js were the two largest main-thread costs measured in step 1. The multi-page build is a dependency-free Node script (`build.mjs`) that compiles tokens, assembles pages from partials and copies assets into `dist/`. Initial JS budget estimate: **~6 KB gz** (core) + 3 KB gz lazy (3D), against a 200 KB budget.

---

## 4. Placeholders introduced in this step

None new. Design uses the placeholders from steps 1–2.
