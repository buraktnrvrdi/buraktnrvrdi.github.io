import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const PROJECTS = [
  {
    name: 'Klipster',
    tagline: 'AI destekli video klipleme SaaS’ı',
    stack: 'Next.js · FastAPI · Whisper · Claude/Gemini · ffmpeg',
    role: 'Kişisel proje — uçtan uca tasarım ve geliştirme',
    outcome: 'Aktif geliştiriliyor, 1 yıldız',
    url: 'https://github.com/buraktnrvrdi/Klipster',
    nodes: ['Video', 'Whisper', 'AI Curation', 'Clip'],
    path: 'M10,170 L110,60 L210,140 L310,40 L390,100',
  },
  {
    name: 'bilgi-islem-app',
    tagline: 'IT departmanları için masaüstü envanter yönetimi',
    stack: 'Electron · SQLite · QR Kod',
    role: 'Staj sürecindeki ihtiyaçtan doğan iç araç',
    outcome: 'Sunucusuz, tamamen yerelde çalışır',
    url: 'https://github.com/buraktnrvrdi/bilgi-islem-app',
    nodes: ['Cihaz', 'QR Tarama', 'SQLite', 'Rapor'],
    path: 'M10,60 L110,150 L210,60 L310,150 L390,80',
  },
  {
    name: 'btsoftdepo',
    tagline: 'Fabrikalar için depo ve stok yönetimi',
    stack: 'Electron · Barkod · Excel · AI Tahminleme',
    role: 'Kişisel proje — stok tahmin modülü dahil',
    outcome: 'Excel içe/dışa aktarım + talep tahmini',
    url: 'https://github.com/buraktnrvrdi/btsoftdepo',
    nodes: ['Stok', 'Barkod', 'Tahminleme', 'Sipariş'],
    path: 'M10,140 L110,40 L210,120 L310,30 L390,110',
  },
  {
    name: 'Alsancak Yedek Parça',
    tagline: 'Marka / model / yıl bazlı araç yedek parça e-ticareti',
    stack: 'Shopify · Liquid · JavaScript (özel araç bulma filtresi)',
    role: 'Tasarım + geliştirme — ticari proje',
    outcome: 'Canlıda — marka/model/yıl/motor ile parça eşleştirme',
    url: 'https://www.xn--alsancakyedekpara-psb.com.tr/',
    nodes: ['Marka', 'Model', 'Yıl / Motor', 'Uygun Parça'],
    path: 'M10,150 L110,50 L210,130 L310,50 L390,120',
  },
  {
    name: 'Pektaş Yapı',
    tagline: 'Yapı malzemeleri e-ticareti ve maliyet hesaplama aracı',
    stack: 'Shopify · Tema özelleştirme',
    role: 'Tasarım + geliştirme — ticari proje',
    outcome: 'Canlıda — ürüne göre anlık maliyet hesaplama',
    url: 'https://pektasyapi.com/',
    nodes: ['Ürün Seç', 'Alan Bilgisi', 'Hesaplama', 'Tahmini Fiyat'],
    path: 'M10,60 L110,140 L210,50 L310,130 L390,70',
  },
];

function parsePoints(d) {
  return (d.match(/[\d.]+,[\d.]+/g) || []).map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    return { x, y };
  });
}

export default function Demonstration() {
  const [panelRef, inView] = useReveal(0.15);
  const [variant, setVariant] = useState(0);
  const pathRef = useRef(null);
  const project = PROJECTS[variant];
  const points = parsePoints(project.path);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const length = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = prefersReduced ? '0' : `${length}`;

    if (!inView) return undefined;

    const id = requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 2s ease';
      path.style.strokeDashoffset = '0';
    });
    return () => cancelAnimationFrame(id);
  }, [variant, inView]);

  return (
    <section id="work" className="section" ref={panelRef}>
      <div className="container">
        <div className="demo-head">
          <div className="eyebrow">Selected Work</div>
          <h2 className="two-col-heading serif">
            Fikirden <em className="accent">çalışan koda.</em>
          </h2>
        </div>

        <div className="variant-picker" role="tablist" aria-label="Projeler">
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className="variant-btn mono"
              aria-pressed={variant === i}
              onClick={() => setVariant(i)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="demo-panel">
          <div className="demo-svg-wrap">
            <svg viewBox="-25 -10 450 220" xmlns="http://www.w3.org/2000/svg">
              <path ref={pathRef} className="demo-path accent" d={project.path} />
              {project.nodes.map((label, i) => {
                const pt = points[i];
                if (!pt) return null;
                const labelY = pt.y > 100 ? pt.y + 20 : pt.y - 14;
                return (
                  <g key={label}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#141c2b" />
                    <text
                      x={pt.x}
                      y={labelY}
                      textAnchor="middle"
                      fontFamily="'Courier Prime', monospace"
                      fontSize="9"
                      fill="#4a5364"
                      letterSpacing="0.5"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="demo-facts">
            <div className="demo-fact">
              <div className="k mono">Project</div>
              <div className="v mono">
                <a href={project.url} target="_blank" rel="noreferrer">
                  {project.name} ↗
                </a>{' '}
                — {project.tagline}
              </div>
            </div>
            <div className="demo-fact">
              <div className="k mono">Stack</div>
              <div className="v mono">{project.stack}</div>
            </div>
            <div className="demo-fact">
              <div className="k mono">Role / Outcome</div>
              <div className="v mono">
                {project.role}. {project.outcome}.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
