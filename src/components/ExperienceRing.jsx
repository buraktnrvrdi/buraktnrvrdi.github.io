import { useEffect, useRef, useState } from 'react';

const ENTRIES = [
  {
    id: 'zinca',
    initials: 'ZM',
    name: 'Zinca Metal',
    title: 'Bilgi İşlem Sorumlusu',
    period: '14.06.2025 – 14.09.2025',
    desc: 'Fabrika ortamında bilgi işlem süreçlerinden sorumlu olarak görev aldım.',
  },
  {
    id: 'cetin',
    initials: 'ÇG',
    name: 'Çetin Group',
    title: 'IT Departmanı — Stajyer',
    period: '2025 – Halen',
    desc: 'IT departmanında envanter, destek ve iç araçlar üzerine çalışıyorum.',
  },
  {
    id: 'edu',
    initials: 'TÜ',
    name: 'Trakya Üniversitesi',
    title: 'Mobil Teknolojileri',
    period: '2026 · Mezuniyet',
    desc: 'Mobil Teknolojileri bölümünden mezun oluyorum.',
  },
];

const STATS = [
  { label: 'Public Repos', value: '3' },
  { label: 'Core Stack', value: '8' },
  { label: 'Based In', value: 'Tekirdağ, TR' },
];

export default function ExperienceRing() {
  const sectionRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(320);

  useEffect(() => {
    const compute = () => {
      const available = Math.min(window.innerWidth - 64, 320);
      setSize(Math.max(220, available));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const SIZE = size;
  const RADIUS = size / 2 - 40;
  const CIRC = 2 * Math.PI * (RADIUS + 20);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const node = sectionRef.current;
    if (!node) return undefined;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (rect.height + vh);
      const p = Math.min(Math.max(raw, 0), 1);
      setProgress(p);
      const idx = Math.round(p * (ENTRIES.length - 1));
      setActive(idx);
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
  }, [reduced]);

  const anglePerNode = 360 / ENTRIES.length;
  const continuousIndex = progress * (ENTRIES.length - 1);
  const rotation = -continuousIndex * anglePerNode;
  const dashOffset = CIRC * (1 - progress);

  return (
    <section id="experience" className="section xpr-section" ref={sectionRef}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 48 }}>
          <div className="eyebrow">Experience</div>
          <h2 className="two-col-heading serif" style={{ marginBottom: 0 }}>
            Bugüne kadarki <em className="accent">yolculuk.</em>
          </h2>
        </div>

        <div className="xpr-widget">
          {reduced ? (
            <ul className="xpr-list">
              {ENTRIES.map((e) => (
                <li className="xpr-list-item" key={e.id}>
                  <span className="xpr-avatar">{e.initials}</span>
                  <div>
                    <div className="xpr-list-name">
                      {e.name} <span className="xpr-list-title">— {e.title}</span>
                    </div>
                    <div className="xpr-list-period">{e.period}</div>
                    <p className="xpr-list-desc">{e.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="xpr-stage" style={{ width: SIZE, height: SIZE }}>
                <svg className="xpr-track" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
                  <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS + 20}
                    fill="none"
                    stroke="#e4e4e7"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS + 20}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  />
                </svg>

                <div
                  className="xpr-rotator"
                  style={{ width: SIZE, height: SIZE, transform: `rotate(${rotation}deg)` }}
                >
                  {ENTRIES.map((e, i) => {
                    const baseAngle = anglePerNode * i;
                    const isActive = i === active;
                    return (
                      <div
                        key={e.id}
                        className="xpr-node-anchor"
                        style={{ transform: `rotate(${baseAngle}deg) translate(0, ${-RADIUS}px)` }}
                      >
                        <button
                          type="button"
                          className={`xpr-node ${isActive ? 'is-active' : ''}`}
                          style={{ transform: `rotate(${-(rotation + baseAngle)}deg)` }}
                          aria-current={isActive}
                          aria-label={`${e.name} — ${e.title}`}
                          onClick={() => setActive(i)}
                        >
                          <span className="xpr-avatar">{e.initials}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="xpr-hub">
                  {ENTRIES.map((e, i) => (
                    <div key={e.id} className={`xpr-hub-face ${i === active ? 'is-active' : ''}`}>
                      <span className="xpr-hub-avatar">{e.initials}</span>
                      <div className="xpr-hub-name">{e.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xpr-detail" key={ENTRIES[active].id}>
                <span className="xpr-avatar xpr-avatar-lg">{ENTRIES[active].initials}</span>
                <div>
                  <div className="xpr-detail-name">{ENTRIES[active].name}</div>
                  <div className="xpr-detail-title">{ENTRIES[active].title}</div>
                  <div className="xpr-detail-period">{ENTRIES[active].period}</div>
                  <p className="xpr-detail-desc">{ENTRIES[active].desc}</p>
                </div>
              </div>
            </>
          )}

          <div className="xpr-stats">
            {STATS.map((s) => (
              <div className="xpr-stat" key={s.label}>
                <div className="xpr-stat-value">{s.value}</div>
                <div className="xpr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
