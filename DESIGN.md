# CE Solution Plus | Design notes ("Federal Standard")

## Direction
Power, America, reliability, without losing the premium finish. The site should feel at home next to the
agencies it serves (VA, NPS, USACE, DoD) and be trusted at a glance by contracting officers.

- **Palette:** deep navy `#0A1628`, Old Glory red `#B31942` (`#E04A5F` for red text on navy), clean white `#F4F6F9`,
  steel `#9AA8BD` for secondary text on navy. Sections alternate navy and white.
- **Type:** Barlow Condensed in uppercase for headlines (American signage), Barlow for text,
  Libre Caslon italic only for the promise lines ("your success is our mission").
- **Motifs:** a five-point star (hero watermark, bullets, eyebrow separators); a red-white-blue medal ribbon
  (chapter markers, the credentials certificate); tricolour bands at the hero, overture and footer edges.
- **Logo:** the company's own monogram and wordmark (`assets/logo-*.png`, from cesolutionplus.com) as CSS masks,
  in navy ink on white and brushed silver on navy.
- **Copy:** no em dashes; facts unchanged.

## Motion (unchanged choreography, re-dressed)
| Moment | What happens |
|---|---|
| Overture | The monogram is signed in navy ink on white; it becomes a window and the camera flies through the E into the navy hero. Shorter on repeat visits; any scroll/key skips. |
| Hero | A star field drifts; letters turn into place; a searchlight follows the pointer across a great star (drifts by itself on touch). On scroll the letters break loose and the star turns exactly one point. |
| I. Mission | A circular iris opens onto white; the sentence ignites word by word. |
| II. Challenge | "Staffing gaps", "broken chillers", "untrained teams" are struck through in red. |
| III. Services | Three panels swing open like doors in 3D (pinned on desktop). |
| IV. Capabilities | A 3D drum turns through thirteen capabilities and snaps to each one. |
| VI. Credentials | Steel-framed certificate under a medal ribbon and rotating ownership seal; tilts and catches the light. |
| VII. Contact | Headline turns in; rotating seal button; footer logo unveiled like a plaque. |

Reduced motion: no overture, no pins, no smooth scroll; the drum becomes a flat index.

## Verification (October 2026, headless Chrome)
| Check | Result |
|---|---|
| axe-core 4.10, WCAG 2.2 AA + best practices, desktop 1440 & mobile 390 | 0 violations |
| Cumulative Layout Shift | ~0 |
| LCP | ~1.1 s desktop (local, unthrottled) |
| Page weight | ~410 KB incl. fonts and logo |
| Horizontal overflow at 390 px | none |
