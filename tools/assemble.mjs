// Assembles the public site into _site/ and verifies that every local file the site references exists.
//   node tools/assemble.mjs
// Used by both GitHub Actions workflows (CI and Pages deploy). No dependencies.
import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");
// Only what the browser needs. Docs, tokens and tooling stay out of the deployed site.
const PUBLIC = ["index.html", "styles.css", "main.js", "stars-gl.js", "assets", "fonts", ".nojekyll"];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
for (const entry of PUBLIC) await cp(join(ROOT, entry), join(OUT, entry), { recursive: true });
await rm(join(OUT, "fonts", "README.md"), { force: true });

// Collect local references from HTML (src/href), CSS (url()) and JS (string paths and dynamic imports).
const refs = new Set();
const html = await readFile(join(OUT, "index.html"), "utf8");
for (const m of html.matchAll(/\b(?:src|href)="([^"#?]+)"/g)) refs.add(m[1]);
const css = await readFile(join(OUT, "styles.css"), "utf8");
for (const m of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) refs.add(m[1]);
for (const file of ["main.js", "stars-gl.js"]) {
  const js = await readFile(join(OUT, file), "utf8");
  for (const m of js.matchAll(/["'`]((?:\.\/)?(?:assets|fonts)\/[^"'`]+|\.\/[\w-]+\.js)["'`]/g)) refs.add(m[1]);
}

const missing = [];
for (const ref of refs) {
  if (/^(?:[a-z]+:|\/\/|data:)/i.test(ref)) continue; // external, mailto:, tel:, data:
  const path = normalize(join(OUT, ref.replace(/^\//, "")));
  try { await stat(path); } catch { missing.push(ref); }
}

if (missing.length) {
  console.error(`Missing local files referenced by the site:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
console.log(`Assembled _site/ (${PUBLIC.length} entries) and verified ${refs.size} references.`);
