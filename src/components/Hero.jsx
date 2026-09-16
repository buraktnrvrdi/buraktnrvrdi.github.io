import WordmarkSpread from './WordmarkSpread.jsx';

export default function Hero() {
  return (
    <header id="top" className="hero">
      <div className="container">
        <div className="hero-copy">
          <div className="hero-kicker">Software Developer — Mobile Technologies, Trakya University</div>
          <h1 className="hero-headline serif">
            I build things that <em className="accent">actually ship.</em>
          </h1>
          <p className="hero-lede">
            Yeni mezun bir yazılım geliştiriciyim; masaüstü, mobil ve web tarafında
            uçtan uca ürün çıkarmayı seviyorum. Şu an Çetin Group IT departmanında
            stajyer olarak çalışıyor, boş vakitlerimde kendi projelerimi geliştirip
            GitHub'da paylaşıyorum.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-fill">
              View Work
            </a>
            <a href="#contact" className="btn">
              Contact
            </a>
          </div>
        </div>

        <div className="hero-specs">
          <div className="hero-spec">
            <div className="k mono">Location</div>
            <div className="v mono">Tekirdağ, TR</div>
          </div>
          <div className="hero-spec">
            <div className="k mono">Focus</div>
            <div className="v mono">Full-stack · Desktop · Mobile</div>
          </div>
          <div className="hero-spec">
            <div className="k mono">Status</div>
            <div className="v mono">Intern @ Çetin Group</div>
          </div>
        </div>
      </div>

      <WordmarkSpread text="BURAK TANRIVERDI" revealOn="load" />
    </header>
  );
}
