# CE Solution Plus — Website Redesign

Single-page marketing site for CE Solution Plus (veteran- & woman-owned federal contractor).

**Stack:** static HTML/CSS/JS · GSAP + ScrollTrigger · Lenis smooth scroll · Three.js (WebGL "+" hero).
No build step — all libraries load from CDNs.

## Run locally
```bash
node serve.mjs   # → http://localhost:5173
```

## Files
- `index.html` — markup & content
- `styles.css` — design tokens, layout, responsive rules
- `main.js` — scroll choreography, loader, cursor, interactions
- `scene.js` — Three.js scene (segmented "+" that assembles and rolls with scroll)
- `serve.mjs` — tiny static preview server
