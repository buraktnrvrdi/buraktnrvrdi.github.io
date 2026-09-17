# burak@portfolio: ~/dev

Kişisel portfolyo sitem. Retro CRT terminal temalı, tek sayfalık bir React uygulaması —
sahte bir terminal penceresi içinde `whoami`, `neofetch`, `ls ~/projects`, `cat stack.txt`
ve `./contact --hire` gibi komutlarla kendimi, projelerimi ve yeteneklerimi anlatıyorum.

**Canlı adres:** [buraktnrvrdi.github.io](https://buraktnrvrdi.github.io)

## Neler var

- **whoami --full** — kısa tanıtım, konum/eğitim/durum bilgileri
- **neofetch** — piksel-art terminal ikonu + sistem bilgisi tarzında kimlik kartı
- **cat experience.log** — Zinca Metal, Çetin Group ve Trakya Üniversitesi kronolojisi
- **ls -la ~/projects** — GitHub'daki gerçek projelerim ve canlı Shopify siteleri
- **cat stack.txt** — kullandığım dil/araçlar, glow efektli ilerleme çubuklarıyla
- **./contact --hire** — kopyalanabilir mail komutu, GitHub/LinkedIn bağlantıları

Fosfor yeşili vurgu, CRT tarama çizgisi efekti, JetBrains Mono + IBM Plex Mono ve
`prefers-reduced-motion` desteği ile tamamen CSS/SVG tabanlı, harici animasyon
kütüphanesi kullanmıyor.

## Teknolojiler

- [React](https://react.dev) + [Vite](https://vite.dev)
- Sade CSS (framework yok) — CRT/terminal görsel efektleri elle yazıldı
- Piksel-art avatar inline SVG olarak render ediliyor

## Geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Yayınlama

`main` dalına yapılan her push, GitHub Actions üzerinden otomatik olarak build alıp
GitHub Pages'e deploy eder (bkz. `.github/workflows/deploy.yml`).
