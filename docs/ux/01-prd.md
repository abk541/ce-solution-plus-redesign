# 01 · Discovery & PRD: CE Solution Plus website

Step 1 of 7 · Branch `redesign` · October 2026
Skills used: `redesign` (Scan → Diagnose stages of `workflows/redesign-audit.md`) and `ux-designer` (audit workflow), as the closest installed equivalents of `ux-discovery`, which is not installed.

---

## 1. Method

| Source | What was done |
|---|---|
| Repository | Read every file on `redesign` (working tree carried over from `main`, uncommitted). |
| Live site | Rendered all 5 pages of cesolutionplus.com in headless Chrome and extracted their text and links. |
| Lighthouse | Lighthouse 12.8.2 CLI, mobile preset (simulated 4G, 4× CPU slowdown), on 3 targets. The PageSpeed Insights API was unusable (zero keyless quota), so Lighthouse ran locally from a temporary folder outside the repo; nothing was added to the project. |
| Accessibility | Lighthouse a11y + axe-core 4.10 (WCAG 2.2 AA + best practices) in earlier rounds at 1440 px and 390 px; keyboard walk-through of nav, menu and copy buttons. |

INP cannot be measured in a lab run. Total Blocking Time (TBT) is used as its proxy until field data exists.

---

## 2. Current state (Scan)

### 2.1 Three things called "the site"

| Target | What it is | Status |
|---|---|---|
| **Live** · cesolutionplus.com | Zyro/Hostinger template site, 5 pages: Home, Services, About Us, Contact, Privacy Policy. | In production. This is what the redesign replaces. |
| **main** · abk541.github.io/ce-solution-plus-redesign | First redesign commit: dark/orange single page, Three.js WebGL hero. | Published on GitHub Pages. |
| **local** · `redesign` working tree | Our latest iteration ("Federal Standard"): navy / red / white single page, GSAP choreography, no WebGL. | Uncommitted. |

### 2.2 Stack (local)

- Static HTML + one CSS file + one ES-module JS file. **No framework, no build step, no package.json.**
- `serve.mjs`: 25-line Node static server for preview only.
- Runtime libraries from CDNs: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13.
- Self-hosted fonts: Barlow Condensed (600/700/800), Barlow (400/500/600), Libre Caslon Text italic.
- Assets: the company logo (`assets/logo-original.png`, from the live site) split into monogram / wordmark / tagline PNGs used as CSS masks; star SVGs.
- Hosting: `.nojekyll` + GitHub Pages for `main`. Production hosting is still the Zyro site.

| File | Raw | Gzipped |
|---|---|---|
| `index.html` | 22.7 KB | 5.8 KB |
| `styles.css` | 44.2 KB | 9.6 KB |
| `main.js` | 29.7 KB | 9.1 KB |
| GSAP + ScrollTrigger + Lenis (CDN) | ~140 KB | ~51 KB |
| **Initial JS total** | | **~60 KB** (budget: 200 KB) |

### 2.3 Pages and sections (local)

One page, `index.html`, with in-page anchors:
Hero → I Mission → II Challenge → III Services → IV Capabilities → V Agencies → VI Credentials → VII Contact → Footer. Plus an overture (logo intro), a mobile menu and a mobile Call/Email dock.

**Missing against the brief:** separate pages for Capabilities, Past Performance, About / Leadership, Careers and Contact; contact form; capability statement PDF; NAICS codes; contract vehicles; 404 page; privacy policy (exists only on the live site).

### 2.4 Components (local)

Nav with active-section marker and scroll progress · mobile disclosure menu (focus-managed) · buttons (solid, ghost, outline) · animated underline links · copy-to-clipboard (single + "copy all") · codes table · service cards ("doors") · 3D capability drum (with a screen-reader list) · agency rows · credential certificate · contact seal button · mobile contact dock · skip link · live-region announcer.

### 2.5 Tokens

Single CSS-variable token layer in `:root` with two themes (`[data-theme="light"]`, `[data-theme="navy"]`): colour, three font stacks, spacing via `clamp()`, easing curves. No radius, shadow or duration tokens; some hardcoded rgba values in components.

### 2.6 Motion inventory (local)

| Effect | Tech | Notes against the brief |
|---|---|---|
| Overture: monogram drawn, then fly-through into hero | CSS masks + GSAP | **Blocks content ~3–4 s** (skippable). Conflicts with "text readable immediately". |
| Hero letters flip in, then scatter on scroll | GSAP, 60 split spans | Blur filters on 60 spans drive the 2.9 s Style & Layout cost. Scatter may read as playful. |
| Star field | Canvas 2D, paused off-screen | Ambient, OK. |
| Searchlight on hero star | CSS mask + pointer | OK. |
| Iris into mission, word ignition | GSAP scrub | OK. |
| Red strike-throughs | GSAP scrub | OK, purposeful. |
| Service doors (pinned) | GSAP + 3D transforms | OK. |
| Capability drum (pinned, snaps) | GSAP + 3D transforms | OK. |
| Certificate tilt, rotating seal text, rotating contact seal | CSS + pointer | **Rotating seals ≈ "spinning logo"** (banned). |
| Magnetic buttons | GSAP `elastic.out` | **Elastic easing is banned.** |
| Cursor follower ring | GSAP | **Cursor trail is banned.** |
| Smooth scroll | Lenis | OK. |
| WebGL 3D hero | none | **Brief requires one signature 3D moment** (lazy-loaded, with poster). |

---

## 3. Content inventory and provenance

The brief forbids invented facts. Every fact in the current code is traced below.

| Fact in current code | Live site | Brief | Verdict |
|---|---|---|---|
| Name "CE Solution Plus", legal "CE Solution Plus Corp." | Yes (privacy policy) | Yes | **Verified** |
| Tagline "Our mission is your success" / "You have a need, we have a solution" | Yes (hero, logo) | | **Verified** |
| SDVOSB | No (live says only "veteran woman owned") | **Yes** | **Verified by brief**; certification body unknown |
| WOSB (Woman-Owned Small Business) | "Veteran & Woman Owned Small Business" (About) | No | **Ownership stated; WOSB certification unconfirmed** |
| SAM UEI ZVQVJUVMF9K6 | Yes (Services) | | **Verified** |
| CAGE 9KV33 | Yes (Services) | Yes | **Verified** |
| 3 service lines: Staffing, Facility O&M, Training | Yes | | **Verified** |
| Staffing details (temporary & surge, specialised talent, client-focused placement) | Yes | | **Verified** |
| Facility O&M details (mechanical, electrical, HVAC, security & fire protection, grounds & landscaping, custodial & janitorial, logistics) | Yes | | **Verified** |
| Training: 300+ courses; business admin, leadership, D&I, technical (MS Office, technical writing); in-person, computer-based, webinar, VR, blended | Yes | | **Verified** |
| Address 3007 43rd Street, Suite 1, Astoria, NY 11103 | Yes | | **Verified** |
| Email siblini@cesolutionplus.com | Yes | | **Verified** (info@cesolutionplus.com also appears in the privacy policy) |
| Phone (718) 587-9987 | Yes (footer, all pages) | | **Conflict:** the Contact page lists **(347) 825-6779** |
| **Six agencies** (VA, NCA, NPS, USACE, DOI, DoD) with service tags | **No** | No | **Unverified.** Arrived with the repo's first commit; source unknown. Must be confirmed or removed. |
| **13 capabilities**: 7 match the live site (HVAC, fire protection, grounds, custodial, logistics, surge staffing, leadership training) | Partly | | 7 verified |
| Therapy pool maintenance, snow removal & de-icing, chiller rental, pest control, lab refrigeration, equipment procurement | **No** | No | **Unverified.** Same unknown source. |
| "Challenge" copy (staffing gaps, broken chillers, untrained teams) | No | | Our editorial copy; implies chiller work, so depends on the line above |

Live-site content **not** carried over, and why:

- Anonymous 5-star "Satisfied Customer" testimonial: unattributable, so not usable.
- "Delivered qualified candidates within days" anecdote: unverified example.
- About page: intelligence/cyber, national-security technology, Construction Services, Transportation Services. Reads as template filler (the page title is "Professional SEO Services for Your Business Growth"). **Needs confirmation** before any use.
- Page titles say "**CE Flagging Plus**": brand inconsistency on the live site.
- LinkedIn link points to an admin dashboard URL, not the public company page. Facebook profile exists.

---

## 4. Lighthouse baseline (mobile)

| Target | Perf | A11y | Best Pr. | SEO | FCP | LCP | CLS | TBT (INP proxy) | Weight | Req. |
|---|---|---|---|---|---|---|---|---|---|---|
| Live (Zyro) | 75 | 91 | 100 | 92 | 2.0 s | **5.8 s** | 0 | 130 ms | 1,039 KiB | 28 |
| main (orange WebGL) | **54** | 90 | 96 | 100 | 3.6 s | 3.6 s | 0.001 | **990 ms** | 478 KiB | 15 |
| local (navy) | 72 | **100** | 100 | 100 | 2.0 s | **3.8 s** | 0.001 | 590 ms | 417 KiB | 19 |
| **Budget** | **90+** | **95+** | **95+** | **95+** | | **< 2.5 s** | **< 0.1** | **< 200 ms** | | |

Diagnosis:

- **Live:** LCP is a 1440 px hero photo (1.9 s load delay + 1.6 s load). Failing audits: `heading-order`, `image-alt`.
- **main:** Three.js costs 2.5 s of script evaluation on a mid-range CPU, which is why TBT is 990 ms. Failing: `aria-hidden-focus`, `color-contrast`, `label-content-name-mismatch`, console errors.
- **local:** the LCP text is in the HTML at 463 ms but its **render is held back 3.3 s** by the overture and letter choreography. Style & Layout costs 2.9 s (60 blurred, split spans plus large masks); GSAP boot costs 2.5 s. No failing audits.

**Implication:** the brief's WebGL hero is affordable only if Three.js loads *after* LCP, the hero headline is never hidden, and the CSS/JS hero work shrinks.

---

## 5. Diagnosis: prioritised findings

| # | Severity | Finding | Who it hurts | Fix direction |
|---|---|---|---|---|
| 1 | **Critical** | Unverified facts in code (six agencies, six capabilities, implied chiller work) | Credibility with contracting officers; legal risk | Confirm or remove; use `[TODO]` placeholders |
| 2 | **Critical** | Single page; no Capabilities / Past Performance / About / Careers / Contact pages, no form, no PDF | All four audiences | New information architecture (step 2) |
| 3 | **Critical** | Overture hides content ~3–4 s; LCP 3.8 s | Busy, skeptical scanners; Lighthouse Perf | No content-blocking intro; headline visible at first paint |
| 4 | **Major** | Auto-playing motion longer than 5 s (star field, rotating seals, sheens) with no pause control | Users with vestibular or attention disorders; **WCAG 2.2.2 / Section 508** | Global "Pause animations" control plus `prefers-reduced-motion` |
| 5 | **Major** | Banned patterns: elastic easing, cursor follower, rotating seals | Trust and tone | Remove (ease-out only, no cursor effects, static seals) |
| 6 | **Major** | No WebGL signature moment | Brief ambition | Lazy-loaded scene with poster image (step 3 concept) |
| 7 | **Major** | Mobile TBT 590 ms (INP risk) from char splitting, blur filters and GSAP boot | Mid-range phone users | Split by word not letter, no blur filters, defer non-critical motion |
| 8 | **Major** | Contact info conflict (two phone numbers, two emails) | Contracting officers trying to call | Confirm one canonical phone and email |
| 9 | **Major** | NAICS codes and contract vehicles absent | Contracting officers' first scan | Add with placeholders |
| 10 | Minor | Three typefaces (Barlow Condensed, Barlow, Libre Caslon); the brief allows two | Budget compliance | Two families max (step 3) |
| 11 | Minor | No build step, but the brief requires "run the build" and multi-page sharing | Maintainability | Choose a static build tool in step 3/5 (decision needed) |
| 12 | Minor | Live site title says "CE Flagging Plus"; LinkedIn link points to an admin URL | Brand trust, SEO | Correct titles and links in the new site (step 5) |
| 13 | Minor | Hero letter-scatter on scroll reads as playful | Tone | Replace with a calmer exit |

### 5.1 What to preserve

- The verified content in section 3.
- One-click copy of UEI and CAGE (and "copy all"); credibility codes above the fold.
- Navy / Old Glory red / white palette and condensed signage typography (approved direction, to be refined in step 3).
- Purposeful scroll moments: red strike-throughs, opening service panels, capability drum (simplified), iris transition.
- Accessibility wins: skip link, visible focus, focus-managed menu, sr-only text for split headings, reduced-motion path, 0 axe violations.
- Self-hosted fonts and logo, zero third-party font requests.

---

## 6. Product requirements

### 6.1 Goal

Replace the template site with a fast, accessible, multi-page site that makes CE Solution Plus read as a serious, established SDVOSB federal contractor within seconds, with premium, calm, engineered motion.

### 6.2 Audiences and their jobs

| Audience | Job to be done | Must find in ≤ 1 scroll |
|---|---|---|
| Federal contracting officer | Verify eligibility and capability before a set-aside or sole-source | SDVOSB, UEI, CAGE, NAICS, core capabilities, capability statement PDF, contact |
| Small business liaison (OSDBU) | Match vendor to requirement; refer internally | Capabilities by NAICS, past performance, contact person |
| Prime contractor | Find an SDVOSB teaming partner | Capabilities, past performance, contract vehicles, teaming contact |
| Candidate | Judge employer and apply | Careers page, open roles or general application, location |

### 6.3 Scope (pages)

Home · Capabilities (Staffing, Facility O&M, Training) · Past Performance · About / Leadership · Careers · Contact · Privacy Policy · 404. Persistent footer contact (email, phone, address, codes) on every page. Downloadable Capability Statement PDF.

### 6.4 Functional requirements

1. Credibility bar on every page: SDVOSB, UEI, CAGE, NAICS (copyable).
2. Contact form: name, organization, email, phone (optional), topic, message; inline validation, error summary, success state, spam protection; delivery method to be decided.
3. Capability Statement PDF download.
4. Careers: open roles or "general application" path.
5. Email and phone links on every page.
6. Pause/play control for all ambient motion; reduced-motion parity.

### 6.5 Non-functional requirements

- Performance budget exactly as in the brief (Lighthouse mobile 90/95/95/95; LCP < 2.5 s; CLS < 0.1; INP < 200 ms; initial JS < 200 KB gz; WebGL lazy-loaded after first paint, one canvas, DPR ≤ 2, paused off-screen).
- WCAG 2.1 AA / Section 508 (we already test against 2.2 AA).
- Animate only `transform` and `opacity`; UI durations 200–800 ms; no bounce or elastic easing.
- Max 2 font families, self-hosted, `font-display: swap`; AVIF/WebP images with explicit sizes.

### 6.6 Out of scope

Backend, auth, database, ERP. A form-delivery service is an external dependency, not a backend we build.

### 6.7 Success measures

Lighthouse and Core Web Vitals targets met on every page; 0 axe violations. SEO (step 6) and analytics (step 7) are out of scope by decision of 2026-10-01; pages still ship correct titles, descriptions and semantics.

---

## 7. Questions only you can answer

1. **Certifications:** is SDVOSB certified through SBA VetCert (or legacy VA CVE)? Is the company also **WOSB-certified**, or only woman-owned?
2. **Agencies:** are the six agencies (VA, NCA, NPS, USACE, DOI, DoD) real customers? If yes, can they be named publicly, and for what work?
3. **Capabilities:** are therapy pool maintenance, snow removal, chiller rental, pest control, lab refrigeration and equipment procurement real offerings?
4. **Contact:** canonical phone, (718) 587-9987 or (347) 825-6779? Canonical email, siblini@ or info@?
5. **Codes:** NAICS codes (primary first), PSC codes, contract vehicles (GSA MAS, BPAs, IDIQs), if any.
6. **Past performance / leadership / careers:** any content, or placeholders for now?
7. **Capability statement:** does a PDF exist?
8. **About-page claims** (cyber/intelligence, construction, transportation): real, or template text to drop?
9. **Hosting and form delivery:** where will the site be hosted (Vercel, GitHub Pages, Hostinger)? Where should form submissions go?
10. **Build tooling:** OK to add a static build step (e.g. Vite or Astro) for multi-page sharing and the Lighthouse build loop? Packages will be proposed with sizes in step 3, per the brief.

---

## 8. Placeholders introduced in this step

None in code. These `[TODO]` placeholders are planned for later steps, pending section 7:

- `[TODO: SDVOSB certifying body]`
- `[TODO: WOSB certification status]`
- `[TODO: NAICS codes]`
- `[TODO: PSC codes]`
- `[TODO: contract vehicles]`
- `[TODO: past performance #1]`, `[TODO: past performance #2]`, `[TODO: past performance #3]`
- `[TODO: leadership bios]`
- `[TODO: open roles]`
- `[TODO: capability statement PDF]`
- `[TODO: canonical phone]`
- `[TODO: canonical email]`
- `[TODO: agency names, if confirmed]`
- `[TODO: form delivery endpoint]`
