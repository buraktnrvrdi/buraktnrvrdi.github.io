import { useEffect, useRef, useState } from 'react';

export default function WordmarkSpread({ text, revealOn = 'load', className = '' }) {
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(revealOn === 'load');
  const letters = text.split('');

  useEffect(() => {
    if (revealOn === 'load') {
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    }

    const node = wrapRef.current;
    if (!node) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealOn]);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress stays 0 while the word is still fully in view; it only
      // spreads once it starts scrolling past the top of the viewport.
      const raw = -rect.top / (vh * 0.8);
      const progress = Math.min(Math.max(raw, 0), 1);
      const spans = node.querySelectorAll('span[data-letter]');
      const mid = (spans.length - 1) / 2;
      spans.forEach((span, i) => {
        const dist = i - mid;
        const spread = progress * dist * 6;
        const sink = progress * 26;
        const fade = 1 - progress * 0.55;
        span.style.transform = `translate(${spread}px, ${sink}px)`;
        span.style.opacity = fade;
      });
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

  return (
    <div
      className={`wordmark-spread ${revealed ? 'revealed' : ''} ${className}`}
      ref={wrapRef}
      aria-hidden="true"
    >
      {letters.map((letter, i) => (
        <span data-letter key={`${letter}-${i}`}>
          {letter === ' ' ? ' ' : letter}
        </span>
      ))}
    </div>
  );
}
