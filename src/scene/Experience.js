import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  COLORS,
  KEYS_DESKTOP,
  KEYS_MOBILE,
  MIX_RANGE,
  PANE,
  THREAD_POINTS,
} from './config.js';
import { CameraRig } from './rig.js';
import {
  barFrag,
  barVert,
  dustFrag,
  dustVert,
  FinalShader,
  GrainShader,
  hazeFrag,
  hazeVert,
  paneFrag,
  rockFrag,
  rockVert,
  threadFrag,
  threadVert,
} from './shaders.js';
import { loadHeroObject } from './HeroObject.js';

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Düzgün değer gürültüsü (JS tarafı, kaya geometrisi için)
function makeNoise(rand) {
  const perm = new Float32Array(512);
  for (let i = 0; i < 512; i++) perm[i] = rand();
  const h = (x, y, z) => perm[(((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0) % 512];
  return (x, y, z) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const fx = x - xi;
    const fy = y - yi;
    const fz = z - zi;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const sz = fz * fz * (3 - 2 * fz);
    const l = (a, b, t) => a + (b - a) * t;
    return l(
      l(l(h(xi, yi, zi), h(xi + 1, yi, zi), sx), l(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), sx), sy),
      l(l(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), sx), l(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), sx), sy),
      sz,
    );
  };
}

// Köşeli kaya: ikosahedron + gürültü + rastgele kesme düzlemleri
function makeRockGeometry(seed) {
  const rand = rng(seed);
  const noise = makeNoise(rand);
  const geo = new THREE.IcosahedronGeometry(1, 7);
  const pos = geo.attributes.position;
  const planes = [];
  const cuts = 6 + Math.floor(rand() * 4);
  for (let i = 0; i < cuts; i++) {
    const n = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    planes.push({ n, d: 0.5 + rand() * 0.3 });
  }
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = 1 + 0.22 * (noise(v.x * 1.3 + seed, v.y * 1.3, v.z * 1.3) - 0.5) * 2;
    v.multiplyScalar(r);
    for (const { n, d } of planes) {
      const dist = v.dot(n) - d;
      if (dist > 0) v.addScaledVector(n, -dist);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeBoundingSphere();
  return geo;
}

function labelTexture(lines, font) {
  const c = document.createElement('canvas');
  const pad = 8;
  const lh = 26;
  c.width = 360;
  c.height = pad * 2 + lh * lines.length;
  const g = c.getContext('2d');
  g.font = `500 17px ${font}`;
  g.textBaseline = 'top';
  g.fillStyle = '#fff';
  lines.forEach((t, i) => g.fillText(t, pad, pad + i * lh));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: c.width / c.height };
}

function addQuad(arr, cx, cy, w, h) {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  arr.push(x0, y0, 0, x1, y0, 0, x1, y1, 0, x0, y0, 0, x1, y1, 0, x0, y1, 0);
}

export class Experience {
  constructor(canvas, { mobile = false, reduced = false, onLost = () => {} } = {}) {
    this.canvas = canvas;
    this.mobile = mobile;
    this.reduced = reduced;
    this.onLost = onLost;
    this.target = 0;
    this.sp = 0;
    this.running = false;
    this.raf = 0;
    this.last = 0;
    this.time = 0;
    this.frames = 0;
    this.pointer = new THREE.Vector2();
    this.pointerS = new THREE.Vector2();
    this.listeners = [];
    this.disposed = false;
    this.onFrame = null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: mobile,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer = renderer;
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    this.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
    renderer.setPixelRatio(this.dpr);

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
      this.onLost();
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
    this.thread = new THREE.CatmullRomCurve3(
      THREAD_POINTS.map((p) => new THREE.Vector3(...p)),
      false,
      'centripetal',
    );
    this.keys = (mobile ? KEYS_MOBILE : KEYS_DESKTOP).map((k) => ({ ...k }));
    this.rig = new CameraRig(this.keys, this.thread);

    const acc = new THREE.Color(...COLORS.red);
    this.uAccent = { value: acc.clone() };
    this.uTime = { value: 0 };
    this.uThreadFade = { value: 1 };
    this.shared = {
      uAccent: this.uAccent,
      uLightA: { value: new THREE.Vector3() },
      uLightB: { value: new THREE.Vector3() },
      uColA: { value: new THREE.Color() },
      uColB: { value: new THREE.Color() },
      uFogDensity: { value: mobile ? 0.02 : 0.017 },
    };

    this.buildHaze();
    this.buildThread();
    this.buildCross();
    this.buildRocks();
    this.buildDust();
    this.buildPanes();
    this.buildLabels();
    this.buildPost();
    this.resize();

    // 3B nesne kancası (public/models/hero.glb varsa)
    loadHeroObject(this.scene).catch(() => {});

    this.track();
  }

  track() {
    const move = (e) => {
      this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('pointermove', move, { passive: true });
    this.listeners.push(['pointermove', move]);
  }

  buildHaze() {
    this.scene.add(this.camera);
    this.hazeU = { uColor: { value: new THREE.Color() }, uAmt: { value: 0 }, uTime: this.uTime };
    const mat = new THREE.ShaderMaterial({
      vertexShader: hazeVert,
      fragmentShader: hazeFrag,
      uniforms: this.hazeU,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });
    this.haze = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    this.haze.position.z = -30;
    this.haze.renderOrder = -10;
    this.haze.frustumCulled = false;
    this.camera.add(this.haze);
  }

  buildThread() {
    const segs = this.mobile ? 500 : 900;
    const make = (radius, power, gain) => {
      const geo = new THREE.TubeGeometry(this.thread, segs, radius, 8, false);
      const mat = new THREE.ShaderMaterial({
        vertexShader: threadVert,
        fragmentShader: threadFrag,
        uniforms: {
          uColor: { value: new THREE.Color(...COLORS.thread) },
          uHot: { value: new THREE.Color(...COLORS.hot) },
          uPower: { value: power },
          uGain: { value: gain },
          uTime: this.uTime,
          uFar: { value: 110 },
          uFade: this.uThreadFade,
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const m = new THREE.Mesh(geo, mat);
      m.frustumCulled = false;
      this.scene.add(m);
    };
    make(0.02, 3, 1.7);
    make(0.07, 2.4, 0.75);
    make(0.3, 2.0, this.mobile ? 0.35 : 0.2);
  }

  buildCross() {
    const g = new THREE.Group();
    this.cross = g;
    const mk = (len, width, core, glow, alpha, vertical, uHalf) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: barVert,
        fragmentShader: barFrag,
        uniforms: {
          uColor: { value: new THREE.Color(...COLORS.red).multiplyScalar(1.3) },
          uHot: { value: new THREE.Color(...COLORS.hot) },
          uHalfW: { value: uHalf },
          uCore: { value: core },
          uGlow: { value: glow },
          uAlpha: { value: alpha },
          uTime: this.uTime,
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      mesh.userData = { len, width, vertical };
      if (vertical) mesh.rotation.z = Math.PI / 2;
      mesh.scale.set(len, width, 1);
      g.add(mesh);
      return mesh;
    };
    const w = 3.2;
    this.barH = mk(6, w, 0.05, 0.2, 1, false, w / 2);
    this.barV = mk(5.4, w, 0.05, 0.2, 1, true, w / 2);
    // ince, uzun yatay çizgi (kenarlara kadar)
    this.barWide = mk(60, 0.5, 0.012, 0.07, 0.55, false, 0.25);

    // ölçek çentikleri
    const q = [];
    for (let i = 1; i <= 16; i++) {
      const x = i * 0.7;
      const h = i % 3 === 0 ? 0.42 : 0.2;
      addQuad(q, x, 0, 0.03, h);
      addQuad(q, -x, 0, 0.03, h);
      addQuad(q, 0, x, h, 0.03);
      addQuad(q, 0, -x, h, 0.03);
    }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.Float32BufferAttribute(q, 3));
    const tm = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.6, 0.35, 0.28),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ticks = new THREE.Mesh(tg, tm);
    g.add(this.ticks);

    // merkez parlaması
    const flare = this.makePoints(
      new Float32Array([0, 0, 0.01]),
      new Float32Array([2.2]),
      new Float32Array([0.5]),
      COLORS.hot,
      0.22,
      0,
      0.2,
    );
    g.add(flare);
    this.scene.add(g);
  }

  makePoints(positions, sizes, seeds, color, alpha, bokeh, near) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      uniforms: {
        uTime: this.uTime,
        uScale: this.uScale || (this.uScale = { value: 1000 }),
        uNear: { value: near },
        uDrift: { value: bokeh === 0 && alpha < 1 ? 0 : 1 },
        uColor: color === 'accent' ? this.uAccent : { value: new THREE.Color(...color) },
        uBokeh: { value: bokeh },
        uAlpha: { value: alpha },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    return p;
  }

  buildRocks() {
    const m = this.mobile;
    const rand = rng(7311);
    const variants = [];
    for (let i = 0; i < 6; i++) {
      const geo = makeRockGeometry(101 + i * 17);
      const mat = new THREE.ShaderMaterial({
        vertexShader: rockVert,
        fragmentShader: rockFrag,
        uniforms: { ...this.shared, uSeed: { value: i * 3.7 } },
      });
      variants.push({ geo, mat });
    }
    // kamera yolunu örnekle: kayalar yoldan uzak durur
    const camSamples = [];
    const tmp = new THREE.PerspectiveCamera();
    for (let i = 0; i <= 160; i++) {
      this.rig.at(i / 160, tmp);
      camSamples.push(tmp.position.clone());
    }
    const threadSamples = [];
    for (let i = 0; i <= 300; i++) threadSamples.push(this.thread.getPointAt(i / 300));
    const paneCenters = this.keys.filter((k) => k.pane).map((k) => k.paneOrigin.look);
    const clear = (p, size) => {
      for (const c of camSamples) if (c.distanceTo(p) < size * 1.15 + 2.4) return false;
      for (const c of threadSamples) if (c.distanceTo(p) < size * 1.05 + 1.1) return false;
      for (const c of paneCenters) if (c.distanceTo(p) < size + 4.5) return false;
      return true;
    };

    this.rocks = [];
    const add = (pos, size, spin = 1) => {
      if (!clear(pos, size)) return false;
      const v = variants[Math.floor(rand() * variants.length)];
      const mesh = new THREE.Mesh(v.geo, v.mat);
      mesh.position.copy(pos);
      mesh.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
      mesh.scale.set(size * (0.8 + rand() * 0.5), size * (0.75 + rand() * 0.5), size * (0.8 + rand() * 0.5));
      mesh.userData.spin = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.06 * spin);
      mesh.userData.base = pos.clone();
      mesh.userData.ph = rand() * 6.28;
      this.scene.add(mesh);
      this.rocks.push(mesh);
      return true;
    };

    // hero halkası
    const aspect = m ? 9 / 19.5 : 1.6;
    const d0 = m ? 17 : 13.5;
    const fov0 = m ? 52 : 40;
    const halfH = d0 * Math.tan((fov0 * Math.PI) / 360);
    const halfW = halfH * aspect;
    const ringN = m ? 8 : 9;
    for (let i = 0; i < ringN; i++) {
      const a = (i / ringN) * Math.PI * 2 + (rand() - 0.5) * 0.35 + 0.2;
      const rx = halfW * (m ? 0.82 : 0.7);
      const ry = halfH * (m ? 0.78 : 0.8);
      const size = (m ? 1.05 : 1.25) * (0.8 + rand() * 0.5);
      add(new THREE.Vector3(Math.cos(a) * rx * (0.9 + rand() * 0.25), Math.sin(a) * ry * (0.9 + rand() * 0.2), (rand() - 0.5) * 2.6), size, 0.6);
    }
    // yakın ön plan (kenarlarda bulanık)
    const nearN = m ? 3 : 7;
    for (let i = 0; i < nearN * 6 && this.rocks.length < ringN + nearN; i++) {
      const sx = rand() < 0.5 ? -1 : 1;
      const sy = rand() < 0.5 ? -1 : 1;
      add(new THREE.Vector3(sx * (3 + rand() * 6), sy * (1.5 + rand() * 4), 2 + rand() * 8), 0.9 + rand() * 1.2);
    }
    // uzak sahne
    const farN = m ? 5 : 12;
    let tries = 0;
    for (let n = 0; n < farN && tries < 200; tries++) {
      const p = new THREE.Vector3((rand() - 0.5) * 30, (rand() - 0.5) * 16, -(4 + rand() * 24));
      if (add(p, 1.4 + rand() * 2.2)) n++;
    }
    // iplik boyunca
    const pathN = m ? 16 : 40;
    tries = 0;
    for (let n = 0; n < pathN && tries < 400; tries++) {
      const u = 0.05 + rand() * 0.95;
      const P = this.thread.getPointAt(u);
      const ang = rand() * Math.PI * 2;
      const r = 4 + rand() * 12;
      const p = new THREE.Vector3(P.x + Math.cos(ang) * r, P.y + Math.sin(ang) * r * 0.7, P.z + (rand() - 0.5) * 10);
      if (add(p, 0.9 + Math.pow(rand(), 1.6) * 3.2)) n++;
    }
  }

  buildDust() {
    const m = this.mobile;
    const rand = rng(4242);
    const makeSet = (n, spread, size, alpha, bokeh, near, around) => {
      const pos = new Float32Array(n * 3);
      const sz = new Float32Array(n);
      const sd = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let x;
        let y;
        let z;
        if (around && rand() < 0.4) {
          x = (rand() - 0.5) * 2 * spread.x;
          y = (rand() - 0.5) * 2 * spread.y;
          z = -10 + rand() * 24;
        } else {
          const P = this.thread.getPointAt(0.03 + rand() * 0.97);
          x = P.x + (rand() - 0.5) * 2 * spread.x;
          y = P.y + (rand() - 0.5) * 2 * spread.y;
          z = P.z + (rand() - 0.5) * 2 * spread.z;
        }
        pos.set([x, y, z], i * 3);
        sz[i] = size[0] + rand() * (size[1] - size[0]);
        sd[i] = rand();
      }
      const pts = this.makePoints(pos, sz, sd, 'accent', alpha, bokeh, near);
      this.scene.add(pts);
      return pts;
    };
    makeSet(m ? 900 : 5200, { x: 16, y: 9, z: 12 }, [0.03, 0.1], 2.6, 0, 0.5, true);
    this.bokeh = makeSet(m ? 24 : 70, { x: 8, y: 5, z: 6 }, [0.2, 0.7], 0.14, 1, 2.5, true);
  }

  buildPanes() {
    this.paneGroup = new THREE.Group();
    this.scene.add(this.paneGroup);
    this.panes = [];
    const cfg = this.mobile ? PANE.mobile : PANE.desktop;
    for (const k of this.keys) {
      if (!k.pane) continue;
      const mat = new THREE.ShaderMaterial({
        vertexShader: barVert.replace('vUv = uv;', 'vUv = uv;'),
        fragmentShader: paneFrag,
        uniforms: { uColor: { value: new THREE.Color(...COLORS.green) }, uAlpha: { value: 1 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cfg.width, cfg.height), mat);
      this.paneGroup.add(mesh);
      this.panes.push({ key: k, mesh });
    }
    this.placePanes();
  }

  placePanes() {
    const cfg = this.mobile ? PANE.mobile : PANE.desktop;
    const cam = new THREE.PerspectiveCamera(this.camera.fov, this.camera.aspect, 0.1, 400);
    for (const { key, mesh } of this.panes) {
      cam.fov = key.fov;
      cam.aspect = this.camera.aspect;
      cam.position.copy(key.paneOrigin.pos);
      cam.lookAt(key.paneOrigin.look);
      cam.updateMatrixWorld();
      const halfH = cfg.dist * Math.tan((key.fov * Math.PI) / 360);
      const halfW = halfH * cam.aspect;
      const local = new THREE.Vector3(cfg.ndc[0] * halfW, cfg.ndc[1] * halfH, -cfg.dist);
      mesh.position.copy(local.applyMatrix4(cam.matrixWorld));
      mesh.quaternion.copy(cam.quaternion);
      mesh.rotateY(cfg.ndc[0] > 0 ? 0.22 : -0.1);
      // panelin ekrandaki payı genişliğe göre
      const w = Math.min(cfg.width, halfW * 1.1);
      mesh.scale.set(w / cfg.width, w / cfg.width, 1);
    }
  }

  buildLabels() {
    const font = '"Geist Variable", system-ui, sans-serif';
    this.labels = [];
    const add = (lines, pos, h, op, rotZ = 0) => {
      const { tex, aspect } = labelTexture(lines, font);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: op,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: new THREE.Color(...COLORS.red).multiplyScalar(1.5),
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), mat);
      mesh.position.set(...pos);
      mesh.rotation.z = rotZ;
      this.scene.add(mesh);
      this.labels.push(mesh);
      return mesh;
    };
    const f = (n) => n.toFixed(3);
    // artı etrafı
    add(['X +03.000', 'AXIS 01'], [3.1, 0.34, 0.02], 0.34, 0.65);
    add(['X -03.000', 'AXIS 01'], [-4.6, -0.5, 0.02], 0.34, 0.65);
    add(['Y +02.700'], [0.28, 2.9, 0.02], 0.18, 0.55);
    add(['SEC 01 / 06'], [-3.4, 0.44, 0.02], 0.2, 0.5);
    // iplik boyunca: gerçek konum okumaları
    [0.012, 0.045, 0.085, 0.13, 0.2].forEach((u, i) => {
      const P = this.thread.getPointAt(u);
      add([`SEG ${String(i + 1).padStart(2, '0')}`, `${f(P.x)} ${f(P.y)}`], [P.x + 0.3, P.y + 0.55, P.z], 0.34, 0.6, (i % 2 ? -1 : 1) * 0.06);
    });
  }

  buildPost() {
    if (this.mobile) {
      this.composer = null;
      return;
    }
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(this.renderer, target);
    composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.6, 0.5, 0.72);
    composer.addPass(this.bloom);
    this.finalPass = new ShaderPass(FinalShader);
    this.finalPass.uniforms.uTime = this.uTime;
    composer.addPass(this.finalPass);
    composer.addPass(new OutputPass());
    this.grainPass = new ShaderPass(GrainShader);
    this.grainPass.uniforms.uTime = this.uTime;
    composer.addPass(this.grainPass);
    this.composer = composer;
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (w < 2 || h < 2) return;
    this.w = w;
    this.h = h;
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(this.dpr);
      this.composer.setSize(w, h);
      this.finalPass.uniforms.uRes.value = [w * this.dpr, h * this.dpr];
      this.grainPass.uniforms.uRes.value = [w * this.dpr, h * this.dpr];
    }
    if (this.panes) this.placePanes();
  }

  setTarget(p, snap = false) {
    this.target = Math.min(1, Math.max(0, p));
    if (snap) this.sp = this.target;
  }

  update(dt) {
    const p = this.sp;
    const t = this.time;
    this.uTime.value = t;
    const mixV = smooth(MIX_RANGE[0], MIX_RANGE[1], p);
    const red = new THREE.Color(...COLORS.red);
    const green = new THREE.Color(...COLORS.green);
    this.uAccent.value.copy(red).lerp(green, mixV);

    // kamera
    this.rig.at(p, this.camera);
    {
      const hh = 2 * 30 * Math.tan((this.camera.fov * Math.PI) / 360) * 1.05;
      this.haze.scale.set(hh * this.camera.aspect, hh, 1);
      this.hazeU.uColor.value.copy(this.uAccent.value);
      this.hazeU.uAmt.value = 0.012 + 0.04 * (1 - smooth(0.0, 0.1, p)) + 0.075 * mixV;
    }
    this.pointerS.lerp(this.pointer, 1 - Math.exp(-dt * 3));
    const camX = this.pointerS.x * (this.mobile ? 0 : 0.35);
    const camY = this.pointerS.y * (this.mobile ? 0 : 0.2);
    this.camera.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
    this.camera.position.addScaledVector(right, camX + Math.sin(t * 0.3) * 0.05).addScaledVector(up, camY + Math.cos(t * 0.23) * 0.04);
    this.camera.updateMatrixWorld();
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert();

    // ışıklar (görünüm uzayında)
    const sh = this.shared;
    const la = new THREE.Vector3(0, 0, 0).applyMatrix4(this.camera.matrixWorldInverse);
    sh.uLightA.value.copy(la);
    const threadAhead = this.threadNear(p);
    sh.uLightB.value.copy(threadAhead).applyMatrix4(this.camera.matrixWorldInverse);
    const aFade = 1 - smooth(0.1, 0.3, p);
    sh.uColA.value.copy(red).multiplyScalar(aFade * 1.15);
    sh.uColB.value.copy(this.uAccent.value).multiplyScalar((0.9 + 0.5 * mixV) * (0.3 + 0.7 * smooth(0.0, 0.14, p)));

    // artı kolları: ilerledikçe uzar
    const grow = smooth(0.0, 0.1, p);
    this.barH.scale.x = 6 + grow * 20;
    this.barV.scale.x = 5.4 + grow * 20;
    const f = Math.min(1, Math.max(0.3, Math.abs(this.camera.position.z) / 13.5));
    for (const b of [this.barH, this.barV]) {
      b.material.uniforms.uCore.value = 0.07 * (0.4 + 0.6 * f);
      b.material.uniforms.uGlow.value = 0.27 * (0.3 + 0.7 * f);
    }
    const crossAlpha = 1 - smooth(0.22, 0.3, p);
    this.cross.visible = crossAlpha > 0.01;
    this.barH.material.uniforms.uAlpha.value = crossAlpha * (0.55 + 0.45 * f);
    this.barV.material.uniforms.uAlpha.value = crossAlpha * (0.55 + 0.45 * f);
    this.barWide.material.uniforms.uAlpha.value = 0.55 * crossAlpha;
    this.ticks.material.opacity = crossAlpha;
    this.ticks.geometry.setDrawRange(0, 24 * Math.max(2, Math.min(16, Math.floor((this.barH.scale.x / 2 - 0.2) / 0.7))));
    for (const l of this.labels.slice(0, 4)) l.material.opacity = 0.6 * crossAlpha;

    // paneller: yalnızca yaklaşırken görünür
    for (const { key, mesh } of this.panes) {
      const d = Math.abs(p - key.p);
      const a = 1 - smooth(0.02, 0.06, d);
      mesh.visible = a > 0.01;
      mesh.material.uniforms.uAlpha.value = a;
      mesh.material.uniforms.uColor.value.copy(this.uAccent.value).lerp(new THREE.Color(0.3, 1, 0.5), 0.35);
    }

    // kayalar
    for (const r of this.rocks) {
      const s = r.userData.spin;
      r.rotation.x += s.x * dt;
      r.rotation.y += s.y * dt;
      r.rotation.z += s.z * dt;
      r.position.y = r.userData.base.y + Math.sin(t * 0.25 + r.userData.ph) * 0.18;
    }

    // son geçiş: bulanıklık, renk kayması
    if (this.finalPass) {
      this.finalPass.uniforms.uBlur.value = 0.004 + 0.004 * smooth(0.1, 0.2, p) + 0.008 * mixV;
    }
    if (this.bloom) this.bloom.strength = 0.7 + 0.25 * mixV;
    this.uThreadFade.value = smooth(0.02, 0.085, p);

    // iplik pikseli ölçeği
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.uScale.value = (this.h * this.dpr) / (2 * Math.tan(fovRad / 2));
  }

  // İplik üzerinde kameraya en yakın ilerleyen nokta (ışık için)
  threadNear(p) {
    if (!this._cache) {
      this._cache = [];
      const tmp = new THREE.PerspectiveCamera();
      const pts = [];
      for (let i = 0; i <= 600; i++) pts.push(this.thread.getPointAt(i / 600));
      for (let i = 0; i <= 100; i++) {
        this.rig.at(i / 100, tmp);
        let best = 0;
        let bd = 1e9;
        for (let j = 0; j < pts.length; j++) {
          const d = pts[j].distanceToSquared(tmp.position);
          if (d < bd) {
            bd = d;
            best = j;
          }
        }
        this._cache.push(Math.min(600, best + 18));
      }
      this._pts = pts;
    }
    const f = p * 100;
    const i = Math.min(99, Math.floor(f));
    const j = this._cache[i] + (this._cache[i + 1] - this._cache[i]) * (f - i);
    const a = this._pts[Math.floor(j)];
    const b = this._pts[Math.min(600, Math.ceil(j))];
    return a.clone().lerp(b, j - Math.floor(j));
  }

  renderFrame() {
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
    this.frames++;
    window.__btFrames = this.frames;
  }

  // Azaltılmış hareket: tek sabit kare
  renderStill(p) {
    this.sp = p;
    this.time = 3.0;
    this.update(0.016);
    this.renderFrame();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      this.time += dt;
      this.sp += (this.target - this.sp) * (1 - Math.exp(-dt * 5.5));
      if (Math.abs(this.target - this.sp) < 0.00002) this.sp = this.target;
      this.update(dt);
      this.renderFrame();
      if (this.onFrame) this.onFrame(this.sp);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    for (const [n, f] of this.listeners) window.removeEventListener(n, f);
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
      }
    });
    if (this.composer) this.composer.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
