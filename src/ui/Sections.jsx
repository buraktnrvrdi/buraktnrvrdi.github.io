import { CONTACT, EMAIL, EXPERIENCE, GITHUB, HERO, INTRO, LINKEDIN, NAME, SECTIONS, SKILLS, UI, WORK } from '../data.js';
import { ArrowUpRight } from './icons.jsx';

const num = (i) => String(i + 1).padStart(2, '0');

function Chapter({ i }) {
  return (
    <p className="chapter">
      <span className="c-n">{num(i)}</span>
      <span className="c-line" />
      <span className="c-l">{SECTIONS[i].label}</span>
    </p>
  );
}

// Her bölüm: sahne modunda sabit sol alt blok (aktif olan görünür); akış modunda alt alta.
function Section({ i, active, children, aside, id, labelId }) {
  return (
    <section
      className="sec"
      id={id}
      data-sec={i}
      data-active={active ? '1' : '0'}
      aria-labelledby={labelId}
      inert={active ? undefined : true}
    >
      <div className="sec-text">{children}</div>
      {aside}
    </section>
  );
}

export function Hero({ active }) {
  const role = HERO.role.join('');
  return (
    <Section i={0} id="top" labelId="h-hero" active={active}>
      <p className="kicker">{HERO.meta[1]}</p>
      <h1 id="h-hero" className="t-hero">
        {NAME}, {role}
      </h1>
      <p className="status">
        <span className="dot" aria-hidden="true" />
        <span>{HERO.meta[2]}</span>
        <span className="status-sep">{HERO.meta[0]}</span>
      </p>
    </Section>
  );
}

export function About({ active }) {
  return (
    <Section i={1} id="about" labelId="h-about" active={active}>
      <Chapter i={1} />
      <h2 id="h-about" className="t-chap">
        {INTRO.lead.join('')}
      </h2>
      <p className="lede" dangerouslySetInnerHTML={{ __html: INTRO.rest }} />
    </Section>
  );
}

export function Experience({ active }) {
  return (
    <Section i={2} id="experience" labelId="h-exp" active={active}>
      <Chapter i={2} />
      <h2 id="h-exp" className="t-chap">
        {EXPERIENCE.heading.join('')}
      </h2>
      <ol className="timeline">
        {EXPERIENCE.rows.map((r) => (
          <li key={r.org}>
            <span className="tl-time">{r.time}</span>
            <span className="tl-org">{r.org}</span>
            <span className="tl-desc">{r.desc}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Work({ active, proj, flow, onProject }) {
  const aside = (
    <div className="aside aside-work">
      {WORK.projects.map((p, k) => (
        <article className="proj" key={p.name} data-active={flow || k === proj ? '1' : '0'} aria-labelledby={`pj-${k}`} inert={flow || (active && k === proj) ? undefined : true}>
          <header className="proj-bar">
            <h3 id={`pj-${k}`} className="proj-name">
              {p.name}
            </h3>
            <span className="proj-n">
              {num(k)} / {num(WORK.projects.length - 1)}
            </span>
          </header>
          <p className="proj-desc" dangerouslySetInnerHTML={{ __html: p.desc }} />
          <ul className="tags" aria-label="Etiketler">
            {p.tags.map((t) => {
              const label = typeof t === 'string' ? t : t.label;
              const hot = typeof t !== 'string';
              return (
                <li key={label} data-hot={hot ? '1' : '0'}>
                  {label}
                </li>
              );
            })}
          </ul>
          <div className="proj-links">
            {p.demo && (
              <a className="cap cap-sm" href={p.demo} target="_blank" rel="noreferrer">
                {UI.live}
                <ArrowUpRight />
              </a>
            )}
            {p.source && (
              <a className="cap cap-sm" href={p.source} target="_blank" rel="noreferrer">
                {UI.source}
                <ArrowUpRight />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
  return (
    <Section i={3} id="work" labelId="h-work" active={active} aside={aside}>
      <Chapter i={3} />
      <h2 id="h-work" className="t-chap t-chap-sm">
        {WORK.heading.join('')}
      </h2>
      <ol className="projlist" aria-label={UI.project}>
        {WORK.projects.map((p, k) => (
          <li key={p.name}>
            <button type="button" data-active={k === proj ? '1' : '0'} aria-current={k === proj ? 'true' : undefined} onClick={() => onProject(k)}>
              <span className="n">{num(k)}</span>
              {p.name}
            </button>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Skills({ active }) {
  const aside = (
    <div className="aside aside-skills">
      <ul className="skills">
        {SKILLS.rows.map((r, k) => (
          <li key={r.label} style={{ '--k': k, '--pct': r.pct / 100 }}>
            <span className="sk-pct">
              {r.pct}
              <small>%</small>
            </span>
            <span className="sk-label">{r.label}</span>
            <span className="sk-bar" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Section i={4} id="stack" labelId="h-stack" active={active} aside={aside}>
      <Chapter i={4} />
      <h2 id="h-stack" className="t-chap">
        {SKILLS.heading.join('')}
      </h2>
      <p className="note">{SKILLS.note}</p>
    </Section>
  );
}

export function Contact({ active }) {
  return (
    <Section i={5} id="contact" labelId="h-contact" active={active}>
      <Chapter i={5} />
      <h2 id="h-contact" className="t-big">
        {CONTACT.heading.join('')}
      </h2>
      <p className="lede">{CONTACT.sub}</p>
      <div className="contact-row">
        <a className="mail" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <a className="cap cap-sm" href={GITHUB} target="_blank" rel="noreferrer">
          {UI.github}
          <ArrowUpRight />
        </a>
        <a className="cap cap-sm" href={LINKEDIN} target="_blank" rel="noreferrer">
          {UI.linkedin}
          <ArrowUpRight />
        </a>
      </div>
    </Section>
  );
}
