import { useEffect, useRef, useState } from 'react';
import { GITHUB, LINKEDIN, NAME, SECTIONS, UI } from '../data.js';
import { SECTION_STARTS } from '../scene/config.js';
import { ArrowUp, ArrowUpRight } from './icons.jsx';

const pad = (n) => String(n + 1).padStart(2, '0');

export function Monogram() {
  return (
    <a className="brand" href="#top" aria-label={NAME}>
      <span className="mono" aria-hidden="true">
        BT
      </span>
      <span className="brand-name">{NAME}</span>
    </a>
  );
}

export function Counter({ sec }) {
  return (
    <div className="counter" aria-hidden="true">
      <span className="cur">{pad(sec)}</span>
      <span className="slash">/</span>
      <span className="tot">{pad(SECTIONS.length - 1)}</span>
    </div>
  );
}

// Sağ üst: dikey bölüm listesi
export function SectionList({ sec, onGo }) {
  return (
    <nav className="seclist" aria-label={UI.menu}>
      <ol>
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="sec-item"
              data-active={i === sec ? '1' : '0'}
              aria-current={i === sec ? 'true' : undefined}
              onClick={() => onGo(i)}
            >
              <span className="n">{pad(i)}</span>
              <span className="l">{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Sağ kenar: ilerleme işaretleri
export function Strip({ sec }) {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-line" />
      {SECTION_STARTS.map((s, i) => (
        <span key={i} className="strip-tick" style={{ '--t': s }} />
      ))}
      <div className="strip-mark">
        <span className="strip-label">
          {pad(sec)} {SECTIONS[sec].label}
        </span>
        <span className="strip-red" />
      </div>
    </div>
  );
}

// Sağ alt: küçük bağlantı düğmesi
export function CornerLink({ sec, onTop }) {
  const last = sec === SECTIONS.length - 1;
  return last ? (
    <button type="button" className="corner" onClick={onTop}>
      <span>{UI.toTop}</span>
      <span className="corner-ic">
        <ArrowUp />
      </span>
    </button>
  ) : (
    <div className="corner-row">
      <a className="corner" href={GITHUB} target="_blank" rel="noreferrer">
        <span>{UI.github}</span>
        <span className="corner-ic">
          <ArrowUpRight />
        </span>
      </a>
      <a className="corner" href={LINKEDIN} target="_blank" rel="noreferrer">
        <span>{UI.linkedin}</span>
        <span className="corner-ic">
          <ArrowUpRight />
        </span>
      </a>
    </div>
  );
}

// Mobil: bölüm listesi için menü
export function MobileMenu({ sec, onGo }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const first = panel.current?.querySelector('button');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
      if (e.key === 'Tab' && panel.current) {
        const f = [...panel.current.querySelectorAll('button')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div className="mmenu">
      <button ref={btn} type="button" className="mmenu-btn" aria-expanded={open} aria-controls="mmenu-panel" onClick={() => setOpen((o) => !o)}>
        <span className="n">{pad(sec)}</span>
        <span>{SECTIONS[sec].label}</span>
      </button>
      <div id="mmenu-panel" ref={panel} className="mmenu-panel" data-open={open ? '1' : '0'} role="dialog" aria-label={UI.menu} aria-modal="true" inert={open ? undefined : true}>
        <ol>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className="sec-item"
                data-active={i === sec ? '1' : '0'}
                aria-current={i === sec ? 'true' : undefined}
                onClick={() => {
                  setOpen(false);
                  onGo(i);
                }}
              >
                <span className="n">{pad(i)}</span>
                <span className="l">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="mmenu-close" onClick={() => setOpen(false)}>
          {UI.close}
        </button>
      </div>
    </div>
  );
}

// İmleç halkası (yalnızca ince işaretçi)
export function Reticle() {
  const ring = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return undefined;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (ring.current) ring.current.dataset.on = '1';
    };
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const vis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', vis);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);
  return <span ref={ring} className="reticle" aria-hidden="true" />;
}
