// CE Solution Plus | "Federal Standard" motion layer.
// Motion language: deliberate and ceremonial. Ink is signed, colours are raised, nothing bounces.
// Signature moments: the overture (monogram signed in navy ink, then we fly through the E),
// the scattering headline over a star field, the iris, red strike-throughs, opening doors,
// the capability drum and the steel-framed certificate.

const root = document.documentElement;
const REDUCED = root.classList.contains("reduced");
const SEEN = root.classList.contains("seen");
const FINE_POINTER = matchMedia("(hover: hover) and (pointer: fine)").matches;
const { gsap, ScrollTrigger, Lenis } = window;
const HAS_GSAP = Boolean(gsap && ScrollTrigger);
const MOTION = HAS_GSAP && !REDUCED;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);
const isDesktop = () => matchMedia("(min-width: 901px)").matches;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const nav = $("[data-nav]");
const navHeight = () => nav.offsetHeight;
let lenis = null;

/* =========================================================
   Text splitting: visual pieces are aria-hidden, a single
   sr-only copy keeps the sentence whole for screen readers.
   ========================================================= */
function split(el, mode) {
  const label = el.textContent.replace(/\s+/g, " ").trim();
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = label;
  const vis = document.createElement("span");
  vis.setAttribute("aria-hidden", "true");
  while (el.firstChild) vis.appendChild(el.firstChild);

  const make = (word) => {
    if (mode === "chars") {
      const w = document.createElement("span");
      w.className = "word";
      [...word].forEach((c) => {
        const ch = document.createElement("span");
        ch.className = "ch";
        ch.textContent = c;
        w.appendChild(ch);
      });
      return w;
    }
    if (mode === "ignite") {
      const s = document.createElement("span");
      s.className = "iw";
      s.textContent = word;
      return s;
    }
    const w = document.createElement("span");
    w.className = "w";
    const i = document.createElement("span");
    i.className = "wi";
    i.textContent = word;
    w.appendChild(i);
    return w;
  };

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
          else frag.appendChild(make(part));
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(vis);
  el.append(sr, vis);
  const cls = mode === "chars" ? ".ch" : mode === "ignite" ? ".iw" : ".wi";
  return $$(cls, vis);
}

// Splitting into letters loses the font's kerning pairs ("Yo", "We"...).
// Measure each pair with the real font and give the gap back as a margin.
function restoreKerning(scope) {
  const ctx = document.createElement("canvas").getContext("2d");
  $$(".word", scope).forEach((word) => {
    const chars = $$(".ch", word);
    if (chars.length < 2) return;
    const cs = getComputedStyle(chars[0]);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.letterSpacing = "0px";
    if ("fontKerning" in ctx) ctx.fontKerning = "normal";
    for (let i = 0; i < chars.length - 1; i++) {
      const a = chars[i].textContent;
      const b = chars[i + 1].textContent;
      const k = ctx.measureText(a + b).width - ctx.measureText(a).width - ctx.measureText(b).width;
      chars[i].style.marginRight = Math.abs(k) > 0.2 ? `${k.toFixed(2)}px` : "";
    }
  });
}

/* =========================================================
   Smooth scroll
   ========================================================= */
function initLenis() {
  if (!MOTION || !Lenis) return;
  lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  const el = typeof target === "string" ? $(target) : null;
  const done = () => {
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  if (lenis) lenis.scrollTo(el || 0, { duration: 1.8, onComplete: done });
  else {
    if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
    else window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    done();
  }
}

/* =========================================================
   Overture + hero entrance
   ========================================================= */
function initOverture() {
  const heroChars = split($(".hero__title"), "chars");
  const curtain = $("[data-curtain]");
  if (!MOTION) { if (curtain) curtain.style.display = "none"; root.classList.add("booted"); return heroChars; }

  const fades = $$("[data-hero-fade]");
  const mark = $(".curtain__mark", curtain);
  const word = $(".curtain__word", curtain);
  const tag = $(".curtain__tag", curtain);
  const veil = $(".curtain__veil", curtain);

  // start states (the curtain hides all of this)
  gsap.set(heroChars, { yPercent: 70, rotationX: -88, opacity: 0, filter: "blur(10px)", transformOrigin: "50% 100%" });
  gsap.set(fades, { y: 18, opacity: 0 });
  gsap.set(nav, { yPercent: -100, opacity: 0 });
  gsap.set(".hero__mono", { scale: 1.25, opacity: 0 });
  gsap.set(".hero__title", { opacity: 1 });
  gsap.set(mark, { "--sweep": "0deg", scale: 0.92 });
  gsap.set(word, { clipPath: "inset(0 100% 0 0)", filter: "blur(12px)" });
  gsap.set(tag, { opacity: 0, scaleX: 0.86 });
  root.classList.add("booted");
  lenis?.stop();

  const tl = gsap.timeline({ paused: true });
  const draw = SEEN ? 0.75 : 1.7;

  // I. the pen draws the monogram in gold
  tl.to(mark, { "--sweep": "360deg", duration: draw, ease: "power2.inOut" }, 0)
    .to(mark, { scale: 1, duration: draw + 0.4, ease: "expo.out" }, 0);
  if (!SEEN) {
    tl.to(word, { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", duration: 1.3, ease: "expo.out" }, 1.0)
      .to(tag, { opacity: 1, scaleX: 1, duration: 1.2, ease: "expo.out" }, 1.45)
      .to([word, tag], { opacity: 0, y: -14, duration: 0.6, ease: "power3.in" }, 2.75);
  }
  // the stripe storm: 13 bars shoot across from alternating sides, then clear the stage
  const stripes = $$(".curtain__stripes i", curtain);
  const ss = SEEN ? draw - 0.15 : 2.6;
  stripes.forEach((st, i) => gsap.set(st, { scaleX: 0, transformOrigin: i % 2 ? "100% 50%" : "0% 50%" }));
  tl.to(stripes, { scaleX: 1, duration: 0.5, ease: "power4.inOut", stagger: 0.03 }, ss)
    .add(() => stripes.forEach((st, i) => { st.style.transformOrigin = i % 2 ? "0% 50%" : "100% 50%"; }), ss + 0.9)
    .to(stripes, { scaleX: 0, duration: 0.55, ease: "power4.inOut", stagger: { each: 0.03, from: "center" } }, ss + 0.95);

  // II. the ink lifts off; the monogram becomes a window
  const hole = SEEN ? draw + 0.75 : 3.7;
  tl.add(() => curtain.classList.add("is-hole"), hole)
    .to(mark, { opacity: 0, duration: 0.45, ease: "power2.out" }, hole)
  // III. fly through the stem of the E
    .to(veil, { scale: 70, duration: 1.45, ease: "power4.in" }, hole + 0.25)
    .to(".hero__mono", { scale: 1, opacity: 1, duration: 2.2, ease: "expo.out" }, hole + 1.1)
    .add(() => { curtain.style.display = "none"; lenis?.start(); }, hole + 1.72);

  // IV. the headline turns into place, letter by letter
  const t = hole + 1.25;
  tl.to(heroChars, { yPercent: 0, rotationX: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", stagger: { each: 0.028 } }, t)
    .to(fades, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.09 }, t + 0.7)
    .to(nav, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", clearProps: "transform" }, t + 0.8)
    .add(() => { try { sessionStorage.setItem("ce-seen", "1"); } catch (e) {} });

  const hurry = () => { if (tl.isActive() && tl.timeScale() === 1) tl.timeScale(4); };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, hurry, { once: true, passive: true }));

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const imgReady = new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = "assets/logo-mark.png"; });
  Promise.race([Promise.all([fontsReady, imgReady]), new Promise((r) => setTimeout(r, 2500))]).then(() => {
    ScrollTrigger.refresh();
    tl.play();
  });
  return heroChars;
}

/* =========================================================
   Hero: searchlight on the star, parallax, scattering exit
   ========================================================= */
function initHero(chars) {
  if (!MOTION) return;
  const hero = $(".hero");
  const light = $(".hero__light");
  initDust($(".dust", hero), hero);

  // the fifty stars: galaxy, then the flag canton, then a warp. Loaded while the overture plays.
  let stars = null;
  const startStars = () => import("./stars-gl.js")
    .then(({ createStars }) => { stars = createStars($(".stars-gl", hero)); if (stars) $(".dust", hero).classList.add("is-off"); })
    .catch((err) => console.warn("Star field unavailable; keeping the 2D dust.", err));
  if ("requestIdleCallback" in window) requestIdleCallback(startStars, { timeout: 1500 }); else setTimeout(startStars, 800);
  ScrollTrigger.create({
    trigger: hero, start: "top top", end: "bottom top",
    onUpdate: (self) => { if (!stars) return; stars.state.morph = smooth(0.03, 0.4, self.progress); stars.state.warp = smooth(0.45, 1, self.progress); },
  });
  if (FINE_POINTER) {
    window.addEventListener("pointermove", (e) => {
      if (!stars) return;
      gsap.to(stars.state, { tiltX: (e.clientX / innerWidth - 0.5) * 2, tiltY: (e.clientY / innerHeight - 0.5) * 2, duration: 1.4, ease: "power3.out", overwrite: true });
    }, { passive: true });
  }
  const pos = { x: 50, y: 42 };
  const apply = () => { light.style.setProperty("--mx", `${pos.x}%`); light.style.setProperty("--my", `${pos.y}%`); };
  const xTo = gsap.quickTo(pos, "x", { duration: 1.2, ease: "power3.out", onUpdate: apply });
  const yTo = gsap.quickTo(pos, "y", { duration: 1.2, ease: "power3.out", onUpdate: apply });

  if (FINE_POINTER) {
    hero.addEventListener("pointermove", (e) => {
      const r = light.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width) * 100);
      yTo(((e.clientY - r.top) / r.height) * 100);
      gsap.to(".hero__mono", { x: (e.clientX / innerWidth - 0.5) * -24, y: (e.clientY / innerHeight - 0.5) * -24, duration: 1.6, ease: "power3.out", overwrite: "auto" });
    });
  } else {
    // touch: the light wanders over the monogram by itself
    const wander = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 4, ease: "sine.inOut", onUpdate: apply } });
    wander.to(pos, { x: 28, y: 30 }).to(pos, { x: 72, y: 56 }).to(pos, { x: 40, y: 72 });
    ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", onToggle: (s) => (s.isActive ? wander.play() : wander.pause()) });
  }

  // scroll away: the letters come loose and drift, the monogram swells
  // scroll away: the headline detonates in 3D
  gsap.set(chars, { transformPerspective: 700 });
  gsap.fromTo(chars, { x: 0, y: 0, z: 0, rotation: 0, rotationY: 0, opacity: 1 }, {
    x: () => rand(-460, 460), y: () => rand(-640, -60), z: () => rand(-900, 520), rotation: () => rand(-140, 140), rotationY: () => rand(-220, 220), opacity: 0, ease: "power2.in",
    immediateRender: false,
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom 15%", scrub: 0.8, invalidateOnRefresh: true },
  });
  gsap.fromTo([".hero__foot", ".hero__eyebrow", ".scrollcue"], { opacity: 1, y: 0 }, {
    opacity: 0, y: -40, ease: "none", immediateRender: false,
    scrollTrigger: { trigger: hero, start: "top top", end: "40% top", scrub: true },
  });
  gsap.to([".hero__mono span", light], {
    scale: 1.45, rotation: 36, ease: "none", // one point of the star: it lands identical
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
}

/* =========================================================
   I. Mission: iris into night, gold dust, word ignition
   ========================================================= */
function initMission() {
  const section = $("[data-iris]");
  const words = split($("[data-ignite]"), "ignite");
  if (!MOTION) return;

  const starClip = (w, h, R, turn) => {
    const cx = w / 2, cy = h / 2, pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + turn + (i * Math.PI) / 5;
      const r = i % 2 ? R * 0.382 : R;
      pts.push((cx + Math.cos(a) * r).toFixed(1) + "px " + (cy + Math.sin(a) * r).toFixed(1) + "px");
    }
    return "polygon(" + pts.join(",") + ")";
  };
  const iris = (p) => {
    const w = section.offsetWidth, h = Math.min(section.offsetHeight, innerHeight * 1.3);
    section.style.clipPath = p >= 0.999 ? "none" : starClip(w, h, Math.hypot(w, h) * 1.45 * Math.pow(p, 1.5), p * Math.PI * 0.8);
  };
  iris(0);
  ScrollTrigger.create({ trigger: section, start: "top bottom", end: "top 5%", scrub: 0.6, onUpdate: (self) => iris(self.progress), onRefresh: (self) => iris(self.progress) });
  gsap.to(words, {
    opacity: 1, ease: "none", stagger: 0.08,
    scrollTrigger: { trigger: "[data-ignite]", start: "top 75%", end: "bottom 50%", scrub: 0.5 },
  });

}

function initDust(canvas, section) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, motes = [];
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(170, Math.round((w * h) / 9000));
    motes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: rand(0.35, 1.5), vy: rand(-0.04, -0.16), vx: rand(-0.03, 0.03),
      tw: rand(0, Math.PI * 2), ts: rand(0.01, 0.035), a: rand(0.25, 0.9),
    }));
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  const tick = () => {
    if (canvas.classList.contains("is-off")) return;
    const v = lenis ? clamp(lenis.velocity, -40, 40) : 0;
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      m.tw += m.ts;
      m.y += m.vy - v * 0.05 * m.r;
      m.x += m.vx;
      if (m.y < -5) m.y = h + 5;
      if (m.y > h + 5) m.y = -5;
      if (m.x < -5) m.x = w + 5;
      if (m.x > w + 5) m.x = -5;
      const a = m.a * (0.55 + 0.45 * Math.sin(m.tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  // only animate while it can be seen
  ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)) });
}

/* =========================================================
   II. Challenge: the problems are crossed out in gold
   ========================================================= */
function initChallenge() {
  const strikes = $$(".strike");
  if (!MOTION) { strikes.forEach((s) => s.classList.add("is-struck")); return; }
  const section = $(".challenge");
  const hit = new Set();
  ScrollTrigger.create({
    trigger: "[data-strikes]", start: "top 65%", end: "bottom 30%", scrub: 0.4,
    onUpdate: (self) => {
      strikes.forEach((s, i) => {
        const p = clamp(self.progress * strikes.length - i, 0, 1);
        s.style.setProperty("--s", p.toFixed(3));
        s.classList.toggle("is-struck", p > 0.6);
        if (p > 0.97 && !hit.has(i)) {
          hit.add(i);
          gsap.fromTo(section, { "--flash": 0.6 }, { "--flash": 0, duration: 0.9, ease: "power2.out", overwrite: true });
          gsap.fromTo(s, { rotation: 0, y: 0 }, { rotation: rand(-8, 8), y: "0.14em", duration: 1, ease: "bounce.out" });
        } else if (p < 0.5 && hit.has(i)) {
          hit.delete(i);
          gsap.to(s, { rotation: 0, y: 0, duration: 0.4, ease: "power2.out" });
        }
      });
    },
  });
}

/* =========================================================
   Shared reveals
   ========================================================= */
function initReveals() {
  $$("[data-rise-words]").forEach((el) => {
    const words = split(el, "words");
    if (!MOTION) return;
    gsap.set(words, { yPercent: 115, rotation: 4 });
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, rotation: 0, duration: 1.3, ease: "expo.out", stagger: 0.05 }),
    });
  });
  $$("[data-rise]").forEach((el) => {
    if (!MOTION) return;
    gsap.from(el, { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  $$(".chapter").forEach((el) => {
    if (!MOTION || el.closest(".hero")) return;
    gsap.from(el, { opacity: 0, letterSpacing: "0.7em", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$("[data-rows]").forEach((list) => {
    [...list.children].forEach((row, i) => row.style.setProperty("--r", i));
    if (!MOTION) { list.classList.add("is-in"); return; }
    ScrollTrigger.create({ trigger: list, start: "top 82%", once: true, onEnter: () => list.classList.add("is-in") });
  });

  // contact headline turns in like the hero
  const contactChars = split($(".contact__title"), "chars");
  if (MOTION) {
    gsap.set(contactChars, { yPercent: 70, rotationX: -88, opacity: 0, filter: "blur(10px)", transformOrigin: "50% 100%" });
    ScrollTrigger.create({
      trigger: ".contact__title", start: "top 80%", once: true,
      onEnter: () => gsap.to(contactChars, { yPercent: 0, rotationX: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", stagger: 0.03 }),
    });
    gsap.fromTo(".contact__mono", { rotation: -25 }, { rotation: 15, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".seal", { scale: 0.4, rotation: -120, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".contact__row", start: "top 85%", once: true } });
    // the footer logo is unveiled like a plaque
    gsap.from([".footer__mark", ".footer__word", ".footer__tag"], {
      clipPath: "inset(0 100% 0 0)", duration: 1.8, ease: "power4.inOut", stagger: 0.15,
      scrollTrigger: { trigger: ".footer", start: "top 80%", once: true },
    });
  }
}

/* =========================================================
   III. Services: three doors open in 3D
   ========================================================= */
function initDoors() {
  const doors = $$(".door");
  const count = $("[data-count]");
  const countUp = () => {
    if (!MOTION) return;
    const o = { v: 0 };
    gsap.to(o, { v: 300, duration: 2, ease: "power3.out", onUpdate: () => { count.textContent = Math.round(o.v); } });
  };
  if (!MOTION) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    gsap.set(doors, { rotationY: -100, z: -120, opacity: 0, transformOrigin: "0% 50%" });
    gsap.set(".doors", { rotationY: -28, rotationX: 10, z: -420, transformPerspective: 1600 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".services__pin", start: "top top", end: "+=140%", pin: true, scrub: 0.8, anticipatePin: 1 },
    });
    tl.to(".doors", { rotationY: 0, rotationX: 0, z: 0, duration: 1.4, ease: "power3.out" }, 0);
    doors.forEach((d, i) => {
      tl.to(d, { rotationY: 0, z: 0, opacity: 1, duration: 1, ease: "power3.out" }, i * 0.55);
      tl.from($$(".door__title, .door__text, .door__list", d), { x: 40, opacity: 0, duration: 0.6, stagger: 0.08 }, i * 0.55 + 0.45);
    });
    tl.add(countUp, 1.3);
    tl.to({}, { duration: 0.4 });
  });
  if (FINE_POINTER) {
    doors.forEach((d) => {
      const face = $(".door__face", d);
      gsap.set(face, { transformPerspective: 900 });
      const rx = gsap.quickTo(face, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(face, "rotationY", { duration: 0.6, ease: "power3.out" });
      face.addEventListener("pointermove", (e) => {
        const r = face.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 16);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
      });
      face.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }
  mm.add("(max-width: 900px)", () => {
    doors.forEach((d) => {
      gsap.from(d, { rotationX: -35, y: 80, opacity: 0, transformOrigin: "50% 0%", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: d, start: "top 88%", once: true, onEnter: () => { if (d.contains(count)) countUp(); } } });
    });
  });
}

/* =========================================================
   IV. Capabilities: the drum
   ========================================================= */
function initDrum() {
  const drum = $("[data-drum]");
  const source = $(".drum__list", drum);
  const idx = $("[data-drum-index]");
  const cat = $("[data-drum-cat]");
  if (!MOTION) return;

  // Screen readers get the real list, whole and still; the spinning drum is a decorative copy
  // (its back-facing names are faded on purpose, which would otherwise read as low contrast).
  const list = source.cloneNode(true);
  list.setAttribute("aria-hidden", "true");
  source.classList.add("sr-only");
  source.after(list);
  const items = $$(".drum__item", list);
  const ghost = $("[data-drum-ghost]", drum);
  gsap.set(drum, { transformPerspective: 1400 });
  const tiltY = gsap.quickTo(drum, "rotationY", { duration: 0.9, ease: "power3.out" });
  const tiltX = gsap.quickTo(drum, "rotationX", { duration: 0.9, ease: "power3.out" });
  const skew = gsap.quickTo(drum, "skewX", { duration: 0.5, ease: "power3.out" });
  if (FINE_POINTER) {
    drum.addEventListener("pointermove", (e) => {
      const r = drum.getBoundingClientRect();
      tiltY(((e.clientX - r.left) / r.width - 0.5) * 18);
      tiltX(-((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    drum.addEventListener("pointerleave", () => { tiltY(0); tiltX(0); });
  }
  gsap.ticker.add(() => { if (lenis) skew(clamp(lenis.velocity * -0.35, -12, 12)); });

  const n = items.length;
  const step = 360 / n;
  let radius = 0;
  let rot = 0;
  const layout = () => {
    const h = list.offsetHeight;
    radius = (h * 1.15) / (2 * Math.tan(Math.PI / n));
    items.forEach((it, i) => { it.style.transform = `rotateX(${-i * step}deg) translateZ(${radius}px)`; });
    render();
  };
  const render = () => {
    list.style.transform = `translateZ(${-radius}px) rotateX(${rot}deg)`;
    let best = 0, bestD = 999;
    items.forEach((it, i) => {
      let d = ((i * step - rot) % 360 + 540) % 360 - 180;
      const ad = Math.abs(d);
      // names that would fall under 3:1 contrast leave the drum instead of lingering as ghosts
      const o = Math.cos((Math.min(ad, 90) * Math.PI) / 180);
      it.style.opacity = o >= 0.42 ? o.toFixed(3) : "0";
      it.style.visibility = o >= 0.42 ? "" : "hidden";
      if (ad < bestD) { bestD = ad; best = i; }
    });
    items.forEach((it, i) => it.classList.toggle("is-active", i === best));
    const label = String(best + 1).padStart(2, "0");
    if (idx.textContent !== label) {
      idx.textContent = label;
      ghost.textContent = label;
      gsap.fromTo(ghost, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out", overwrite: true });
    }
    cat.textContent = items[best].dataset.cat;
  };
  layout();
  new ResizeObserver(layout).observe(list);

  ScrollTrigger.create({
    trigger: ".caps__pin", start: "top top", end: () => `+=${innerHeight * (isDesktop() ? 2.6 : 2)}`, pin: true, scrub: 0.6, anticipatePin: 1,
    snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: "power2.inOut" }, // settle on a capability, never between two
    onUpdate: (self) => { rot = self.progress * step * (n - 1); render(); },
  });
}

/* =========================================================
   VI. Credentials: the certificate tilts and catches light
   ========================================================= */
function initCert() {
  const cert = $("[data-cert]");
  const inner = $(".cert__inner", cert);
  if (!MOTION) return;
  gsap.from(inner, { rotationX: 38, y: 120, opacity: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: cert, start: "top 85%", once: true } });
  gsap.from($$(".spec__row", cert), { opacity: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.4, scrollTrigger: { trigger: cert, start: "top 80%", once: true } });
  const seal = $(".cert__seal", cert);
  const shock = $(".cert__shock", cert);
  gsap.set(seal, { scale: 3.4, rotation: -60, opacity: 0 });
  ScrollTrigger.create({
    trigger: cert, start: "top 65%", once: true,
    onEnter: () => gsap.timeline({ delay: 0.7 })
      .to(seal, { scale: 1, rotation: 0, opacity: 1, duration: 0.42, ease: "power4.in" })
      .fromTo(shock, { scale: 0.7, opacity: 0.95 }, { scale: 3.4, opacity: 0, duration: 1, ease: "expo.out" })
      .fromTo(cert, { y: 14 }, { y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" }, "<"),
  });
  if (!FINE_POINTER) return;
  cert.addEventListener("pointermove", (e) => {
    const r = inner.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    inner.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    inner.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    inner.style.setProperty("--px", `${px * 100}%`);
    inner.style.setProperty("--py", `${py * 100}%`);
  });
  cert.addEventListener("pointerleave", () => { inner.style.setProperty("--rx", "0deg"); inner.style.setProperty("--ry", "0deg"); });
}

/* =========================================================
   Copy to clipboard
   ========================================================= */
const announcer = $("[data-announcer]");
function announce(msg) { announcer.textContent = ""; requestAnimationFrame(() => { announcer.textContent = msg; }); }

async function writeClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function initCopy() {
  $$("[data-copy]").forEach((btn) => {
    const text = $(".copy__text", btn);
    btn.addEventListener("click", async () => {
      const ok = await writeClipboard(btn.dataset.copy);
      announce(ok ? `${btn.dataset.copyLabel} copied: ${btn.dataset.copy}` : `Couldn't copy. ${btn.dataset.copyLabel}: ${btn.dataset.copy}`);
      if (!ok) return;
      btn.classList.add("is-done");
      if (text) text.textContent = "Copied";
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove("is-done"); if (text) text.textContent = "Copy"; }, 1800);
    });
  });
  const all = $("[data-copy-all]");
  const label = $("[data-copy-all-label]");
  const block = [
    "CE Solution Plus Corp.",
    "Service-Disabled Veteran-Owned Small Business (SDVOSB)",
    "Woman-Owned Small Business (WOSB)",
    "SAM UEI: ZVQVJUVMF9K6",
    "CAGE code: 9KV33",
    "3007 43rd Street, Suite 1, Astoria, NY 11103",
    "siblini@cesolutionplus.com | (718) 587-9987",
  ].join("\n");
  all.addEventListener("click", async () => {
    const ok = await writeClipboard(block);
    announce(ok ? "All company details copied." : "Couldn't copy the details.");
    if (!ok) return;
    label.textContent = "Copied to clipboard";
    clearTimeout(all._t);
    all._t = setTimeout(() => { label.textContent = "Copy all details"; }, 2000);
  });
}

/* =========================================================
   Navigation
   ========================================================= */
function initNav() {
  const burger = $(".burger");
  const menu = $("#menu");
  const dock = $("[data-dock]");
  const hero = $(".hero");
  const progress = $(".nav__progress");
  const links = $$(".nav__links [data-link]");
  let last = 0;
  let menuOpen = false;
  let ticking = false;

  const senseTheme = () => {
    const stack = document.elementsFromPoint(innerWidth / 2, navHeight() / 2);
    const under = stack.find((el) => !el.closest(".nav, .menu, .cursor, .curtain"));
    nav.classList.toggle("is-night", under?.closest("[data-theme]")?.dataset.theme === "navy");
  };
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("is-scrolled", y > 10);
    const pastHero = y > hero.offsetHeight * 0.8;
    if (!menuOpen && pastHero && y > last + 2) nav.classList.add("is-hidden");
    if (y < last - 2 || !pastHero) nav.classList.remove("is-hidden");
    last = y;
    if (!ticking) { ticking = true; requestAnimationFrame(() => { senseTheme(); ticking = false; }); }
  };
  if (lenis) lenis.on("scroll", onScroll);
  else window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (HAS_GSAP) {
    links.forEach((l) => {
      ScrollTrigger.create({
        trigger: document.getElementById(l.dataset.link), start: "top 50%", end: "bottom 50%",
        onToggle: (s) => { if (s.isActive) links.forEach((o) => (o === l ? o.setAttribute("aria-current", "true") : o.removeAttribute("aria-current"))); else l.removeAttribute("aria-current"); },
      });
    });
  }

  const behind = [$("main"), $(".footer"), dock];
  const setMenu = (open, { returnFocus = true } = {}) => {
    menuOpen = open;
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    behind.forEach((el) => { el.inert = open; });
    burger.setAttribute("aria-expanded", String(open));
    root.classList.toggle("menu-open", open);
    $(".sr-only", burger).textContent = open ? "Close menu" : "Menu";
    dock.classList.remove("is-visible");
    if (open) {
      lenis?.stop();
      if (MOTION) gsap.fromTo(".menu__list a", { yPercent: 110, rotation: 3 }, { yPercent: 0, rotation: 0, duration: 1.2, ease: "expo.out", stagger: 0.07, delay: 0.35 });
      setTimeout(() => $(".menu__list a")?.focus(), REDUCED ? 0 : 500);
    } else {
      lenis?.start();
      if (returnFocus) burger.focus();
    }
  };
  burger.addEventListener("click", () => setMenu(!menuOpen));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menuOpen) setMenu(false); });
  menu.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const items = [burger, ...$$("a", menu)];
    const i = items.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
  });
  burger.addEventListener("keydown", (e) => {
    if (!menuOpen || e.key !== "Tab") return;
    e.preventDefault();
    const items = $$("a", menu);
    (e.shiftKey ? items[items.length - 1] : items[0]).focus();
  });

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      e.preventDefault();
      if (menuOpen) setMenu(false, { returnFocus: false });
      if (id === "#main") { $("#main").focus(); return; }
      scrollToTarget(id === "#top" ? null : id);
    });
  });

  if (HAS_GSAP) {
    let past = false, atContact = false;
    const sync = () => dock.classList.toggle("is-visible", past && !atContact && !menuOpen);
    ScrollTrigger.create({ trigger: hero, start: "bottom 40%", end: "max", onToggle: (s) => { past = s.isActive; sync(); } });
    ScrollTrigger.create({ trigger: "#contact", start: "top 85%", end: "max", onToggle: (s) => { atContact = s.isActive; sync(); } });
  }
}

/* =========================================================
   Pointer: follower ring + magnetic CTAs
   ========================================================= */
function initPointer() {
  if (!MOTION || !FINE_POINTER) return;
  const cursor = $(".cursor");
  const rx = gsap.quickTo(".cursor__ring", "x", { duration: 0.55, ease: "power3.out" });
  const ry = gsap.quickTo(".cursor__ring", "y", { duration: 0.55, ease: "power3.out" });
  const dx = gsap.quickTo(".cursor__dot", "x", { duration: 0.12 });
  const dy = gsap.quickTo(".cursor__dot", "y", { duration: 0.12 });
  window.addEventListener("pointermove", (e) => { cursor.classList.add("is-on"); rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
  document.addEventListener("pointerover", (e) => cursor.classList.toggle("is-hover", Boolean(e.target.closest("a, button"))));

  $$("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.strength) || 0.25;
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength, -18, 18));
      yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength, -18, 18));
    });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

/* =========================================================
   Codes ticker: two giant bands, speed and lean follow the scroll
   ========================================================= */
function initTicker() {
  if (!MOTION || !$(".ticker")) return;
  const rows = $$(".ticker__track").map((el, i) => ({ el, dir: i % 2 ? 1 : -1, x: 0, w: el.scrollWidth / 3 }));
  addEventListener("resize", () => rows.forEach((r) => { r.w = r.el.scrollWidth / 3; }));
  const lean = gsap.quickTo(".ticker", "skewY", { duration: 0.5, ease: "power3.out" });
  let boost = 0;
  const tick = (_, dt) => {
    const v = lenis ? lenis.velocity : 0;
    boost += (Math.abs(v) * 0.9 - boost) * 0.1;
    rows.forEach((r) => {
      r.x = gsap.utils.wrap(-r.w, 0, r.x + (1.3 + boost) * (dt / 16.67) * r.dir);
      r.el.style.transform = "translate3d(" + r.x + "px, 0, 0)";
    });
    lean(clamp(v * 0.22, -7, 7));
  };
  ScrollTrigger.create({ trigger: ".ticker", start: "top bottom", end: "bottom top", onToggle: (st) => (st.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)) });
}

/* =========================================================
   Big headings lean into fast scrolling
   ========================================================= */
function initVelocitySkew() {
  if (!MOTION || !lenis) return;
  const els = $$(".h-display, .challenge__title, .contact__title");
  const lean = gsap.quickTo(els, "skewY", { duration: 0.6, ease: "power3.out" });
  gsap.ticker.add(() => lean(clamp(lenis.velocity * 0.12, -5, 5)));
}

/* =========================================================
   Stripe wipes: red and navy bars sweep away to reveal a section
   ========================================================= */
function initStripes() {
  if (!MOTION) return;
  $$("[data-stripes]").forEach((section) => {
    const overlay = document.createElement("div");
    overlay.className = "stripes";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = "<i></i>".repeat(13);
    section.prepend(overlay);
    const bars = $$("i", overlay);
    bars.forEach((b, i) => gsap.set(b, { transformOrigin: i % 2 ? "100% 50%" : "0% 50%" }));
    gsap.to(bars, {
      scaleX: 0, ease: "power2.inOut", stagger: { each: 0.06, from: "edges" },
      scrollTrigger: { trigger: section, start: "top 95%", end: "top 20%", scrub: 0.5 },
    });
  });
}

/* =========================================================
   Cursor trail: red, white and blue stars that drift and fade
   ========================================================= */
function initTrail() {
  if (!MOTION || !FINE_POINTER) return;
  const canvas = $(".trail");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#e04a5f", "#3d6bc4", "#c9d2de", "#b31942"];
  let w = 0, h = 0, dpr = 1, parts = [], running = false, lx = 0, ly = 0;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener("resize", resize);
  const star = (x, y, r, rot) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
      const rr = i % 2 ? r * 0.42 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  };
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    parts = parts.filter((p) => (p.life -= 0.022) > 0);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.spin;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      star(p.x, p.y, p.r * (0.4 + p.life * 0.6), p.rot);
    }
    ctx.globalAlpha = 1;
    if (!parts.length) { gsap.ticker.remove(tick); running = false; }
  };
  addEventListener("pointermove", (e) => {
    if (Math.hypot(e.clientX - lx, e.clientY - ly) < 8) return;
    lx = e.clientX; ly = e.clientY;
    if (parts.length > 90) parts.shift();
    parts.push({ x: lx, y: ly, vx: rand(-0.8, 0.8), vy: rand(-1.2, 0.2), r: rand(3, 7), rot: rand(0, 6.28), spin: rand(-0.12, 0.12), life: 1, c: COLORS[(Math.random() * COLORS.length) | 0] });
    if (!running) { running = true; gsap.ticker.add(tick); }
  }, { passive: true });
}

/* =========================================================
   Boot
   ========================================================= */
function boot() {
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);
  initLenis();
  const heroChars = initOverture();
  initHero(heroChars);
  initMission();
  initChallenge();
  initReveals();
  initDoors();
  initDrum();
  initCert();
  initNav();
  initCopy();
  initPointer();
  initTicker();
  initVelocitySkew();
  initStripes();
  initTrail();
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  const kern = () => { restoreKerning($(".hero__title")); restoreKerning($(".contact__title")); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(kern);
  let kt; window.addEventListener("resize", () => { clearTimeout(kt); kt = setTimeout(kern, 150); });
  if (HAS_GSAP) {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
}

boot();
