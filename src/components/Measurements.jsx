import { useReveal } from '../hooks/useReveal.js';

const ROWS = [
  { label: 'Education', desc: 'Trakya Üniversitesi — Mobil Teknolojileri', value: '2026' },
  { label: 'Experience', desc: 'Zinca Metal Bilgi İşlem Sorumlusu', value: '14.06.2025 – 14.09.2025' },
  { label: 'Internship', desc: 'Çetin Group IT Departmanı Stajyer', value: 'Halen' },
  { label: 'Public Repos', desc: 'GitHub üzerinde paylaşılan proje sayısı', value: '3' },
  { label: 'Core Stack', desc: 'Aktif olarak kullanılan dil ve framework sayısı', value: '8' },
  { label: 'Based In', desc: 'Şu anki konum', value: 'Tekirdağ, TR' },
];

export default function Measurements() {
  const [ref, inView] = useReveal();

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <div className={`section-head reveal ${inView ? 'in' : ''}`} style={{ marginBottom: 48 }}>
          <div className="eyebrow">Measurements</div>
          <h2 className="two-col-heading serif" style={{ marginBottom: 0 }}>
            Rakamlarla <em className="accent">bugüne kadarki yol.</em>
          </h2>
        </div>

        <div className={`rule-rows reveal ${inView ? 'in' : ''}`}>
          {ROWS.map((row) => (
            <div className="rule-row" key={row.label}>
              <div className="rule-label mono">{row.label}</div>
              <div className="rule-desc mono">{row.desc}</div>
              <div className="rule-value mono">{row.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
