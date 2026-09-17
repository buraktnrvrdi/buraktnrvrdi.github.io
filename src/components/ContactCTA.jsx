const EMAIL = 'buraktanriverdicontact@gmail.com';
const GITHUB = 'https://github.com/buraktnrvrdi';
const LINKEDIN = 'https://www.linkedin.com/in/burak-tanriverdi-11b6a5377/?skipRedirect=true';

export default function ContactCTA() {
  return (
    <section className="shell-section" id="contact">
      <div className="prompt-line">
        <span className="prompt-user">burak</span>
        <span className="prompt-path">~/dev $ </span>
        <span className="prompt-cmd">./contact --hire</span>
      </div>

      <div className="cta-panel">
        <h2 className="cta-headline">
          Let's build <span className="highlight">something</span> together.
        </h2>
        <p className="cta-sub">
          Yeni fırsatlara açığım — staj sonrası tam zamanlı roller ya da freelance projeler
          için ulaşabilirsin.
        </p>

        <a href={`mailto:${EMAIL}`} className="command-box">
          <span className="dollar">$</span>
          mail {EMAIL}
          <span className="cursor" aria-hidden="true" />
        </a>

        <div className="social-pills">
          <a href={GITHUB} target="_blank" rel="noreferrer" className="social-pill">
            <span className="arrow">&#8594;</span>github
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer" className="social-pill">
            <span className="arrow">&#8594;</span>linkedin
          </a>
          <a href={`mailto:${EMAIL}`} className="social-pill">
            <span className="arrow">&#8594;</span>email
          </a>
        </div>
      </div>
    </section>
  );
}
