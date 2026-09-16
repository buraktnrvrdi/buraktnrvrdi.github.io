import { useEffect, useRef, useState } from 'react';

// Stops describe where the mark sits (as % of viewport) at a given scroll
// progress, expressed as a fraction of TRAVEL_DISTANCE pixels scrolled.
const STOPS = [
  { p: 0, x: 76, y: 20, rotate: -10, scale: 1, opacity: 1 },
  { p: 0.22, x: 84, y: 46, rotate: 4, scale: 0.85, opacity: 1 },
  { p: 0.45, x: 12, y: 58, rotate: -14, scale: 0.72, opacity: 1 },
  { p: 0.68, x: 68, y: 72, rotate: 10, scale: 0.6, opacity: 0.9 },
  { p: 0.88, x: 40, y: 40, rotate: -6, scale: 0.4, opacity: 0.3 },
  { p: 1, x: 40, y: 40, rotate: -6, scale: 0.3, opacity: 0 },
];

const TRAVEL_DISTANCE = 2600;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function computeFrame(progress) {
  let lo = STOPS[0];
  let hi = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    if (progress >= STOPS[i].p && progress <= STOPS[i + 1].p) {
      lo = STOPS[i];
      hi = STOPS[i + 1];
      break;
    }
  }
  const span = hi.p - lo.p || 1;
  const t = (progress - lo.p) / span;
  return {
    x: lerp(lo.x, hi.x, t),
    y: lerp(lo.y, hi.y, t),
    rotate: lerp(lo.rotate, hi.rotate, t),
    scale: lerp(lo.scale, hi.scale, t),
    opacity: lerp(lo.opacity, hi.opacity, t),
  };
}

export default function TravellingMark() {
  const ref = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) return undefined;

    let ticking = false;

    const update = () => {
      ticking = false;
      const progress = Math.min(Math.max(window.scrollY / TRAVEL_DISTANCE, 0), 1);
      const frame = computeFrame(progress);
      const node = ref.current;
      if (!node) return;
      node.style.transform = `translate3d(${frame.x}vw, ${frame.y}vh, 0) rotate(${frame.rotate}deg) scale(${frame.scale})`;
      node.style.opacity = frame.opacity;
      node.style.visibility = frame.opacity <= 0.01 ? 'hidden' : 'visible';
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (reduced) return null;

  return (
    <div className="traveller" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="108" height="108" fill="#141c2b" />
        <path
          d="M30 44 L14 60 L30 76"
          stroke="#efe9dd"
          strokeWidth="6"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M90 44 L106 60 L90 76"
          stroke="#efe9dd"
          strokeWidth="6"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <line x1="66" y1="36" x2="54" y2="84" stroke="#2c4a8f" strokeWidth="6" />
      </svg>
    </div>
  );
}
