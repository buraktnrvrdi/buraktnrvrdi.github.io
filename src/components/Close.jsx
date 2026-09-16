import WordmarkSpread from './WordmarkSpread.jsx';

const EMAIL = 'buraktanriverdicontact@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/burak-tanriverdi-11b6a5377/?skipRedirect=true';
const GITHUB = 'https://github.com/buraktnrvrdi';

export default function Close() {
  return (
    <section id="contact" className="section" style={{ paddingBottom: 48 }}>
      <div className="container">
        <div className="close-top">
          <div>
            <h2 className="close-headline serif">
              Yeni bir fikir mi var, yoksa ekibe <em className="accent">bir geliştirici mi</em>{' '}
              lazım?
            </h2>
            <p className="close-fine mono">{EMAIL}</p>
          </div>

          <div className="close-actions">
            <a href={`mailto:${EMAIL}`} className="btn btn-fill">
              Email
            </a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="btn">
              LinkedIn
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="btn">
              GitHub
            </a>
          </div>
        </div>

        <div className="footer-strip mono">
          <span>&copy; 2026 Burak Tanrıverdi</span>
          <span>Tekirdağ, Türkiye</span>
        </div>

        <div className="wordmark-close">
          <WordmarkSpread text="THANK YOU" revealOn="scroll" />
        </div>
      </div>
    </section>
  );
}
