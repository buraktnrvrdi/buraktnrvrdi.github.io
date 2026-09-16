const PROJECTS = [
  {
    name: 'klipster',
    stars: '1',
    desc: '<strong>AI destekli</strong> video klipleme SaaS’ı — uzun videoları altyazılı dikey kliplere çevirir.',
    tags: ['Next.js', 'FastAPI', 'Whisper', { label: 'SaaS', amber: true }],
    source: 'https://github.com/buraktnrvrdi/Klipster',
    demo: null,
  },
  {
    name: 'bilgi-islem-app',
    stars: '1',
    desc: 'IT departmanları için <strong>masaüstü</strong> envanter yönetimi, QR kod ile takip.',
    tags: ['Electron', 'SQLite', { label: 'open source', amber: true }],
    source: 'https://github.com/buraktnrvrdi/bilgi-islem-app',
    demo: null,
  },
  {
    name: 'btsoftdepo',
    stars: '1',
    desc: 'Fabrikalar için depo yönetimi, barkod desteği ve <strong>AI stok tahmini</strong>.',
    tags: ['Electron', 'AI', 'Excel', { label: 'open source', amber: true }],
    source: 'https://github.com/buraktnrvrdi/btsoftdepo',
    demo: null,
  },
  {
    name: 'alsancak-yedek-parca',
    stars: 'live',
    desc: 'Marka/model/yıl bazlı <strong>araç bulma filtresi</strong> eklediğim oto yedek parça e-ticareti.',
    tags: ['Shopify', 'Liquid', 'JavaScript', { label: 'live', amber: true }],
    source: null,
    demo: 'https://www.xn--alsancakyedekpara-psb.com.tr/',
  },
  {
    name: 'pektas-yapi',
    stars: 'live',
    desc: 'Yapı malzemeleri e-ticareti, ürüne göre <strong>anlık maliyet hesaplama</strong> aracı.',
    tags: ['Shopify', 'JavaScript', { label: 'live', amber: true }],
    source: null,
    demo: 'https://pektasyapi.com/',
  },
];

export default function ProjectsGrid() {
  return (
    <section className="shell-section" id="work">
      <div className="prompt-line">
        <span className="prompt-user">burak</span>
        <span className="prompt-path">~/dev $ </span>
        <span className="prompt-cmd">ls -la ~/projects # 5 selected</span>
      </div>

      <div className="eyebrow-line">&gt; selected work</div>
      <h2 className="section-heading">
        Things I built and shipped <span className="comment">// drwxr-xr-x</span>
      </h2>

      <div className="projects-grid">
        {PROJECTS.map((p) => (
          <div className="project-card" key={p.name}>
            <div className="project-head">
              <span className="project-filename">
                {p.name}
                <span className="slash">/</span>
              </span>
              <span className="project-meta-right">
                <span className="project-stars">
                  {p.stars === 'live' ? '● live' : `★ ${p.stars}`}
                </span>
                <span className="project-perms">-rwxr-xr-x</span>
              </span>
            </div>

            <p className="project-desc" dangerouslySetInnerHTML={{ __html: p.desc }} />

            <div className="tag-row">
              {p.tags.map((tag) =>
                typeof tag === 'string' ? (
                  <span className="tag-pill" key={tag}>
                    {tag}
                  </span>
                ) : (
                  <span className="tag-pill amber-tag" key={tag.label}>
                    {tag.label}
                  </span>
                )
              )}
            </div>

            <div className="links-row">
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noreferrer">
                  <span className="arrow">&#8594;</span>live demo
                </a>
              )}
              {p.source && (
                <a href={p.source} target="_blank" rel="noreferrer">
                  <span className="arrow">&#8594;</span>source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
