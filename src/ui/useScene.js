import { useEffect, useRef, useState } from 'react';
import { PROJECT_COUNT, PROJECT_RANGE, SECTION_STARTS } from '../scene/config.js';

export const sectionAt = (p) => {
  let s = 0;
  for (let i = 0; i < SECTION_STARTS.length; i++) if (p >= SECTION_STARTS[i] - 1e-6) s = i;
  return s;
};
export const projectAt = (p) => {
  const [a, b] = PROJECT_RANGE;
  const i = Math.floor(((p - a) / (b - a)) * PROJECT_COUNT);
  return Math.min(PROJECT_COUNT - 1, Math.max(0, i));
};

const mq = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null);

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch {
    return false;
  }
}

// Tek kalıcı canvas, tek ilerleme kaynağı: scroll -> hedef; kamera ve metin aynı yumuşatılmış değeri okur.
export function useScene(canvasRef, enabled) {
  const [mode, setMode] = useState(() => {
    if (!hasWebGL()) return 'flow-nogl';
    const r = mq('(prefers-reduced-motion: reduce)');
    return r && r.matches ? 'flow' : 'scroll';
  });
  const [mobile, setMobile] = useState(() => {
    const m = mq('(max-aspect-ratio: 4/5), (max-width: 760px)');
    return !!(m && m.matches);
  });
  const [ready, setReady] = useState(false);
  const [sec, setSec] = useState(0);
  const [proj, setProj] = useState(0);
  const expRef = useRef(null);

  // Tercih değişimlerini izle
  useEffect(() => {
    const r = mq('(prefers-reduced-motion: reduce)');
    const m = mq('(max-aspect-ratio: 4/5), (max-width: 760px)');
    const onR = () => setMode(r.matches ? 'flow' : 'scroll');
    const onM = () => setMobile(m.matches);
    r?.addEventListener('change', onR);
    m?.addEventListener('change', onM);
    return () => {
      r?.removeEventListener('change', onR);
      m?.removeEventListener('change', onM);
    };
  }, []);

  useEffect(() => {
    if (!enabled || mode === 'flow-nogl') return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let exp;
    let cancelled = false;
    let cleanup = () => {};
    const html = document.documentElement;
    const still = mode === 'flow';

    (async () => {
      const { Experience } = await import('../scene/Experience.js');
      if (cancelled) return;
      try {
        if (document.fonts?.load) await document.fonts.load('500 17px "Geist Variable"').catch(() => {});
        exp = new Experience(canvas, {
          mobile,
          reduced: still,
          onLost: () => setMode('flow-nogl'),
        });
      } catch {
        setMode('flow-nogl');
        return;
      }
      expRef.current = exp;
      const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pNow = () => window.scrollY / maxScroll();

      let lastSec = -1;
      let lastProj = -1;
      const publish = (sp) => {
        html.style.setProperty('--p', sp.toFixed(4));
        const s = sectionAt(sp);
        if (s !== lastSec) {
          lastSec = s;
          setSec(s);
        }
        const pr = projectAt(sp);
        if (pr !== lastProj) {
          lastProj = pr;
          setProj(pr);
        }
      };

      const q = new URLSearchParams(window.location.search).get('p');
      const dbg = q !== null && q !== '' ? Math.min(1, Math.max(0, parseFloat(q))) : null;

      const onResize = () => {
        exp.resize();
        if (still) exp.renderStill(stillP);
      };
      window.addEventListener('resize', onResize);

      let io;
      let stillP = 0;
      let onScroll;
      let onVis;
      let onSnap;
      if (still) {
        // Azaltılmış hareket: bölüm başına tek sabit kare, hareket yok
        const frames = SECTION_STARTS.map((s, i) => (i === 0 ? 0.0 : s + 0.02));
        const els = [...document.querySelectorAll('[data-sec]')];
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                const i = Number(e.target.dataset.sec);
                stillP = frames[i];
                exp.renderStill(stillP);
                setSec(i);
              }
            }
          },
          { rootMargin: '-45% 0px -45% 0px' },
        );
        els.forEach((el) => io.observe(el));
        exp.renderStill(0);
        setReady(true);
      } else {
        onScroll = () => exp.setTarget(pNow());
        window.addEventListener('scroll', onScroll, { passive: true });
        exp.onFrame = publish;
        // hata ayıklama: ?p= verildiğinde 'bt-snap' olayıyla ilerleme anında ayarlanır
        if (dbg !== null) {
          onSnap = (e) => {
            const v = Math.min(1, Math.max(0, Number(e.detail)));
            window.scrollTo(0, v * maxScroll());
            exp.setTarget(v, true);
          };
          window.addEventListener('bt-snap', onSnap);
        }
        const start = () => {
          if (dbg !== null) {
            window.scrollTo(0, dbg * maxScroll());
            exp.setTarget(dbg, true);
          } else {
            exp.setTarget(pNow(), true);
          }
          exp.start();
        };
        // gerçek ilk kare derlenmeden "hazır" deme
        exp.renderStill(dbg ?? 0);
        setReady(true);
        start();
        onVis = () => {
          if (document.hidden) exp.stop();
          else if (!exp.disposed) exp.start();
        };
        document.addEventListener('visibilitychange', onVis);
      }

      cleanup = () => {
        window.removeEventListener('resize', onResize);
        if (onScroll) window.removeEventListener('scroll', onScroll);
        if (onVis) document.removeEventListener('visibilitychange', onVis);
        if (onSnap) window.removeEventListener('bt-snap', onSnap);
        io?.disconnect();
        exp.dispose();
        expRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [canvasRef, enabled, mode, mobile]);

  return { mode, mobile, ready, sec, proj, expRef };
}

export const maxScrollY = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
