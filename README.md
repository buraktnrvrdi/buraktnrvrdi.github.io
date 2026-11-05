# Burak Tanrıverdi — Çalışma Odası

Referansın aynı oda sahnesi, ışık haritaları, modelleri ve kamera etkileşimleri üzerine Burak’ın portfolyo içeriği uyarlanmıştır.

## Geliştirme

```sh
npm install
npm run dev
npm run build
```

- `index.html`: isim, özgeçmiş, altı proje, deneyim panosu ve telefon bağlantıları.
- `public/boot.js`: başlangıç ve yerel profil soru-cevap rehberi. Harici sohbet servisi veya ziyaretçi takibi yoktur.
- `public/burak.css`: içerik uyarlamaları.
- `public/project-previews/`: Burak’ın projeleri için yerel önizleme görselleri.
- `public/_astro/`, `public/models/`, `public/bake/`, `public/basis/`, `public/fonts/`, `public/sounds/`: referansın tarayıcıya sunduğu oda çalışma zamanı ve görsel/ses varlıkları. Kaynak: https://www.raomuhammadhamza.tech/ . Bu varlıkların özgün tasarımcısı Rao Muhammad Hamza’dır; Burak tarafından tasarlandıkları iddia edilmez.
- `src/`: önceki React sürümünün kaynakları korunmuştur; mevcut giriş sayfası bunları yüklemez.

Gerçek bir indirilebilir CV dosyası henüz eklenmediği için CV indirme bağlantısı gösterilmez. Proje önizlemeleri kayıtlı videolar değil, proje adları ve teknolojileriyle üretilmiş yerel kapaklardır. Profil rehberi kayıtlı bilgilerle çalışır.

`main` dalına gönderilen değişiklikler mevcut GitHub Actions üzerinden GitHub Pages’e yayınlanır. Bu çalışma sırasında yayın yapılmadı.
