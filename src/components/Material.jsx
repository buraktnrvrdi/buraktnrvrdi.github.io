import { useReveal } from '../hooks/useReveal.js';

const ROWS = [
  {
    label: 'Languages',
    desc: 'Python, JavaScript ve TypeScript ile günlük geliştirme; Kotlin ile Android tarafı, SQL ile veri katmanı.',
    value: 'Core',
  },
  {
    label: 'Frameworks',
    desc: 'Node.js ile servisler, Electron ile masaüstü uygulamalar, Flutter ile mobil arayüzler.',
    value: 'Core',
  },
  {
    label: 'Platforms',
    desc: 'Firebase (auth, firestore, hosting) ve REST API entegrasyonları.',
    value: 'Core',
  },
  {
    label: 'Tooling',
    desc: 'Git & GitHub ile versiyon kontrolü, npm/yarn, temel Docker kullanımı.',
    value: 'Familiar',
  },
];

export default function Material() {
  const [ref, inView] = useReveal();

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <div className={`two-col reveal ${inView ? 'in' : ''}`}>
          <div>
            <div className="eyebrow">Material</div>
            <h2 className="two-col-heading serif">
              Farklı katmanlarda <em className="accent">rahat çalışırım.</em>
            </h2>
            <p className="two-col-lede mono">
              Masaüstünden mobile, backend'den veritabanına kadar bir ürünün
              çoğu parçasını tek başıma kurabilirim. Yeni bir araç öğrenmek
              gerektiğinde bunu bir engel değil, projenin bir parçası olarak
              görüyorum.
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
