# 02 · Flows & wireframes

Step 2 of 5 · Branch `redesign`
Skill used: `ux-designer` (references 05 information architecture, 07 forms, 08 mobile), closest installed equivalent of `ux-flows-wireframes`.
Inputs: `01-prd.md`. Facts limited to the "Verified" rows of PRD §3; everything else is a `[TODO]`.

---

## 1. Sitemap

```
/                      Home
/capabilities/         Capabilities (Staffing · Facility O&M · Training, anchored)
/past-performance/     Past Performance
/about/                About & Leadership
/careers/              Careers
/contact/              Contact (form + direct lines)
/privacy/              Privacy Policy (carried over from the live site)
/404.html              Not found
/capability-statement.pdf
```

**Global elements on every page**
- **Credentials strip** (above the header): `SDVOSB · CAGE 9KV33 · UEI ZVQVJUVMF9K6 · NAICS [TODO]` + "Capability statement (PDF)" link. Codes are copyable on the About page and in the footer.
- **Header:** logo (home link) · Capabilities · Past Performance · About · Careers · **Contact** (button). Current page marked with `aria-current="page"` and a red underline. Mobile: logo + "Menu" button opening a full-screen list; Contact also in a bottom dock.
- **Footer:** contact block (email, phone, address) · codes · page links · Privacy · "Pause motion" toggle · © year.
- **Skip link** to `#main` on every page.

Navigation depth is one level; five top-level items (within the 5–7 guideline). No hamburger on desktop.

---

## 2. Key journeys

### J1 · Contracting officer verifying credentials (target: under 30 s, 0–1 clicks)

| # | Step | Where | Success signal |
|---|---|---|---|
| 1 | Lands on Home from SAM.gov, DSBS or a referral | Home hero | Sees "Service-Disabled Veteran-Owned Small Business" in the first viewport |
| 2 | Scans codes | Credentials strip + hero codes panel | CAGE, UEI, NAICS visible without scrolling |
| 3 | Copies UEI/CAGE | Hero codes panel (copy buttons) | "Copied" confirmation + screen-reader announcement |
| 4 | Checks fit | Home "Capabilities" section → Capabilities page | Service line matches requirement |
| 5 | Downloads capability statement | Strip link / hero primary CTA | PDF opens |
| 6 | Contacts | Header Contact or footer phone/email | Email client, call, or form success |

Failure points watched: codes below the fold, PDF missing (currently `[TODO]` content inside), contact info conflicting (resolved by one canonical phone `[TODO: confirm]`).

### J2 · Prime contractor looking for an SDVOSB teaming partner (target: 2–3 clicks)

| # | Step | Where | Success signal |
|---|---|---|---|
| 1 | Lands on Home | Hero | SDVOSB status + service lines |
| 2 | Reads "Teaming" band | Home, after Capabilities | Clear invitation for primes, link to Contact with topic preset |
| 3 | Checks evidence | Past Performance | Entries with agency, scope, period (`[TODO]` until supplied) |
| 4 | Checks vehicles | About → Credentials table | Contract vehicles `[TODO]` |
| 5 | Sends inquiry | Contact (topic = "Teaming / subcontracting") | Success message with expected next step |

### J3 · Candidate applying (target: 2 clicks)

| # | Step | Where | Success signal |
|---|---|---|---|
| 1 | Arrives on Home or Careers (direct link) | Header "Careers" | Page title "Careers" |
| 2 | Reads what kinds of roles exist | Careers: three role families mapped to the three service lines | Understands fit |
| 3 | Sees open roles | Careers list (`[TODO: open roles]`) or empty state | Empty state offers general application |
| 4 | Applies | "Send a general application" → Contact (topic = "Careers") or email | Success message |

---

## 3. Page wireframes

Notation: `[ ]` element · `( )` interactive · `→` link · *motion:* one line per section.

### 3.1 Home `/`

```
[Credentials strip]  SDVOSB · CAGE 9KV33 · UEI ZVQVJUVMF9K6 · NAICS [TODO]      (Capability statement PDF ↓)
[Header]  Logo   Capabilities  Past Performance  About  Careers   (Contact)

HERO (navy, full height minus strip)
  eyebrow   Service-Disabled Veteran-Owned Small Business
  H1        You have a need. We have a solution.
  lead      Staffing, facility operations & maintenance and training for federal agencies.
  (Download capability statement)  (Contact us →)
  [Codes panel]  SDVOSB ✓ · UEI ZVQVJUVMF9K6 (copy) · CAGE 9KV33 (copy) · NAICS [TODO]
  [3D scene / static poster behind, right-weighted]
```
*motion:* poster grid visible at first paint; WebGL topographic grid fades in after load and tilts slightly with pointer and scroll; text never animates in.

```
CAPABILITIES (light) · sticky story on desktop
  left (sticky):  H2 "Three service lines. One accountable partner."  + progress 1/3
  right (steps):  01 Staffing → 02 Facility O&M → 03 Training, each: 1-line summary, 3 bullets, → Capabilities#anchor
  mobile: stacked blocks, no sticky
```
*motion:* left column pins while the three steps scroll past; the active step number and progress bar update; steps fade/slide 16 px in.

```
THE CHALLENGE (navy)
  H2 "Federal missions can't pause for staffing gaps, failing HVAC or untrained teams."
  answer: "CE Solution Plus brings the people, the maintenance and the know-how together, under one accountable partner."
```
*motion:* the three problems are struck through in red as the section crosses the viewport centre (scroll-linked), then the answer fades in.

```
BY THE NUMBERS (light)
  [3] service lines   [300+] training courses   [5] training delivery formats
  (no set-aside eligibility claim: eligibility depends on SBA certification, see [TODO: SDVOSB certifying body])
```
*motion:* counters run once from 0 when 50% visible (≤ 800 ms, ease-out); static in reduced motion.

```
PAST PERFORMANCE TEASER (light)
  H2 "Past performance"  → Past Performance
  3 entries: [TODO: past performance #1–#3]  (agency · scope · period)
  empty state if none: "Past performance references available on request." (Contact →)
```
*motion:* entries reveal with a 60 ms stagger; red rule draws across the top of each.

```
TEAMING (navy band)
  "Prime contractors: team with an SDVOSB."  (Discuss teaming →  /contact/?topic=teaming)
```
*motion:* soft light sweep crosses the band once on entry.

```
CONTACT BAND + FOOTER
```
*motion:* none beyond link/button micro-interactions.

### 3.2 Capabilities `/capabilities/`

```
Page header (navy, short): breadcrumb Home / Capabilities · H1 "Capabilities" · lead · (Capability statement PDF)
In-page nav (sticky on desktop): Staffing · Facility O&M · Training
#staffing   H2 · paragraph (verified) · bullets: temporary & surge staffing; specialised technical talent; client-focused placement process · NAICS [TODO]
#facilities H2 · paragraph · bullets: mechanical & electrical systems; HVAC; security & fire protection systems; grounds & landscaping; custodial & janitorial; logistical & operational support · NAICS [TODO]
#training   H2 · paragraph · 300+ courses; topics: business administration, leadership development, diversity & inclusion, technical skills (Microsoft Office, technical writing); formats: in-person, computer-based, webinar, virtual reality, blended · NAICS [TODO]
CTA band: "Have a requirement?" (Contact)
```
*motion:* page header grid drifts slowly (CSS); in-page nav highlights the section in view; section headings reveal on entry.

### 3.3 Past Performance `/past-performance/`

```
Page header · H1 "Past performance" · lead "Selected federal work. References available on request."
Entry ×3: Agency [TODO] · Contract / PO no. [TODO] · Period [TODO] · Scope [TODO] · Service line tag · Outcome [TODO]
Empty state (if no entries are approved for publication): text + (Request references →Contact)
```
*motion:* entries reveal with stagger; a thin red timeline line grows with scroll on desktop.

### 3.4 About `/about/`

```
Page header · H1 "About CE Solution Plus"
Who we are: veteran- and woman-owned small business, SDVOSB, Astoria NY; mission "Our mission is your success."
Leadership: [TODO: leadership bios] (name, title, short bio, photo)
Credentials table: Legal name · SDVOSB [TODO: certifying body] · WOSB [TODO: certification status] · UEI (copy) · CAGE (copy) · NAICS [TODO] · PSC [TODO] · Contract vehicles [TODO] · Office address   (Copy all details)
```
*motion:* credentials rows draw their rules in sequence; copy buttons swap icon on success (200 ms).

### 3.5 Careers `/careers/`

```
Page header · H1 "Careers"
Role families: Staffing assignments · Facility operations · Training & instruction (derived from the three service lines)
Open roles: [TODO: open roles]
Empty state (no roles listed): "No open roles are posted right now. Send a general application and we'll keep it on file." (Send a general application → /contact/?topic=careers)
```
*motion:* role family cards lift 2 px and their top rule turns red on hover/focus.

### 3.6 Contact `/contact/`

```
Page header · H1 "Contact"
Two columns (stacked on mobile):
  Form: Name* · Organization · Email* · Phone · Topic* (select: General inquiry / Contracting & capability / Teaming / Careers) · Message* · (Send message)
  Direct: Email · Phone [TODO: canonical] · Office address · Codes
```
*motion:* focus ring and label colour transitions only (200 ms); success panel fades in.

**Form states**

| State | Behaviour |
|---|---|
| Default | Labels above fields; required marked with "(required)" text. |
| Focus | 2 px red outline, offset 2 px. |
| Inline error | Validated on blur, then re-validated on input; message under field, `aria-invalid`, `aria-describedby`; icon + text (never colour alone). |
| Submit with errors | Error summary at the top of the form (`role="alert"`), links to each field; focus moves to the summary. |
| Submitting | Button shows "Sending…", disabled, `aria-busy`. |
| Success | Form replaced by a confirmation panel with the reply expectation; focus moves to its heading. |
| Delivery failure | Message with the direct email and phone; form content is kept. |
| No endpoint configured | Builds a pre-filled email to the canonical address (clearly stated). `[TODO: form delivery endpoint]` |
| Spam | Hidden honeypot field; no CAPTCHA. |

### 3.7 Privacy `/privacy/` · text page carried over verbatim from the live site.

### 3.8 404

```
H1 "Page not found" · one line · links: Home, Capabilities, Contact
```

---

## 4. Cross-page states

| State | Handling |
|---|---|
| Loading | Content is server-rendered HTML; only the 3D scene loads later, behind its poster. |
| JS disabled | All content and links work; form posts to email; reveals are visible by default. |
| Reduced motion | No WebGL (poster only), no scroll-linked effects, no counters (final numbers shown), fades ≤ 150 ms. |
| Motion paused (toggle) | Same as reduced motion, saved per visitor. |
| WebGL unavailable / low-end device / Save-Data | Static poster. |
| 360 px width | Single column, credentials strip wraps to two lines, dock with Call / Email. |
| Missing content | Visible, clearly marked `[TODO]` blocks in the build; listed below. |

---

## 5. Placeholders introduced in this step

`[TODO: NAICS codes]` (strip, hero, capabilities ×3, about) · `[TODO: PSC codes]` · `[TODO: contract vehicles]` · `[TODO: SDVOSB certifying body]` · `[TODO: WOSB certification status]` · `[TODO: past performance #1]` · `[TODO: past performance #2]` · `[TODO: past performance #3]` · `[TODO: leadership bios]` · `[TODO: open roles]` · `[TODO: canonical phone]` · `[TODO: canonical email]` · `[TODO: form delivery endpoint]` · `[TODO: capability statement content review]`
