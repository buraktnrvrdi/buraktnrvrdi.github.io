import { useReveal } from '../hooks/useReveal.js';

const ROWS = [
  {
    label: 'Education',
    desc: 'Trakya Üniversitesi — Mobil Teknolojileri mezunu.',
    value: '2026',
  },
  {
    label: 'Experience',
    desc: 'Zinca Metal Bilgi İşlem Sorumlusu',
    value: '14.06.2025 – 14.09.2025',
  },
  {
    label: 'Internship',
    desc: 'Çetin Group IT Departmanı Stajyer',
    value: 'Halen',
  },
  {
    label: 'Interests',
    desc: 'Teknoloji, spor, müzik, konserler ve moda — kod dışında da meraklı biriyim.',
    value: '—',
  },
  {
    label: 'Approach',
    desc: 'Fikri hızlıca çalışan bir ürüne dönüştürmeyi, sonra üzerine katman katman iyileştirmeyi tercih ederim.',
    value: 'Ship first',
  },
];

export default function Argument() {
  const [ref, inView] = useReveal();

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <div className={`two-col reveal ${inView ? 'in' : ''}`}>
          <div>
            <div className="eyebrow">About</div>
            <h2 className="two-col-heading serif">
              Kod yazmayı, <em className="accent">bir şeyin çalıştığını görmeyi</em> seven
              yeni mezun bir geliştirici.
            </h2>
            <p className="two-col-lede mono">
              Okulda öğrendiklerimi gerçek projelere dökmeyi seviyorum — masaüstü
              uygulamalardan mobil prototiplere kadar. Şu anki hedefim, staj
              sürecinde edindiğim tecrübeyi büyütüp kendi ürünlerimi üretmeye
              devam etmek.
            </p>
          </div>

          <div className="rule-rows">
            {ROWS.map((row) => (
              <div className="rule-row" key={row.label}>
                <div className="rule-label mono">{row.label}</div>
                <div className="rule-desc mono">{row.desc}</div>
                <div className="rule-value mono">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
