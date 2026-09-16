const SKILLS = [
  { label: 'JavaScript', pct: 92 },
  { label: 'Python', pct: 85 },
  { label: 'Node.js', pct: 82 },
  { label: 'Electron', pct: 80 },
  { label: 'Flutter', pct: 78 },
  { label: 'Kotlin', pct: 75 },
  { label: 'SQL', pct: 80 },
  { label: 'Firebase', pct: 74 },
];

export default function SkillMeters() {
  return (
    <section className="shell-section" id="stack">
      <div className="prompt-line">
        <span className="prompt-user">burak</span>
        <span className="prompt-path">~/dev $ </span>
        <span className="prompt-cmd">cat stack.txt | sort -r</span>
      </div>

      <div className="eyebrow-line">&gt; proficiency</div>
      <h2 className="section-heading">
        The tools I reach for <span className="comment">// self-assessed, honest</span>
      </h2>

      <div className="skills-panel">
        {SKILLS.map((s) => (
          <div className="skill-row" key={s.label}>
            <span className="skill-label">{s.label}</span>
            <span className="skill-track">
              <span className="skill-fill" style={{ width: `${s.pct}%` }} />
            </span>
            <span className="skill-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
