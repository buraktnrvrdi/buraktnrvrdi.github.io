// Kendi yazdığım GLSL: kaya yüzeyi, ışık çizgisi, iplik, toz ve son geçiş.

export const rockVert = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vView;
  varying float vDepth;
  varying vec3 vNM0;
  varying vec3 vNM1;
  varying vec3 vNM2;
  void main() {
    vObj = position;
    vNM0 = normalMatrix[0];
    vNM1 = normalMatrix[1];
    vNM2 = normalMatrix[2];
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = mv.xyz;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Facet normali türevlerden alınır (köşeli görünüm); üstüne gürültüyle yüzey pürüzü eklenir.
export const rockFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uAccent;
  uniform vec3 uLightA;   // görünüm uzayında ışık konumları
  uniform vec3 uLightB;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uSeed;
  uniform float uFogDensity;
  varying vec3 vObj;
  varying vec3 vView;
  varying float vDepth;
  varying vec3 vNM0;
  varying vec3 vNM1;
  varying vec3 vNM2;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float height(vec3 p) {
    p += uSeed;
    return vnoise(p * 2.4) * 0.5 + vnoise(p * 6.5) * 0.3 + vnoise(p * 15.0) * 0.2;
  }

  void main() {
    vec3 dpdx = dFdx(vView);
    vec3 dpdy = dFdy(vView);
    vec3 n = normalize(cross(dpdx, dpdy));
    // pürüz: nesne uzayında sonlu farklarla eğim, görünüm uzayına çevrilir
    float h = height(vObj);
    const float eps = 0.025;
    vec3 g = vec3(height(vObj + vec3(eps, 0.0, 0.0)) - h,
                  height(vObj + vec3(0.0, eps, 0.0)) - h,
                  height(vObj + vec3(0.0, 0.0, eps)) - h) / eps;
    vec3 gv = mat3(vNM0, vNM1, vNM2) * g;
    gv -= dot(gv, n) * n;
    n = normalize(n - 0.06 * gv);

    vec3 v = normalize(-vView);
    float ndv = clamp(dot(n, v), 0.0, 1.0);

    vec3 la = uLightA - vView;
    float da = length(la);
    float diffA = max(dot(n, la / da), 0.0) / (1.0 + da * da * 0.012);
    vec3 lb = uLightB - vView;
    float db = length(lb);
    float diffB = max(dot(n, lb / db), 0.0) / (1.0 + db * db * 0.01);

    float albedo = 0.04 + 0.055 * h;
    vec3 col = vec3(albedo) * vec3(1.0, 0.97, 0.98);
    vec3 tA = mix(uColA, vec3(length(uColA) * 0.6), 0.7);
    vec3 tB = mix(uColB, vec3(length(uColB) * 0.6), 0.7);
    vec3 lit = tA * diffA * 2.3 + tB * diffB * 1.8;
    vec3 c = col * (lit + 0.06);
    // kenar ışığı
    float rim = pow(1.0 - ndv, 2.6);
    c += uAccent * rim * (0.02 + 0.3 * (diffA + diffB));
    // çukurlarda koyulaşma
    c *= 0.35 + 1.3 * h;

    float fog = 1.0 - exp(-pow(vDepth * uFogDensity, 1.6));
    c = mix(c, vec3(0.0), clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Işık çizgisi (artı kolları): enine gaussian çekirdek + geniş parıltı, uzunlukta sönüm
export const barVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const barFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uHalfW;   // dünya birimi: düzlemin yarı eni
  uniform float uCore;
  uniform float uGlow;
  uniform float uAlpha;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float d = abs(vUv.y - 0.5) * 2.0 * uHalfW;
    float core = exp(-pow(d / uCore, 2.0));
    float edge = 1.0 - smoothstep(0.55, 1.0, abs(vUv.y - 0.5) * 2.0);
    float glow = (exp(-pow(d / uGlow, 2.0)) * 0.5 + exp(-pow(d / (uGlow * 3.0), 2.0)) * 0.1) * edge;
    float u = abs(vUv.x - 0.5) * 2.0;
    float along = smoothstep(1.0, 0.7, u);
    float peak = 0.75 + 0.25 * smoothstep(0.6, 0.0, u);
    float seg = 0.96 + 0.04 * sin(vUv.x * 160.0 + uTime * 1.4);
    float k = along * peak * seg * uAlpha;
    vec3 c = uColor * glow + mix(uColor, uHot, 0.3) * core * 1.1;
    gl_FragColor = vec4(c * k, 1.0);
    #include <colorspace_fragment>
  }
`;

// İplik (tüp) ve halesi
export const threadVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
export const threadFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uPower;
  uniform float uGain;
  uniform float uTime;
  uniform float uFar;
  uniform float uFade;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float f = abs(dot(normalize(vN), normalize(-vView)));
    float core = pow(f, uPower);
    float pulse = 0.82 + 0.18 * sin(vUv.x * 520.0 - uTime * 2.4);
    float dist = length(vView);
    float fade = 1.0 - smoothstep(uFar * 0.5, uFar, dist);
    vec3 c = mix(uColor, uHot, 0.55 * pow(f, uPower * 1.6)) * core * pulse * uGain * fade * uFade;
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

// Toz ve bokeh
export const dustVert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uScale;
  uniform float uNear;
  uniform float uDrift;
  varying float vA;
  varying float vSeed;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.12 + aSeed * 20.0) * 0.7 * uDrift;
    p.y += cos(uTime * 0.1 + aSeed * 31.0) * 0.6 * uDrift;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = -mv.z;
    float near = smoothstep(uNear, uNear * 3.0, d);
    float far = 1.0 - smoothstep(60.0, 95.0, d);
    float tw = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed * 2.0) + aSeed * 60.0);
    vA = near * far * tw;
    vSeed = aSeed;
    gl_PointSize = min(aSize * uScale / max(d, 0.1), 220.0);
    gl_Position = projectionMatrix * mv;
  }
`;
export const dustFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uBokeh;
  uniform float uAlpha;
  varying float vA;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    if (r > 1.0) discard;
    float soft = smoothstep(1.0, 0.0, r);
    float disc = mix(soft * soft, smoothstep(1.0, 0.86, r) * (0.35 + 0.65 * smoothstep(0.55, 1.0, r)), uBokeh);
    vec3 tint = mix(uColor, vec3(1.0, 0.92, 0.86), step(0.82, vSeed) * 0.8);
    gl_FragColor = vec4(tint * disc * vA * uAlpha, 1.0);
    #include <colorspace_fragment>
  }
`;

// Proje penceresi (cam yüzey)
export const paneFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    vec2 q = abs(vUv - 0.5) * 2.0;
    float edge = max(smoothstep(0.985, 1.0, q.x), smoothstep(0.98, 1.0, q.y));
    float fill = 0.1 + 0.14 * (1.0 - vUv.y);
    float g = fill * (1.0 - 0.6 * length(q) * 0.7);
    vec3 c = uColor * (g + edge * 1.5);
    gl_FragColor = vec4(c * uAlpha, 1.0);
    #include <colorspace_fragment>
  }
`;

// Son geçiş: kenarlarda alan derinliği bulanıklığı, renk kayması, vinyet, tane
export const FinalShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberr: { value: 0.004 },
    uGrain: { value: 0 },
    uVig: { value: 0.55 },
    uBlur: { value: 0.006 },
    uRes: { value: [1440, 900] },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberr;
    uniform float uGrain;
    uniform float uVig;
    uniform float uBlur;
    uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    void main() {
      vec2 c = vUv - 0.5;
      c.x *= uRes.x / uRes.y;
      float r = length(c);
      float e = smoothstep(0.3, 0.95, r);
      vec2 off = (vUv - 0.5) * uAberr * e;
      vec3 col = vec3(0.0);
      float rad = uBlur * e;
      if (rad < 0.0004) {
        col = vec3(
          texture2D(tDiffuse, vUv + off).r,
          texture2D(tDiffuse, vUv).g,
          texture2D(tDiffuse, vUv - off).b);
      } else {
        for (int i = 0; i < 9; i++) {
          float a = float(i) * 2.39996;
          float s = sqrt((float(i) + 0.5) / 9.0) * rad;
          vec2 o = vec2(cos(a), sin(a)) * s * vec2(uRes.y / uRes.x, 1.0);
          col.r += texture2D(tDiffuse, vUv + o + off).r;
          col.g += texture2D(tDiffuse, vUv + o).g;
          col.b += texture2D(tDiffuse, vUv + o - off).b;
        }
        col /= 9.0;
      }
      col *= 1.0 - uVig * smoothstep(0.42, 1.15, r);
      col += (hash(vUv * uRes + fract(uTime) * 91.7) - 0.5) * uGrain * (0.4 + col.r + col.g + col.b);
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `,
};

// Atmosfer: kameraya bağlı, tüm ekranı kaplayan renkli sis (kırmızıdan yeşile)
export const hazeVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const hazeFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uAmt;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 q = vUv - vec2(0.5, 0.52);
    q.x *= 1.5;
    float r = length(q);
    float v = 0.15 + 0.85 * (1.0 - smoothstep(0.0, 0.8, r));
    float low = 0.8 + 0.4 * (1.0 - vUv.y);
    float k = uAmt * v * low;
    gl_FragColor = vec4(uColor * k, 1.0);
    #include <colorspace_fragment>
  }
`;

// Son aşama: ekran uzayında tane ve titreşim (bant oluşumunu kırar)
export const GrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAmt: { value: 0.035 },
    uRes: { value: [1440, 900] },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAmt;
    uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 q = vUv * uRes + fract(uTime) * 91.7;
      float n = hash(q) + hash(q + 17.3) - 1.0;
      vec3 chroma = vec3(hash(q + 3.1), hash(q + 5.7), hash(q + 9.3)) - 0.5;
      float l = dot(c.rgb, vec3(0.3, 0.5, 0.2));
      c.rgb += (n + chroma * 0.6) * uAmt * (0.55 + 1.4 * smoothstep(0.0, 0.5, l));
      gl_FragColor = vec4(c.rgb, 1.0);
    }
  `,
};
