const LOG = [
  {
    time: '[2025.06 - 2025.09]',
    org: 'zinca-metal',
    desc: 'Bilgi İşlem Sorumlusu — fabrika ortamında IT süreçlerinden sorumlu oldum.',
  },
  {
    time: '[2025 - 2026]',
    org: 'cetin-group',
    desc: 'IT Departmanı, Stajyer — envanter, destek ve iç araçlar üzerine çalışıyorum.',
  },
  {
    time: '[2026]',
    org: 'trakya-university',
    desc: 'Mobil Teknolojileri — mezuniyet.',
  },
];

export default function ExperienceLog() {
  return (
    <section className="shell-section" id="experience">
      <div className="prompt-line">
        <span className="prompt-user">burak</span>
        <span className="prompt-path">~/dev $ </span>
        <span className="prompt-cmd">cat experience.log</span>
      </div>

      <div className="eyebrow-line">&gt; timeline</div>
      <h2 className="section-heading">
        Bugüne kadarki yol <span className="comment"># chronological</span>
      </h2>

      <div className="log-panel">
        {LOG.map((row) => (
          <div className="log-row" key={row.org}>
            <span className="log-time">{row.time}</span>
            <span className="log-org">{row.org}</span>
            <span className="log-desc">{row.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
