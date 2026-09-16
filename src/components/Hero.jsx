export default function Hero() {
  return (
    <section className="shell-section" id="top">
      <div className="prompt-line">
        <span className="prompt-user">burak</span>
        <span className="prompt-path">~/dev $ </span>
        <span className="prompt-cmd">whoami --full</span>
      </div>

      <h1 className="hero-banner">
        BURAK TANRIVERDI<span className="cursor" aria-hidden="true" />
      </h1>

      <div className="role-line">
        <span className="arrow">&gt;</span>Full-stack &amp; mobil geliştirici, fikirden ürüne
        gidiyorum
      </div>

      <p className="intro-text">
        Yeni mezun bir yazılım geliştiricisiyim. Şu an <strong>Çetin Group</strong> IT
        departmanında stajyer olarak çalışıyorum, boş vakitlerimde masaüstü, mobil ve web
        tarafında uçtan uca projeler geliştirip <strong>GitHub</strong>'da paylaşıyorum.
      </p>

      <div className="meta-checks">
        <span className="meta-check">
          <span className="bracket">[x]</span>Tekirdağ, TR · UTC+3
        </span>
        <span className="meta-check">
          <span className="bracket">[x]</span>Trakya Üniversitesi, 2026
        </span>
        <span className="meta-check">
          <span className="bracket">[x]</span>Available for work
        </span>
      </div>

      <div className="cta-row">
        <a href="#work" className="btn-term btn-solid">
          $ ls ~/projects -&gt;
        </a>
        <a href="#contact" className="btn-term btn-ghost">
          ./contact --hire
        </a>
      </div>
    </section>
  );
}
