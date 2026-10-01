# 05 · Microcopy

Step 4 of 5 · Branch `redesign`
Skills used: `ux-writing-voice-tone` + `ux-writing` (closest installed equivalents of `ux-microcopy`).
Voice: federal, confident, factual. Short sentences, concrete nouns, no hype. Copy is authored in sentence case; uppercase is a CSS presentation only, so screen readers and translators get normal text.
Facts: only the "Verified" rows of PRD §3. No em dashes.

---

## 0. Words we use and avoid

| Use | Avoid |
|---|---|
| staffing, facility operations and maintenance, training | solutions (except the company tagline), synergy, world-class, cutting-edge, innovative |
| federal agencies, contracting officers, prime contractors | partners in excellence, stakeholders |
| we provide, we deliver, we place | we strive, we endeavor, we are passionate |
| service-disabled veteran-owned small business (SDVOSB) | "veteran-backed", "proudly" |
| capability statement | brochure, one-pager |

Tagline usage: "You have a need. We have a solution." (hero) and "Our mission is your success." (footer). Both come from the company's existing logo and site.

---

## 1. Global

| Element | Copy |
|---|---|
| Skip link | Skip to main content |
| Credentials strip | SDVOSB · CAGE 9KV33 · UEI ZVQVJUVMF9K6 · NAICS [TODO: NAICS codes] |
| Strip link | Capability statement (PDF) |
| Logo accessible name | CE Solution Plus, home |
| Nav | Capabilities · Past performance · About · Careers |
| Nav button | Contact us |
| Menu button | Menu / Close menu |
| Mobile dock | Call · Email us |
| Pause toggle | Pause motion / Play motion |
| Pause toggle (state, sr) | Animations paused. / Animations playing. |

### Footer
| Element | Copy |
|---|---|
| Line | Our mission is your success. |
| Contact heading | Contact |
| Email | siblini@cesolutionplus.com [TODO: canonical email] |
| Phone | (718) 587-9987 [TODO: canonical phone] |
| Address | 3007 43rd Street, Suite 1, Astoria, NY 11103 |
| Credentials heading | Credentials |
| Credentials | Service-disabled veteran-owned small business · UEI ZVQVJUVMF9K6 · CAGE 9KV33 · NAICS [TODO] |
| Pages heading | Company |
| Legal | Privacy policy · © {year} CE Solution Plus Corp. |

### Copy buttons
| State | Visible | Announced |
|---|---|---|
| Default (sr name) | (icon) | Copy UEI / Copy CAGE code |
| Success | (check icon) | UEI copied: ZVQVJUVMF9K6 |
| Failure | (icon) | Couldn't copy. UEI: ZVQVJUVMF9K6 |
| Copy all | Copy all details → Copied | Company details copied. |

---

## 2. Home `/`

| Element | Copy |
|---|---|
| `<title>` | CE Solution Plus · SDVOSB federal staffing, facilities and training |
| Meta description | Service-disabled veteran-owned small business providing staffing, facility operations and maintenance, and training to federal agencies. CAGE 9KV33. |
| Hero eyebrow | Service-disabled veteran-owned small business |
| H1 | You have a need. We have a solution. |
| Lead | Staffing, facility operations and maintenance, and training for federal agencies. One accountable partner, so you can focus on your mission. |
| Primary CTA | Download capability statement |
| Secondary CTA | Contact us |
| Codes panel label | Contracting codes |
| Codes rows | SDVOSB · Service-disabled veteran-owned / UEI · ZVQVJUVMF9K6 / CAGE · 9KV33 / NAICS · [TODO: NAICS codes] |

### Capabilities story
| Element | Copy |
|---|---|
| Eyebrow | Capabilities |
| H2 | Three service lines. One accountable partner. |
| Progress (sr) | Service line {n} of 3 |
| 01 title | Staffing |
| 01 summary | Temporary and surge staffing for government agencies, with professionals who bring the specialized skills mission-critical roles demand. |
| 01 bullets | Temporary and surge staffing · Specialized technical talent · Client-focused placement process |
| 01 link | Explore staffing |
| 02 title | Facility operations and maintenance |
| 02 summary | Mechanical, electrical and HVAC systems, security and fire protection, grounds, custodial and logistics support. |
| 02 bullets | Mechanical, electrical and HVAC · Security and fire protection systems · Grounds, custodial and logistics |
| 02 link | Explore facility services |
| 03 title | Training |
| 03 summary | More than 300 courses in business administration, leadership, diversity and inclusion, and technical skills. |
| 03 bullets | In-person and computer-based · Webinars and virtual reality · Blended learning |
| 03 link | Explore training |

### Challenge band
| Element | Copy |
|---|---|
| Eyebrow | The challenge |
| H2 | Federal missions can't pause for staffing gaps, failing HVAC or untrained teams. |
| Answer | CE Solution Plus brings the people, the maintenance and the training together, under one accountable partner. |

### By the numbers
| Value | Label |
|---|---|
| 3 | service lines under one contract partner |
| 300+ | training courses in our catalog |
| 5 | training delivery formats |

### Past performance teaser
| Element | Copy |
|---|---|
| Eyebrow | Past performance |
| H2 | Work delivered for federal clients. |
| Entries | [TODO: past performance #1] · [TODO: past performance #2] · [TODO: past performance #3] |
| Link | View past performance |
| Empty state (if none are approved) | Past performance references are available on request. → Request references |

### Teaming band
| Element | Copy |
|---|---|
| Eyebrow | For prime contractors |
| H2 | Looking for an SDVOSB teaming partner? |
| Body | Tell us about the requirement. We respond with the capabilities, codes and points of contact you need. |
| CTA | Discuss teaming |

### Contact band
| Element | Copy |
|---|---|
| H2 | Have a requirement? |
| Body | Email, call or send a message. We reply within [TODO: response time] business days. |
| CTA | Contact us |

---

## 3. Capabilities `/capabilities/`

| Element | Copy |
|---|---|
| `<title>` | Capabilities · CE Solution Plus |
| Meta description | Staffing, facility operations and maintenance, and training services for federal agencies from an SDVOSB. |
| Breadcrumb | Home / Capabilities |
| H1 | Capabilities |
| Lead | Three service lines for federal agencies, delivered by one accountable partner. |
| Action | Download capability statement |
| In-page nav label (sr) | On this page |
| In-page nav | Staffing · Facility operations and maintenance · Training |

**Staffing (#staffing)**
H2 Staffing.
Body: We deliver swift, dependable staffing to government agencies, so mission-critical roles are filled with qualified people. We specialize in temporary and surge staffing. Our client-focused placement process identifies professionals with the skills your requirement calls for.
List heading: What we provide. Items: Temporary staffing · Surge staffing · Specialized technical talent · Client-focused placement process.
Codes: NAICS [TODO: staffing NAICS].

**Facility operations and maintenance (#facilities)**
H2 Facility operations and maintenance.
Body: We keep government facilities safe, efficient and running. Our services cover building systems, life-safety systems, grounds and day-to-day operations.
List heading: What we provide. Items: Mechanical and electrical systems maintenance and repair · Energy-efficient HVAC services · Installation, monitoring and upkeep of security and fire protection systems · Grounds maintenance and landscaping · Custodial and janitorial services · Logistical and operational support.
Codes: NAICS [TODO: facilities NAICS].

**Training (#training)**
H2 Training.
Body: We close skill gaps with a catalog of more than 300 courses. Programs can be customized or delivered off the shelf.
List heading: Topics. Items: Business administration · Leadership development · Diversity and inclusion · Technical skills, including Microsoft Office and technical writing.
List heading: Delivery formats. Items: In-person · Computer-based · Webinars · Virtual reality · Blended learning.
Codes: NAICS [TODO: training NAICS].

CTA band: H2 "Have a requirement?" · Body "Send the scope and timeline. We'll tell you how we can support it." · Button "Contact us".

---

## 4. Past performance `/past-performance/`

| Element | Copy |
|---|---|
| `<title>` | Past performance · CE Solution Plus |
| Meta description | Federal contracts and purchase orders delivered by CE Solution Plus, an SDVOSB. |
| H1 | Past performance |
| Lead | Selected federal work. References are available on request. |
| Record field labels | Agency · Contract or PO number · Period of performance · Scope · Service line |
| Records | [TODO: past performance #1] · [TODO: past performance #2] · [TODO: past performance #3] |
| Empty state | We share past performance references directly with contracting officers. → Request references |
| CTA | Request references |

---

## 5. About `/about/`

| Element | Copy |
|---|---|
| `<title>` | About · CE Solution Plus |
| Meta description | CE Solution Plus Corp. is a veteran- and woman-owned small business in Astoria, New York, serving federal agencies. |
| H1 | About CE Solution Plus |
| Lead | A veteran- and woman-owned small business serving federal agencies from Astoria, New York. |
| Who we are (H2) | Who we are |
| Who we are (body) | CE Solution Plus Corp. is a service-disabled veteran-owned small business. We provide staffing, facility operations and maintenance, and training services so agencies can focus on their mission. Our mission is your success. |
| Leadership (H2) | Leadership |
| Leadership | [TODO: leadership bios] |
| Credentials (H2) | Credentials |
| Credentials rows | Legal name: CE Solution Plus Corp. · Ownership: Service-disabled veteran-owned small business (SDVOSB) [TODO: SDVOSB certifying body] · Ownership: Woman-owned [TODO: WOSB certification status] · SAM UEI: ZVQVJUVMF9K6 · CAGE code: 9KV33 · NAICS codes: [TODO: NAICS codes] · PSC codes: [TODO: PSC codes] · Contract vehicles: [TODO: contract vehicles] · Office: 3007 43rd Street, Suite 1, Astoria, NY 11103 |
| Copy all | Copy all details |

---

## 6. Careers `/careers/`

| Element | Copy |
|---|---|
| `<title>` | Careers · CE Solution Plus |
| Meta description | Careers in staffing assignments, facility operations and training at CE Solution Plus. |
| H1 | Careers |
| Lead | We place professionals on federal assignments and build teams for facility and training work. |
| Role families (H2) | Where you could work |
| Family 1 | Staffing assignments · Temporary and surge roles with government agencies. |
| Family 2 | Facility operations · Building systems, life safety, grounds and custodial work. |
| Family 3 | Training and instruction · Courses in business, leadership and technical skills. |
| Open roles (H2) | Open roles |
| Open roles | [TODO: open roles] |
| Empty state | No roles are posted right now. Send a general application and we'll keep it on file. |
| CTA | Send a general application |

---

## 7. Contact `/contact/`

| Element | Copy |
|---|---|
| `<title>` | Contact · CE Solution Plus |
| Meta description | Contact CE Solution Plus, an SDVOSB in Astoria, NY. Email, phone and inquiry form. |
| H1 | Contact |
| Lead | Send a message, email or call. Contracting officers, prime contractors and candidates welcome. |
| Form heading | Send a message |
| Required marker | (required) |
| Name | Full name |
| Organization | Organization or agency |
| Email | Email address |
| Phone | Phone number |
| Phone hint | Optional. We'll call only if you ask us to. |
| Topic | Topic |
| Topic options | Choose a topic · Contracting and capabilities · Teaming and subcontracting · Careers · General inquiry |
| Message | Message |
| Message hint | Include the requirement, location and timeline if you have them. |
| Submit | Send message |
| Submitting | Sending… |
| Direct heading | Reach us directly |
| Direct labels | Email · Phone · Office |

### Validation and system messages
| Case | Message (what → why → how) |
|---|---|
| Error summary title | There is a problem with your message |
| Name empty | Enter your full name. |
| Email empty | Enter your email address. |
| Email invalid | Enter an email address in the format name@agency.gov. |
| Phone invalid | Enter a phone number using digits, spaces, brackets or dashes. |
| Topic empty | Choose a topic so we can route your message. |
| Message empty | Enter your message. |
| Message too short | Your message is too short. Add a few more details (at least 10 characters). |
| Success heading | Message sent |
| Success body | Thank you. We'll reply to {email} within [TODO: response time] business days. |
| Delivery failure | We couldn't send your message. Your text is still in the form. Try again, or email siblini@cesolutionplus.com. |
| No endpoint (mailto fallback) | Your email app will open with the message filled in. Press send there to finish. |

---

## 8. Privacy `/privacy/`

Body carried over verbatim from the live site's Privacy Policy (company-owned text). Heading: Privacy policy. `<title>`: Privacy policy · CE Solution Plus. Note: the live text mentions newsletters and payments, which the new site doesn't have. [TODO: legal review of privacy policy]

---

## 9. 404

| Element | Copy |
|---|---|
| `<title>` | Page not found · CE Solution Plus |
| H1 | Page not found |
| Body | The page you're looking for doesn't exist or has moved. |
| Links | Go to the home page · View capabilities · Contact us |

---

## 10. Capability statement (PDF)

One page, generated from the site's verified data: company name and tagline, SDVOSB, UEI, CAGE, NAICS [TODO], core capabilities (three service lines with the bullets above), differentiators (one accountable partner for staffing, facilities and training; 300+ course training catalog; five delivery formats), past performance [TODO], contact. Footer: "Draft. [TODO: capability statement content review]".

---

## 11. Pre-ship checklist (run on every line above)

1. Reads naturally aloud ✓
2. Actions start with a verb (Download, Contact, Send, Discuss, Explore, View, Request, Copy) ✓
3. No jargon or hype words from §0 ✓
4. Errors follow what → why → how; none blame the user ✓
5. Empty states give value → action ✓
6. Sentence case in source ✓
7. Numerals (3, 300+, 5) ✓
8. Labels, not placeholders ✓
9. No colour- or direction-only instructions ✓
10. No concatenated strings; `{email}`, `{year}`, `{n}` are whole-sentence variables ✓

---

## 12. Placeholders introduced in this step

New: `[TODO: response time]` · `[TODO: staffing NAICS]` · `[TODO: facilities NAICS]` · `[TODO: training NAICS]` · `[TODO: legal review of privacy policy]` · `[TODO: capability statement content review]`.
Carried: NAICS, PSC, contract vehicles, SDVOSB certifying body, WOSB status, past performance #1–#3, leadership bios, open roles, canonical phone, canonical email, form delivery endpoint.
