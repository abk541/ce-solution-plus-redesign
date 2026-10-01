// CE Solution Plus — motion system (GSAP + ScrollTrigger + Lenis + Three.js)
import { createScene } from "./scene.js";

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const LOADER_MIN_SECONDS = 1.8;
const MAX_SKEW = 6;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------------- Smooth scroll ---------------- */
let lenis = null;
function initLenis() {
  if (REDUCED || !Lenis) return;
  lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else $(target)?.scrollIntoView({ behavior: "smooth" });
}

/* ---------------- Text splitting ---------------- */
// Wraps each word in a mask (.w) + inner span so it can slide up from below.
function splitWords(el, innerClass = "wi") {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = "w";
          const inner = document.createElement("span");
          inner.className = innerClass;
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
  return $$(`.${innerClass}`, el);
}

/* ---------------- Loader + intro ---------------- */
function runLoader(scene) {
  const num = $(".loader__num");
  const bar = $(".loader__bar span");
  const counter = { v: 0 };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  const heroWords = $$(".hero .split").flatMap((el) => splitWords(el));
  gsap.set(heroWords, { yPercent: 115 });
  gsap.set(".hero .reveal-fade", { opacity: 0, y: 20 });
  gsap.set(".nav", { yPercent: -100, opacity: 0 });

  const count = gsap.to(counter, {
    v: 100, duration: REDUCED ? 0.2 : LOADER_MIN_SECONDS, ease: "power2.inOut",
    onUpdate: () => {
      num.textContent = Math.round(counter.v);
      bar.style.transform = `scaleX(${counter.v / 100})`;
    },
  });

  Promise.all([fontsReady, count.then()]).then(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("is-loading");
        lenis?.start();
        ScrollTrigger.refresh();
      },
    });
    tl.to(".loader__count, .loader__label", { yPercent: -40, opacity: 0, duration: 0.6, ease: "power3.in" })
      .to(".loader__bar", { scaleX: 0, transformOrigin: "right", duration: 0.5, ease: "power3.in" }, "<")
      .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.15")
      .set(".loader", { display: "none" })
      .add(() => { if (scene) scene.state.intro = 1; }, "-=0.9")
      .to(heroWords, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.06 }, "-=0.7")
      .to(".hero .reveal-fade", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, "-=1")
      .to(".nav", { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" }, "-=1");
  }).catch((err) => {
    console.error("Intro failed; revealing page without animation.", err);
    gsap.set([heroWords, ".hero .reveal-fade", ".nav"], { clearProps: "all" });
    gsap.set(".loader", { display: "none" });
    document.body.classList.remove("is-loading");
    lenis?.start();
  });
}

/* ---------------- Scroll choreography ---------------- */
function initScene3DScroll(scene) {
  if (!scene) return;
  ScrollTrigger.create({
    trigger: ".hero", start: "top top", endTrigger: ".manifesto", end: "bottom center", scrub: true,
    onUpdate: (self) => { scene.state.p1 = self.progress; },
  });
  ScrollTrigger.create({
    trigger: ".contact", start: "top bottom", end: "center center", scrub: true,
    onUpdate: (self) => { scene.state.p2 = self.progress; },
  });
}

function initHeroParallax() {
  gsap.to(".hero__title", {
    yPercent: -30, opacity: 0.2, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

function initScrubWords() {
  $$(".scrub-words").forEach((el) => {
    const words = splitWords(el, "sw");
    gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: true },
    });
  });
}

function initSplitReveals() {
  $$(".split-lines").forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.025,
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
  });
  $$(".contact .split").forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.08,
      scrollTrigger: { trigger: ".contact__title", start: "top 80%" },
    });
  });
  $$(".reveal-up").forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  $$(".contact .reveal-fade").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 20, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });
}

function initStatementPanel() {
  const panel = $(".statement__panel");
  gsap.to(panel, {
    clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
    scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true },
  });
  gsap.from(".statement__ring", {
    scale: 0.4, rotate: -120, opacity: 0, ease: "none",
    scrollTrigger: { trigger: panel, start: "top 60%", end: "center center", scrub: true },
  });
}

function initServices() {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 761px)", () => {
    const track = $(".services__track");
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: {
        trigger: ".services", pin: ".services__pin", start: "top top",
        end: () => `+=${distance()}`, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => gsap.set(".services__progress span", { scaleX: self.progress }),
      },
    });
    $$(".card", track).forEach((card) => {
      gsap.from(card, {
        y: 120, rotate: 4, opacity: 0.2, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 55%", scrub: true },
      });
    });
  });
  mm.add("(max-width: 760px)", () => {
    $$(".card").forEach((card) => {
      gsap.from(card, { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } });
    });
  });
}

function initCounters() {
  $$(".stat__n").forEach((el) => {
    const target = Number(el.dataset.count) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 2.2, ease: "power3.out",
      onUpdate: () => { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  gsap.from(".stat", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".numbers", start: "top 75%" } });
}

// Infinite marquees whose speed (and direction) react to scroll velocity.
function initMarquees() {
  const rows = $$(".marquee").map((row) => {
    const inner = $(".marquee__inner", row);
    inner.innerHTML = inner.innerHTML.repeat(3);
    return { inner, dir: Number(row.dataset.dir) || 1, x: 0, setWidth: inner.scrollWidth / 3 };
  });
  window.addEventListener("resize", () => rows.forEach((r) => { r.setWidth = r.inner.scrollWidth / 3; }));
  if (REDUCED) return;
  let boost = 0;
  let heading = 1;
  gsap.ticker.add((_, delta) => {
    const v = lenis ? lenis.velocity : 0;
    if (Math.abs(v) > 0.5) heading = Math.sign(v);
    boost = gsap.utils.interpolate(boost, Math.abs(v) * 0.6, 0.1);
    rows.forEach((r) => {
      r.x -= (1.1 + boost) * (delta / 16.67) * r.dir * heading;
      r.x = gsap.utils.wrap(-r.setWidth, 0, r.x);
      r.inner.style.transform = `translate3d(${r.x}px,0,0)`;
    });
  });
}

function initAgencies() {
  gsap.from(".agency", {
    y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".agency-list", start: "top 80%" },
  });
}

function initCredentials() {
  gsap.from(".cred", {
    y: 80, rotateX: -25, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.1,
    scrollTrigger: { trigger: ".cred-grid", start: "top 82%" },
  });
  if (FINE_POINTER) {
    $$("[data-tilt]").forEach((card) => {
      const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3.out" });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 16);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }
  $$(".cred__copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied";
      } catch (err) {
        console.warn("Clipboard unavailable", err);
        btn.textContent = btn.dataset.copy;
      }
      btn.classList.add("is-done");
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("is-done"); }, 1800);
    });
  });
}

function initFooter() {
  gsap.from(".footer__big", {
    yPercent: 60, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });
  $(".year").textContent = new Date().getFullYear();
}

// Cards lean into fast scrolling — the "rolling" feel.
function initVelocitySkew(scene) {
  if (REDUCED) return;
  const skewTo = gsap.quickTo($$(".card, .agency__n"), "skewY", { duration: 0.5, ease: "power3.out" });
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : 0;
    skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, v * 0.12));
    if (scene) scene.state.velocity = v;
  });
}

/* ---------------- Interaction ---------------- */
function initCursor() {
  if (!FINE_POINTER) return;
  const cursor = $(".cursor");
  const label = $(".cursor__ring em");
  const dx = gsap.quickTo(".cursor__dot", "x", { duration: 0.1 });
  const dy = gsap.quickTo(".cursor__dot", "y", { duration: 0.1 });
  const rx = gsap.quickTo(".cursor__ring", "x", { duration: 0.5, ease: "power3.out" });
  const ry = gsap.quickTo(".cursor__ring", "y", { duration: 0.5, ease: "power3.out" });
  window.addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });

  document.addEventListener("pointerover", (e) => {
    const labelled = e.target.closest("[data-cursor]");
    const hoverable = e.target.closest("a, button");
    const showLabel = Boolean(labelled) && !hoverable;
    cursor.classList.toggle("is-label", showLabel);
    cursor.classList.toggle("is-hover", Boolean(hoverable));
    if (showLabel) label.textContent = labelled.dataset.cursor;
  });
}

function initMagnetic() {
  if (!FINE_POINTER) return;
  $$("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.strength) || 0.3;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

function initCardSpotlight() {
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

function initNav() {
  const nav = $(".nav");
  const burger = $(".burger");
  const menu = $(".menu");
  let last = 0;

  const onScroll = (y) => {
    nav.classList.toggle("is-solid", y > 40);
    const menuOpen = menu.classList.contains("is-open");
    nav.classList.toggle("is-hidden", !menuOpen && y > last && y > 300);
    last = y;
  };
  if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
  else window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      lenis?.stop();
      gsap.fromTo(".menu li", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.25 });
    } else {
      lenis?.start();
    }
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      e.preventDefault();
      setMenu(false);
      scrollToTarget(id === "#top" || id === "#" ? 0 : id);
    });
  });
}

/* ---------------- Boot ---------------- */
function boot() {
  initLenis();
  let scene = null;
  try {
    scene = createScene($(".gl"));
  } catch (err) {
    console.warn("3D scene failed to start", err);
  }

  runLoader(scene);
  initScene3DScroll(scene);
  initHeroParallax();
  initScrubWords();
  initSplitReveals();
  initStatementPanel();
  initServices();
  initCounters();
  initMarquees();
  initAgencies();
  initCredentials();
  initFooter();
  initVelocitySkew(scene);
  initCursor();
  initMagnetic();
  initCardSpotlight();
  initNav();
}

boot();
