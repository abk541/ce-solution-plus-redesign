// WebGL hero: a segmented "+" that assembles on load and rolls with scroll.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const ACCENT = 0xff5a1f;
const PIECE_GAP = 1.07;
const PARTICLE_COUNT = 700;
const MAX_PIXEL_RATIO = 1.75;

const lerp = (a, b, t) => a + (b - a) * t;
const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));

function buildPieces(material) {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 5, 0.14);
  const homes = [
    [0, 0, 0],
    [PIECE_GAP, 0, 0],
    [-PIECE_GAP, 0, 0],
    [0, PIECE_GAP, 0],
    [0, -PIECE_GAP, 0],
  ];
  return homes.map(([x, y, z], i) => {
    const mesh = new THREE.Mesh(geometry, material);
    const dir = new THREE.Vector3(x || (Math.random() - 0.5), y || (Math.random() - 0.5), (Math.random() - 0.5) * 2).normalize();
    mesh.userData = {
      home: new THREE.Vector3(x, y, z),
      away: dir.multiplyScalar(7 + i * 0.8),
      spin: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    };
    return mesh;
  });
}

function buildParticles() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 4 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 4;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xf2efe9, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false, sizeAttenuation: true,
  });
  return new THREE.Points(geometry, material);
}

export function createScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (err) {
    console.warn("WebGL unavailable, continuing without 3D scene.", err);
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 6);
  const rim = new THREE.PointLight(ACCENT, 60, 30);
  rim.position.set(-5, -3, -2);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

  const material = new THREE.MeshPhysicalMaterial({
    color: ACCENT, metalness: 0.35, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12,
  });

  const group = new THREE.Group();
  const pieces = buildPieces(material);
  pieces.forEach((p) => group.add(p));
  scene.add(group);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.006, 8, 220),
    new THREE.MeshBasicMaterial({ color: 0xf2efe9, transparent: true, opacity: 0.18 })
  );
  scene.add(ring);

  const particles = buildParticles();
  scene.add(particles);

  // Public state — driven by GSAP / ScrollTrigger from main.js.
  const state = { intro: 0, p1: 0, p2: 0, velocity: 0 };
  const mouse = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0, scale: 1, assemble: 0, rotY: 0, rotX: 0, mx: 0, my: 0 };

  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // p1: hero → manifesto exit. p2: contact entry.
  function targets() {
    const isNarrow = window.innerWidth < 760;
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
    const heroX = isNarrow ? 0.7 : Math.min(halfW * 0.55, 3.6);
    const heroY = isNarrow ? 1.55 : 1.05;
    const sideX = isNarrow ? 1.6 : Math.min(halfW * 0.6, 4);
    const contactX = isNarrow ? 0 : Math.min(halfW * 0.68, 4.6);
    const x1 = lerp(heroX, sideX, state.p1);
    const y1 = lerp(heroY, -0.4, state.p1);
    return {
      x: lerp(x1, contactX, state.p2),
      y: lerp(y1, isNarrow ? 2.3 : 0.9, state.p2),
      scale: lerp(lerp(isNarrow ? 0.62 : 0.9, 0.72, state.p1), isNarrow ? 0.55 : 0.7, state.p2),
      assemble: state.intro * lerp(lerp(1, 0.55, state.p1), 1, state.p2),
      rotY: state.p1 * Math.PI * 2.2 + state.p2 * Math.PI * 1.5,
      rotX: state.p1 * 0.9 - state.p2 * 0.9,
    };
  }

  const clock = new THREE.Clock();
  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const tg = targets();

    smooth.x = damp(smooth.x, tg.x, 4, dt);
    smooth.y = damp(smooth.y, tg.y, 4, dt);
    smooth.scale = damp(smooth.scale, tg.scale, 4, dt);
    smooth.assemble = damp(smooth.assemble, tg.assemble, 3.2, dt);
    smooth.rotY = damp(smooth.rotY, tg.rotY, 3.5, dt);
    smooth.rotX = damp(smooth.rotX, tg.rotX, 3.5, dt);
    smooth.mx = damp(smooth.mx, mouse.x, 3, dt);
    smooth.my = damp(smooth.my, mouse.y, 3, dt);

    const ease = 1 - Math.pow(1 - smooth.assemble, 3);
    pieces.forEach((p, i) => {
      const { home, away, spin } = p.userData;
      p.position.lerpVectors(away, home, ease);
      p.position.multiplyScalar(1 + Math.sin(t * 1.4 + i) * 0.03 * ease);
      p.rotation.set(spin.x * (1 - ease), spin.y * (1 - ease), spin.z * (1 - ease));
    });

    group.position.set(smooth.x, smooth.y, 0);
    group.scale.setScalar(smooth.scale);
    group.rotation.y = smooth.rotY + t * 0.25 + smooth.mx * 0.5 + state.velocity * 0.02;
    group.rotation.x = smooth.rotX + Math.sin(t * 0.6) * 0.12 + smooth.my * 0.35;
    group.rotation.z = Math.sin(t * 0.4) * 0.06;

    ring.position.copy(group.position);
    ring.scale.setScalar(smooth.scale * (0.9 + 0.1 * ease));
    ring.rotation.set(1.1 + smooth.my * 0.2, t * 0.15, t * 0.1);
    ring.material.opacity = 0.18 * ease;

    particles.rotation.y = t * 0.02 + smooth.mx * 0.1;
    particles.rotation.x = smooth.my * 0.06;
    particles.position.y = (state.p1 + state.p2) * 2;

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(tick);

  return { state };
}
