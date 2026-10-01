# 04 · UI specifications

Step 3 of 5 (part 2) · Branch `redesign` · Tokens: `tokens/tokens.json` · System: `03-design-system.md`
Every component lists its states: default · hover · focus-visible · active · disabled · loading · error · success, where they apply.

---

## Global

### Credentials strip (`.strip`)
- Height 36 px (wraps to 2 lines below 600 px), dark theme (navy-950), text 13 px Barlow 600, uppercase, 0.12em.
- Content: `SDVOSB` · `CAGE 9KV33` · `UEI ZVQVJUVMF9K6` · `NAICS [TODO]` · link "Capability statement (PDF)" with download icon.
- Not sticky (header is). Hidden from nothing; read by screen readers as a `<p>` with a link.

### Header (`.site-header`)
- Height 72 px, sticky top, light theme by default; over the home hero it starts transparent on navy and becomes solid light after 40 px of scroll (300 ms).
- Logo: monogram 36 px + wordmark 12 px (CSS mask of the company logo), link to `/` with accessible name "CE Solution Plus, home".
- Nav: 4 links + Contact button. Link: 15 px Barlow 600 uppercase 0.08em; underline 3 px red scales in on hover (200 ms) and stays for `aria-current="page"`.
- < 1100 px: links collapse into "Menu" button (`aria-expanded`, `aria-controls`); Contact button stays visible ≥ 600 px.
- Focus: 2 px focus outline, offset 2 px. Never covered by sticky elements (`scroll-padding-top: 120px`).

### Mobile menu (`.menu`)
- Full-screen dark panel; opens with opacity + translateY(−8 px) 300 ms; items 40 px Barlow Condensed 700.
- Focus moves to first link; Tab cycles within menu + Menu button; Esc closes and returns focus; page behind is `inert`.
- Includes phone, email and the Pause motion toggle.

### Footer (`.site-footer`)
- Dark theme, band (tricolour, 6 px) on top edge.
- Columns: Contact (email, phone, address) · Credentials (SDVOSB, UEI copy, CAGE copy, NAICS) · Pages · Legal (Privacy, © year).
- "Pause motion" toggle button with pause/play icon, `aria-pressed`.

### Mobile dock (`.dock`, < 600 px)
- Fixed bottom, two buttons: Call (outline) · Email (red). 52 px high, safe-area padding. Slides in after the hero, hidden on `/contact/` and when the menu is open.

### Skip link
- First focusable element, "Skip to main content", visible on focus at top-left.

---

## Actions

### Button (`.btn`)
| Variant | Light theme | Dark theme |
|---|---|---|
| Primary | navy-900 bg, white text | white bg, navy-900 text |
| Secondary | transparent, 2 px navy border | transparent, 2 px white border |
| Text link button | navy-700 text + underline | white text + underline |

- Height 52 px (sm 44 px), padding 0 24 px, 15 px Barlow 600 uppercase 0.1em, radius 0, optional trailing icon 18 px.
- Hover / focus-visible: red fill sweeps left→right under the label (300 ms), text white; arrow icon translateX 4 px.
- Active: scale .98, 100 ms. Disabled: 50% opacity, `aria-disabled`, cursor default, reason stated nearby. Loading: label "Sending…", spinner 16 px (linear 800 ms), `aria-busy="true"`.
- Touch target ≥ 44 × 44.

### Link (`.link`)
- Underline 1 px offset 3 px; hover thickens to 2 px and turns red (200 ms). External links get an external icon + visually hidden "(opens in new tab)" only if `target=_blank` (avoided by default).

### Copy button (`.copy`)
- 36 px icon button (44 px on touch), accessible name "Copy UEI" / "Copy CAGE code".
- Success: copy icon cross-fades to check (200 ms), live region announces "UEI copied: ZVQVJUVMF9K6"; reverts after 1.8 s. Failure: announces the value so it can be copied manually.

---

## Content components

### Page header (`.page-head`)
- Dark theme, padding-block 96/64 px; ambient grid background (CSS); breadcrumb (`nav aria-label="Breadcrumb"`, ordered list, current page `aria-current="page"`); H1 Display L; lead; optional primary action.

### Codes panel (`.codes`, hero)
- `dl` with rows: label (13 px uppercase muted) / value (Barlow Condensed 600 20px, tracking .08em) / copy button. Rows separated by hairlines; top 3 px red rule.
- `[TODO]` values render in the TODO style (below) and have no copy button.

### Capability step (`.story__step`)
- Number `01–03` (Barlow Condensed 700, 56 px, accent when active), H3, one-sentence summary, 3 bullets with red star bullets (10 px), link "Explore staffing →".
- Desktop: right column of the pinned story; inactive steps at 45% opacity text-muted, active 100% (300 ms). Mobile: all active.

### Stat (`.stat`)
- Value Barlow Condensed 700 `clamp(56px, 7vw, 104px)`, accent "+" suffix; label 15px muted, max 22ch. Top hairline.

### Record card (`.record`, past performance)
- Surface, shadow-1, 3 px navy top rule (red on hover/focus-within), padding 32 px.
- Fields as `dl`: Agency · Contract / PO · Period · Scope · Service line (tag).
- Whole card is not a link (no detail pages); hover lift only on pointer devices.

### Role family card (`.role`)
- Same shell as record card; H3 + 2-line description + link to general application.

### Credentials table (`.cred-table`, About)
- `dl` two columns (label 30% / value), hairline rows, copy buttons on UEI and CAGE, "Copy all details" secondary button (copies a plain-text block).

### Section heading
- Ribbon marker (32 × 8 px) + eyebrow label + H2. Ribbon is decorative (`aria-hidden`).

### TODO block (`.todo`)
- Dashed 2 px border, slate-100 background, monospace-free text "[TODO: past performance #1]" in slate-600. Never styled to look finished. Present in the build until content is supplied; listed in the step report.

---

## Forms (Contact)

### Field (`.field`)
- Label above (15 px Barlow 600), "(required)" text on required fields (minority marking: optional fields are fewer, but the federal audience expects explicit required marks).
- Input/select/textarea: 48 px height (textarea 160 px), 1 px `border-input`, radius 2 px, white surface, 17 px text.
- Focus: 2 px focus outline (red), border navy.
- Error: border error colour 2 px, message below with alert icon + text, `aria-invalid="true"`, `aria-describedby` → message id.
- Hint text: 14px muted under label, linked with `aria-describedby`.
- Autocomplete: `name`, `organization`, `email`, `tel`.

### Error summary (`.form-errors`)
- Appears above the form on submit with errors; `role="alert"`, `tabindex="-1"`, receives focus; title "There is a problem" + list of links to fields.

### Success panel (`.form-done`)
- Replaces the form; check icon in success colour + H2 "Message sent" + what happens next; focus moves to the H2.

### Validation rules
| Field | Rule | Message |
|---|---|---|
| Name | required, ≥ 2 chars | Enter your name |
| Email | required, valid format | Enter an email address in the format name@agency.gov |
| Topic | required | Choose a topic |
| Message | required, 10–4000 chars | Enter a message of at least 10 characters |
| Phone | optional, digits/spaces/()+- | Enter a phone number using digits only |
| Honeypot `company_website` | must be empty | (silent) |

---

## Hero

- Height `min(100svh − strip, 920px)`, min 640 px; dark theme with radial vignette.
- Layout ≥ 900 px: 7/12 text column left, 5/12 visual right (scene canvas spans full hero behind, weighted right); < 900 px: text then codes panel; scene behind text at 35% opacity.
- Poster: inline SVG operations grid (`aria-hidden`), always present; canvas absolutely positioned above it, opacity 0 → 1 (800 ms) after first frame.
- Text never animates in. Primary CTA: "Download capability statement"; secondary: "Contact us".

---

## Responsive rules

| Width | Changes |
|---|---|
| ≥ 1200 | Full layout, pinned story, 3-column records |
| 900–1199 | Nav collapses to Menu below 1100; 2-column records |
| 600–899 | Single-column hero; story unpinned; dock hidden; Contact button stays in header |
| 360–599 | Strip wraps; dock visible; type scale at clamp minimums; all targets ≥ 44 px |
