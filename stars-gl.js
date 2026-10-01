// "Fifty stars": a swirling two-arm galaxy of star sprites behind the hero headline.
// Scroll: the 50 large stars fly into the flag's canton pattern (6/5 rows × 9), then the camera
// warps through the whole field. Custom WebGL1, no library. Lazy-loaded after the overture.

const VERT = `
attribute vec3 a_scatter;
attribute vec3 a_flag;
attribute float a_seed;
uniform float u_time;
uniform float u_morph;
uniform float u_warp;
uniform float u_aspect;
uniform vec2 u_tilt;
uniform float u_big;
uniform float u_px;
varying float v_alpha;
varying float v_seed;
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
void main() {
  // galaxy: spin each star around the core, faster near the centre
  vec3 g = a_scatter;
  float r = length(g.xz);
  g.xz = rot(u_time * (0.05 + 0.18 / (0.6 + r * 0.25)) + a_seed * 0.0) * g.xz;
  g.y += sin(u_time * 0.6 + a_seed * 6.2831) * 0.08;
  // tilt the galaxy disc toward the viewer
  g.yz = rot(-1.05) * g.yz;
  vec3 p = mix(g, a_flag, u_morph * u_big);
  // pointer parallax: rotate the whole field a little
  p.xz = rot(u_tilt.x * 0.35) * p.xz;
  p.yz = rot(u_tilt.y * 0.25) * p.yz;
  // camera on +z looking down -z; warp flies the camera through the field
  float camZ = 13.0 - u_warp * 15.0;
  float z = camZ - p.z;
  if (z < 0.2) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; v_alpha = 0.0; return; }
  float f = 1.6;
  gl_Position = vec4(p.x * f / (z * u_aspect), p.y * f / z, 0.0, 1.0);
  float size = mix(1.4 + a_seed * 2.2, 26.0, u_big) * (12.0 / z);
  gl_PointSize = size * u_px * (1.0 + u_warp * 2.5 * (1.0 - u_big));
  v_alpha = clamp(1.4 - z / 26.0, 0.0, 1.0) * (u_big > 0.5 ? 1.0 : 0.35 + 0.65 * fract(a_seed * 7.13));
  v_seed = a_seed;
}`;

const FRAG = `
precision mediump float;
uniform float u_bigF;
uniform float u_pulse;
uniform vec3 u_color;
varying float v_alpha;
varying float v_seed;
float sdStar5(vec2 p, float r, float rf) {
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-0.809016994375, -0.587785252292);
  p.x = abs(p.x);
  p -= 2.0 * max(dot(k1, p), 0.0) * k1;
  p -= 2.0 * max(dot(k2, p), 0.0) * k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0);
  float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
  return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}
void main() {
  vec2 p = (gl_PointCoord - 0.5) * 2.0;
  p.y = -p.y;
  float a;
  if (u_bigF > 0.5) {
    float d = sdStar5(p * 1.05, 0.82, 0.42);
    float core = smoothstep(0.03, -0.03, d);
    float glow = smoothstep(0.45, 0.0, d) * 0.35;
    a = max(core, glow) * (0.85 + 0.15 * sin(u_pulse * 2.0 + v_seed * 40.0));
  } else {
    float d = length(p);
    a = smoothstep(1.0, 0.0, d);
    a *= a;
  }
  a *= v_alpha;
  gl_FragColor = vec4(u_color * a, a);
}`;

const rand = (a, b) => a + Math.random() * (b - a);

function buildStars() {
  // 50 big stars: scatter in the galaxy, home in the canton (9 rows alternating 6 and 5)
  const big = [];
  const S = 1.05, H = 0.78;
  let k = 0;
  for (let row = 0; row < 9; row++) {
    const n = row % 2 === 0 ? 6 : 5;
    for (let j = 0; j < n; j++) {
      const fx = (j - (n - 1) / 2) * S;
      const fy = (4 - row) * H;
      const ang = rand(0, Math.PI * 2), rad = rand(1.5, 7.5);
      big.push(Math.cos(ang) * rad, rand(-0.6, 0.6), Math.sin(ang) * rad, fx + 2.6, fy + 0.4, 0, (k++ + 0.5) / 50);
    }
  }
  // dust: two-arm spiral
  const dust = [];
  const N = matchMedia("(max-width: 899px)").matches ? 1400 : 2600;
  for (let i = 0; i < N; i++) {
    const arm = i % 2;
    const t = Math.pow(Math.random(), 0.7);
    const rad = 0.4 + t * 11;
    const ang = arm * Math.PI + t * 5.2 + rand(-0.35, 0.35) * (1.2 - t);
    const x = Math.cos(ang) * rad + rand(-0.4, 0.4);
    const z = Math.sin(ang) * rad + rand(-0.4, 0.4);
    const y = rand(-0.35, 0.35) * (1.2 - t);
    dust.push(x, y, z, x, y, z, Math.random());
  }
  return { big: new Float32Array(big), dust: new Float32Array(dust) };
}

export function createStars(canvas) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  if (!gl) return null;
  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  const U = {};
  for (const n of ["u_time", "u_morph", "u_warp", "u_aspect", "u_tilt", "u_big", "u_px", "u_pulse", "u_color", "u_bigF"]) U[n] = gl.getUniformLocation(prog, n);
  const A = { scatter: gl.getAttribLocation(prog, "a_scatter"), flag: gl.getAttribLocation(prog, "a_flag"), seed: gl.getAttribLocation(prog, "a_seed") };

  const data = buildStars();
  const buf = {};
  for (const key of ["big", "dust"]) {
    buf[key] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf[key]);
    gl.bufferData(gl.ARRAY_BUFFER, data[key], gl.STATIC_DRAW);
  }
  const bind = (key) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf[key]);
    gl.enableVertexAttribArray(A.scatter); gl.vertexAttribPointer(A.scatter, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(A.flag); gl.vertexAttribPointer(A.flag, 3, gl.FLOAT, false, 28, 12);
    gl.enableVertexAttribArray(A.seed); gl.vertexAttribPointer(A.seed, 1, gl.FLOAT, false, 28, 24);
  };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // additive: stars glow where they overlap
  gl.clearColor(0, 0, 0, 0);

  let w = 1, h = 1, px = 1;
  const resize = () => {
    px = Math.min(devicePixelRatio || 1, matchMedia("(max-width: 899px)").matches ? 1.5 : 2);
    w = Math.max(1, Math.round(canvas.clientWidth * px));
    h = Math.max(1, Math.round(canvas.clientHeight * px));
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  const state = { morph: 0, warp: 0, tiltX: 0, tiltY: 0 };
  let t = 0, last = performance.now(), raf = 0, running = true, visible = true, first = true;

  const draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.u_time, t);
    gl.uniform1f(U.u_pulse, t % 600);
    gl.uniform1f(U.u_morph, state.morph);
    gl.uniform1f(U.u_warp, state.warp);
    gl.uniform1f(U.u_aspect, w / h);
    gl.uniform2f(U.u_tilt, state.tiltX, state.tiltY);
    gl.uniform1f(U.u_px, px);

    bind("dust");
    gl.uniform1f(U.u_big, 0); gl.uniform1f(U.u_bigF, 0);
    gl.uniform3f(U.u_color, 0.79, 0.84, 0.92);
    gl.drawArrays(gl.POINTS, 0, data.dust.length / 7);

    bind("big");
    gl.uniform1f(U.u_big, 1); gl.uniform1f(U.u_bigF, 1);
    gl.uniform3f(U.u_color, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, data.big.length / 7);
    if (first) { first = false; canvas.classList.add("is-ready"); }
  };
  const frame = (now) => {
    raf = 0;
    if (!running || !visible || document.hidden) return;
    t += Math.min(0.05, (now - last) / 1000);
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  };
  const loop = () => { if (!raf && running && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; loop(); }).observe(canvas);
  document.addEventListener("visibilitychange", loop);
  loop();

  return {
    state,
    play() { running = true; loop(); },
    pause() { running = false; },
  };
}
