# CE Solution Plus | Website

Single-page site for CE Solution Plus (veteran- & woman-owned federal contractor).

**Stack:** static HTML/CSS/JS · GSAP + ScrollTrigger · Lenis smooth scroll · self-hosted fonts · logo as CSS masks.
No build step and no framework. GSAP and Lenis load from CDNs; everything else is in this folder.

## Run locally
```bash
node serve.mjs   # → http://localhost:5173
```

## Files
- `index.html` | markup, content, SEO meta and Organization JSON-LD
- `styles.css` | design tokens, layout, components, responsive and reduced-motion rules
- `main.js` | motion system and interactions (ES module)
- `fonts/` | Bodoni Moda and Jost (OFL), latin subsets
- `assets/` | the company logo (original + monogram / wordmark / tagline crops used as CSS masks)
- `DESIGN.md` | audit, design system and motion system: read this before changing visuals
- `serve.mjs` | tiny static preview server

## Principles worth keeping
- Content is in the HTML and visible without JavaScript; JS only adds motion.
- Animate `transform`, `opacity` and `clip-path` only. No perpetual render loops.
- `prefers-reduced-motion` gets the full content with no pinning, scrubbing or smooth scroll.
